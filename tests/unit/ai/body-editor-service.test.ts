import { afterEach, describe, expect, test, vi } from 'vitest';
import { createBodyEditorService, type SubmitBodyEdit } from '../../../libs/ai/body-editor-service';
import { BodyImageEditError } from '../../../libs/ai/body-edit';
import type { BodyEditJob, BodyEditRepository, BodyEditResultStore, ReserveBodyEdit } from '../../../libs/credits/body-edit-types';

const PNG = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
const id = '12345678-1234-4234-8234-123456789012';
afterEach(() => vi.restoreAllMocks());
function setup() {
  const jobs = new Map<string, BodyEditJob>();
  let balance = 0; // A new account receives its one-time welcome credits.
  let trial = false;
  const repo: BodyEditRepository = {
    reserve: vi.fn(async (input: ReserveBodyEdit) => {
      const prior = [...jobs.values()].find((j) => j.requestId === input.requestId);
      if (prior) return { job: prior, balance, reused: true };
      if (!trial) { balance += input.trialCredits; trial = true; }
      balance -= input.costCredits;
      const job: BodyEditJob = { ...input, id: input.jobId, status: 'processing', resultKey: null, resultMimeType: null,
        errorCode: null, refunded: false, createdAt: input.now, updatedAt: input.now };
      jobs.set(job.id, job);
      return { job, balance, reused: false };
    }),
    get: vi.fn(async (_userId, jobId) => ({ job: jobs.get(jobId)!, balance, reused: true })),
    getByRequest: vi.fn(async (userId, requestId) => ({ job: [...jobs.values()].find(j => j.userId === userId && j.requestId === requestId)!, balance, reused: true })),
    succeed: vi.fn(async (_userId, jobId, key, mime, now) => {
      const job = jobs.get(jobId)!;
      if (job.status === 'processing') Object.assign(job, { status: 'succeeded', resultKey: key, resultMimeType: mime, updatedAt: now });
      return { job, balance, reused: false };
    }),
    fail: vi.fn(async (_userId, jobId, code, now) => {
      const job = jobs.get(jobId)!;
      if (job.status === 'processing') { balance += job.costCredits; Object.assign(job, { status: 'failed', errorCode: code, refunded: true, updatedAt: now }); }
      return { job, balance, reused: false };
    }),
  };
  const store: BodyEditResultStore = { put: vi.fn(async (jobId) => `body-edits/${jobId}.png`), get: vi.fn(async () => null), delete: vi.fn(async () => undefined) };
  const edit = vi.fn(async () => ({ imageUrl: `data:image/png;base64,${Buffer.from(PNG).toString('base64')}`,
    outputFormat: 'png' as const, provider: 'openai' as const, model: 'gpt-image-2.5-1k' as const, mode: 'slim' as const, intensity: 70 as const }));
  const available = vi.fn(async () => true);
  const service = createBodyEditorService({ repository: repo, storage: store, editImage: edit, checkAvailable: available,
    now: () => new Date('2026-10-14T12:00:00Z'), newJobId: () => id });
  const input = { userId: 'u1', requestId: id, image: { bytes: PNG, mimeType: 'image/png' as const }, mode: 'slim' as const };
  return { service, repo, store, edit, available, input };
}

