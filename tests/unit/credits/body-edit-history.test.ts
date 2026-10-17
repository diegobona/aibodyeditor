import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import Database from 'better-sqlite3';
import { createBodyEditHistory } from '../../../libs/credits/body-edit-history';
import { createBodyEditHandlers } from '../../../apps/tanstack-app/src/lib/body-edit-api';
import type { BodyEditorService } from '../../../libs/ai/body-editor-service';

let db: Database.Database;
const now = new Date('2026-10-17T12:00:00Z');
const id = '71000000-0000-4000-8000-000000000001';
const other = '71000000-0000-4000-8000-000000000002';
const expired = '71000000-0000-4000-8000-000000000003';
const storage = { put: vi.fn(), get: vi.fn(), delete: vi.fn(async () => {}) };
let history: ReturnType<typeof createBodyEditHistory>;
beforeEach(() => {
  vi.clearAllMocks(); db = new Database(':memory:');
  db.exec('CREATE TABLE body_image_edit (id TEXT PRIMARY KEY, user_id TEXT, result_key TEXT, result_mime_type TEXT, mode TEXT, intensity TEXT, status TEXT, created_at INTEGER); CREATE TABLE credit_transaction (id TEXT PRIMARY KEY, amount INTEGER); INSERT INTO credit_transaction VALUES (\'debit\', -15)');
  const add = db.prepare('INSERT INTO body_image_edit VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  add.run(id, 'owner', `body-edits/${id}.png`, 'image/png', 'slim', '70', 'succeeded', now.getTime());
  add.run(other, 'other', `body-edits/${other}.png`, 'image/png', 'muscle', '80', 'succeeded', now.getTime());
  add.run(expired, 'owner', `body-edits/${expired}.png`, 'image/png', 'breast', 'balanced', 'succeeded', now.getTime() - 31 * 86_400_000);
  history = createBodyEditHistory({ dialect: 'sqlite', sqlite: db }, storage, () => now);
});
afterEach(() => db.close());

test('lists only owned, unexpired results and physically cleans expired images', async () => {
  const result = await history.list('owner', 0);
  expect(result.items.map(item => item.id)).toEqual([id]);
  expect(result.items[0]).toMatchObject({ intensity: 70, expiresAt: '2026-11-16T12:00:00.000Z' });
  expect(result.items[0]).not.toHaveProperty('resultKey');
  expect(storage.delete).toHaveBeenCalledExactlyOnceWith(`body-edits/${expired}.png`);
});
test('other users cannot delete a result; owned deletion preserves billing and is retry-safe', async () => {
  await expect(history.remove('other', id)).rejects.toMatchObject({ code: 'NOT_FOUND' });
  expect(storage.delete).not.toHaveBeenCalled();
  await history.remove('owner', id); await history.remove('owner', id);
  expect(storage.delete).toHaveBeenCalledExactlyOnceWith(`body-edits/${id}.png`);
  expect(db.prepare('SELECT amount FROM credit_transaction').get()).toEqual({ amount: -15 });
  expect((await history.list('owner', 0)).items).toEqual([]);
});
test('failed storage deletion retains its reference so cleanup can retry', async () => {
  storage.delete.mockRejectedValueOnce(new Error('storage temporarily down'));
  await expect(history.remove('owner', id)).rejects.toThrow();
  expect(db.prepare('SELECT result_key FROM body_image_edit WHERE id = ?').get(id)).toEqual({ result_key: `body-edits/${id}.png` });
  await history.remove('owner', id);
});
test('scheduled cleanup needs no user visit and keeps recent results', async () => {
  expect(await history.cleanup()).toBe(1);
  expect(await history.cleanup()).toBe(0);
  expect((await history.list('other', 0)).items).toHaveLength(1);
});
test('page boundaries are stable and malformed pages are rejected', async () => {
  const add = db.prepare('INSERT INTO body_image_edit VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  for (let index = 0; index < 25; index++) add.run(`extra-${index}`, 'owner', `key-${index}`, 'image/png', 'slim', '50', 'succeeded', now.getTime() - index - 1);
  expect(await history.list('owner', 0)).toMatchObject({ hasMore: true, items: expect.any(Array) });
  expect((await history.list('owner', 0)).items).toHaveLength(24);
  expect((await history.list('owner', 1)).items).toHaveLength(2);
  await expect(history.list('owner', -1)).rejects.toMatchObject({ code: 'INVALID_INPUT' });
});
test('HTTP history/deletion require login and same-origin deletion', async () => {
  let loggedIn = false;
  const handlers = createBodyEditHandlers({ service: {} as BodyEditorService, history,
    getUser: async () => loggedIn ? { id: 'owner' } : null,
    getConfig: () => ({ available: true, costCredits: 15, freeTrialEdits: 0 }), readImage: async () => null });
  expect((await handlers.history(new Request('https://example.com/api/body-edit/history'))).status).toBe(401);
  expect((await handlers.remove(new Request('https://example.com/api/body-edit/' + id, { method: 'DELETE', headers: { Origin: 'https://example.com' } }), id)).status).toBe(401);
  loggedIn = true;
  expect((await handlers.remove(new Request('https://example.com/api/body-edit/' + id, { method: 'DELETE', headers: { Origin: 'https://evil.test' } }), id)).status).toBe(403);
  expect((await handlers.history(new Request('https://example.com/api/body-edit/history?page=abc'))).status).toBe(400);
  const response = await handlers.history(new Request('https://example.com/api/body-edit/history'));
  expect(response.status).toBe(200); expect(response.headers.get('Cache-Control')).toContain('no-store');
  expect((await response.json()).items).toHaveLength(1);
});
