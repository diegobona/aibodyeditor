import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createBodyEditHandlers } from '../../../apps/tanstack-app/src/lib/body-edit-api';
import { BodyEditError, type BodyEditJob, type BodyEditOutcome } from '../../../libs/credits/body-edit-types';
import type { BodyEditorService } from '../../../libs/ai/body-editor-service';

const ORIGIN = 'https://aibodyeditor.net';
const API_URL = `${ORIGIN}/api/body-edit`;
const JOB_ID = '89c2cd5c-1602-4b81-8d96-21b7a79be307';
const REQUEST_ID = '22a5b5a5-3b3a-47df-a631-a7a58b79c805';
const PNG = new Uint8Array(readFileSync(resolve('apps/tanstack-app/public/favicon-32x32.png')));
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const WIRE_LIMIT = MAX_IMAGE_BYTES + 64 * 1024;
const PRIVATE_ERROR = 'sk-private-unit-only upstream-detail private/storage-path';

test('optional body instructions are normalized and forwarded without client prompt/model overrides', async () => {
  const { handlers, service } = setup();
  const response = await handlers.submit(formRequest({ instructions: '  Only slim my waist.\r\nLeave my arms unchanged.  ', prompt: 'raw override', model: 'other-model' }));
  expect(response.status).toBe(200);
  expect(service.submit).toHaveBeenCalledWith(expect.objectContaining({ instructions: 'Only slim my waist.\nLeave my arms unchanged.' }));
  expect(service.submit.mock.calls[0][0]).not.toHaveProperty('prompt');
  expect(service.submit.mock.calls[0][0]).not.toHaveProperty('model');
  expect(await response.text()).not.toContain('Only slim');
});

test.each([null, '', ' \r\n\t '])('blank or omitted instructions %j keep the existing submission contract', async instructions => {
  const { handlers, service } = setup();
  expect((await handlers.submit(formRequest({ instructions }))).status).toBe(200);
  expect(service.submit.mock.calls[0][0].instructions ?? '').toBe('');
});

test('accepts exactly 500 instruction code units', async () => {
  const { handlers, service } = setup();
  expect((await handlers.submit(formRequest({ instructions: 'x'.repeat(500) }))).status).toBe(200);
  expect(service.submit).toHaveBeenCalledWith(expect.objectContaining({ instructions: 'x'.repeat(500) }));
});

test.each(['x'.repeat(501), 'waist\0only', 'waist\u0007only'])('rejects invalid instructions before executing', async instructions => {
  const { handlers, service } = setup();
  await expectError(await handlers.submit(formRequest({ instructions })), 400, 'INVALID_INSTRUCTIONS');
  expect(service.submit).not.toHaveBeenCalled();
});

test.each(['duplicate', 'file'])('rejects a %s instructions field before executing', async kind => {
  const { handlers, service } = setup();
  const body = await formRequest().formData();
  if (kind === 'duplicate') { body.append('instructions', 'one'); body.append('instructions', 'two'); }
  else body.set('instructions', new Blob(['not text'], { type: 'text/plain' }), 'instructions.txt');
  await expectError(await handlers.submit(new Request(API_URL, { method: 'POST', headers: { Origin: ORIGIN }, body })), 400, 'INVALID_INSTRUCTIONS');
  expect(service.submit).not.toHaveBeenCalled();
});

test.each(['1', '37', '73', '100'])('HTTP intensity %s reaches the service as an exact number', async (value) => {
  const { handlers, service } = setup();
  const response = await handlers.submit(formRequest({ intensity: value }));
  expect(response.status).toBe(200);
  expect(service.submit).toHaveBeenCalledWith(expect.objectContaining({ intensity: Number(value) }));
});

test.each(['0', '-1', '101', '37.5', 'NaN', 'Infinity', '', ' 70 ', '070', '1e2', '0x46'])('rejects malformed numeric intensity %s before executing', async (value) => {
  const { handlers, service } = setup();
  await expectError(await handlers.submit(formRequest({ intensity: value })), 400, 'INVALID_INPUT');
  expect(service.submit).not.toHaveBeenCalled();
});

