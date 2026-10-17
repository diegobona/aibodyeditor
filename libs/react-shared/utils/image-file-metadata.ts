export interface ImageFileMetadata {
  width: number;
  height: number;
  mimeType: string;
  byteLength: number;
}

const formats: Record<string, string> = { 'image/png': 'PNG', 'image/jpeg': 'JPEG', 'image/webp': 'WebP' };

/** Uses original file bytes and decoded pixels, never the CSS preview dimensions. */
export function formatImageFileMetadata(metadata: ImageFileMetadata, template: string, locale: string): string | null {
  const { width, height, byteLength, mimeType } = metadata;
  if (![width, height, byteLength].every(value => Number.isSafeInteger(value) && value > 0) || !formats[mimeType]) return null;
  const divisor = byteLength >= 1_000_000 ? 1_000_000 : byteLength >= 1000 ? 1000 : 1;
  const unit = divisor === 1_000_000 ? 'megabyte' : divisor === 1000 ? 'kilobyte' : 'byte';
  const size = new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay: 'short', maximumFractionDigits: divisor === 1 ? 0 : 2 }).format(byteLength / divisor);
  return template.replace('{width}', String(width)).replace('{height}', String(height)).replace('{format}', formats[mimeType]).replace('{size}', size);
}
