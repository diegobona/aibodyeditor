import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { materializeBodyImageResult, BodyImageEditError, type BodyImageEditResult } from '../../../libs/ai/body-edit';

const PNG = new Uint8Array(readFileSync(resolve('apps/tanstack-app/public/favicon-32x32.png')));
const PNG_B64 = Buffer.from(PNG).toString('base64');
const CDN_URL = 'https://apioss8.sydney-ai.com/ximg/unit-result.png?signature=private-unit-query';
const TEST_KEY = 'sk-result-unit-only';
const MAX_BYTES = 10 * 1024 * 1024;
const WEBP = new Uint8Array(readFileSync(resolve('apps/tanstack-app/public/examples/v2/slim-editorial-v2.webp')));

function result(imageUrl = CDN_URL): BodyImageEditResult {
  return { imageUrl, provider: 'openai', model: 'gpt-image-2.5-1k', mode: 'slim', intensity: 70, requestId: 'req-result-unit' };
}

function imageResponse(bytes = PNG, init: ResponseInit = {}) {
  return new Response(bytes, { ...init, headers: { 'Content-Type': 'image/png', ...init.headers } });
}

async function expectSafeError(promise: Promise<unknown>, code: string) {
  const error = await promise.then(() => undefined, (failure: unknown) => failure);
  expect(error).toBeInstanceOf(BodyImageEditError);
  expect(error).toMatchObject({ code });
  const printable = `${String(error)} ${JSON.stringify(error)}`;
  expect(printable).not.toContain(TEST_KEY);
  expect(printable).not.toContain(CDN_URL);
  expect(printable).not.toContain('private-unit-query');
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Unexpected real network request'))));
  vi.stubEnv('OPENAI_API_KEY', TEST_KEY);
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('private materialization of provider image results', () => {
  test('passes an existing base64 result through without making a request', async () => {
    const input = { ...result(`data:image/png;base64,${PNG_B64}`), outputFormat: 'png' as const };
    expect(await materializeBodyImageResult(input)).toEqual(input);
    expect(fetch).not.toHaveBeenCalled();
  });

  test('downloads an approved CDN result without credentials or redirects and preserves job metadata', async () => {
    const fetchMock = vi.fn<typeof fetch>(async (url, init) => {
      expect(String(url)).toBe(CDN_URL);
      expect(init?.method).toBe('GET');
      expect(init?.redirect).toBe('error');
      expect(init?.credentials).toBe('omit');
      const headers = new Headers(init?.headers);
      expect(headers.has('Authorization')).toBe(false);
      expect(headers.has('Cookie')).toBe(false);
      return imageResponse();
    });
    expect(await materializeBodyImageResult(result(), { fetch: fetchMock })).toEqual({
      ...result(), imageUrl: `data:image/png;base64,${PNG_B64}`, outputFormat: 'png',
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('rejects an unapproved host without making a network request', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    await expect(materializeBodyImageResult(result('https://other.example.test/ximg/image.png'), { fetch: fetchMock })).rejects.toBeInstanceOf(BodyImageEditError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test.each(['apioss8.sydney-ai.com', 'apioss28.sydney-ai.com', 'apioss1.sydney-ai.com'])('accepts Rabbit numbered result node %s', async (host) => {
    const url = `https://${host}/ximg/unit-result.png?signature=private-unit-query`;
    const fetchMock = vi.fn<typeof fetch>(async () => imageResponse());
    const output = await materializeBodyImageResult(result(url), { fetch: fetchMock });
    expect(output.outputFormat).toBe('png');
    expect(fetchMock).toHaveBeenCalledWith(url, expect.objectContaining({ redirect: 'error', credentials: 'omit' }));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('keeps safe rejection diagnostics without exposing the signed image URL', async () => {
    const error = await materializeBodyImageResult(result('https://other.example.test/ximg/image.png?signature=private-unit-query'))
      .catch((failure: unknown) => failure);
    expect(error).toMatchObject({ code: 'INVALID_RESPONSE', requestId: 'req-result-unit',
      diagnostic: { reason: 'result_origin', resultHost: 'other.example.test' } });
    expect(JSON.stringify(error)).not.toContain('private-unit-query');
    expect(fetch).not.toHaveBeenCalled();
  });

  test.each([
    'http://apioss8.sydney-ai.com/ximg/image.png',
    'https://user:password@apioss8.sydney-ai.com/ximg/image.png',
    'https://apioss8.sydney-ai.com:8443/ximg/image.png',
    'https://apioss8.sydney-ai.com/ximg/image.png#fragment',
    'https://apioss8.sydney-ai.com/other/image.png',
    'https://apioss8.sydney-ai.com/ximg',
    'https://apioss8.sydney-ai.com/ximg/../private.png',
    'https://apioss8.sydney-ai.com.attacker.example.test/ximg/image.png',
    'https://sub.apioss8.sydney-ai.com/ximg/image.png',
    'https://apioss28.sydney-ai.com.attacker.example.test/ximg/image.png',
    'https://apioss28-sydney-ai.com/ximg/image.png',
    'https://apioss28.evil.sydney-ai.com/ximg/image.png',
    'https://apioss.sydney-ai.com/ximg/image.png',
    'https://other.sydney-ai.com/ximg/image.png',
    'https://apioss8.sydney-ai.com./ximg/image.png',
    'https://127.0.0.1/ximg/image.png',
    'https://192.168.1.2/ximg/image.png',
    'https://[::1]/ximg/image.png',
    'https://203.0.113.10/ximg/image.png',
    'https://localhost/ximg/image.png',
    'ftp://apioss8.sydney-ai.com/ximg/image.png',
    'not-a-url',
  ])('rejects disallowed URL %s before fetching', async (url) => {
    const fetchMock = vi.fn<typeof fetch>();
    await expectSafeError(materializeBodyImageResult(result(url), { fetch: fetchMock }), 'INVALID_RESPONSE');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('permits only the standard HTTPS port and keeps signed query parameters', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => imageResponse());
    await materializeBodyImageResult(result(CDN_URL.replace('.com/', '.com:443/')), { fetch: fetchMock });
    expect(String(fetchMock.mock.calls[0][0])).toBe(CDN_URL);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('infers genuine WebP output from its magic bytes without trusting its file extension', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => imageResponse(WEBP, { headers: { 'Content-Type': 'image/jpeg' } }));
    const output = await materializeBodyImageResult(result(), { fetch: fetchMock });
    expect(output).toEqual({ ...result(), imageUrl: `data:image/webp;base64,${Buffer.from(WEBP).toString('base64')}`, outputFormat: 'webp' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test.each([301, 302, 401, 429, 500])('rejects HTTP %s without following redirects or retrying', async (status) => {
    const fetchMock = vi.fn<typeof fetch>(async () => imageResponse(PNG, {
      status, headers: { Location: 'https://127.0.0.1/private' },
    }));
    await expectSafeError(materializeBodyImageResult(result(), { fetch: fetchMock }), 'INVALID_RESPONSE');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][1]?.redirect).toBe('error');
  });

  test('rejects a result that a custom fetch already followed through a redirect', async () => {
    const response = imageResponse();
    Object.defineProperty(response, 'redirected', { value: true });
    const fetchMock = vi.fn<typeof fetch>(async () => response);
    await expectSafeError(materializeBodyImageResult(result(), { fetch: fetchMock }), 'INVALID_RESPONSE');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test.each([
    ['empty body', new Uint8Array(), 'image/png'],
    ['invalid magic bytes', new TextEncoder().encode('not an image'), 'image/png'],
    ['HTML output', new TextEncoder().encode('<html>private-unit-query</html>'), 'text/html'],
    ['unsupported GIF', new TextEncoder().encode('GIF89a'), 'image/gif'],
  ] as const)('rejects %s instead of persisting it as a photograph', async (_label, bytes, mimeType) => {
    const fetchMock = vi.fn<typeof fetch>(async () => imageResponse(bytes, { headers: { 'Content-Type': mimeType } }));
    await expectSafeError(materializeBodyImageResult(result(), { fetch: fetchMock }), 'INVALID_RESPONSE');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('rejects a missing HTTP body', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => new Response(null));
    await expectSafeError(materializeBodyImageResult(result(), { fetch: fetchMock }), 'INVALID_RESPONSE');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('rejects a declared result above 10MB and cancels its unread body', async () => {
    let cancelled = false;
    const body = new ReadableStream<Uint8Array>({ cancel() { cancelled = true; } });
    const fetchMock = vi.fn<typeof fetch>(async () => new Response(body, { headers: { 'Content-Length': String(MAX_BYTES + 1) } }));
    await expectSafeError(materializeBodyImageResult(result(), { fetch: fetchMock }), 'OUTPUT_TOO_LARGE');
    expect(cancelled).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('bounds a result stream without Content-Length and stops reading at 10MB', async () => {
    let chunks = 0;
    let cancelled = false;
    const body = new ReadableStream<Uint8Array>({
      pull(controller) { chunks += 1; controller.enqueue(new Uint8Array(1024 * 1024)); },
      cancel() { cancelled = true; },
    });
    const fetchMock = vi.fn<typeof fetch>(async () => new Response(body));
    await expectSafeError(materializeBodyImageResult(result(), { fetch: fetchMock }), 'OUTPUT_TOO_LARGE');
    expect(cancelled).toBe(true);
    expect(chunks).toBeLessThanOrEqual(12);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])('rejects invalid download timeout %s before network', async (timeoutMs) => {
    const fetchMock = vi.fn<typeof fetch>();
    await expectSafeError(materializeBodyImageResult(result(), { fetch: fetchMock, timeoutMs }), 'INVALID_CONFIGURATION');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('aborts a stalled download after its timeout without retrying', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn<typeof fetch>(async (_url, init) => new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')), { once: true });
    }));
    const pending = expectSafeError(materializeBodyImageResult(result(), { fetch: fetchMock, timeoutMs: 25 }), 'TIMEOUT');
    await vi.advanceTimersByTimeAsync(26);
    await pending;
    expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('returns timeout promptly even if a stalled body cannot finish cancellation', async () => {
    vi.useFakeTimers();
    const cancel = vi.fn(() => new Promise<void>(() => {}));
    const fetchMock = vi.fn<typeof fetch>(async () => new Response(new ReadableStream<Uint8Array>({ cancel })));
    let settled = false;
    let error: unknown;
    void materializeBodyImageResult(result(), { fetch: fetchMock, timeoutMs: 25 }).catch((failure: unknown) => { settled = true; error = failure; });
    await vi.advanceTimersByTimeAsync(26);
    expect(settled, 'Best-effort stream cleanup must not extend the download timeout').toBe(true);
    expect(error).toBeInstanceOf(BodyImageEditError);
    expect(error).toMatchObject({ code: 'TIMEOUT' });
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('does not await cancellation of a declared oversized response', async () => {
    const cancel = vi.fn(() => new Promise<void>(() => {}));
    const fetchMock = vi.fn<typeof fetch>(async () => new Response(new ReadableStream<Uint8Array>({ cancel }), {
      headers: { 'Content-Length': String(MAX_BYTES + 1) },
    }));
    await expectSafeError(materializeBodyImageResult(result(), { fetch: fetchMock }), 'OUTPUT_TOO_LARGE');
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('wraps a download network failure without leaking credential or signed URL details', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => { throw new Error(`${TEST_KEY} ${CDN_URL}`); });
    await expectSafeError(materializeBodyImageResult(result(), { fetch: fetchMock }), 'INVALID_RESPONSE');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