test('legacy strengths remain accepted when old clients retry requests', async () => {
  const { handlers, service } = setup();
  expect((await handlers.submit(formRequest({ intensity: 'balanced' }))).status).toBe(200);
  expect(service.submit).toHaveBeenCalledWith(expect.objectContaining({ intensity: 'balanced' }));
});

function outcome(overrides: Partial<BodyEditJob> = {}, reused = false): BodyEditOutcome {
  return {
    job: {
      id: JOB_ID, userId: 'user-owner', requestId: REQUEST_ID, inputHash: 'a'.repeat(64),
      mode: 'slim', intensity: 70, model: 'gpt-image-2.5-1k', status: 'succeeded', costCredits: 15,
      resultKey: `private/body-edits/${JOB_ID}.png`, resultMimeType: 'image/png', errorCode: null, refunded: false,
      createdAt: new Date('2026-10-14T12:00:00Z'), updatedAt: new Date('2026-10-14T12:01:00Z'),
      deadlineAt: new Date('2026-10-14T12:03:05Z'), ...overrides,
    },
    balance: 45, reused,
  };
}

function setup() {
  const getUser = vi.fn<(request: Request) => Promise<{ id: string; banned?: boolean } | null>>(async () => ({ id: 'user-owner' }));
  const service = {
    submit: vi.fn<BodyEditorService['submit']>(async () => outcome()),
    getJob: vi.fn<BodyEditorService['getJob']>(async () => outcome({}, true)),
    getRequest: vi.fn<BodyEditorService['getRequest']>(async () => outcome({}, true)),
  };
  const getConfig = vi.fn(async () => ({ available: true, costCredits: 15, freeTrialEdits: 1 }));
  const readImage = vi.fn(async (_key: string): Promise<{ bytes: Uint8Array; mimeType: string } | null> => ({ bytes: PNG, mimeType: 'image/png' }));
  return { handlers: createBodyEditHandlers({ getUser, service, getConfig, readImage }), getUser, service, getConfig, readImage };
}

function formRequest(fields: Record<string, string | null> = {}, headers: HeadersInit = {}, image: Blob | string | null = new Blob([PNG], { type: 'image/png' })) {
  const body = new FormData();
  if (typeof image === 'string') body.set('image', image);
  else if (image) body.set('image', image, 'portrait.png');
  body.set('mode', 'slim');
  body.set('intensity', '70');
  body.set('requestId', REQUEST_ID);
  for (const [key, value] of Object.entries(fields)) {
    if (value === null) body.delete(key);
    else body.set(key, value);
  }
  const requestHeaders = new Headers(headers);
  if (!requestHeaders.has('Origin')) requestHeaders.set('Origin', ORIGIN);
  return new Request(API_URL, { method: 'POST', headers: requestHeaders, body });
}

function jobRequest(download = false) {
  return new Request(`${API_URL}/${JOB_ID}/image${download ? '?download=1' : ''}`);
}

