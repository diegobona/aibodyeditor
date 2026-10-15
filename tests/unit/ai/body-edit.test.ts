import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { editBodyImage, prepareBodyImageEdit, BodyImageEditError, type BodyImageEditOptions } from '../../../libs/ai/body-edit';
import { buildBodyEditPrompt } from '../../../libs/ai/body-edit-prompts';

const PNG = new Uint8Array(readFileSync(resolve('apps/tanstack-app/public/favicon-32x32.png')));
const PNG_B64 = Buffer.from(PNG).toString('base64');
const WEBP = new Uint8Array(readFileSync(resolve('apps/tanstack-app/public/examples/v2/slim-editorial.webp')));
const TEST_KEY = 'sk-body-edit-test-only';
const MODEL = 'gpt-image-2.5-1k';
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_RESPONSE_BYTES = 20 * 1024 * 1024;

function options(overrides: Partial<BodyImageEditOptions> = {}): BodyImageEditOptions {
  return { sourceImage: { bytes: PNG, mimeType: 'image/png', fileName: 'portrait.png' }, mode: 'slim', ...overrides };
}

function jsonResponse(payload: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(payload), {
    ...init, headers: { 'Content-Type': 'application/json', ...init.headers },
  });
}

function imageResponse() {
  return jsonResponse({ created: 1770000000, data: [{ b64_json: PNG_B64 }] }, { headers: { 'x-request-id': 'req-test-image' } });
}

async function expectFailure(promise: Promise<unknown>, code: string) {
  const error = await promise.then(() => undefined, (failure: unknown) => failure);
  expect(error).toBeInstanceOf(BodyImageEditError);
  expect(error).toMatchObject({ code });
  const printable = `${String(error)} ${JSON.stringify(error)}`;
  expect(printable).not.toContain(TEST_KEY);
  expect(printable).not.toContain(PNG_B64);
  return error as BodyImageEditError;
}

function abortableFetch() {
  return vi.fn<typeof fetch>(async (_url, init) => new Promise<Response>((_resolve, reject) => {
    const signal = init?.signal;
    const rejectAbort = () => reject(new DOMException('Request aborted', 'AbortError'));
    if (signal?.aborted) rejectAbort();
    else signal?.addEventListener('abort', rejectAbort, { once: true });
  }));
}

