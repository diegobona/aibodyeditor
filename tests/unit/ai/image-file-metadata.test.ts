import { expect, test } from 'vitest';
import { formatImageFileMetadata } from '../../../libs/react-shared/utils/image-file-metadata';

const template = '{width} × {height} px · {format} · {size}';
test.each([['image/png', 'PNG'], ['image/jpeg', 'JPEG'], ['image/webp', 'WebP']])('formats actual pixels and %s file bytes', (mimeType, format) => {
  expect(formatImageFileMetadata({ width: 1086, height: 1448, byteLength: 2_288_028, mimeType }, template, 'en')).toBe(`1086 × 1448 px · ${format} · 2.29 MB`);
});
test.each([[999, '999 byte'], [1000, '1 kB'], [999_999, '1,000 kB'], [1_000_000, '1 MB']])('formats %i bytes at unit boundaries', (byteLength, size) => {
  expect(formatImageFileMetadata({ width: 32, height: 32, byteLength, mimeType: 'image/png' }, template, 'en')).toBe(`32 × 32 px · PNG · ${size}`);
});
test.each([{ width: 0 }, { height: -1 }, { byteLength: 0 }, { mimeType: 'text/html' }])('does not invent specifications for unavailable data: %o', invalid => {
  expect(formatImageFileMetadata({ width: 32, height: 32, byteLength: 1000, mimeType: 'image/png', ...invalid }, template, 'en')).toBeNull();
});
