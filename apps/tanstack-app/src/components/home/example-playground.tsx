import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DiptychPhoto } from "@libs/react-shared/components/photo-comparison";
import { cn } from "@libs/ui/utils/cn";
import { useTranslation } from "@/hooks/use-translation";
import type { BodyEditMode } from "../../../../../config/body-editor";
import { UploadDropzone } from "./upload-dropzone";
import { RealResultsGallery } from "./real-results-gallery";
import { SettingsOnlyToggle } from "./settings-only-toggle";
import { REAL_RESULT_CASES, REAL_RESULT_IMAGES, type EditorPhotoSource, type EditorSample } from "./showcase-data";

type ExampleKey = (typeof REAL_RESULT_CASES)[number]["key"];

export function ExamplePlayground({ selectedMode, onModeChange, pending, onPendingChange }: {
  selectedMode: BodyEditMode;
  onModeChange: (mode: BodyEditMode) => void;
  pending: boolean;
  onPendingChange: (pending: boolean) => void;
}) {
  const { t } = useTranslation();
  const copy = t.home.examples;
  const [selected, setSelected] = useState<ExampleKey>();
  const [sample, setSample] = useState<EditorSample>();
  const [photoSource, setPhotoSource] = useState<EditorPhotoSource>(null);
  const [settingsOnly, setSettingsOnly] = useState(false);
  const rail = useRef<HTMLDivElement>(null);

  const choose = (key: ExampleKey) => {
    if (pending) return;
    const chosen = REAL_RESULT_CASES.find((value) => value.key === key)!;
    const details = t.home.realResults[key];
    setSelected(key);
    setSample({ id: key, src: REAL_RESULT_IMAGES[key], alt: details.beforeAlt, afterAlt: details.afterAlt,
      mode: chosen.mode, intensity: chosen.intensity, instructions: details.instructions,
      loadPhoto: !(settingsOnly && photoSource) });
  };

  return (
    <>
    <section id="home-hero" className="pb-10 pt-5 md:pb-14 md:pt-7">
      <div id="try" className="mx-auto w-full max-w-[1600px] scroll-mt-20 px-3 sm:px-6">
        <h1 className="mb-5 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{t.home.hero.title}</h1>
        <section id="samples" aria-labelledby="sample-heading" className="mb-4 min-w-0">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h2 id="sample-heading" className="text-sm font-semibold">{copy.title}</h2>
            <SettingsOnlyToggle checked={settingsOnly} disabled={!photoSource || pending} onChange={setSettingsOnly} />
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <button type="button" aria-label={copy.previousExamples} onClick={() => rail.current?.scrollBy({ left: -440, behavior: "smooth" })}
              className="hidden size-10 shrink-0 items-center justify-center rounded-full border bg-card text-muted-foreground hover:text-primary sm:flex"><ChevronLeft className="size-4" /></button>
            <div ref={rail} role="group" aria-label={copy.selectorLabel} className="flex min-w-0 flex-1 gap-2 overflow-x-auto overscroll-x-contain pb-2">
              {REAL_RESULT_CASES.map((value) => (
                <button key={value.key} type="button" data-example={value.key} data-subject={value.subject}
                  aria-label={copy.chooseLabel.replace("{name}", copy.labels[value.key])} aria-pressed={selected === value.key}
                  disabled={pending} onClick={() => choose(value.key)}
                  className={cn("flex w-40 shrink-0 items-center gap-2 overflow-hidden rounded-2xl border p-1.5 text-left focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50", selected === value.key ? "border-primary bg-accent ring-1 ring-primary/30" : "border-border bg-card hover:border-primary/60")}>
                  <DiptychPhoto src={REAL_RESULT_IMAGES[value.key]} alt={t.home.realResults[value.key].beforeAlt} className="w-11 shrink-0 rounded-xl" />
                  <span className="min-w-0 text-xs font-semibold leading-snug">{copy.labels[value.key]}</span>
                </button>
              ))}
            </div>
            <button type="button" aria-label={copy.nextExamples} onClick={() => rail.current?.scrollBy({ left: 440, behavior: "smooth" })}
              className="hidden size-10 shrink-0 items-center justify-center rounded-full border bg-card text-muted-foreground hover:text-primary sm:flex"><ChevronRight className="size-4" /></button>
          </div>
        </section>
        <UploadDropzone layout="workbench" selectedMode={selectedMode} onModeChange={onModeChange}
          onPendingChange={onPendingChange} onPhotoChange={setPhotoSource} preserveSettingsOnPhotoChange
          sample={sample} onSampleClear={() => { setSample(undefined); setSelected(undefined); }} />
      </div>
    </section>
    <RealResultsGallery pending={pending} settingsOnly={settingsOnly} onSettingsOnlyChange={setSettingsOnly}
      settingsOnlyDisabled={!photoSource || pending} onTry={(key) => {
      choose(key);
      rail.current?.querySelector(`[data-example="${key}"]`)?.scrollIntoView({ block: "nearest", inline: "center" });
    }} />
    </>
  );
}
