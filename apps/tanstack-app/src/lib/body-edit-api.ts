import { bodyEditConfig, LEGACY_BODY_EDIT_INTENSITIES, normalizeBodyEditIntensity } from '../../../../config/body-editor';
import { prepareBodyImageEdit, type BodyImageEditOptions } from '../../../../libs/ai/body-edit';
import { isBodyEditUuid, type BodyEditorService } from '../../../../libs/ai/body-editor-service';
import { BodyEditError, type BodyEditOutcome } from '../../../../libs/credits/body-edit-types';

const noStore = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' };
const statuses: Record<string, number> = {
  UNAUTHORIZED: 401, FORBIDDEN: 403, INVALID_ORIGIN: 403, INVALID_INPUT: 400, NOT_CONFIGURED: 503,
  NOT_FOUND: 404, IDEMPOTENCY_CONFLICT: 409, INSUFFICIENT_CREDITS: 402, TIMEOUT: 504,
  CANCELLED: 502, UPSTREAM_ERROR: 502, INVALID_RESPONSE: 502, OUTPUT_TOO_LARGE: 502,
  ASYNC_RESPONSE: 502, STORAGE_ERROR: 502, RESULT_UNAVAILABLE: 502, INTERNAL_ERROR: 500,
};
const json = (body: unknown, status = 200, headers: Record<string, string> = {}) => Response.json(body, { status, headers: { ...noStore, ...headers } });
function failure(error: unknown) {
  const known = error instanceof BodyEditError && Object.hasOwn(statuses, error.code);
  const code = known ? error.code : 'INTERNAL_ERROR';
  const status = known && code === 'INVALID_INPUT' && error.status === 413 ? 413 : statuses[code];
  return json({ error: { code, ...(known && typeof error.refunded === 'boolean' ? { refunded: error.refunded } : {}) },
    ...(known && error.jobId && isBodyEditUuid(error.jobId) ? { jobId: error.jobId } : {}) }, status);
}
function project({ job, balance, reused }: BodyEditOutcome) {
  if (!isBodyEditUuid(job.id)) throw new BodyEditError('INTERNAL_ERROR');
  if (job.status === 'processing') return json({ jobId: job.id, status: job.status, retryAfterSeconds: 3 }, 202, { 'Retry-After': '3' });
  if (job.status === 'failed') {
    const code = job.errorCode && Object.hasOwn(statuses, job.errorCode) ? job.errorCode : 'INTERNAL_ERROR';
    return json({ error: { code, refunded: job.refunded }, jobId: job.id }, statuses[code]);
  }
  return json({ jobId: job.id, status: 'succeeded',
    result: { imageUrl: `/api/body-edit/${job.id}/image`, downloadUrl: `/api/body-edit/${job.id}/image?download=1`, mode: job.mode, intensity: job.intensity },
    credits: { charged: job.costCredits, balance }, reused });
}

async function boundedForm(request: Request): Promise<FormData> {
  const limit = bodyEditConfig.maxInputBytes + 64 * 1024;
  if (Number(request.headers.get('Content-Length')) > limit) throw new BodyEditError('INVALID_INPUT', 413);
  const contentType = request.headers.get('Content-Type') ?? '';
  if (!/^multipart\/form-data;/i.test(contentType) || !request.body) throw new BodyEditError('INVALID_INPUT', 400);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = []; let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      total += value.byteLength;
      if (total > limit) throw new BodyEditError('INVALID_INPUT', 413);
      chunks.push(value);
    }
  } catch (error) { void reader.cancel().catch(() => undefined); throw error; }
  finally { reader.releaseLock(); }
  const bytes = new Uint8Array(total); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return await new Request(request.url, { method: 'POST', headers: { 'Content-Type': contentType }, body: bytes }).formData(); }
  catch { throw new BodyEditError('INVALID_INPUT', 400); }
}

