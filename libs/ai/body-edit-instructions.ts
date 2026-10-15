import { bodyEditConfig } from '../../config/body-editor';

/** Shared text contract for the browser, HTTP boundary, prompt and request fingerprint. */
export function normalizeBodyEditInstructions(value?: unknown): string {
  if (value === undefined) return '';
  if (typeof value !== 'string' || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) {
    throw new TypeError('Provide body edit instructions as text without unsupported control characters.');
  }
  const normalized = value.replace(/\r\n?/g, '\n').trim();
  if (normalized.length > bodyEditConfig.maxInstructionsLength) {
    throw new TypeError(`Body edit instructions must be at most ${bodyEditConfig.maxInstructionsLength} characters.`);
  }
  return normalized;
}
