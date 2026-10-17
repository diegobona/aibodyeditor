import { eq } from 'drizzle-orm';
import { bodyEditConfig } from '../../../../config/body-editor';
import { BODY_EDIT_CREDIT_COST, creditsConfig } from '../../../../config/credits';
import { getApiKey, getBaseUrl } from '../../../../libs/ai/config';
import { createBodyEditorService } from '../../../../libs/ai/body-editor-service';
import { prepareBodyImageEdit, type BodyImageEditOptions } from '../../../../libs/ai/body-edit';
import { createBodyEditRepository } from '../../../../libs/credits/body-edit-repository';
import { createBodyEditHistory } from '../../../../libs/credits/body-edit-history';
import { createBodyGuestRepository } from '../../../../libs/credits/body-guest-repository';
import { guestIdentity, guestNetworkHash } from '../../../../libs/ai/body-guest-session';
import { bodyGuestConfig } from '../../../../config/body-guest';
import { BodyEditError, type BodyEditResultStore } from '../../../../libs/credits/body-edit-types';
import { createNodeBodyEditStore, createR2BodyEditStore } from '../../../../libs/storage/body-edit-results';
import { createBodyEditHandlers } from './body-edit-api';
import { withCfDb } from './with-request-db';

/** Bind server-owned dependencies per request so Workers bindings never cross request contexts. */
export async function getBodyEditHandlers(request?: Request) {
  const database = await import('@libs/database');
  const dialect = database.getDialect();
  let storage: BodyEditResultStore | undefined;
  if (database.isWorkersRuntime) {
    const { env } = await import('cloudflare:workers');
    const bucket = (env as Record<string, unknown>).BODY_EDIT_RESULTS_BUCKET;
    if (bucket) storage = createR2BodyEditStore(bucket as Parameters<typeof createR2BodyEditStore>[0]);
  } else {
    storage = createNodeBodyEditStore();
  }
  const available = async () => {
    try {
      const key = getApiKey('openai').trim();
      if (!key || /^(?:sk[-_])?your(?:[-_]|$)/i.test(key) || !storage || dialect === 'd1') return false;
      prepareBodyImageEdit({ sourceImage: { bytes: new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), mimeType: 'image/png' }, mode: 'slim' },
        { baseURL: getBaseUrl('openai') ?? bodyEditConfig.baseURL });
      await storage.checkReady?.();
      return true;
    } catch { return false; }
  };
  const missing = async (): Promise<never> => { throw new BodyEditError('NOT_CONFIGURED', 503); };
  const dbOptions = dialect === 'sqlite' ? { dialect: 'sqlite' as const, sqlite: database.sqliteInstance }
    : { dialect: 'pg' as const, pool: database.pool, withFresh: database.withFreshRequestClient };
  const repository = dialect === 'd1' ? { initializeAccount: missing, reserve: missing, get: missing, getByRequest: missing, succeed: missing, fail: missing } : createBodyEditRepository(dbOptions);
  const networkHash = request ? await guestNetworkHash(request, process.env.BETTER_AUTH_SECRET ?? '', database.isWorkersRuntime) : undefined;
  const guestRepository = dialect === 'd1' ? undefined : createBodyGuestRepository({ ...dbOptions, networkHash });
  const pipeline = { storage: storage ?? { put: missing, get: missing, delete: missing },
    checkAvailable: available,
    editImage: async (options: BodyImageEditOptions) => {
      const { editBodyImage, materializeBodyImageResult } = await import('../../../../libs/ai/body-edit');
      return materializeBodyImageResult(await editBodyImage(options));
    },
  };
  const service = createBodyEditorService({ ...pipeline, repository });
  return createBodyEditHandlers({
    service,
    initializeAccount: (id, now) => repository.initializeAccount(id, now),
    ...(dialect !== 'd1' && storage ? { history: createBodyEditHistory(dbOptions, storage) } : {}),
    getConfig: async () => ({ available: await available(), costCredits: BODY_EDIT_CREDIT_COST, freeTrialEdits: creditsConfig.publicOffer.freeTrialEdits, guestTrialEdits: bodyGuestConfig.freeEdits }),
    ...(guestRepository ? { guest: {
      service: createBodyEditorService({ ...pipeline, repository: guestRepository }),
      getIdentity: async (req: Request, create: boolean) => {
        if (create && !networkHash) throw new BodyEditError('NOT_CONFIGURED', 503);
        return guestIdentity(req, create);
      },
      allowance: (id: string, now: Date) => guestRepository.allowance(id, now),
    } } : {}),
    getUser: async (request) => {
      const { auth } = await import('@libs/auth');
      const session = await auth.api.getSession({ headers: new Headers(request.headers) });
      if (!session?.user?.id) return null;
      const [current] = await database.db.select({ id: database.user.id, banned: database.user.banned, creditBalance: database.user.creditBalance }).from(database.user).where(eq(database.user.id, session.user.id)).limit(1);
      return current ? { id: current.id, banned: Boolean(current.banned), creditBalance: Number(current.creditBalance) } : null;
    },
    readImage: async (key) => { if (!storage) throw new BodyEditError('NOT_CONFIGURED', 503); return storage.get(key); },
  });
}

/** Also catches DB setup failures, which happen before the pure HTTP handler runs. */
export function withBodyEditDb<T extends { request: Request }>(handler: (context: T) => Promise<Response>): (context: T) => Promise<Response> {
  const wrapped = withCfDb(handler);
  return async (context) => {
    try { return await wrapped(context); }
    catch { return Response.json({ error: { code: 'INTERNAL_ERROR' } }, { status: 500, headers: { 'Cache-Control': 'private, no-store' } }); }
  };
}
