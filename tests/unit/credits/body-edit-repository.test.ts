import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createBodyEditRepository } from '../../../libs/credits/body-edit-repository';
import type { BodyEditRepository, ReserveBodyEdit } from '../../../libs/credits/body-edit-types';

let sqlite: Database.Database;
let repo: BodyEditRepository;
const start = new Date('2026-10-14T12:00:00Z');
let serial = 0;
function input(overrides: Partial<ReserveBodyEdit> = {}): ReserveBodyEdit {
  serial++;
  return { jobId: `job-${serial}`, userId: 'u1', requestId: `request-${serial}`, inputHash: 'a'.repeat(64),
    mode: 'slim', intensity: 'balanced', model: 'gpt-image-2.5-1k', costCredits: 15, trialCredits: 15,
    now: start, deadlineAt: new Date(start.getTime() + 185_000), ...overrides };
}
const rows = () => sqlite.prepare('SELECT * FROM credit_transaction').all();
const balance = () => Number((sqlite.prepare('SELECT credit_balance FROM user WHERE id = ?').get('u1') as { credit_balance: string }).credit_balance);

beforeEach(() => {
  serial = 0;
  sqlite = new Database(':memory:');
  sqlite.pragma('foreign_keys = ON');
  sqlite.exec(`CREATE TABLE user (id TEXT PRIMARY KEY, banned INTEGER DEFAULT 0, credit_balance TEXT DEFAULT '0', updated_at INTEGER);
    CREATE TABLE credit_transaction (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES user(id), type TEXT NOT NULL,
      amount TEXT NOT NULL, balance TEXT NOT NULL, order_id TEXT, description TEXT, metadata TEXT, created_at INTEGER NOT NULL);
    INSERT INTO user (id) VALUES ('u1'), ('u2');`);
  sqlite.exec(readFileSync(resolve('libs/database/drizzle-sqlite/0006_body_image_edit.sql'), 'utf8'));
  repo = createBodyEditRepository({ dialect: 'sqlite', sqlite });
});
afterEach(() => sqlite?.close());