describe('body editor domain', () => {
  test.each([null, 1, {}, 'x'.repeat(501), 'waist\0', '\vwaist', 'waist\u007f'])('rejects invalid instructions before checking readiness or reserving credits', async (instructions) => {
    const { service, repo, edit, available, input } = setup();
    await expect(service.submit({ ...input, instructions } as SubmitBodyEdit)).rejects.toMatchObject({ code: 'INVALID_INSTRUCTIONS', status: 400 });
    expect(available).not.toHaveBeenCalled();
    expect(repo.reserve).not.toHaveBeenCalled();
    expect(edit).not.toHaveBeenCalled();
  });

  test('normalizes instructions once for the provider and request hash without persisting the text', async () => {
    const { service, repo, edit, input } = setup();
    await service.submit({ ...input, instructions: ' \r\nWaist only.\rKeep arms.\r\n ' });
    expect(edit).toHaveBeenCalledWith(expect.objectContaining({ instructions: 'Waist only.\nKeep arms.' }));
    const first = vi.mocked(repo.reserve).mock.calls[0][0];
    expect(first).not.toHaveProperty('instructions');
    expect(JSON.stringify(first)).not.toContain('Waist only.');
    await service.submit({ ...input, requestId: '87654321-1234-4234-8234-123456789012', instructions: 'Waist only.\nKeep arms.' });
    expect(vi.mocked(repo.reserve).mock.calls[1][0].inputHash).toBe(first.inputHash);
    await service.submit({ ...input, requestId: '87654321-1234-4234-8234-123456789013', instructions: 'Hips fuller.' });
    expect(vi.mocked(repo.reserve).mock.calls[2][0].inputHash).not.toBe(first.inputHash);
  });

  test('hashes the entire encoded instruction prefix and original photo even when it exceeds 128 bytes', async () => {
    const { service, repo, edit, input } = setup();
    const instructions = '腰'.repeat(500);
    await service.submit({ ...input, instructions });
    await service.submit({ ...input, requestId: '87654321-1234-4234-8234-123456789012', instructions: `${'腰'.repeat(499)}臀` });
    await service.submit({ ...input, requestId: '87654321-1234-4234-8234-123456789013', instructions,
      image: { ...input.image, bytes: new Uint8Array([...PNG, 1]) } });
    const hashes = vi.mocked(repo.reserve).mock.calls.map(([value]) => value.inputHash);
    expect(new Set(hashes).size).toBe(3);
    expect(edit).toHaveBeenCalledTimes(3);
  });

  test.each([70, 'balanced'] as const)('keeps the old %s request hash for blank instructions', async (intensity) => {
    const { service, repo, input } = setup();
    for (const instructions of [undefined, '', ' \t\r\n ']) await service.submit({ ...input, intensity, instructions });
    const prefix = new TextEncoder().encode(`slim\0${intensity}\0image/png\0`);
    const bytes = new Uint8Array(prefix.length + PNG.length);
    bytes.set(prefix); bytes.set(PNG, prefix.length);
    const hash = Buffer.from(await crypto.subtle.digest('SHA-256', bytes)).toString('hex');
    for (const [reserved] of vi.mocked(repo.reserve).mock.calls) expect(reserved.inputHash).toBe(hash);
  });

  test('does not log instructions when a custom request fails', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { service, edit, input } = setup();
    edit.mockRejectedValue(new BodyImageEditError('UPSTREAM_ERROR', 'Private request: waist only.'));
    await service.submit({ ...input, instructions: 'Private request: waist only.' });
    expect(warn).toHaveBeenCalled();
    expect(JSON.stringify(warn.mock.calls)).not.toContain('Private request: waist only.');
  });

  test('keeps numeric strength in the job, prompt options and request fingerprint', async () => {
    const { service, repo, edit, input } = setup();
    await service.submit({ ...input, intensity: 73 });
    expect(repo.reserve).toHaveBeenCalledWith(expect.objectContaining({ intensity: 73 }));
    expect(edit).toHaveBeenCalledWith(expect.objectContaining({ intensity: 73 }));
    const numericHash = vi.mocked(repo.reserve).mock.calls[0][0].inputHash;
    await service.submit({ ...input, requestId: '87654321-1234-4234-8234-123456789012', intensity: 74 });
    expect(vi.mocked(repo.reserve).mock.calls[1][0].inputHash).not.toBe(numericHash);
  });
  test('preserves historical named request fingerprints while recording numeric strength', async () => {
    const { service, repo, input } = setup();
    await service.submit({ ...input, intensity: 'balanced' });
    const prefix = new TextEncoder().encode('slim\0balanced\0image/png\0');
    const bytes = new Uint8Array(prefix.length + input.image.bytes.length);
    bytes.set(prefix); bytes.set(input.image.bytes, prefix.length);
    const expectedHash = Buffer.from(await crypto.subtle.digest('SHA-256', bytes)).toString('hex');
    expect(repo.reserve).toHaveBeenCalledWith(expect.objectContaining({ intensity: 50, inputHash: expectedHash }));
  });
  test.each([0, 101, 73.5, NaN])('rejects invalid strength %s before reserving credits', async (intensity) => {
    const { service, repo, edit, input } = setup();
    await expect(service.submit({ ...input, intensity })).rejects.toMatchObject({ code: 'INVALID_INPUT' });
    expect(repo.reserve).not.toHaveBeenCalled(); expect(edit).not.toHaveBeenCalled();
  });
  test('reserves billing once, stores only the output, and reuses a completed request', async () => {
    const { service, repo, edit, store, input } = setup();
    const first = await service.submit(input);
    expect(first).toMatchObject({ job: { status: 'succeeded', costCredits: 10 }, balance: 0, reused: false });
    expect(repo.reserve).toHaveBeenCalledWith(expect.objectContaining({ trialCredits: 10, costCredits: 10, inputHash: expect.stringMatching(/^[a-f0-9]{64}$/) }));
    expect(store.put).toHaveBeenCalledWith(id, PNG, 'image/png');
    expect(await service.submit(input)).toMatchObject({ job: { status: 'succeeded' }, reused: true });
    expect(edit).toHaveBeenCalledTimes(1);
    expect(store.put).toHaveBeenCalledTimes(1);
  });
  test('does not reserve credits when the gateway or storage is unavailable', async () => {
    const { service, repo, available, edit, input } = setup();
    available.mockResolvedValue(false);
    await expect(service.submit(input)).rejects.toMatchObject({ code: 'NOT_CONFIGURED', status: 503 });
    expect(repo.reserve).not.toHaveBeenCalled();
    expect(edit).not.toHaveBeenCalled();
  });
  test.each(['requestId', 'mode', 'mime'])('rejects invalid %s before billing', async (field) => {
    const { service, repo, input } = setup();
    const invalid = field === 'requestId' ? { ...input, requestId: 'not-uuid' }
      : field === 'mode' ? { ...input, mode: 'face' } : { ...input, image: { ...input.image, mimeType: 'image/jpeg' } };
    await expect(service.submit(invalid as typeof input)).rejects.toMatchObject({ code: 'INVALID_INPUT' });
    expect(repo.reserve).not.toHaveBeenCalled();
  });
  test('refunds provider failure and reuses the failed job without retrying', async () => {
    const { service, repo, edit, input } = setup();
    edit.mockRejectedValue(Object.assign(new Error('Private upstream text'), { code: 'TIMEOUT' }));
    expect(await service.submit(input)).toMatchObject({ job: { status: 'failed', errorCode: 'TIMEOUT', refunded: true }, balance: 10 });
    expect(await service.submit(input)).toMatchObject({ job: { status: 'failed' }, reused: true });
    expect(edit).toHaveBeenCalledTimes(1);
    expect(repo.fail).toHaveBeenCalledTimes(1);
  });
  test('logs safe provider diagnostics with the job ID while refunding a rejected result', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { service, edit, input } = setup();
    const error = Object.assign(new BodyImageEditError('INVALID_RESPONSE', 'private upstream message', 200, 'req-provider-unit'),
      { diagnostic: { reason: 'result_origin', resultHost: 'other.example.test' } });
    edit.mockRejectedValue(error);
    expect(await service.submit(input)).toMatchObject({ job: { status: 'failed', refunded: true }, balance: 10 });
    expect(warn).toHaveBeenCalledWith('[body-edit] failed', expect.objectContaining({ jobId: id,
      model: 'gpt-image-2.5-1k', stage: 'provider', code: 'INVALID_RESPONSE', providerRequestId: 'req-provider-unit',
      diagnostic: { reason: 'result_origin', resultHost: 'other.example.test' } }));
    expect(JSON.stringify(warn.mock.calls)).not.toContain('private upstream message');
  });
  test('refunds storage failure without exposing raw errors or retaining original input', async () => {
    const { service, store, input } = setup();
    vi.mocked(store.put).mockRejectedValue(new Error('Private storage path'));
    expect(await service.submit(input)).toMatchObject({ job: { status: 'failed', errorCode: 'STORAGE_ERROR', refunded: true } });
  });
  test('never fetches an arbitrary URL returned by the gateway', async () => {
    const { service, edit, store, input } = setup();
    edit.mockResolvedValue({ imageUrl: 'https://images.example.test/result.png' } as Awaited<ReturnType<typeof edit>>);
    expect(await service.submit(input)).toMatchObject({ job: { status: 'failed', errorCode: 'RESULT_UNAVAILABLE', refunded: true } });
    expect(store.put).not.toHaveBeenCalled();
  });
  test('deletes a late output when an already-refunded job cannot become successful', async () => {
    const { service, repo, store, input } = setup();
    const original = repo.succeed;
    repo.succeed = vi.fn(async (userId, jobId, key, mime, at) => {
      await repo.fail(userId, jobId, 'TIMEOUT', at);
      return original(userId, jobId, key, mime, at);
    });
    expect(await service.submit(input)).toMatchObject({ job: { status: 'failed', refunded: true } });
    expect(store.delete).toHaveBeenCalledWith(`body-edits/${id}.png`);
  });
});