async function expectError(response: Response, status: number, code: string) {
  expect(response.status).toBe(status);
  expect(response.headers.get('Cache-Control')).toContain('no-store');
  const body = await response.json();
  expect(body).toMatchObject({ error: { code } });
  expect(JSON.stringify(body)).not.toContain(PRIVATE_ERROR);
  expect(JSON.stringify(body)).not.toContain('private/body-edits');
  return body;
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Unexpected real network request'))));
  vi.stubEnv('OPENAI_API_KEY', '');
  vi.stubEnv('OPENAI_BASE_URL', 'https://api.tu-zi.com/v1');
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('body edit API authentication and projection', () => {
  test('requires authentication before calling a service that could charge credits', async () => {
    const { handlers, getUser, service } = setup();
    getUser.mockResolvedValue(null);
    const response = await handlers.submit(formRequest());
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: { code: 'UNAUTHORIZED' } });
    expect(service.submit).not.toHaveBeenCalled();
  });

  test('forbids a banned account before charging credits', async () => {
    const { handlers, getUser, service } = setup();
    getUser.mockResolvedValue({ id: 'user-owner', banned: true });
    const response = await handlers.submit(formRequest());
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: { code: 'FORBIDDEN' } });
    expect(service.submit).not.toHaveBeenCalled();
  });

  test('requires a matching origin before charging credits', async () => {
    const { handlers, service } = setup();
    const response = await handlers.submit(formRequest({}, { Origin: 'https://other.example.test' }));
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: { code: 'INVALID_ORIGIN' } });
    expect(service.submit).not.toHaveBeenCalled();
  });

  test('projects a successful job without exposing storage paths, hashes or the owner', async () => {
    const { handlers, service } = setup();
    const response = await handlers.submit(formRequest());
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toContain('no-store');
    expect(await response.json()).toEqual({
      jobId: JOB_ID, status: 'succeeded',
      result: { imageUrl: `/api/body-edit/${JOB_ID}/image`, downloadUrl: `/api/body-edit/${JOB_ID}/image?download=1`, mode: 'slim', intensity: 70 },
      credits: { charged: 15, balance: 45 }, reused: false,
    });
    expect(service.submit).toHaveBeenCalledTimes(1);
    const input = service.submit.mock.calls[0][0];
    expect(input).toMatchObject({ userId: 'user-owner', requestId: REQUEST_ID, mode: 'slim', intensity: 70 });
    expect(input.image.mimeType).toBe('image/png');
    expect(input.image.bytes).toEqual(PNG);
  });
});

