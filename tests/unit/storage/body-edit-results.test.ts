import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createNodeBodyEditStore, createR2BodyEditStore } from '../../../libs/storage/body-edit-results';

const id = '12345678-1234-4234-8234-123456789012';
const PNG = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
let directory: string;
beforeEach(async () => { directory = await mkdtemp(join(tmpdir(), 'body-edit-store-')); });
afterEach(async () => { await rm(directory, { recursive: true, force: true }); });

describe('private body edit results', () => {
  test('writes only a generated result to a private directory and never overwrites it', async () => {
    const store = createNodeBodyEditStore({ directory });
    const key = await store.put(id, PNG, 'image/png');
    expect(key).toBe(`body-edits/${id}.png`);
    expect(await store.get(key)).toEqual({ bytes: PNG, mimeType: 'image/png' });
    await expect(store.put(id, PNG, 'image/png')).rejects.toThrow();
    expect(new Uint8Array(await readFile(join(directory, `${id}.png`)))).toEqual(PNG);
    await store.delete(key);
    expect(await store.get(key)).toBeNull();
  });
  test.each(['../../.env', `body-edits/../../.env`, `body-edits/${id}.svg`, 'https://files.example.test/a.png'])('rejects an untrusted storage key %s', async (key) => {
    const store = createNodeBodyEditStore({ directory });
    await expect(store.get(key)).rejects.toThrow();
    await expect(store.delete(key)).rejects.toThrow();
  });
  test('checks generated output type and size before any file is saved', async () => {
    const store = createNodeBodyEditStore({ directory });
    await expect(store.put(id, PNG, 'image/jpeg')).rejects.toThrow();
    await expect(store.put(id, new Uint8Array(10 * 1024 * 1024 + 1), 'image/png')).rejects.toThrow();
    await expect(store.put('../escape', PNG, 'image/png')).rejects.toThrow();
  });
  test('uses a private R2 binding without a public URL or presigned credentials', async () => {
    const saved = new Map<string, { bytes: Uint8Array; mimeType: string }>();
    const bucket = {
      put: vi.fn(async (key: string, value: ArrayBuffer | ArrayBufferView, options?: { httpMetadata?: { contentType?: string } }) => {
        const bytes = ArrayBuffer.isView(value) ? new Uint8Array(value.buffer, value.byteOffset, value.byteLength) : new Uint8Array(value);
        saved.set(key, { bytes: new Uint8Array(bytes), mimeType: options?.httpMetadata?.contentType ?? 'application/octet-stream' });
        return { key, size: bytes.byteLength, etag: 'unit', uploaded: new Date() };
      }),
      get: vi.fn(async (key: string) => { const value = saved.get(key); return value ? { size: value.bytes.length, httpMetadata: { contentType: value.mimeType }, arrayBuffer: async () => new Uint8Array(value.bytes).buffer } : null; }),
      head: vi.fn(async () => null),
      list: vi.fn(async () => ({ objects: [] })),
      delete: vi.fn(async (key) => { saved.delete(key); }),
    };
    const store = createR2BodyEditStore(bucket as Parameters<typeof createR2BodyEditStore>[0]);
    const key = await store.put(id, PNG, 'image/png');
    expect(bucket.put).toHaveBeenCalledTimes(1);
    expect(await store.get(key)).toEqual({ bytes: PNG, mimeType: 'image/png' });
    await store.delete(key);
    expect(await store.get(key)).toBeNull();
  });
});
