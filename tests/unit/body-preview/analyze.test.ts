import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { analyzeBodyPhoto } from '../../../libs/body-preview/analyze';

class LocalWorker {
  static instances: LocalWorker[] = [];
  onmessage: ((event: { data: unknown }) => void) | null = null;
  onerror: (() => void) | null = null;
  onmessageerror: (() => void) | null = null;
  terminate = vi.fn();
  postMessage = vi.fn();
  constructor(public readonly url: string) { LocalWorker.instances.push(this); }
}

describe('local photo analysis lifecycle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    LocalWorker.instances = [];
    vi.stubGlobal('Worker', LocalWorker);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  test('passes the local blob to a same-origin worker and releases it after success', async () => {
    const photo = new Blob(['photo'], { type: 'image/png' });
    const task = analyzeBodyPhoto(photo);
    const worker = LocalWorker.instances[0];
    expect(worker.url).toBe('/body-preview/worker.js');
    expect(worker.postMessage).toHaveBeenCalledWith({ type: 'analyze', file: photo });
    const analysis = { width: 640, height: 480, landmarks: [], contours: [] };
    worker.onmessage!({ data: { type: 'result', analysis } });
    await expect(task).resolves.toEqual(analysis);
    expect(worker.terminate).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });

  test('aborting a replaced photo terminates model work and ignores late results', async () => {
    const controller = new AbortController();
    const task = analyzeBodyPhoto(new Blob(), controller.signal);
    const rejected = expect(task).rejects.toMatchObject({ name: 'AbortError' });
    const worker = LocalWorker.instances[0];
    controller.abort();
    worker.onmessage!({ data: { type: 'result', analysis: {} } });
    await rejected;
    expect(worker.terminate).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });

  test('an already-aborted photo does not create or fetch a model worker', async () => {
    await expect(analyzeBodyPhoto(new Blob(), AbortSignal.abort())).rejects.toMatchObject({ name: 'AbortError' });
    expect(LocalWorker.instances).toHaveLength(0);
  });

  test.each(['NO_PERSON', 'UNAVAILABLE', 'unexpected'])('handles worker failure %s without leaving work running', async (code) => {
    const task = analyzeBodyPhoto(new Blob());
    const expected = code === 'NO_PERSON' ? 'NO_PERSON' : 'UNAVAILABLE';
    const rejected = expect(task).rejects.toMatchObject({ code: expected });
    const worker = LocalWorker.instances[0];
    worker.onmessage!({ data: { type: 'error', code } });
    await rejected;
    expect(worker.terminate).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });

  test('terminates a stalled model download after the bounded first-use deadline', async () => {
    const task = analyzeBodyPhoto(new Blob());
    const rejected = expect(task).rejects.toMatchObject({ code: 'UNAVAILABLE' });
    await vi.advanceTimersByTimeAsync(45_000);
    await rejected;
    expect(LocalWorker.instances[0].terminate).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });

  test.each(['onerror', 'onmessageerror'] as const)('cleans up when the browser reports %s', async (event) => {
    const task = analyzeBodyPhoto(new Blob());
    const rejected = expect(task).rejects.toMatchObject({ code: 'UNAVAILABLE' });
    LocalWorker.instances[0][event]!();
    await rejected;
    expect(LocalWorker.instances[0].terminate).toHaveBeenCalledOnce();
  });

  test('fails gracefully when browser workers are unavailable', async () => {
    vi.stubGlobal('Worker', undefined);
    await expect(analyzeBodyPhoto(new Blob())).rejects.toMatchObject({ code: 'UNAVAILABLE' });
    expect(LocalWorker.instances).toHaveLength(0);
  });
});