describe('body edit API validation before billing', () => {
  test.each([
    ['requestId missing', { requestId: null }], ['requestId invalid', { requestId: 'not-a-uuid' }],
    ['requestId wrong version', { requestId: '22a5b5a5-3b3a-07df-a631-a7a58b79c805' }],
    ['mode missing', { mode: null }], ['mode unsupported', { mode: 'face' }],
    ['intensity unsupported', { intensity: 'maximum' }],
  ] as const)('rejects %s without reaching the charging service', async (_label, fields) => {
    const { handlers, service } = setup();
    await expectError(await handlers.submit(formRequest(fields)), 400, 'INVALID_INPUT');
    expect(service.submit).not.toHaveBeenCalled();
  });

  test.each([
    ['missing file', null], ['remote URL', 'https://other.example.test/photo.png'],
    ['unsupported MIME', new Blob([PNG], { type: 'image/gif' })],
    ['signature does not match MIME', new Blob([PNG], { type: 'image/jpeg' })],
    ['empty image', new Blob([], { type: 'image/png' })],
    ['invalid signature', new Blob(['not an image'], { type: 'image/png' })],
  ] as const)('rejects %s before charging or fetching a source URL', async (_label, image) => {
    const { handlers, service } = setup();
    await expectError(await handlers.submit(formRequest({}, {}, image)), 400, 'INVALID_INPUT');
    expect(service.submit).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  test('rejects an image above 10MB without reaching the charging service', async () => {
    const bytes = new Uint8Array(MAX_IMAGE_BYTES + 1);
    bytes.set(PNG);
    const { handlers, service } = setup();
    await expectError(await handlers.submit(formRequest({}, {}, new Blob([bytes], { type: 'image/png' }))), 413, 'INVALID_INPUT');
    expect(service.submit).not.toHaveBeenCalled();
  });

  test('rejects an oversized Content-Length without parsing or charging', async () => {
    const { handlers, service } = setup();
    const request = formRequest({}, { 'Content-Length': String(WIRE_LIMIT + 1) });
    const parse = vi.spyOn(request, 'formData');
    await expectError(await handlers.submit(request), 413, 'INVALID_INPUT');
    expect(parse).not.toHaveBeenCalled();
    expect(service.submit).not.toHaveBeenCalled();
  });

  test('bounds a chunked multipart body with no Content-Length and stops the stream before charging', async () => {
    let chunks = 0;
    let cancelled = false;
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        chunks += 1;
        controller.enqueue(new Uint8Array(1024 * 1024));
      },
      cancel() { cancelled = true; },
    });
    const request = new Request(API_URL, {
      method: 'POST', headers: { Origin: ORIGIN, 'Content-Type': 'multipart/form-data; boundary=unit-test-boundary' },
      body: stream, duplex: 'half',
    } as RequestInit & { duplex: 'half' });
    const { handlers, service } = setup();
    await expectError(await handlers.submit(request), 413, 'INVALID_INPUT');
    expect(cancelled).toBe(true);
    expect(chunks).toBeLessThanOrEqual(12);
    expect(service.submit).not.toHaveBeenCalled();
  });

  test('returns the input-size error even when multipart stream cancellation never settles', async () => {
    const cancel = vi.fn(() => new Promise<void>(() => {}));
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) { controller.enqueue(new Uint8Array(1024 * 1024)); }, cancel,
    });
    const request = new Request(API_URL, {
      method: 'POST', headers: { Origin: ORIGIN, 'Content-Type': 'multipart/form-data; boundary=unit-test-boundary' },
      body: stream, duplex: 'half',
    } as RequestInit & { duplex: 'half' });
    const { handlers, service } = setup();
    let response: Response | undefined;
    void handlers.submit(request).then((settled) => { response = settled; });
    await vi.waitFor(() => expect(cancel).toHaveBeenCalledTimes(1));
    expect(response, 'Multipart cleanup must not hide a size-limit error behind a pending promise').toBeDefined();
    await expectError(response!, 413, 'INVALID_INPUT');
    expect(service.submit).not.toHaveBeenCalled();
  });

  test.each([
    new Request(API_URL, { method: 'POST', headers: { Origin: ORIGIN, 'Content-Type': 'application/json' }, body: '{}' }),
    new Request(API_URL, { method: 'POST', headers: { Origin: ORIGIN, 'Content-Type': 'multipart/form-data; boundary=missing' }, body: 'malformed multipart' }),
  ])('rejects non-multipart or malformed multipart input', async (request) => {
    const { handlers, service } = setup();
    await expectError(await handlers.submit(request), 400, 'INVALID_INPUT');
    expect(service.submit).not.toHaveBeenCalled();
  });

  test('requires Origin even when a same-origin Referer is present', async () => {
    const request = formRequest();
    request.headers.delete('Origin');
    request.headers.set('Referer', `${ORIGIN}/`);
    const { handlers, service } = setup();
    await expectError(await handlers.submit(request), 403, 'INVALID_ORIGIN');
    expect(service.submit).not.toHaveBeenCalled();
  });

  test.each(['null', 'http://aibodyeditor.net', 'https://aibodyeditor.net:8443', 'https://aibodyeditor.net.attacker.example.test'])('rejects mismatched Origin %s', async (origin) => {
    const { handlers, service } = setup();
    await expectError(await handlers.submit(formRequest({}, { Origin: origin })), 403, 'INVALID_ORIGIN');
    expect(service.submit).not.toHaveBeenCalled();
  });

  test('accepts a local development origin that matches the actual request URL', async () => {
    const localOrigin = 'http://localhost:7001';
    const request = new Request(`${localOrigin}/api/body-edit`, {
      method: 'POST', headers: { Origin: localOrigin }, body: await formRequest().formData(),
    });
    const { handlers, service } = setup();
    expect((await handlers.submit(request)).status).toBe(200);
    expect(service.submit).toHaveBeenCalledTimes(1);
  });

  test('does not charge when the provider or private result storage is unavailable', async () => {
    const { handlers, getConfig, service } = setup();
    getConfig.mockResolvedValue({ available: false, costCredits: 15, freeTrialEdits: 1 });
    await expectError(await handlers.submit(formRequest()), 503, 'NOT_CONFIGURED');
    expect(service.submit).not.toHaveBeenCalled();
  });

  test('uses the authenticated owner and ignores client billing, model, prompt or credential overrides', async () => {
    const { handlers, service } = setup();
    const response = await handlers.submit(formRequest({
      userId: 'other-user', model: 'unapproved-model', prompt: 'arbitrary instructions',
      apiKey: PRIVATE_ERROR, costCredits: '0',
    }));
    expect(response.status).toBe(200);
    expect(service.submit).toHaveBeenCalledTimes(1);
    const input = service.submit.mock.calls[0][0];
    expect(Object.keys(input).sort()).toEqual(['image', 'intensity', 'mode', 'requestId', 'userId']);
    expect(input.userId).toBe('user-owner');
  });

  test.each(['slim', 'muscle', 'proportions', 'breast'] as const)('accepts the %s mode without overriding the server-owned service', async (mode) => {
    const { handlers, service } = setup();
    expect((await handlers.submit(formRequest({ mode, intensity: '90' }))).status).toBe(200);
    expect(service.submit).toHaveBeenCalledWith(expect.objectContaining({ mode, intensity: 90 }));
    expect(service.submit).toHaveBeenCalledTimes(1);
  });
});

