import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, Images, LoaderCircle, Trash2, ZoomIn } from 'lucide-react';
import { Button } from '@libs/react-shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@libs/react-shared/ui/dialog';
import { authClientReact } from '@libs/auth/authClient';
import { bodyEditConfig } from '../../../../config/body-editor';
import type { BodyEditHistoryItem } from '../../../../libs/credits/body-edit-history';
import { useTranslation } from '@/hooks/use-translation';
import { localizedPath } from '@/lib/i18n-path';
import { ImageFileDetails } from '@libs/react-shared/components/image-file-details';
import type { ImageFileMetadata } from '@libs/react-shared/utils/image-file-metadata';

async function imageBlob(url: string, signal?: AbortSignal) {
  const response = await fetch(url, { credentials: 'same-origin', cache: 'no-store', signal });
  const mime = response.headers.get('Content-Type')?.split(';')[0] ?? '';
  if (!response.ok || !(bodyEditConfig.allowedMimeTypes as readonly string[]).includes(mime)) throw new Error('IMAGE_UNAVAILABLE');
  const blob = await response.blob();
  if (!blob.size || blob.size > bodyEditConfig.maxOutputBytes) throw new Error('IMAGE_UNAVAILABLE');
  return blob;
}

function WorkImage({ item, onPreview }: { item: BodyEditHistoryItem; onPreview: (item: BodyEditHistoryItem, src: string, metadata?: ImageFileMetadata) => void }) {
  const { t, locale } = useTranslation(); const copy = t.myWorks;
  const root = useRef<HTMLDivElement>(null);
  const fileInfo = useRef<{ mimeType: string; byteLength: number } | null>(null);
  const [metadata, setMetadata] = useState<ImageFileMetadata>();
  const [visible, setVisible] = useState(false), [src, setSrc] = useState(''), [error, setError] = useState(false), [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); } }, { rootMargin: '200px' });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!visible) return;
    const controller = new AbortController(); let active = true; let url = '';
    const timer = setTimeout(() => controller.abort(), 15_000);
    setError(false);
    setSrc(''); setMetadata(undefined); fileInfo.current = null;
    void imageBlob(item.imageUrl, controller.signal).then(blob => {
      if (active) { fileInfo.current = { mimeType: blob.type, byteLength: blob.size }; url = URL.createObjectURL(blob); setSrc(url); }
    }).catch(() => { if (active) setError(true); }).finally(() => clearTimeout(timer));
    return () => { active = false; clearTimeout(timer); controller.abort(); if (url) URL.revokeObjectURL(url); };
  }, [item.imageUrl, visible, attempt]);
  return <><div ref={root} className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-t-2xl bg-muted">
    {src ? <button type="button" onClick={() => onPreview(item, src, metadata)} aria-label={copy.preview} className="group h-full w-full focus-visible:outline-2 focus-visible:outline-ring">
      <img src={src} alt={copy.imageAlt.replace('{mode}', t.home.upload.modes[item.mode])} className="h-full w-full object-contain"
        onLoad={event => { if (fileInfo.current) setMetadata({ ...fileInfo.current, width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight }); }}
        onError={() => { setSrc(''); setMetadata(undefined); setError(true); }} />
      <span className="absolute bottom-3 right-3 rounded-full bg-background/90 p-2 shadow-sm"><ZoomIn className="size-4" aria-hidden="true" /></span>
    </button> : error ? <div className="space-y-2 px-4 text-center text-sm text-muted-foreground"><p>{copy.imageError}</p><Button variant="outline" size="sm" onClick={() => setAttempt(value => value + 1)}>{copy.retry}</Button></div>
      : <LoaderCircle className="size-5 animate-spin text-muted-foreground" aria-label={copy.loading} />}
  </div><ImageFileDetails metadata={metadata} copy={t.imageDetails} locale={locale} className="px-4 pt-3" /></>;
}

