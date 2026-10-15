import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { createBodyGuestRepository } from '../../../libs/credits/body-guest-repository';
import type { ReserveBodyEdit } from '../../../libs/credits/body-edit-types';
import { createBodyEditRepository } from '../../../libs/credits/body-edit-repository';
import { createBodyEditorService } from '../../../libs/ai/body-editor-service';

let db: Database.Database;
let repo: ReturnType<typeof createBodyGuestRepository>;
const now = new Date('2026-10-15T12:00:00Z');
let serial = 0;
function input(overrides: Partial<ReserveBodyEdit> = {}): ReserveBodyEdit {
  serial++;
  return { jobId: `job-${serial}`, userId: 'guest:a', requestId: `request-${serial}`, inputHash: 'a'.repeat(64),
    mode: 'slim', intensity: 70, model: 'unit-model', costCredits: 15, trialCredits: 0, now,
    deadlineAt: new Date(now.getTime() + 180_000), ...overrides };
}
beforeEach(() => {
  serial = 0; db = new Database(':memory:');
  db.exec(readFileSync('libs/database/drizzle-sqlite/0007_body_guest_edit.sql', 'utf8'));
  repo = createBodyGuestRepository({ dialect: 'sqlite', sqlite: db, networkHash: 'network-a' });
});
afterEach(() => db?.close());

test('a guest gets one successful edit without any account or credit ledger', async () => {
  expect(await repo.allowance('guest:a', now)).toBe(1);
  const first = input();
  expect(await repo.reserve(first)).toMatchObject({ job: { userId: 'guest:a', costCredits: 0, status: 'processing' }, balance: 0 });
  expect(await repo.allowance('guest:a', now)).toBe(0);
  await repo.succeed('guest:a', first.jobId, 'private/result', 'image/png', now);
  await expect(repo.reserve(input())).rejects.toMatchObject({ code: 'TRIAL_EXHAUSTED' });
  expect(db.prepare('SELECT * FROM body_guest_edit').all()).toHaveLength(1);
});
test('same UUID reuses the job and mismatched content is rejected', async () => {
  const first = input(); await repo.reserve(first);
  expect(await repo.reserve({ ...first, jobId: 'unused' })).toMatchObject({ job: { id: first.jobId }, reused: true });
  await expect(repo.reserve({ ...first, inputHash: 'different' })).rejects.toMatchObject({ code: 'IDEMPOTENCY_CONFLICT' });
});
test('different concurrent requests reserve at most one trial', async () => {
  const results = await Promise.allSettled([repo.reserve(input()), repo.reserve(input())]);
  expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(1);
  expect(results.filter(r => r.status === 'rejected')).toHaveLength(1);
  expect(db.prepare('SELECT * FROM body_guest_edit').all()).toHaveLength(1);
});
test('failure releases the trial and retrying a failed UUID does not execute again', async () => {
  const first = input(); await repo.reserve(first);
  await repo.fail('guest:a', first.jobId, 'UPSTREAM_ERROR', now);
  expect(await repo.allowance('guest:a', now)).toBe(1);
  expect(await repo.reserve(first)).toMatchObject({ job: { status: 'failed', refunded: true }, reused: true });
  expect(await repo.reserve(input())).toMatchObject({ job: { status: 'processing' }, reused: false });
});
test('expired jobs release quota and late output cannot consume it', async () => {
  const first = input(); await repo.reserve(first);
  const later = new Date(first.deadlineAt.getTime() + 1);
  expect(await repo.allowance('guest:a', later)).toBe(1);
  expect(await repo.succeed('guest:a', first.jobId, 'late', 'image/png', later)).toMatchObject({ job: { status: 'failed', errorCode: 'TIMEOUT' } });
  expect(await repo.reserve(input({ now: later, deadlineAt: new Date(later.getTime() + 180_000) }))).toMatchObject({ reused: false });
});
test('other guests cannot access, look up or mutate output', async () => {
  const first = input(); await repo.reserve(first);
  await expect(repo.get('guest:b', first.jobId, now)).rejects.toMatchObject({ code: 'NOT_FOUND' });
  await expect(repo.getByRequest('guest:b', first.requestId, now)).rejects.toMatchObject({ code: 'NOT_FOUND' });
  await expect(repo.succeed('guest:b', first.jobId, 'stolen', 'image/png', now)).rejects.toMatchObject({ code: 'NOT_FOUND' });
  await expect(repo.fail('guest:b', first.jobId, 'TIMEOUT', now)).rejects.toMatchObject({ code: 'NOT_FOUND' });
});
test('resetting cookies stays bounded by the persistent network trial limit', async () => {
  for (let i = 0; i < 5; i++) {
    const item = input({ userId: `guest:${i}` }); await repo.reserve(item);
    await repo.succeed(item.userId, item.jobId, 'result', 'image/png', now);
  }
  await expect(repo.reserve(input({ userId: 'guest:reset-cookie' }))).rejects.toMatchObject({ code: 'RATE_LIMITED' });
  const other = createBodyGuestRepository({ dialect: 'sqlite', sqlite: db, networkHash: 'network-b' });
  expect(await other.reserve(input({ userId: 'guest:another-network' }))).toMatchObject({ reused: false });
});
test('failures do not allow unlimited provider retries', async () => {
  for (let i = 0; i < 3; i++) { const item = input(); await repo.reserve(item); await repo.fail(item.userId, item.jobId, 'TIMEOUT', now); }
  await expect(repo.reserve(input())).rejects.toMatchObject({ code: 'RATE_LIMITED' });
});
test('missing trusted network identity fails closed before reserving', async () => {
  const unavailable = createBodyGuestRepository({ dialect: 'sqlite', sqlite: db });
  await expect(unavailable.reserve(input())).rejects.toMatchObject({ code: 'NOT_CONFIGURED' });
  expect(db.prepare('SELECT * FROM body_guest_edit').all()).toHaveLength(0);
});

test('a signed-in zero-balance account receives no extra trial or provider call', async () => {
  db.exec(`CREATE TABLE user (id TEXT PRIMARY KEY,banned INTEGER DEFAULT 0,credit_balance TEXT DEFAULT '0',updated_at INTEGER);
    CREATE TABLE credit_transaction (id TEXT PRIMARY KEY,user_id TEXT,type TEXT,amount TEXT,balance TEXT,description TEXT,metadata TEXT,created_at INTEGER);
    INSERT INTO user (id) VALUES ('account');`);
  db.exec(readFileSync('libs/database/drizzle-sqlite/0006_body_image_edit.sql', 'utf8'));
  const editImage = vi.fn();
  const service = createBodyEditorService({ repository: createBodyEditRepository({ dialect: 'sqlite', sqlite: db }),
    storage: { put: vi.fn(), get: vi.fn(), delete: vi.fn() }, editImage, checkAvailable: () => true });
  await expect(service.submit({ userId: 'account', requestId: crypto.randomUUID(), mode: 'slim',
    image: { bytes: new Uint8Array([137,80,78,71,13,10,26,10]), mimeType: 'image/png' } })).rejects.toMatchObject({ code: 'INSUFFICIENT_CREDITS' });
  expect(editImage).not.toHaveBeenCalled();
  expect(db.prepare('SELECT * FROM credit_transaction').all()).toHaveLength(0);
  expect(db.prepare('SELECT * FROM body_image_edit').all()).toHaveLength(0);
});