describe('body edit public configuration and stable job DTOs', () => {
  test('returns only public availability, cost and trial configuration with no-store', async () => {
    const { handlers, getUser, getConfig, service, readImage } = setup();
    getConfig.mockResolvedValue(Object.assign({ available: true, costCredits: 15, freeTrialEdits: 1 }, { apiKey: PRIVATE_ERROR }));
    const response = await handlers.config(new Request(API_URL));
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toContain('no-store');
    expect(await response.json()).toEqual({ available: true, costCredits: 15, freeTrialEdits: 1 });
    expect(getUser).not.toHaveBeenCalled();
    expect(service.submit).not.toHaveBeenCalled();
    expect(service.getJob).not.toHaveBeenCalled();
    expect(readImage).not.toHaveBeenCalled();
  });

  test('returns a processing duplicate with a retry hint instead of exposing result or billing details', async () => {
    const { handlers, service } = setup();
    service.submit.mockResolvedValue(outcome({ status: 'processing', resultKey: null, resultMimeType: null }, true));
    const response = await handlers.submit(formRequest());
    expect(response.status).toBe(202);
    expect(response.headers.get('Cache-Control')).toContain('no-store');
    expect(response.headers.get('Retry-After')).toBe('3');
    expect(await response.json()).toEqual({ jobId: JOB_ID, status: 'processing', retryAfterSeconds: 3 });
    expect(service.submit).toHaveBeenCalledTimes(1);
  });

  test('reports an idempotently reused success using the same result URLs', async () => {
    const { handlers, service } = setup();
    service.submit.mockResolvedValue(outcome({}, true));
    const response = await handlers.submit(formRequest());
    expect(await response.json()).toMatchObject({ jobId: JOB_ID, reused: true, credits: { charged: 15, balance: 45 } });
    expect(service.submit).toHaveBeenCalledTimes(1);
  });

  test.each([['TIMEOUT', 504], ['UPSTREAM_ERROR', 502], ['STORAGE_ERROR', 502]] as const)('projects a refunded failed job (%s)', async (code, status) => {
    const { handlers, service } = setup();
    service.submit.mockResolvedValue(outcome({ status: 'failed', errorCode: code, refunded: true, resultKey: null, resultMimeType: null }));
    const body = await expectError(await handlers.submit(formRequest()), status, code);
    expect(body).toEqual({ error: { code, refunded: true }, jobId: JOB_ID });
    expect(service.submit).toHaveBeenCalledTimes(1);
  });

  test.each([['INSUFFICIENT_CREDITS', 402], ['IDEMPOTENCY_CONFLICT', 409], ['NOT_CONFIGURED', 503]] as const)('preserves the domain error %s without details', async (code, status) => {
    const { handlers, service } = setup();
    service.submit.mockRejectedValue(new BodyEditError(code, status));
    expect(await expectError(await handlers.submit(formRequest()), status, code)).toEqual({ error: { code } });
    expect(service.submit).toHaveBeenCalledTimes(1);
  });

  test('returns a private status projection for the authenticated owner', async () => {
    const { handlers, service, readImage } = setup();
    const response = await handlers.status(new Request(`${API_URL}/${JOB_ID}`), JOB_ID);
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toContain('no-store');
    expect(await response.json()).toEqual({
      jobId: JOB_ID, status: 'succeeded',
      result: { imageUrl: `/api/body-edit/${JOB_ID}/image`, downloadUrl: `/api/body-edit/${JOB_ID}/image?download=1`, mode: 'slim', intensity: 70 },
      credits: { charged: 15, balance: 45 }, reused: true,
    });
    expect(service.getJob).toHaveBeenCalledExactlyOnceWith({ userId: 'user-owner', jobId: JOB_ID });
    expect(service.submit).not.toHaveBeenCalled();
    expect(readImage).not.toHaveBeenCalled();
  });
});

