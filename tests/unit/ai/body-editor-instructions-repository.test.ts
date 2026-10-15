import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createBodyEditorService } from '../../../libs/ai/body-editor-service';
import { createBodyEditRepository } from '../../../libs/credits/body-edit-repository';
import { createBodyGuestRepository } from '../../../libs/credits/body-guest-repository';
import { editBodyImage } from '../../../libs/ai/body-edit';

const PNG = new Uint8Array(readFileSync(resolve('apps/tanstack-app/public/favicon-32x32.png')));
const requestId = '12345678-1234-4234-8234-123456789012';
let sqlite: Database.Database;

beforeEach(() => {
  sqlite = new Database(':memory:');
  sqlite.pragma('foreign_keys = ON');
  sqlite.exec(`CREATE TABLE user (id TEXT PRIMARY KEY, banned INTEGER DEFAULT 0, credit_balance TEXT DEFAULT '0', updated_at INTEGER);
    CREATE TABLE credit_transaction (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES user(id), type TEXT NOT NULL,
      amount TEXT NOT NULL, balance TEXT NOT NULL, order_id TEXT, description TEXT, metadata TEXT, created_at INTEGER NOT NULL);
    INSERT INTO user (id, credit_balance) VALUES ('u1', '45');`);
  sqlite.exec(readFileSync(resolve('libs/database/drizzle-sqlite/0006_body_image_edit.sql'), 'utf8'));
  sqlite.exec(readFileSync(resolve('libs/database/drizzle-sqlite/0007_body_guest_edit.sql'), 'utf8'));
});
afterEach(() => sqlite?.close());

describe('normalized instructions with persistent idempotency and billing', () => {
  test.each(['paid', 'guest'] as const)('%s reuses an equivalent request, conflicts on changed instructions, and executes only once', async (kind) => {
    const fetchMock = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({ data: [{ b64_json: Buffer.from(PNG).toString('base64') }] }),
      { headers: { 'Content-Type': 'application/json' } }));
    const storage = { put: vi.fn(async () => 'body-edits/edited.png'), get: vi.fn(async () => null), delete: vi.fn(async () => {}) };
    const repository = kind === 'paid' ? createBodyEditRepository({ dialect: 'sqlite', sqlite })
      : createBodyGuestRepository({ dialect: 'sqlite', sqlite, networkHash: 'network-instructions-test' });
    const service = createBodyEditorService({ repository, storage,
      editImage: (options) => editBodyImage(options, { apiKey: 'sk-unit-instructions-only', fetch: fetchMock }), checkAvailable: () => true });
    const input = { userId: kind === 'paid' ? 'u1' : 'guest:instructions-test', requestId, mode: 'slim' as const, intensity: 73,
      image: { bytes: PNG, mimeType: 'image/png' as const }, instructions: ' \r\nOnly slim waist.\rKeep arms.\r\n ' };
    const first = await service.submit(input);
    expect(first).toMatchObject({ balance: kind === 'paid' ? 30 : 0, reused: false, job: { status: 'succeeded' } });
    expect(await service.submit({ ...input, instructions: 'Only slim waist.\nKeep arms.' }))
      .toMatchObject({ balance: kind === 'paid' ? 30 : 0, reused: true, job: { id: first.job.id } });
    await expect(service.submit({ ...input, instructions: 'Make hips fuller.' }))
      .rejects.toMatchObject({ code: 'IDEMPOTENCY_CONFLICT', status: 409, jobId: first.job.id });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(storage.put).toHaveBeenCalledTimes(1);
    const jobs = sqlite.prepare(kind === 'paid' ? 'SELECT * FROM body_image_edit' : 'SELECT * FROM body_guest_edit').all();
    expect(jobs).toHaveLength(1);
    const ledger = sqlite.prepare('SELECT * FROM credit_transaction').all();
    expect(ledger).toHaveLength(kind === 'paid' ? 1 : 0);
    if (kind === 'paid') expect(ledger[0]).toMatchObject({ type: 'consumption', amount: '-15', description: 'ai_body_edit' });
    const persisted = JSON.stringify({ jobs, ledger, outcome: first });
    expect(persisted).not.toContain('Only slim waist.');
    expect(persisted).not.toContain('"instructions"');
    const form = fetchMock.mock.calls[0][1]?.body as FormData;
    expect(form.get('prompt')).toContain(JSON.stringify('Only slim waist.\nKeep arms.'));
  });
});
