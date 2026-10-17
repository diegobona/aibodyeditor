import { useEffect, useId, useRef, useState } from "react";
import { ChevronsLeftRight, LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";
import { bodyEditConfig } from "../../../config/body-editor";
import { cn } from "@libs/ui/utils/cn";

/** Actual source and saved output are separate images, unlike the promotional diptychs. */
export function BodyEditComparison({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  beforeLabel,
  afterLabel,
  controlLabel,
  hint,
  loadingLabel,
  loadErrorLabel,
  reloadLabel,
  className,
  frameClassName,
}: {
  beforeSrc: string | null;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel: string;
  afterLabel: string;
  controlLabel: string;
  hint: string;
  loadingLabel: string;
  loadErrorLabel: string;
  reloadLabel: string;
  className?: string;
  frameClassName?: string;
}) {
  const [position, setPosition] = useState(50);
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'retrying' | 'failed'>('loading');
  const [attempt, setAttempt] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const automaticRetries = useRef(0);
  const hintId = useId();
  function failImage() {
    if (automaticRetries.current < 2) {
      automaticRetries.current += 1;
      setImageState('retrying');
    } else setImageState('failed');
  }
  useEffect(() => {
    const controller = new AbortController();
    let disposed = false;
    let objectUrl: string | undefined;
    const timer = setTimeout(() => controller.abort(), 15_000);
    setImageUrl(null);
    setImageState('loading');
    // Private dynamic API paths must be fetched with the session. In Node dev,
    // Nitro routes direct <img> requests to the static asset middleware instead.
    void (async () => {
      try {
        // Let a discarded development effect clean up before starting its request.
        await Promise.resolve();
        if (disposed) return;
        const response = await fetch(afterSrc, { credentials: 'same-origin', cache: 'no-store', signal: controller.signal });
        const mime = response.headers.get('Content-Type')?.split(';')[0] ?? '';
        if (!response.ok || !(bodyEditConfig.allowedMimeTypes as readonly string[]).includes(mime)
          || Number(response.headers.get('Content-Length')) > bodyEditConfig.maxOutputBytes) throw new Error('RESULT_UNAVAILABLE');
        const blob = await response.blob();
        if (!blob.size || blob.size > bodyEditConfig.maxOutputBytes) throw new Error('RESULT_UNAVAILABLE');
        if (disposed) return;
        objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      } catch {
        if (!disposed) failImage();
      } finally { clearTimeout(timer); }
    })();
    return () => {
      disposed = true;
      clearTimeout(timer);
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [afterSrc, attempt]);
  useEffect(() => {
    if (imageState !== 'retrying') return;
    const timer = setTimeout(() => {
      setAttempt(value => value + 1);
      setImageState('loading');
    }, automaticRetries.current * 1000);
    return () => clearTimeout(timer);
  }, [imageState]);
  // Retry only the existing private result GET, never the billable edit request.
  const loaded = imageState === 'loaded';
  return (
    <div className={className}>
      <div data-result-frame className={cn("relative isolate h-80 overflow-hidden rounded-2xl bg-muted has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-ring/70 sm:h-[420px]", frameClassName)} aria-busy={imageState === 'loading' || imageState === 'retrying'}>
        {imageUrl && <img
          key={attempt}
          src={imageUrl}
          data-result-source={afterSrc}
          alt={afterAlt}
          className={`h-full w-full object-contain ${loaded ? '' : 'opacity-0'}`}
          onLoad={() => setImageState('loaded')}
          onError={failImage}
        />}
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-sm text-muted-foreground">
            {imageState === 'failed' ? (
              <>
                <p role="alert">{loadErrorLabel}</p>
                <Button type="button" variant="outline" className="rounded-full" onClick={() => {
                  automaticRetries.current = 0;
                  setAttempt(value => value + 1);
                  setImageState('loading');
                }}>{reloadLabel}</Button>
              </>
            ) : (
              <>
                <LoaderCircle className="size-6 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                <p role="status">{loadingLabel}</p>
              </>
            )}
          </div>
        )}
        {beforeSrc && loaded && (
          <>
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
              data-result-before
            >
              <img
                src={beforeSrc}
                alt={beforeAlt}
                className="h-full w-full object-contain"
              />
            </div>
            <div
              className="pointer-events-none absolute inset-y-0 w-0.5 bg-white"
              style={{ left: `${position}%` }}
              aria-hidden="true"
            >
              <span className="absolute left-1/2 top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#292336] shadow">
                <ChevronsLeftRight className="size-5" />
              </span>
            </div>
            <div
              className="pointer-events-none absolute inset-x-0 top-3 flex justify-between gap-2 px-3 text-xs font-semibold"
              aria-hidden="true"
            >
              <span
                className="rounded-full bg-white px-3 py-1.5 text-[#292336]"
                style={{ visibility: position === 0 ? "hidden" : undefined }}
              >
                {beforeLabel}
              </span>
              <span
                className="rounded-full bg-white px-3 py-1.5 text-[#292336]"
                style={{ visibility: position === 100 ? "hidden" : undefined }}
              >
                {afterLabel}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={position}
              onChange={(event) => setPosition(Number(event.target.value))}
              aria-label={controlLabel}
              aria-describedby={hintId}
              aria-valuetext={`${position}% ${beforeLabel}`}
              className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
            />
          </>
        )}
      </div>
      {beforeSrc && loaded && (
        <p
          id={hintId}
          className="mt-2 text-center text-xs text-muted-foreground"
        >
          {hint}
        </p>
      )}
    </div>
  );
}