/** HTTP boundary is independently testable; auth, billing and storage are server dependencies. */
export function createBodyEditHandlers(deps: {
  getUser(request: Request): Promise<{ id: string; banned?: boolean } | null>;
  service: BodyEditorService;
  getConfig(): Promise<{ available: boolean; costCredits: number; freeTrialEdits: number }> | { available: boolean; costCredits: number; freeTrialEdits: number };
  readImage(key: string): Promise<{ bytes: Uint8Array; mimeType: string } | null>;
}) {
  const user = async (request: Request) => {
    const found = await deps.getUser(request);
    if (!found?.id) throw new BodyEditError('UNAUTHORIZED', 401);
    if (found.banned) throw new BodyEditError('FORBIDDEN', 403);
    return found;
  };
  const owned = async (request: Request, jobId: string) => {
    const current = await user(request);
    if (!isBodyEditUuid(jobId)) throw new BodyEditError('NOT_FOUND', 404);
    const outcome = await deps.service.getJob({ userId: current.id, jobId });
    if (outcome.job.userId !== current.id) throw new BodyEditError('FORBIDDEN', 403);
    return outcome;
  };
  return {
    async config(_request?: Request) {
      try { const { available, costCredits, freeTrialEdits } = await deps.getConfig(); return json({ available, costCredits, freeTrialEdits }); }
      catch (error) { return failure(error); }
    },
    async submit(request: Request) {
      try {
        const current = await user(request);
        if (request.headers.get('Origin') !== new URL(request.url).origin) throw new BodyEditError('INVALID_ORIGIN', 403);
        const form = await boundedForm(request);
        const image = form.get('image');
        if (!(image instanceof File) || form.getAll('image').length !== 1 || !image.size) throw new BodyEditError('INVALID_INPUT', 400);
        if (image.size > bodyEditConfig.maxInputBytes) throw new BodyEditError('INVALID_INPUT', 413);
        const requestId = form.get('requestId');
        if (typeof requestId !== 'string' || !isBodyEditUuid(requestId)) throw new BodyEditError('INVALID_INPUT', 400);
        const rawIntensity = form.get('intensity') ?? undefined;
        if (form.getAll('intensity').length > 1) throw new BodyEditError('INVALID_INPUT', 400);
        let intensity: BodyImageEditOptions['intensity'];
        try {
          const numeric = normalizeBodyEditIntensity(rawIntensity);
          // Keep legacy names for old idempotency hashes; new requests use numbers.
          intensity = typeof rawIntensity === 'string' && Object.hasOwn(LEGACY_BODY_EDIT_INTENSITIES, rawIntensity)
            ? rawIntensity as BodyImageEditOptions['intensity'] : numeric;
        } catch { throw new BodyEditError('INVALID_INPUT', 400); }
        const options: BodyImageEditOptions = {
          sourceImage: { bytes: new Uint8Array(await image.arrayBuffer()), mimeType: image.type as BodyImageEditOptions['sourceImage']['mimeType'] },
          mode: form.get('mode') as BodyImageEditOptions['mode'],
          intensity,
        };
        try { prepareBodyImageEdit(options, { baseURL: bodyEditConfig.baseURL }); }
        catch { throw new BodyEditError('INVALID_INPUT', 400); }
        if (!(await deps.getConfig()).available) throw new BodyEditError('NOT_CONFIGURED', 503);
        const outcome = await deps.service.submit({ userId: current.id, requestId, image: options.sourceImage, mode: options.mode, intensity: options.intensity });
        if (outcome.job.userId !== current.id) throw new BodyEditError('FORBIDDEN', 403);
        return project(outcome);
      } catch (error) { return failure(error); }
    },
    async status(request: Request, jobId: string) {
      try { return project(await owned(request, jobId)); } catch (error) { return failure(error); }
    },
    async lookup(request: Request) {
      try {
        const current = await user(request);
        const requestId = new URL(request.url).searchParams.get('requestId') ?? '';
        if (!isBodyEditUuid(requestId)) throw new BodyEditError('NOT_FOUND', 404);
        const outcome = await deps.service.getRequest({ userId: current.id, requestId });
        if (outcome.job.userId !== current.id) throw new BodyEditError('FORBIDDEN', 403);
        return project(outcome);
      } catch (error) { return failure(error); }
    },
    async image(request: Request, jobId: string) {
      try {
        const { job } = await owned(request, jobId);
        if (job.status !== 'succeeded' || !job.resultKey) throw new BodyEditError('NOT_FOUND', 404);
        const image = await deps.readImage(job.resultKey); if (!image) throw new BodyEditError('NOT_FOUND', 404);
        if (!bodyEditConfig.allowedMimeTypes.includes(image.mimeType as any) || image.bytes.byteLength > bodyEditConfig.maxOutputBytes) throw new BodyEditError('STORAGE_ERROR', 502);
        const extension = image.mimeType.slice('image/'.length);
        const disposition = new URL(request.url).searchParams.get('download') === '1' ? 'attachment' : 'inline';
        return new Response(new Uint8Array(image.bytes), { headers: { ...noStore, 'Content-Type': image.mimeType,
          'Content-Disposition': `${disposition}; filename="ai-body-edit-${jobId}.${extension}"` } });
      } catch (error) { return failure(error); }
    },
  };
}
