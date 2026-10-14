import { Buffer } from 'node:buffer';
import { bodyEditConfig, LEGACY_BODY_EDIT_INTENSITIES } from '../../config/body-editor';
import { BODY_EDIT_CREDIT_COST, creditsConfig } from '../../config/credits';
import { BodyImageEditError, prepareBodyImageEdit, type editBodyImage, type BodyImageEditOptions } from './body-edit';
import { BodyEditError, type BodyEditRepository, type BodyEditResultStore, type BodyEditOutcome } from '../credits/body-edit-types';

export { BodyEditError as BodyEditorServiceError } from '../credits/body-edit-types';
export type { BodyEditOutcome } from '../credits/body-edit-types';
export interface SubmitBodyEdit {
  userId: string;
  requestId: string;
  image: BodyImageEditOptions['sourceImage'];
  mode: BodyImageEditOptions['mode'];
  intensity?: BodyImageEditOptions['intensity'];
}
export interface BodyEditorService {
  submit(input: SubmitBodyEdit): Promise<BodyEditOutcome>;
  getJob(input: { userId: string; jobId: string }): Promise<BodyEditOutcome>;
  getRequest(input: { userId: string; requestId: string }): Promise<BodyEditOutcome>;
}
export const isBodyEditUuid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export function createBodyEditorService(deps: {
  repository: BodyEditRepository;
  storage: BodyEditResultStore;
  editImage: typeof editBodyImage;
  checkAvailable: () => boolean | Promise<boolean>;
  now?: () => Date;
  newJobId?: () => string;
}): BodyEditorService {
  const now = deps.now ?? (() => new Date());
  return {
    async submit(input) {
      if (!input?.userId || !isBodyEditUuid(input.requestId ?? '')) throw new BodyEditError('INVALID_INPUT', 400);
      const options: BodyImageEditOptions = { sourceImage: input.image, mode: input.mode, intensity: input.intensity };
      let prepared: ReturnType<typeof prepareBodyImageEdit>;
      try { prepared = prepareBodyImageEdit(options); }
      catch (error) {
        const unavailable = (error as { code?: string }).code === 'INVALID_CONFIGURATION';
        throw new BodyEditError(unavailable ? 'NOT_CONFIGURED' : 'INVALID_INPUT', unavailable ? 503 : 400);
      }
      if (!(await deps.checkAvailable())) throw new BodyEditError('NOT_CONFIGURED', 503);
      const hashInput = new Uint8Array(input.image.bytes.length + 128);
      // Preserve the hash format of old in-flight requests when an old client retries.
      const hashIntensity = typeof input.intensity === 'string' && Object.hasOwn(LEGACY_BODY_EDIT_INTENSITIES, input.intensity)
        ? input.intensity : prepared.intensity;
      const prefix = new TextEncoder().encode(`${prepared.mode}\0${hashIntensity}\0${prepared.mimeType}\0`);
      hashInput.set(prefix); hashInput.set(input.image.bytes, prefix.length);
      const digest = await crypto.subtle.digest('SHA-256', hashInput.subarray(0, prefix.length + input.image.bytes.length));
      const inputHash = Buffer.from(digest).toString('hex');
      const started = now();
      const reserved = await deps.repository.reserve({
        jobId: (deps.newJobId ?? (() => crypto.randomUUID()))(), userId: input.userId, requestId: input.requestId.toLowerCase(),
        inputHash, mode: prepared.mode, intensity: prepared.intensity, model: prepared.model,
        costCredits: BODY_EDIT_CREDIT_COST,
        trialCredits: BODY_EDIT_CREDIT_COST * creditsConfig.publicOffer.freeTrialEdits,
        now: started, deadlineAt: new Date(started.getTime() + bodyEditConfig.timeoutMs + bodyEditConfig.resultTimeoutMs + 10_000),
      });
      if (reserved.reused) return reserved;
      const jobId = reserved.job.id;
      let storedKey: string | undefined;
      let stage: 'provider' | 'storage' | 'complete' = 'provider';
      try {
        const result = await deps.editImage(options);
        const match = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]+=*)$/.exec(result.imageUrl);
        if (!match) throw new BodyEditError('RESULT_UNAVAILABLE');
        const bytes = new Uint8Array(Buffer.from(match[2], 'base64'));
        stage = 'storage';
        storedKey = await deps.storage.put(jobId, bytes, match[1]);
        stage = 'complete';
        const outcome = await deps.repository.succeed(input.userId, jobId, storedKey, match[1], now());
        if (outcome.job.status !== 'succeeded') await deps.storage.delete(storedKey).catch(() => undefined);
        return outcome;
      } catch (error) {
        const allowed = new Set(['TIMEOUT', 'CANCELLED', 'UPSTREAM_ERROR', 'INVALID_RESPONSE', 'OUTPUT_TOO_LARGE', 'ASYNC_RESPONSE', 'NOT_CONFIGURED', 'RESULT_UNAVAILABLE']);
        const rawCode = (error as { code?: string })?.code;
        const code = stage === 'storage' ? 'STORAGE_ERROR' : allowed.has(rawCode ?? '') ? rawCode! : 'UPSTREAM_ERROR';
        // Never log original photos, full URLs, credentials or raw provider/storage messages.
        console.warn('[body-edit] failed', {
          jobId, provider: 'openai', model: prepared.model, mode: prepared.mode, intensity: prepared.intensity, stage, code,
          ...(error instanceof BodyImageEditError ? {
            providerRequestId: error.requestId, upstreamStatus: error.status, diagnostic: error.diagnostic,
          } : {}),
        });
        const outcome = await deps.repository.fail(input.userId, jobId, code, now());
        if (storedKey && outcome.job.status !== 'succeeded') await deps.storage.delete(storedKey).catch(() => undefined);
        return outcome;
      }
    },
    async getJob({ userId, jobId }) {
      if (!isBodyEditUuid(jobId)) throw new BodyEditError('NOT_FOUND', 404);
      return deps.repository.get(userId, jobId, now());
    },
    async getRequest({ userId, requestId }) {
      if (!isBodyEditUuid(requestId)) throw new BodyEditError('NOT_FOUND', 404);
      return deps.repository.getByRequest(userId, requestId, now());
    },
  };
}
