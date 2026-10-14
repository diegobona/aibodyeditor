/** Shared modes for the photo preview and public concept showcase. */
export const BODY_EDITOR_MODES = ["slim", "muscle", "proportions"] as const;
export type BodyEditorMode = (typeof BODY_EDITOR_MODES)[number];

/** Actual edit modes; promotional concept images currently cover the first three. */
export const BODY_EDIT_MODES = [...BODY_EDITOR_MODES, "breast"] as const;
export type BodyEditMode = (typeof BODY_EDIT_MODES)[number];

/** Prompt strengths describe visual intent; they are not provider API parameters. */
export const BODY_EDIT_INTENSITIES = [
  "subtle",
  "balanced",
  "noticeable",
] as const;
export type BodyEditIntensity = (typeof BODY_EDIT_INTENSITIES)[number];

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
