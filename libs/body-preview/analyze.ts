import type { BodyPhotoAnalysis } from './types';

export type BodyPhotoAnalysisErrorCode = 'NO_PERSON' | 'UNAVAILABLE';

export class BodyPhotoAnalysisError extends Error {
  constructor(public readonly code: BodyPhotoAnalysisErrorCode) {
    super(code);
    this.name = 'BodyPhotoAnalysisError';
  }
}

/** Analyze a selected photo on this device. No photo data is uploaded. */
export function analyzeBodyPhoto(file: Blob, signal?: AbortSignal): Promise<BodyPhotoAnalysis> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    if (typeof Worker === 'undefined') {
      reject(new BodyPhotoAnalysisError('UNAVAILABLE'));
      return;
    }

    let worker: Worker;
    try {
      worker = new Worker('/body-preview/worker.js');
    } catch {
      reject(new BodyPhotoAnalysisError('UNAVAILABLE'));
      return;
    }
    let settled = false;
    const finish = (error?: Error, analysis?: BodyPhotoAnalysis) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      worker.terminate();
      if (error) reject(error);
      else resolve(analysis!);
    };
    const abort = () => finish(new DOMException('Aborted', 'AbortError'));
    // Includes first-use model download. Slow/unsupported devices retain normal editing.
    const timer = setTimeout(() => finish(new BodyPhotoAnalysisError('UNAVAILABLE')), 45_000);
    signal?.addEventListener('abort', abort, { once: true });
    worker.onerror = () => finish(new BodyPhotoAnalysisError('UNAVAILABLE'));
    worker.onmessageerror = () => finish(new BodyPhotoAnalysisError('UNAVAILABLE'));
    worker.onmessage = ({ data }) => {
      if (data?.type === 'result') finish(undefined, data.analysis as BodyPhotoAnalysis);
      else if (data?.type === 'error') {
        finish(new BodyPhotoAnalysisError(data.code === 'NO_PERSON' ? 'NO_PERSON' : 'UNAVAILABLE'));
      }
    };
    try {
      worker.postMessage({ type: 'analyze', file });
    } catch {
      finish(new BodyPhotoAnalysisError('UNAVAILABLE'));
    }
  });
}