describe('body edit status and image ownership', () => {
  for (const operation of ['status', 'image'] as const) {
    test(`${operation} requires authentication before looking up a private job`, async () => {
      const { handlers, getUser, service, readImage } = setup();
      getUser.mockResolvedValue(null);
      await expectError(await handlers[operation](jobRequest(), JOB_ID), 401, 'UNAUTHORIZED');
      expect(service.getJob).not.toHaveBeenCalled();
      expect(readImage).not.toHaveBeenCalled();
    });

    test(`${operation} rejects a banned account before looking up a job`, async () => {
      const { handlers, getUser, service, readImage } = setup();
      getUser.mockResolvedValue({ id: 'user-owner', banned: true });
      await expectError(await handlers[operation](jobRequest(), JOB_ID), 403, 'FORBIDDEN');
      expect(service.getJob).not.toHaveBeenCalled();
      expect(readImage).not.toHaveBeenCalled();
    });

    test(`${operation} enforces owner again even if an incorrect repository returns somebody else's job`, async () => {
      const { handlers, service, readImage } = setup();
      service.getJob.mockResolvedValue(outcome({ userId: 'different-user' }));
      await expectError(await handlers[operation](jobRequest(), JOB_ID), 403, 'FORBIDDEN');
      expect(service.getJob).toHaveBeenCalledExactlyOnceWith({ userId: 'user-owner', jobId: JOB_ID });
      expect(readImage).not.toHaveBeenCalled();
    });

    test(`${operation} preserves a missing or non-owned repository lookup as 404`, async () => {
      const { handlers, service, readImage } = setup();
      service.getJob.mockRejectedValue(new BodyEditError('NOT_FOUND', 404));
      await expectError(await handlers[operation](jobRequest(), JOB_ID), 404, 'NOT_FOUND');
      expect(service.getJob).toHaveBeenCalledTimes(1);
      expect(readImage).not.toHaveBeenCalled();
    });
  }

  test('serves only private result bytes to the owner and disables caching', async () => {
    const { handlers, service, readImage } = setup();
    const response = await handlers.image(jobRequest(), JOB_ID);
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toContain('no-store');
    expect(response.headers.get('Content-Type')).toBe('image/png');
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(PNG);
    expect(service.getJob).toHaveBeenCalledExactlyOnceWith({ userId: 'user-owner', jobId: JOB_ID });
    expect(readImage).toHaveBeenCalledExactlyOnceWith(`private/body-edits/${JOB_ID}.png`);
    expect(service.submit).not.toHaveBeenCalled();
  });

  test('provides a safe attachment filename for download without leaking the storage key', async () => {
    const { handlers, readImage } = setup();
    const response = await handlers.image(jobRequest(true), JOB_ID);
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toContain('no-store');
    const disposition = response.headers.get('Content-Disposition')!;
    expect(disposition).toMatch(/^attachment;/);
    expect(disposition).toMatch(/filename=.*\.png/i);
    expect(disposition).not.toContain('private/');
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(PNG);
    expect(readImage).toHaveBeenCalledTimes(1);
  });

  test('does not read a result that is still processing', async () => {
    const { handlers, service, readImage } = setup();
    service.getJob.mockResolvedValue(outcome({ status: 'processing', resultKey: null, resultMimeType: null }));
    const response = await handlers.image(jobRequest(), JOB_ID);
    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.headers.get('Cache-Control')).toContain('no-store');
    expect(readImage).not.toHaveBeenCalled();
  });

  test('returns NOT_FOUND for a missing private result object', async () => {
    const { handlers, readImage } = setup();
    readImage.mockResolvedValue(null);
    await expectError(await handlers.image(jobRequest(), JOB_ID), 404, 'NOT_FOUND');
    expect(readImage).toHaveBeenCalledTimes(1);
  });
});

