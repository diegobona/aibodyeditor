import { bodyEditConfig, BODY_EDIT_MODES, normalizeBodyEditIntensity, type BodyEditMode } from '../../../config/body-editor';

/** Reuse the protected original output bytes as an input; never resample the image. */
export async function loadBodyEditResultFile(input: { imageUrl: string; jobId: string; origin: string; signal: AbortSignal }): Promise<File> {
  const url = new URL(input.imageUrl, input.origin);
  if (url.origin !== input.origin) throw new Error('RESULT_UNAVAILABLE');
  url.searchParams.set('continue', '1');
  const response = await fetch(url, { credentials: 'same-origin', cache: 'no-store', signal: input.signal });
  if (response.status === 401) throw new Error('UNAUTHORIZED');
  if (response.status === 402) throw new Error('INSUFFICIENT_CREDITS');
  const mimeType = response.headers.get('Content-Type')?.split(';')[0] ?? '';
  if (!response.ok || !(bodyEditConfig.allowedMimeTypes as readonly string[]).includes(mimeType)
    || Number(response.headers.get('Content-Length')) > bodyEditConfig.maxInputBytes) throw new Error('RESULT_UNAVAILABLE');
  const blob = await response.blob();
  if (!blob.size || blob.size > bodyEditConfig.maxInputBytes) throw new Error('RESULT_UNAVAILABLE');
  const bitmap = await createImageBitmap(blob);
  try { if (!bitmap.width || !bitmap.height) throw new Error('RESULT_UNAVAILABLE'); }
  finally { bitmap.close(); }
  return new File([blob], `ai-body-edit-${input.jobId}.${mimeType.slice('image/'.length)}`, { type: mimeType });
}

/** History provides the authorized job ID; settings come from its private server DTO. */
export async function loadSavedBodyEdit(input: { jobId: string; origin: string; signal: AbortSignal }) {
  const response = await fetch(`/api/body-edit/${input.jobId}`, { credentials: 'same-origin', cache: 'no-store', signal: input.signal });
  if (response.status === 401) throw new Error('UNAUTHORIZED');
  const body = await response.json();
  if (!response.ok || body.jobId !== input.jobId || body.status !== 'succeeded'
    || !BODY_EDIT_MODES.includes(body.result?.mode) || typeof body.result?.imageUrl !== 'string') throw new Error('RESULT_UNAVAILABLE');
  const intensity = normalizeBodyEditIntensity(body.result.intensity);
  const file = await loadBodyEditResultFile({ ...input, imageUrl: body.result.imageUrl });
  return { file, mode: body.result.mode as BodyEditMode, intensity };
}
