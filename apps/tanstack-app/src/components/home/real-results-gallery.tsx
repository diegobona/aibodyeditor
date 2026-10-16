import { ArrowUpRight } from "lucide-react";
import { PhotoComparison } from "@libs/react-shared/components/photo-comparison";
import { useTranslation } from "@/hooks/use-translation";
import { Section } from "@/components/page-section";
import { REAL_RESULT_CASES, REAL_RESULT_IMAGES } from "./showcase-data";
import { SettingsOnlyToggle } from "./settings-only-toggle";

type ExampleKey = (typeof REAL_RESULT_CASES)[number]["key"];

/** Browsable proof of each recipe; Try uses the same selection flow as the top strip. */
export function RealResultsGallery({ onTry, pending, settingsOnly, settingsOnlyDisabled, onSettingsOnlyChange }: {
  onTry: (key: ExampleKey) => void;
  pending: boolean;
  settingsOnly: boolean;
  settingsOnlyDisabled: boolean;
  onSettingsOnlyChange: (checked: boolean) => void;
}) {
  const { t } = useTranslation();
  const copy = t.home.realResults;

  return (
    <Section id="real-results" className="bg-card py-12 md:py-16">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4 md:mb-10">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">{copy.title}</h2>
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{copy.description}</p>
        </div>
        <SettingsOnlyToggle checked={settingsOnly} disabled={settingsOnlyDisabled} onChange={onSettingsOnlyChange} />
      </div>
      <div data-results-grid className="grid gap-x-5 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
        {REAL_RESULT_CASES.map(({ key, mode, intensity, subject }) => {
          const item = copy[key];
          return (
            <article key={key} data-real-result={key} data-result-subject={subject} className="flex min-w-0 flex-col">
              <PhotoComparison src={REAL_RESULT_IMAGES[key]} beforeAlt={item.beforeAlt} afterAlt={item.afterAlt}
                beforeLabel={copy.before} afterLabel={copy.after} controlLabel={copy.compareLabel}
                hint={t.home.showcase.compareHint} />
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-primary">
                <span className="rounded-full bg-accent px-3 py-1.5">{t.home.upload.modes[mode]}</span>
                <span className="rounded-full bg-background px-3 py-1.5">{copy.intensity.replace("{value}", String(intensity))}</span>
              </div>
              <h3 className="mt-3 font-display text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              {item.instructions && <p className="mt-3 border-l-2 border-primary/25 pl-3 text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold">{copy.requestLabel} </span>{item.instructions}
              </p>}
              <div className="mt-auto pt-4">
                <a href="#try" data-try-example={key} aria-label={copy.tryLabel.replace("{name}", t.home.examples.labels[key])}
                  aria-disabled={pending} onClick={(event) => {
                    if (pending) { event.preventDefault(); return; }
                    onTry(key);
                  }}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/25 px-4 text-sm font-semibold text-primary transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-disabled:opacity-50">
                  {copy.try}<ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