describe('body edit API error privacy', () => {
  test.each(['submit', 'getUser', 'getConfig', 'getJob', 'readImage'] as const)('does not expose an unknown %s error', async (stage) => {
    const { handlers, service, getUser, getConfig, readImage } = setup();
    const failure = new Error(PRIVATE_ERROR);
    let response: Response;
    if (stage === 'getUser') {
      getUser.mockRejectedValue(failure);
      response = await handlers.submit(formRequest());
      expect(service.submit).not.toHaveBeenCalled();
    } else if (stage === 'getConfig') {
      getConfig.mockRejectedValue(failure);
      response = await handlers.config(new Request(API_URL));
    } else if (stage === 'getJob') {
      service.getJob.mockRejectedValue(failure);
      response = await handlers.status(jobRequest(), JOB_ID);
      expect(readImage).not.toHaveBeenCalled();
    } else if (stage === 'readImage') {
      readImage.mockRejectedValue(failure);
      response = await handlers.image(jobRequest(), JOB_ID);
    } else {
      service.submit.mockRejectedValue(failure);
      response = await handlers.submit(formRequest());
      expect(service.submit).toHaveBeenCalledTimes(1);
    }
    expect(await expectError(response, 500, 'INTERNAL_ERROR')).toEqual({ error: { code: 'INTERNAL_ERROR' } });
  });

  test('does not echo an arbitrary unrecognized domain error code', async () => {
    const { handlers, service } = setup();
    service.submit.mockRejectedValue(new BodyEditError(PRIVATE_ERROR, 500));
    expect(await expectError(await handlers.submit(formRequest()), 500, 'INTERNAL_ERROR')).toEqual({ error: { code: 'INTERNAL_ERROR' } });
  });
});

describe('recovering an edit before its job ID arrived', () => {
  test('looks up the request only for the authenticated owner', async () => {
    const { handlers, service } = setup();
    const response = await handlers.lookup(new Request(API_URL + '?requestId=' + REQUEST_ID));
    expect(response.status).toBe(200);
    expect(service.getRequest).toHaveBeenCalledWith({ userId: 'user-owner', requestId: REQUEST_ID });
    expect((await response.json()).result.imageUrl).toBe('/api/body-edit/' + JOB_ID + '/image');
  });
  test('rejects missing auth, invalid request IDs and foreign outcomes', async () => {
    const { handlers, getUser, service } = setup();
    await expectError(await handlers.lookup(new Request(API_URL + '?requestId=bad')), 404, 'NOT_FOUND');
    expect(service.getRequest).not.toHaveBeenCalled();
    getUser.mockResolvedValue(null);
    await expectError(await handlers.lookup(new Request(API_URL + '?requestId=' + REQUEST_ID)), 401, 'UNAUTHORIZED');
    getUser.mockResolvedValue({ id: 'user-owner' });
    service.getRequest.mockResolvedValue(outcome({ userId: 'someone-else' }));
    await expectError(await handlers.lookup(new Request(API_URL + '?requestId=' + REQUEST_ID)), 403, 'FORBIDDEN');
  });
});