describe('persistent body edit billing', () => {
  test('atomically grants the one account trial and debits its first edit once', async () => {
    const first = input();
    expect(await repo.reserve(first)).toMatchObject({ job: { id: first.jobId, status: 'processing' }, balance: 0, reused: false });
    expect(rows()).toHaveLength(2);
    expect(rows()).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'bonus', amount: '15', description: 'body_edit_trial' }),
      expect.objectContaining({ type: 'consumption', amount: '-15', description: 'ai_body_edit' }),
    ]));
    expect(await repo.reserve({ ...first, jobId: 'unused-id' })).toMatchObject({ job: { id: first.jobId }, reused: true });
    expect(rows()).toHaveLength(2);
    expect(balance()).toBe(0);
    await expect(repo.reserve(input())).rejects.toMatchObject({ code: 'INSUFFICIENT_CREDITS', status: 402 });
    expect(rows()).toHaveLength(2);
  });
  test('different concurrent requests cannot spend the same available balance', async () => {
    sqlite.prepare('UPDATE user SET credit_balance = ? WHERE id = ?').run('15', 'u1');
    await repo.reserve(input());
    const results = await Promise.allSettled([repo.reserve(input()), repo.reserve(input())]);
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    expect(results.filter((r) => r.status === 'rejected')).toHaveLength(1);
    expect(balance()).toBe(0);
    expect(rows().filter((row: any) => row.type === 'bonus')).toHaveLength(1);
    expect(rows().filter((row: any) => row.type === 'consumption')).toHaveLength(2);
  });
  test('rejects the same idempotency key for different content without new ledger entries', async () => {
    const first = input();
    await repo.reserve(first);
    await expect(repo.reserve({ ...first, inputHash: 'b'.repeat(64) })).rejects.toMatchObject({ code: 'IDEMPOTENCY_CONFLICT', status: 409 });
    expect(rows()).toHaveLength(2);
    expect(balance()).toBe(0);
  });
  test('banned accounts cannot obtain a trial or reserve a job', async () => {
    sqlite.prepare('UPDATE user SET banned = 1 WHERE id = ?').run('u1');
    await expect(repo.reserve(input())).rejects.toMatchObject({ code: 'FORBIDDEN', status: 403 });
    expect(rows()).toHaveLength(0);
    expect(sqlite.prepare('SELECT * FROM body_image_edit').all()).toHaveLength(0);
  });
  test('rolls back job, balance, and trial ledger if debit logging fails', async () => {
    sqlite.exec(`CREATE TRIGGER reject_debit BEFORE INSERT ON credit_transaction WHEN NEW.type = 'consumption'
      BEGIN SELECT RAISE(ABORT, 'unit debit failure'); END;`);
    await expect(repo.reserve(input())).rejects.toThrow();
    expect(balance()).toBe(0);
    expect(rows()).toHaveLength(0);
    expect(sqlite.prepare('SELECT * FROM body_image_edit').all()).toHaveLength(0);
  });
  test('refund and failed state commit once across repeated failures', async () => {
    const first = input();
    await repo.reserve(first);
    expect(await repo.fail('u1', first.jobId, 'UPSTREAM_ERROR', start)).toMatchObject({ job: { status: 'failed', refunded: true }, balance: 15 });
    await repo.fail('u1', first.jobId, 'TIMEOUT', start);
    expect(rows().filter((row: any) => row.type === 'refund')).toHaveLength(1);
    expect(balance()).toBe(15);
    expect(await repo.reserve(first)).toMatchObject({ job: { status: 'failed', errorCode: 'UPSTREAM_ERROR' }, reused: true });
  });
  test('expires a stale job and prevents a late success from replacing its refund', async () => {
    const first = input();
    await repo.reserve(first);
    const late = new Date(first.deadlineAt.getTime() + 1);
    expect(await repo.get('u1', first.jobId, late)).toMatchObject({ job: { status: 'failed', errorCode: 'TIMEOUT', refunded: true }, balance: 15 });
    expect(await repo.succeed('u1', first.jobId, 'body-edits/result.png', 'image/png', late)).toMatchObject({ job: { status: 'failed', resultKey: null } });
    expect(rows().filter((row: any) => row.type === 'refund')).toHaveLength(1);
  });
  test('success persists a private result and cannot subsequently be refunded', async () => {
    const first = input();
    await repo.reserve(first);
    expect(await repo.succeed('u1', first.jobId, 'body-edits/result.png', 'image/png', start)).toMatchObject({ job: { status: 'succeeded', resultKey: 'body-edits/result.png' }, balance: 0 });
    expect(await repo.fail('u1', first.jobId, 'TIMEOUT', start)).toMatchObject({ job: { status: 'succeeded', refunded: false } });
    expect(rows()).toHaveLength(2);
    await expect(repo.get('u2', first.jobId, start)).rejects.toMatchObject({ code: 'NOT_FOUND', status: 404 });
  });
});

test('request lookup recovers a charged task and cannot read another account task', async () => {
  const reserved = input();
  await repo.reserve(reserved);
  expect(await repo.getByRequest('u1', reserved.requestId, start)).toMatchObject({ job: { id: reserved.jobId }, reused: true });
  await expect(repo.getByRequest('u2', reserved.requestId, start)).rejects.toMatchObject({ code: 'NOT_FOUND' });
  expect(rows()).toHaveLength(2);
  const expired = new Date(start.getTime() + 190_000);
  expect(await repo.getByRequest('u1', reserved.requestId, expired)).toMatchObject({ job: { status: 'failed', refunded: true }, balance: 15 });
  expect(await repo.getByRequest('u1', reserved.requestId, expired)).toMatchObject({ balance: 15 });
  expect(rows().filter((row: any) => row.type === 'refund')).toHaveLength(1);
});
