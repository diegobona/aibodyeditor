import { useState } from "react";
import { Button } from "@libs/react-shared/ui/button";
import { PhotoComparison } from "@libs/react-shared/components/photo-comparison";
import { Section, SectionHeading } from "@/components/page-section";
import { useTranslation } from "@/hooks/use-translation";
import { REAL_RESULT_CASES, REAL_RESULT_IMAGES } from "./showcase-data";

/** All case copy is server rendered; expanding the gallery never submits an edit. */
export function RealResultsGallery() {
  const { t } = useTranslation();
  const home = t.home;
  const copy = home.realResults;
  const [expanded, setExpanded] = useState(false);
  const coverage = copy.coverage
    .replace("{cases}", String(REAL_RESULT_CASES.length))
    .replace("{people}", String(new Set(REAL_RESULT_CASES.map((item) => item.subject)).size))
    .replace("{modes}", String(new Set(REAL_RESULT_CASES.map((item) => item.mode)).size));

  const card = ({ key, mode, intensity, subject }: (typeof REAL_RESULT_CASES)[number]) => {
    const item = copy[key];
    return (
      <article key={key} data-real-result={key} data-result-mode={mode} data-subject={subject} className="mx-auto w-full max-w-sm">
        <PhotoComparison
          src={REAL_RESULT_IMAGES[key]}
          beforeAlt={item.beforeAlt}
          afterAlt={item.afterAlt}
          beforeLabel={copy.before}
          afterLabel={copy.after}
          controlLabel={copy.compareLabel}
          hint={home.showcase.compareHint}
        />
        <p className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-primary">
          <span className="rounded-full bg-accent px-3 py-1">{home.upload.modes[mode]}</span>
          <span className="rounded-full bg-background px-3 py-1">{copy.intensity.replace("{value}", String(intensity))}</span>
        </p>
        <h3 className="mt-3 font-display text-xl font-semibold">{item.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        {item.instructions && (
          <p className="mt-3 border-l-2 border-primary/25 pl-3 text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold">{copy.requestLabel} </span>{item.instructions}
          </p>
        )}
      </article>
    );
  };

  return (
    <Section id="real-results" className="bg-card py-12 md:py-16">
      <SectionHeading title={copy.title} subtitle={copy.description} />
      <p className="mb-6 text-center text-sm font-medium text-primary">{coverage}</p>
      <div className="grid items-start gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {REAL_RESULT_CASES.slice(0, 6).map(card)}
      </div>
      <div className="my-8 text-center">
        <Button type="button" variant="outline" className="min-h-11 rounded-full px-6" aria-expanded={expanded} aria-controls="more-real-results" onClick={() => setExpanded((value) => !value)}>
          {expanded ? copy.showLess : copy.showMore}
        </Button>
      </div>
      <div id="more-real-results" hidden={!expanded}>
        <div className="grid items-start gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {REAL_RESULT_CASES.slice(6).map(card)}
        </div>
      </div>
    </Section>
  );
}
