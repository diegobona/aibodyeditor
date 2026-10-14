/** Shared modes for the photo preview and public concept showcase. */
export const BODY_EDITOR_MODES = ["slim", "muscle", "proportions"] as const;
export type BodyEditorMode = (typeof BODY_EDITOR_MODES)[number];

/** Actual edit modes; promotional concept images currently cover the first three. */
export const BODY_EDIT_MODES = [...BODY_EDITOR_MODES, "breast"] as const;
export type BodyEditMode = (typeof BODY_EDIT_MODES)[number];

/** Continuous visual intent, not a body measurement or provider API parameter. */
export const BODY_EDIT_INTENSITY = { min: 1, max: 100, step: 1, default: 70 } as const;
export type BodyEditIntensity = number;
/** Compatibility for already submitted requests and historical jobs. */
export const LEGACY_BODY_EDIT_INTENSITIES = { subtle: 25, balanced: 50, noticeable: 80 } as const;
export type LegacyBodyEditIntensity = keyof typeof LEGACY_BODY_EDIT_INTENSITIES;
export type BodyEditIntensityInput = BodyEditIntensity | LegacyBodyEditIntensity;

export function normalizeBodyEditIntensity(value: unknown = BODY_EDIT_INTENSITY.default): BodyEditIntensity {
  if (typeof value === 'string') {
    if (Object.hasOwn(LEGACY_BODY_EDIT_INTENSITIES, value)) {
      return LEGACY_BODY_EDIT_INTENSITIES[value as LegacyBodyEditIntensity];
    }
    // FormData and the existing text column use canonical integer strings.
    if (!/^(?:[1-9]\d?|100)$/.test(value)) throw new TypeError('Unsupported body edit intensity');
    value = Number(value);
  }
  if (typeof value !== 'number' || !Number.isInteger(value) || value < BODY_EDIT_INTENSITY.min || value > BODY_EDIT_INTENSITY.max) {
    throw new TypeError('Unsupported body edit intensity');
  }
  return value;
}

export const bodyEditConfig = {
  model: "gpt-image-2.5-1k",
  baseURL: "https://api.tu-zi.com/v1",
  maxInputBytes: 10 * 1024 * 1024,
  maxOutputBytes: 10 * 1024 * 1024,
  maxResponseBytes: 20 * 1024 * 1024,
  timeoutMs: 180_000,
  resultTimeoutMs: 30_000,
  // Rabbit rotates numbered CDN nodes (observed apioss8 and apioss28).
  // Match only this namespace, not arbitrary subdomains or browser-supplied URLs.
  resultHostPattern: /^apioss[0-9]+\.sydney-ai\.com$/,
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
} as const;