export function MyWorks() {
  const { t, locale } = useTranslation(); const copy = t.myWorks;
  const { data: session, isPending } = authClientReact.useSession();
  const [items, setItems] = useState<BodyEditHistoryItem[]>([]), [page, setPage] = useState(0), [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true), [loadError, setLoadError] = useState(false), [actionError, setActionError] = useState('');
  const [retentionDays, setRetentionDays] = useState<number>(bodyEditConfig.resultRetentionDays);
  const [preview, setPreview] = useState<{ item: BodyEditHistoryItem; src: string; metadata?: ImageFileMetadata } | null>(null);
  const [deleting, setDeleting] = useState<BodyEditHistoryItem | null>(null), [busy, setBusy] = useState(false), [downloading, setDownloading] = useState<string | null>(null);
  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true); setLoadError(false);
    try {
      const response = await fetch(`/api/body-edit/history?page=${page}`, { credentials: 'same-origin', cache: 'no-store', signal });
      if (!response.ok) throw new Error('HISTORY_UNAVAILABLE');
      const data = await response.json() as { items: BodyEditHistoryItem[]; hasMore: boolean; retentionDays: number };
      if (!signal?.aborted) { setItems(data.items); setHasMore(data.hasMore); setRetentionDays(data.retentionDays); }
    } catch { if (!signal?.aborted) setLoadError(true); }
    finally { if (!signal?.aborted) setLoading(false); }
  }, [page]);
  useEffect(() => {
    if (!session?.user) return;
    const controller = new AbortController(); const timer = setTimeout(() => { controller.abort(); setLoadError(true); setLoading(false); }, 20_000);
    void load(controller.signal).finally(() => clearTimeout(timer));
    return () => { clearTimeout(timer); controller.abort(); };
  }, [load, session?.user.id]);
  const date = (value: string) => new Date(value).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
  const download = async (item: BodyEditHistoryItem) => {
    setDownloading(item.id); setActionError('');
    try {
      const blob = await imageBlob(item.downloadUrl, AbortSignal.timeout(20_000));
      const url = URL.createObjectURL(blob); const anchor = document.createElement('a');
      anchor.href = url; anchor.download = `ai-body-edit-${item.id}.${blob.type.split('/')[1]}`; anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
    } catch { setActionError(copy.downloadError); }
    finally { setDownloading(null); }
  };
  const remove = async () => {
    if (!deleting || busy) return;
    setBusy(true); setActionError('');
    try {
      const response = await fetch(`/api/body-edit/${deleting.id}`, { method: 'DELETE', credentials: 'same-origin', signal: AbortSignal.timeout(20_000) });
      if (!response.ok) throw new Error('DELETE_FAILED');
      if (preview?.item.id === deleting.id) setPreview(null);
      setDeleting(null);
      if (items.length === 1 && page > 0) setPage(value => value - 1); else await load();
    } catch { setActionError(copy.deleteError); }
    finally { setBusy(false); }
  };
  return <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-2xl font-semibold sm:text-3xl">{copy.title}</h1><p className="mt-2 text-sm text-muted-foreground">{copy.description}</p></div>
      <Button asChild className="rounded-full"><a href={localizedPath('/', locale) + '#try'}>{copy.editPhoto}</a></Button>
    </div>
    <p className="mb-6 rounded-xl border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">{copy.retention.replace('{days}', String(retentionDays))}</p>
    <a href={localizedPath('/deletion', locale)} className="mb-6 inline-block text-sm text-primary underline underline-offset-4">{t.legal.deletion.title}</a>
    {actionError && !deleting && <p role="alert" className="mb-4 text-sm text-destructive">{actionError}</p>}
    {loading || isPending ? <div role="status" className="flex min-h-56 items-center justify-center gap-3 text-muted-foreground"><LoaderCircle className="size-5 animate-spin" />{copy.loading}</div>
      : loadError ? <div role="alert" className="py-16 text-center"><p className="mb-4">{copy.loadError}</p><Button variant="outline" onClick={() => void load()}>{copy.retry}</Button></div>
      : !items.length ? <div className="flex flex-col items-center gap-3 py-16 text-center"><Images className="mb-1 size-10 text-primary" /><h2 className="text-xl font-semibold">{copy.empty}</h2><p className="max-w-md text-sm text-muted-foreground">{copy.emptyHint}</p></div>
      : <div className="grid grid-cols-1 gap-5 min-[440px]:grid-cols-2 lg:grid-cols-4">{items.map(item => <article key={item.id} data-work-id={item.id} className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <WorkImage item={item} onPreview={(selected, src, metadata) => setPreview({ item: selected, src, metadata })} />
        <div className="space-y-2 p-4"><div className="flex flex-wrap items-center justify-between gap-1"><h2 className="text-sm font-semibold">{t.home.upload.modes[item.mode]}</h2><span className="text-xs text-muted-foreground">{copy.intensity.replace('{value}', String(item.intensity))}</span></div>
          <time dateTime={item.createdAt} className="block text-xs text-muted-foreground">{date(item.createdAt)}</time>
          <p className="text-xs text-muted-foreground">{copy.expires.replace('{date}', date(item.expiresAt))}</p>
          <div className="flex gap-2 pt-2"><Button variant="outline" size="sm" className="flex-1" title={t.imageDetails.downloadOriginal} disabled={downloading === item.id} onClick={() => void download(item)}><Download className="size-3.5" aria-hidden="true" />{copy.download}</Button>
            <Button variant="ghost" size="sm" aria-label={copy.delete} className="text-muted-foreground hover:text-destructive" onClick={() => { setActionError(''); setDeleting(item); }}><Trash2 className="size-4" aria-hidden="true" /></Button></div>
        </div>
      </article>)}</div>}
    {!loading && !loadError && (page > 0 || hasMore) && <nav className="mt-8 flex items-center justify-center gap-4" aria-label={copy.title}><Button variant="outline" disabled={page === 0} onClick={() => setPage(value => value - 1)}>{copy.previous}</Button><span className="text-sm">{copy.page.replace('{page}', String(page + 1))}</span><Button variant="outline" disabled={!hasMore} onClick={() => setPage(value => value + 1)}>{copy.next}</Button></nav>}
    <Dialog open={!!preview} onOpenChange={open => { if (!open) setPreview(null); }}><DialogContent className="max-h-[95dvh] sm:max-w-3xl"><DialogHeader><DialogTitle>{copy.preview}</DialogTitle><DialogDescription>{preview && t.home.upload.modes[preview.item.mode]}</DialogDescription></DialogHeader>{preview && <><ImageFileDetails metadata={preview.metadata} copy={t.imageDetails} locale={locale} /><img src={preview.src} alt={copy.imageAlt.replace('{mode}', t.home.upload.modes[preview.item.mode])} className="max-h-[70dvh] w-full object-contain" /></>}</DialogContent></Dialog>
    <Dialog open={!!deleting} onOpenChange={open => { if (!open && !busy) { setDeleting(null); setActionError(''); } }}><DialogContent><DialogHeader><DialogTitle>{copy.deleteTitle}</DialogTitle><DialogDescription>{copy.deleteDescription}</DialogDescription></DialogHeader>{actionError && <p role="alert" className="text-sm text-destructive">{actionError}</p>}<div className="flex justify-end gap-2"><Button variant="outline" disabled={busy} onClick={() => setDeleting(null)}>{copy.cancel}</Button><Button variant="destructive" disabled={busy} onClick={() => void remove()}>{busy ? copy.deleting : copy.delete}</Button></div></DialogContent></Dialog>
  </main>;
}

