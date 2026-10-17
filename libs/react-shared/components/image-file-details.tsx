import { cn } from '@libs/ui/utils/cn';
import { formatImageFileMetadata, type ImageFileMetadata } from '../utils/image-file-metadata';

export function ImageFileDetails({ metadata, copy, locale, className }: {
  metadata?: ImageFileMetadata | null;
  copy: { label: string; format: string };
  locale: string;
  className?: string;
}) {
  if (!metadata) return null;
  const details = formatImageFileMetadata(metadata, copy.format, locale);
  if (!details) return null;
  return <p data-image-details data-width={metadata.width} data-height={metadata.height} data-byte-length={metadata.byteLength}
    aria-label={copy.label} className={cn('text-xs leading-relaxed text-muted-foreground', className)}>{details}</p>;
}
