import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { Pool } from 'pg';
import { readFileSync } from 'node:fs';
import { config as dotenv } from 'dotenv';
import { createBodyGuestRepository } from '../../../libs/credits/body-guest-repository';
import type { ReserveBodyEdit } from '../../../libs/credits/body-edit-types';

// Explicit opt-in: all writes are confined to a newly created, random test schema.
describe.skipIf(process.env.GUEST_PG_TEST !== 'true')('real PostgreSQL guest concurrency', () => {
  let pool: Pool;
  const schema = 'guest_trial_test_' + crypto.randomUUID().replace(/-/g, '');
  let created = false;
  const now = new Date();
  const connection = { connect: async () => {
    const client = await pool.connect();
    try { await client.query(`SET search_path TO "${schema}"`); return client; }
    catch (error) { client.release(); throw error; }
  } };
  const repo = (networkHash = 'network') => createBodyGuestRepository({ dialect: 'pg', pool: connection, networkHash });
  const input = (owner: string, overrides: Partial<ReserveBodyEdit> = {}): ReserveBodyEdit => ({
    jobId: crypto.randomUUID(), userId: owner, requestId: crypto.randomUUID(), inputHash: 'a'.repeat(64),
    mode: 'slim', intensity: 70, model: 'unit', costCredits: 15, trialCredits: 0, now,
    deadlineAt: new Date(now.getTime() + 180_000), ...overrides });
  beforeAll(async () => {
    dotenv(); pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 6, connectionTimeoutMillis: 15000 });
    if (!/^guest_trial_test_[a-f0-9]{32}$/.test(schema)) throw new Error('Invalid isolated test schema');
    await pool.query(`CREATE SCHEMA "${schema}"`); created = true;
    const client = await connection.connect();
    try { for (const sql of readFileSync('libs/database/drizzle/0007_body_guest_edit.sql', 'utf8').split('--> statement-breakpoint')) if (sql.trim()) await client.query(sql); }
    finally { client.release(); }
  }, 30000);
  beforeEach(async () => { const client = await connection.connect(); try { await client.query('TRUNCATE body_guest_edit'); } finally { client.release(); } });
  afterAll(async () => { try { if (created) await pool.query(`DROP SCHEMA "${schema}" CASCADE`); } finally { await pool?.end(); } });
  test('concurrent distinct requests for one guest execute at most once', async () => {
    const results = await Promise.allSettled([repo().reserve(input('guest:a')), repo().reserve(input('guest:a'))]);
    expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(1);
    expect(results.filter(r => r.status === 'rejected')).toHaveLength(1);
  }, 30000);
  test('network reservation caps hold across concurrent new guest cookies', async () => {
    const results = await Promise.allSettled(Array.from({ length: 6 }, (_, i) => repo().reserve(input(`guest:${i}`))));
    expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(5);
    expect(results.filter(r => r.status === 'rejected')).toHaveLength(1);
  }, 30000);
  test('same UUID reuses a completed trial, failure releases quota, late output stays failed', async () => {
    const repository = repo(); const request = input('guest:a');
    await repository.reserve(request); await repository.succeed(request.userId, request.jobId, 'private', 'image/png', now);
    expect(await repository.reserve(request)).toMatchObject({ reused: true, job: { costCredits: 0, status: 'succeeded' } });
    await expect(repository.reserve(input('guest:a'))).rejects.toMatchObject({ code: 'TRIAL_EXHAUSTED' });
    const retry = input('guest:b'); await repository.reserve(retry); await repository.fail(retry.userId, retry.jobId, 'TIMEOUT', now);
    expect(await repository.allowance(retry.userId, now)).toBe(1);
    expect(await repository.succeed(retry.userId, retry.jobId, 'late', 'image/png', now)).toMatchObject({ job: { status: 'failed' } });
    await expect(repository.get('guest:c', request.jobId, now)).rejects.toMatchObject({ code: 'NOT_FOUND' });
  }, 45000);
});
