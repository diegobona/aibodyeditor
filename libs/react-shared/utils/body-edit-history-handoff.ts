import { BODY_EDIT_RECOVERY_KEY } from '../../../config/body-editor';

type TabStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
const key = 'body-editor-continue-work';
const lifetime = 5 * 60_000;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** This tab keeps a short-lived reference only; image bytes and prompts stay out of storage. */
export function queueSavedBodyEdit(jobId: string, ownerId: string, storage: TabStorage = sessionStorage, now = Date.now()) {
  if (!uuid.test(jobId) || !ownerId || ownerId === 'guest') throw new Error('INVALID_REFERENCE');
  storage.setItem(key, JSON.stringify({ jobId, ownerId, createdAt: now }));
  // An explicit new input must not restore an earlier result over the selected work.
  storage.removeItem(BODY_EDIT_RECOVERY_KEY);
}

export function clearSavedBodyEdit(storage: TabStorage = sessionStorage) {
  try { storage.removeItem(key); } catch { /* Optional tab storage. */ }
}

export function readSavedBodyEdit(ownerId: string, storage: TabStorage = sessionStorage, now = Date.now()): string | null {
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    const value = JSON.parse(raw);
    if (value.ownerId !== ownerId || typeof value.jobId !== 'string' || !uuid.test(value.jobId)
      || !Number.isFinite(value.createdAt) || value.createdAt > now || now - value.createdAt >= lifetime) {
      clearSavedBodyEdit(storage); return null;
    }
    return value.jobId;
  } catch { clearSavedBodyEdit(storage); return null; }
}