beforeEach(() => {
  // Never allow a real network call, including when a connection omits fetch.
  vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Unexpected real fetch'))));
  vi.stubEnv('OPENAI_API_KEY', '');
  vi.stubEnv('OPENAI_BASE_URL', '');
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('body image edit HTTP contract', () => {
  test('prepares and posts the same normalized user request inside the server-owned multipart prompt', async () => {
    const raw = ' \r\nOnly slim my waist.\rKeep my arms.\r\n ';
    const normalized = 'Only slim my waist.\nKeep my arms.';
    const prepared = prepareBodyImageEdit(options({ intensity: 73, instructions: raw }));
    expect(prepared.instructions).toBe(normalized);
    expect(prepared.prompt).toBe(buildBodyEditPrompt({ mode: 'slim', intensity: 73, instructions: normalized }));
    const fetchMock = vi.fn<typeof fetch>(async () => imageResponse());
    const result = await editBodyImage(options({ intensity: 73, instructions: raw }), { apiKey: TEST_KEY, fetch: fetchMock });
    const form = fetchMock.mock.calls[0][1]?.body as FormData;
    expect([...form.keys()].sort()).toEqual(['image', 'model', 'n', 'prompt']);
    expect(form.get('prompt')).toBe(prepared.prompt);
    expect(form.get('prompt')).toContain(JSON.stringify(normalized));
    expect(form.get('prompt')).not.toContain('less upper-arm thickness');
    expect(form.get('model')).toBe(MODEL);
    expect(form.get('n')).toBe('1');
    expect(result).not.toHaveProperty('instructions');
  });

  test('posts the original image as multipart data and returns a validated PNG data URL', async () => {
    const fetchMock = vi.fn<typeof fetch>(async (url, init) => {
      expect(String(url)).toBe('https://api.tu-zi.com/v1/images/edits');
      expect(init?.method).toBe('POST');
      const headers = new Headers(init?.headers);
      expect(headers.get('Authorization')).toBe(`Bearer ${TEST_KEY}`);
      expect(headers.has('Content-Type')).toBe(false);
      expect(init?.body).toBeInstanceOf(FormData);
      const form = init!.body as FormData;
      expect([...form.keys()].sort()).toEqual(['image', 'model', 'n', 'prompt']);
      expect(form.get('model')).toBe(MODEL);
      expect(form.get('n')).toBe('1');
      const prompt = String(form.get('prompt'));
      expect(prompt).toMatch(/waist.*upper.arm/i);
      expect(prompt).toMatch(/same adult/i);
      expect(prompt).toMatch(/single edited image/i);
      const image = form.get('image') as File;
      expect(image.type).toBe('image/png');
      expect(image.name).toBe('portrait.png');
      expect(new Uint8Array(await image.arrayBuffer())).toEqual(PNG);
      return imageResponse();
    });
    const result = await editBodyImage(options(), { apiKey: TEST_KEY, fetch: fetchMock });
    expect(result).toMatchObject({
      imageUrl: `data:image/png;base64,${PNG_B64}`, provider: 'openai', model: MODEL,
      mode: 'slim', intensity: 70, requestId: 'req-test-image',
    });
    expect(result.outputFormat).toBe('png');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('returns a secure provider URL without downloading it', async () => {
    const url = 'https://images.example.test/edited.png?signature=unit-test';
    const fetchMock = vi.fn<typeof fetch>(async () => jsonResponse({ data: [{ url }] }));
    const result = await editBodyImage(options({ mode: 'muscle', intensity: 70 }), { apiKey: TEST_KEY, fetch: fetchMock });
    expect(result).toMatchObject({ imageUrl: url, provider: 'openai', model: MODEL, mode: 'muscle', intensity: 70 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('rejects missing credentials before making a request', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    await expect(editBodyImage(options(), { fetch: fetchMock })).rejects.toMatchObject({ code: 'NOT_CONFIGURED' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test.each([
    ['https://api.tu-zi.com', 'https://api.tu-zi.com/v1/images/edits'],
    ['https://api.tu-zi.com/', 'https://api.tu-zi.com/v1/images/edits'],
    ['https://api.tu-zi.com/v1', 'https://api.tu-zi.com/v1/images/edits'],
    ['https://api.tu-zi.com/v1/', 'https://api.tu-zi.com/v1/images/edits'],
    ['https://gateway.example.test/proxy/v1/', 'https://gateway.example.test/proxy/v1/images/edits'],
  ])('normalizes %s without duplicating the API version', async (baseURL, endpoint) => {
    const fetchMock = vi.fn<typeof fetch>(async () => imageResponse());
    await editBodyImage(options(), { apiKey: TEST_KEY, baseURL, fetch: fetchMock });
    expect(String(fetchMock.mock.calls[0][0])).toBe(endpoint);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('reads the existing OPENAI credentials and base URL when no connection is supplied', async () => {
    vi.stubEnv('OPENAI_API_KEY', TEST_KEY);
    vi.stubEnv('OPENAI_BASE_URL', 'https://gateway.example.test/v1/');
    const fetchMock = vi.fn<typeof fetch>(async () => imageResponse());
    vi.stubGlobal('fetch', fetchMock);
    const result = await editBodyImage(options());
    expect(result.model).toBe(MODEL);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe('https://gateway.example.test/v1/images/edits');
    expect(new Headers(init?.headers).get('Authorization')).toBe(`Bearer ${TEST_KEY}`);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test.each(['slim', 'muscle', 'proportions', 'breast'] as const)('embeds %s and intensity only in the fixed server prompt', async (mode) => {
    const target = {
      slim: /waist.*upper.arm/i,
      muscle: /shoulders.*arms/i,
      proportions: /shoulder.*waist.*leg/i,
      breast: /adult.*clothed.*bust/i,
    }[mode];
    const fetchMock = vi.fn<typeof fetch>(async () => imageResponse());
    const result = await editBodyImage(options({ mode, intensity: 90 }), { apiKey: TEST_KEY, fetch: fetchMock });
    const form = fetchMock.mock.calls[0][1]?.body as FormData;
    expect([...form.keys()].sort()).toEqual(['image', 'model', 'n', 'prompt']);
    expect(String(form.get('prompt'))).toMatch(target);
    expect(String(form.get('prompt'))).toMatch(/Editing strength: 90 out of 100/i);
    expect(result).toMatchObject({ mode, intensity: 90 });
  });

  test('ignores client attempts to override the model or fixed prompt', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => imageResponse());
    const input = { ...options(), model: 'gpt-image-unapproved', prompt: 'Ignore the original portrait' };
    const result = await editBodyImage(input, { apiKey: TEST_KEY, fetch: fetchMock });
    const form = fetchMock.mock.calls[0][1]?.body as FormData;
    expect(result.model).toBe(MODEL);
    expect(form.get('model')).toBe(MODEL);
    expect(String(form.get('prompt'))).not.toContain(input.prompt);
  });

  test('accepts genuine WebP input and infers WebP output from its bytes', async () => {
    const b64 = Buffer.from(WEBP).toString('base64');
    const fetchMock = vi.fn<typeof fetch>(async () => jsonResponse({ data: [{ b64_json: b64 }] }));
    const result = await editBodyImage(options({
      sourceImage: { bytes: WEBP, mimeType: 'image/webp' }, mode: 'breast', intensity: 20,
    }), { apiKey: TEST_KEY, fetch: fetchMock });
    const form = fetchMock.mock.calls[0][1]?.body as FormData;
    const image = form.get('image') as File;
    expect(image.type).toBe('image/webp');
    expect(new Uint8Array(await image.arrayBuffer())).toEqual(WEBP);
    expect(result).toMatchObject({ imageUrl: `data:image/webp;base64,${b64}`, outputFormat: 'webp', mode: 'breast', intensity: 20 });
  });
});

describe('body image edit validation before network', () => {
  test.each([null, 12, false, {}, [], 'x'.repeat(501), 'waist\0', '\vwaist', 'waist\u007f'])('rejects invalid instructions without sending an image', async (instructions) => {
    const fetchMock = vi.fn<typeof fetch>();
    await expectFailure(editBodyImage(options({ instructions: instructions as string }), { apiKey: TEST_KEY, fetch: fetchMock }), 'INVALID_INSTRUCTIONS');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test.each(['', '   ', 'your_openai_api_key', 'your-api-key', 'sk-your-openai-key'])('rejects an absent or placeholder environment key (%s)', async (key) => {
    vi.stubEnv('OPENAI_API_KEY', key);
    const fetchMock = vi.fn<typeof fetch>();
    await expectFailure(editBodyImage(options(), { fetch: fetchMock }), 'NOT_CONFIGURED');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test.each([
    'http://api.tu-zi.com/v1', 'https://user:password@api.tu-zi.com/v1',
    'https://api.tu-zi.com/v1?api_key=test', 'https://api.tu-zi.com/v1#images',
    'https://api.tu-zi.com/v1/images/edits', 'https://api.tu-zi.com/not-an-api-version',
    'not-a-url',
  ])('rejects unsafe or ambiguous endpoint configuration %s', async (baseURL) => {
    const fetchMock = vi.fn<typeof fetch>();
    await expectFailure(editBodyImage(options(), { apiKey: TEST_KEY, baseURL, fetch: fetchMock }), 'INVALID_CONFIGURATION');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])('rejects invalid timeout %s before network', async (timeoutMs) => {
    const fetchMock = vi.fn<typeof fetch>();
    await expectFailure(editBodyImage(options(), { apiKey: TEST_KEY, timeoutMs, fetch: fetchMock }), 'INVALID_CONFIGURATION');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test.each([
    ['unknown mode', { mode: 'unsupported' }],
    ['unknown intensity', { intensity: 'maximum' }],
    ['unsupported MIME', { sourceImage: { bytes: PNG, mimeType: 'image/gif' } }],
    ['PNG labeled JPEG', { sourceImage: { bytes: PNG, mimeType: 'image/jpeg' } }],
    ['PNG labeled WebP', { sourceImage: { bytes: PNG, mimeType: 'image/webp' } }],
    ['empty source image', { sourceImage: { bytes: new Uint8Array(), mimeType: 'image/png' } }],
    ['invalid signature', { sourceImage: { bytes: new Uint8Array([1, 2, 3, 4]), mimeType: 'image/png' } }],
    ['remote source URL', { sourceImage: { url: 'https://images.example.test/original.png', mimeType: 'image/png' } }],
  ])('rejects %s without sending the original photo', async (_name, invalid) => {
    const fetchMock = vi.fn<typeof fetch>();
    await expectFailure(editBodyImage(options(invalid as Partial<BodyImageEditOptions>), { apiKey: TEST_KEY, fetch: fetchMock }), 'INVALID_INPUT');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('rejects an image over 10 MB before network', async () => {
    const oversized = new Uint8Array(MAX_IMAGE_BYTES + 1);
    oversized.set(PNG);
    const fetchMock = vi.fn<typeof fetch>();
    await expectFailure(editBodyImage(options({ sourceImage: { bytes: oversized, mimeType: 'image/png' } }), {
      apiKey: TEST_KEY, fetch: fetchMock,
    }), 'INVALID_INPUT');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('body image edit response validation', () => {
  test.each([
    ['empty data', { data: [] }],
    ['missing data', {}],
    ['empty base64', { data: [{ b64_json: '' }] }],
    ['invalid base64 characters', { data: [{ b64_json: '%%%not-image%%%' }] }],
    ['base64 text with no image signature', { data: [{ b64_json: Buffer.from('not an image').toString('base64') }] }],
    ['non-string base64', { data: [{ b64_json: true }] }],
    ['empty URL', { data: [{ url: '' }] }],
    ['HTTP URL', { data: [{ url: 'http://images.example.test/edited.png' }] }],
    ['URL credentials', { data: [{ url: 'https://user:password@images.example.test/edited.png' }] }],
    ['data URL in URL field', { data: [{ url: `data:image/png;base64,${PNG_B64}` }] }],
    ['localhost URL', { data: [{ url: 'https://localhost/edited.png' }] }],
    ['private IPv4 URL', { data: [{ url: 'https://192.168.1.2/edited.png' }] }],
    ['loopback IPv6 URL', { data: [{ url: 'https://[::1]/edited.png' }] }],
  ])('rejects %s as an invalid provider result', async (_name, payload) => {
    const fetchMock = vi.fn<typeof fetch>(async () => jsonResponse(payload));
    await expectFailure(editBodyImage(options(), { apiKey: TEST_KEY, fetch: fetchMock }), 'INVALID_RESPONSE');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test.each([200, 202])('rejects an asynchronous task response (HTTP %s) without polling', async (status) => {
    const fetchMock = vi.fn<typeof fetch>(async () => jsonResponse({ request_id: 'job-test-pending', status: 'pending' }, { status }));
    await expectFailure(editBodyImage(options(), { apiKey: TEST_KEY, fetch: fetchMock }), 'ASYNC_RESPONSE');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('rejects malformed success JSON without leaking its body', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => new Response(`<html>${TEST_KEY}${PNG_B64}</html>`, { status: 200 }));
    await expectFailure(editBodyImage(options(), { apiKey: TEST_KEY, fetch: fetchMock }), 'INVALID_RESPONSE');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('rejects base64 decoded output over 10 MB', async () => {
    const bytes = new Uint8Array(MAX_IMAGE_BYTES + 1);
    bytes.set(PNG);
    const fetchMock = vi.fn<typeof fetch>(async () => jsonResponse({ data: [{ b64_json: Buffer.from(bytes).toString('base64') }] }));
    await expectFailure(editBodyImage(options(), { apiKey: TEST_KEY, fetch: fetchMock }), 'OUTPUT_TOO_LARGE');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('rejects an oversized declared JSON response before parsing it', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => jsonResponse({ data: [{ b64_json: PNG_B64 }] }, {
      headers: { 'Content-Length': String(MAX_RESPONSE_BYTES + 1) },
    }));
    await expectFailure(editBodyImage(options(), { apiKey: TEST_KEY, fetch: fetchMock }), 'OUTPUT_TOO_LARGE');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('bounds streamed JSON without relying on Content-Length and cancels the unread remainder', async () => {
    let chunks = 0;
    let cancelled = false;
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        chunks += 1;
        controller.enqueue(new Uint8Array(8 * 1024 * 1024).fill(0x20));
      },
      cancel() { cancelled = true; },
    });
    const fetchMock = vi.fn<typeof fetch>(async () => new Response(stream));
    await expectFailure(editBodyImage(options(), { apiKey: TEST_KEY, fetch: fetchMock }), 'OUTPUT_TOO_LARGE');
    expect(cancelled).toBe(true);
    // The stream may prefetch one chunk; it must not drain an unbounded body.
    expect(chunks).toBeLessThanOrEqual(4);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('body image edit failures and cancellation', () => {
  test.each([401, 429, 500])('does not retry or expose raw provider errors after HTTP %s', async (status) => {
    const fetchMock = vi.fn<typeof fetch>(async () => jsonResponse({
      error: { message: `Upstream echoed ${TEST_KEY} and ${PNG_B64}`, type: 'provider_error' },
    }, { status, headers: { 'x-request-id': `req-http-${status}` } }));
    const error = await expectFailure(editBodyImage(options(), { apiKey: TEST_KEY, fetch: fetchMock }), 'UPSTREAM_ERROR');
    expect(error).toMatchObject({ status, requestId: `req-http-${status}` });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('wraps network failure without an implicit retry or raw error text', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => { throw new Error(`Network error included ${TEST_KEY}`); });
    await expectFailure(editBodyImage(options(), { apiKey: TEST_KEY, fetch: fetchMock }), 'UPSTREAM_ERROR');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('does not start a request when the caller already cancelled', async () => {
    const controller = new AbortController();
    controller.abort();
    const fetchMock = vi.fn<typeof fetch>();
    await expectFailure(editBodyImage(options({ signal: controller.signal }), { apiKey: TEST_KEY, fetch: fetchMock }), 'CANCELLED');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('propagates cancellation to an in-flight request without retrying', async () => {
    const controller = new AbortController();
    const fetchMock = abortableFetch();
    const outcome = editBodyImage(options({ signal: controller.signal }), { apiKey: TEST_KEY, fetch: fetchMock }).catch((error) => error);
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    controller.abort();
    const error = await outcome;
    expect(error).toBeInstanceOf(BodyImageEditError);
    expect(error.code).toBe('CANCELLED');
    expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('aborts an in-flight request when the configured timeout expires', async () => {
    vi.useFakeTimers();
    const fetchMock = abortableFetch();
    const outcome = editBodyImage(options(), { apiKey: TEST_KEY, fetch: fetchMock, timeoutMs: 25 }).catch((error) => error);
    await vi.advanceTimersByTimeAsync(26);
    const error = await outcome;
    expect(error).toBeInstanceOf(BodyImageEditError);
    expect(error.code).toBe('TIMEOUT');
    expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('keeps the timeout active while reading a stalled response body', async () => {
    vi.useFakeTimers();
    let cancelled = false;
    const fetchMock = vi.fn<typeof fetch>(async () => new Response(new ReadableStream<Uint8Array>({
      start() { /* A stalled HTTP body never produces a chunk. */ },
      cancel() { cancelled = true; },
    })));
    const outcome = editBodyImage(options(), { apiKey: TEST_KEY, fetch: fetchMock, timeoutMs: 25 }).catch((error) => error);
    await vi.advanceTimersByTimeAsync(26);
    const error = await outcome;
    expect(error).toBeInstanceOf(BodyImageEditError);
    expect(error.code).toBe('TIMEOUT');
    expect(cancelled).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('body image edit cleanup never blocks the final error', () => {
  function hangingCleanupResponse(init: ResponseInit = {}, oversizedStream = false) {
    const cancel = vi.fn(() => new Promise<void>(() => { /* The upstream never finishes cancellation. */ }));
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        if (oversizedStream) controller.enqueue(new Uint8Array(8 * 1024 * 1024));
        // Otherwise leave the read pending until timeout or caller cancellation.
      },
      cancel,
    });
    return { response: new Response(body, init), cancel };
  }

  function observe(promise: Promise<unknown>) {
    const outcome: { state: 'pending' | 'fulfilled' | 'rejected'; error?: unknown } = { state: 'pending' };
    void promise.then(
      () => { outcome.state = 'fulfilled'; },
      (error: unknown) => { outcome.state = 'rejected'; outcome.error = error; },
    );
    return outcome;
  }

  test('rejects oversized Content-Length even when cancelling the HTTP body never settles', async () => {
    vi.useFakeTimers();
    const { response, cancel } = hangingCleanupResponse({ headers: { 'Content-Length': String(MAX_RESPONSE_BYTES + 1) } });
    const fetchMock = vi.fn<typeof fetch>(async () => response);
    const outcome = observe(editBodyImage(options(), { apiKey: TEST_KEY, fetch: fetchMock, timeoutMs: 25 }));
    await vi.advanceTimersByTimeAsync(26);
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(outcome.state, 'Best-effort body cancellation must not delay the size-limit error').toBe('rejected');
    expect(outcome.error).toMatchObject({ code: 'OUTPUT_TOO_LARGE' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('rejects a failed HTTP status even when cancelling its body never settles', async () => {
    vi.useFakeTimers();
    const { response, cancel } = hangingCleanupResponse({ status: 429, headers: { 'x-request-id': 'req-cleanup-error' } });
    const fetchMock = vi.fn<typeof fetch>(async () => response);
    const outcome = observe(editBodyImage(options(), { apiKey: TEST_KEY, fetch: fetchMock, timeoutMs: 25 }));
    await vi.advanceTimersByTimeAsync(26);
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(outcome.state, 'Best-effort body cancellation must not delay the provider error').toBe('rejected');
    expect(outcome.error).toMatchObject({ code: 'UPSTREAM_ERROR', status: 429, requestId: 'req-cleanup-error' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test.each([
    ['stream size limit', 'OUTPUT_TOO_LARGE'],
    ['request timeout', 'TIMEOUT'],
    ['caller cancellation', 'CANCELLED'],
  ] as const)('preserves %s when reader cancellation never settles', async (trigger, code) => {
    vi.useFakeTimers();
    const controller = new AbortController();
    const { response, cancel } = hangingCleanupResponse({}, trigger === 'stream size limit');
    const fetchMock = vi.fn<typeof fetch>(async () => response);
    const outcome = observe(editBodyImage(options({ signal: controller.signal }), {
      apiKey: TEST_KEY, fetch: fetchMock, timeoutMs: 25,
    }));
    await vi.advanceTimersByTimeAsync(0);
    if (trigger === 'caller cancellation') controller.abort();
    await vi.advanceTimersByTimeAsync(26);
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(outcome.state, 'Reader cleanup must not hide an error behind a pending promise').toBe('rejected');
    expect(outcome.error).toMatchObject({ code });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
