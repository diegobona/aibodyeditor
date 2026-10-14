import { useId, useState } from "react";
import { ChevronsLeftRight } from "lucide-react";
import { cn } from "@libs/ui/utils/cn";

/** One portrait half of a photographic diptych, with no extra image processing. */
export function DiptychPhoto({
  src,
  side = "before",
  alt,
  eager = false,
  className,
}: {
  src: string;
  side?: "before" | "after";
  alt: string;
  eager?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[3/4] overflow-hidden bg-muted",
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        width={1536}
        height={1024}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        decoding="async"
        className="absolute left-0 top-0 h-full w-[200%] max-w-none"
        style={{ transform: side === "after" ? "translateX(-50%)" : undefined }}
      />
    </div>
  );
}

/** SSR-visible comparison, controlled by a native keyboard- and touch-accessible range. */
export function PhotoComparison({
  src,
  beforeAlt,
  afterAlt,
  beforeLabel,
  afterLabel,
  controlLabel,
  hint,
  eager = false,
  className,
}: {
  src: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel: string;
  afterLabel: string;
  controlLabel: string;
  hint: string;
  eager?: boolean;
  className?: string;
}) {
  const [position, setPosition] = useState(50);
  const hintId = useId();
  return (
    <div className={className}>
      <div className="relative isolate overflow-hidden rounded-[24px] has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-ring/70">
        <DiptychPhoto src={src} side="after" alt={afterAlt} eager={eager} />
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          data-comparison-before
        >
          <DiptychPhoto
            src={src}
            alt={beforeAlt}
            eager={eager}
            className="h-full"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-white shadow-sm"
          style={{ left: `${position}%` }}
          aria-hidden="true"
        >
          <span className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#292336] shadow-lg">
            <ChevronsLeftRight className="size-5" />
          </span>
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 top-3 z-10 flex justify-between gap-2 px-3"
          aria-hidden="true"
        >
          <span
            className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#292336] sm:text-xs"
            style={{ visibility: position === 0 ? "hidden" : undefined }}
          >
            {beforeLabel}
          </span>
          <span
            className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#292336] sm:text-xs"
            style={{ visibility: position === 100 ? "hidden" : undefined }}
          >
            {afterLabel}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label={controlLabel}
          aria-describedby={hintId}
          aria-valuetext={`${position}% ${beforeLabel}`}
          className="absolute inset-0 z-20 m-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <p
        id={hintId}
        className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground"
      >
        <ChevronsLeftRight className="size-4" aria-hidden="true" />
        {hint}
      </p>
    </div>
  );
}
