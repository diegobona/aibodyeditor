import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DiptychPhoto } from "@libs/react-shared/components/photo-comparison";
import { cn } from "@libs/ui/utils/cn";
import { useTranslation } from "@/hooks/use-translation";
import type { BodyEditMode, BodyEditIntensity } from "../../../../../config/body-editor";
import { UploadDropzone } from "./upload-dropzone";
import { RealResultsGallery } from "./real-results-gallery";
import { SettingsOnlyToggle } from "./settings-only-toggle";
import { REAL_RESULT_CASES, REAL_RESULT_IMAGES, type EditorPhotoSource, type EditorSample } from "./showcase-data";

type ExampleKey = (typeof REAL_RESULT_CASES)[number]["key"];

export function ExamplePlayground({ selectedMode, onModeChange, pending, onPendingChange, title, breadcrumb, caseKeys, galleryTitle, galleryDescription, defaultIntensity }: {
  selectedMode: BodyEditMode;
  onModeChange: (mode: BodyEditMode) => void;
  pending: boolean;
  onPendingChange: (pending: boolean) => void;
  title?: string;
  breadcrumb?: ReactNode;
  caseKeys?: readonly ExampleKey[];
  galleryTitle?: string;
  galleryDescription?: string;
  defaultIntensity?: BodyEditIntensity;
}) {
  const { t } = useTranslation();
  const copy = t.home.examples;
  const [selected, setSelected] = useState<ExampleKey>();
  const [sample, setSample] = useState<EditorSample>();
  const [photoSource, setPhotoSource] = useState<EditorPhotoSource>(null);
  const [settingsOnly, setSettingsOnly] = useState(false);
  const rail = useRef<HTMLDivElement>(null);
  const cases = caseKeys ? REAL_RESULT_CASES.filter(item => caseKeys.includes(item.key)) : REAL_RESULT_CASES;

  useEffect(() => {
    const element = rail.current;
    if (!element || pending || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0, last = 0, position = element.scrollLeft, direction = 1;
    const move = (now: number) => {
      const elapsed = last ? Math.min(now - last, 50) : 0;
      last = now;
      const limit = element.scrollWidth - element.clientWidth;
      if (document.hidden || element.matches(":hover, :focus-within, :active") || limit <= 0) {
        position = element.scrollLeft;
      } else {
        // Keep fractional pixels so slow movement also works with integer scrollLeft.
        if (Math.abs(element.scrollLeft - position) > 2) position = element.scrollLeft;
        position += direction * elapsed * 0.018;
        if (position >= limit) { position = limit; direction = -1; }
        if (position <= 0) { position = 0; direction = 1; }
        element.scrollLeft = position;
      }
      frame = requestAnimationFrame(move);
    };
    frame = requestAnimationFrame(move);
    return () => cancelAnimationFrame(frame);
  }, [pending]);

  const choose = (key: ExampleKey, onlySettings = settingsOnly) => {
    if (pending) return;
    const chosen = REAL_RESULT_CASES.find((value) => value.key === key)!;
    const details = t.home.realResults[key];
    setSelected(key);
    setSample({ id: key, src: REAL_RESULT_IMAGES[key], alt: details.beforeAlt, afterAlt: details.afterAlt,
      mode: chosen.mode, intensity: chosen.intensity, instructions: details.instructions,
      loadPhoto: !(onlySettings && photoSource) });
  };

  return (
    <>
    <section id="home-hero" className="pb-8 pt-2 md:pb-10">
      <div id="try" className="mx-auto w-full max-w-[1600px] scroll-mt-16 px-3 sm:px-6">
        <div className={breadcrumb ? 'flex flex-wrap items-center justify-between gap-x-4' : 'contents'}>
          <h1 className="mb-2 font-sans text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{title ?? t.home.hero.title}</h1>
          {breadcrumb}
        </div>
        <section id="samples" aria-labelledby="sample-heading" className="mb-2 min-w-0">
          <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
            <h2 id="sample-heading" className="text-xs font-semibold">{copy.title}</h2>
            <SettingsOnlyToggle checked={settingsOnly} disabled={!photoSource || pending} needsPhoto={!photoSource && !pending} onChange={setSettingsOnly} />
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <button type="button" aria-label={copy.previousExamples} onClick={() => rail.current?.scrollBy({ left: -440, behavior: "smooth" })}
              className="hidden size-10 shrink-0 items-center justify-center rounded-full border bg-card text-muted-foreground hover:text-primary sm:flex"><ChevronLeft className="size-4" /></button>
            <div ref={rail} data-example-rail role="group" aria-label={copy.selectorLabel} className="flex min-w-0 flex-1 gap-2 overflow-x-auto overscroll-x-contain py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {cases.map((value) => (
                <button key={value.key} type="button" data-example={value.key} data-subject={value.subject}
                  aria-label={copy.chooseLabel.replace("{name}", copy.labels[value.key])} aria-pressed={selected === value.key}
                  disabled={pending} onClick={() => choose(value.key)}
                  className={cn("flex w-40 shrink-0 items-center gap-2 overflow-hidden rounded-xl border p-1 text-left focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50", selected === value.key ? "border-primary bg-accent ring-1 ring-primary/30" : "border-border bg-card hover:border-primary/60")}>
                  <DiptychPhoto src={REAL_RESULT_IMAGES[value.key]} alt={t.home.realResults[value.key].beforeAlt} className="w-9 shrink-0 rounded-lg" />
                  <span className="min-w-0 text-xs font-semibold leading-snug">{copy.labels[value.key]}</span>
                </button>
              ))}
            </div>
            <button type="button" aria-label={copy.nextExamples} onClick={() => rail.current?.scrollBy({ left: 440, behavior: "smooth" })}
              className="hidden size-10 shrink-0 items-center justify-center rounded-full border bg-card text-muted-foreground hover:text-primary sm:flex"><ChevronRight className="size-4" /></button>
          </div>
        </section>
        <UploadDropzone layout="workbench" selectedMode={selectedMode} onModeChange={onModeChange} defaultIntensity={defaultIntensity}
          onPendingChange={onPendingChange} onPhotoChange={setPhotoSource} preserveSettingsOnPhotoChange
          sample={sample} onSampleClear={() => { setSample(undefined); setSelected(undefined); }} />
      </div>
    </section>
    <RealResultsGallery pending={pending} caseKeys={caseKeys} title={galleryTitle} description={galleryDescription} onTry={(key) => {
      choose(key, false);
      rail.current?.querySelector(`[data-example="${key}"]`)?.scrollIntoView({ block: "nearest", inline: "center" });
    }} />
    </>
  );
}
