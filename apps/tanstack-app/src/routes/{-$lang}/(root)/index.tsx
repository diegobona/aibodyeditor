import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import { Button } from "@libs/react-shared/ui/button";
import {
  DiptychPhoto,
  PhotoComparison,
} from "@libs/react-shared/components/photo-comparison";
import { useTranslation } from "@/hooks/use-translation";
import { routeHead } from "@/lib/seo";
import { toolRoute } from "@/lib/tools";
import { Section, SectionHeading } from "@/components/page-section";
import { formatPrice, getCreditPacks } from "@/lib/public-offer";
import { UploadDropzone } from "@/components/home/upload-dropzone";
import {
  BODY_EDITOR_MODES,
  SHOWCASE_IMAGES,
  type BodyEditorMode,
  type EditorSample,
} from "@/components/home/showcase-data";
import { cn } from "@libs/ui/utils/cn";
import type { BodyEditMode } from "../../../../../../config/body-editor";

/** Photo-led overview. Copy, meaningful image alt and keyword links remain SSR-visible. */
export const Route = createFileRoute("/{-$lang}/(root)/")({
  head: routeHead("home"),
  component: HomePage,
});

type Item = { title: string; description: string };

function HomePage() {
  const { t, langParam } = useTranslation();
  const home = t.home;
  const copy = home.showcase;
  const [mode, setMode] = useState<BodyEditorMode>("slim");
  const [editMode, setEditMode] = useState<BodyEditMode>("slim");
  const [editingPending, setEditingPending] = useState(false);
  const [sample, setSample] = useState<EditorSample>();
  const active = copy.modes[mode];
  const packs = getCreditPacks().filter((pack) => pack.price !== null);

  const previewSample = (
    selected: BodyEditorMode,
    variant: "primary" | "secondary",
  ) => {
    if (editingPending) return;
    setMode(selected);
    setEditMode(selected);
    setSample({
      id: `${selected}-${variant}`,
      mode: selected,
      src: SHOWCASE_IMAGES[selected][variant],
      alt:
        variant === "primary"
          ? copy.modes[selected].beforeAlt
          : copy.modes[selected].secondaryBeforeAlt,
    });
  };

  return (
    <div className="bg-background">
      <section id="home-hero" className="pb-10 pt-5 md:pb-14 md:pt-8">
        <div className="container grid max-w-6xl items-start gap-8 px-4 md:px-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)] lg:gap-12">
          <div id="try" className="w-full scroll-mt-24">
            <h1 className="mb-5 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {home.hero.title}
            </h1>
            <UploadDropzone
              selectedMode={editMode}
              onModeChange={(value) => {
                setEditMode(value);
                if (value !== "breast") setMode(value);
              }}
              onPendingChange={setEditingPending}
              sample={sample}
              onSampleClear={() => setSample(undefined)}
              className="w-full"
            />
          </div>
          <div
            id="hero-showcase"
            className="mx-auto w-full max-w-[410px] lg:mr-0"
          >
            <div className="rounded-[32px] border border-primary/10 bg-card p-3 shadow-[0_20px_70px_-35px_rgb(78_44_132/0.28)] sm:p-4">
              <p className="mb-2 text-center text-[11px] font-semibold text-primary">
                {copy.conceptLabel}
              </p>
              <div
                role="group"
                aria-label={copy.modesLabel}
                className="mb-3 grid grid-cols-3 rounded-full bg-background p-1"
              >
                {BODY_EDITOR_MODES.map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={mode === value}
                    disabled={editingPending}
                    onClick={() => {
                      setMode(value);
                      setEditMode(value);
                    }}
                    className={cn(
                      "min-h-10 rounded-full px-2 text-xs font-semibold transition-colors sm:text-sm",
                      mode === value
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {copy.modes[value].label}
                  </button>
                ))}
              </div>
              <PhotoComparison
                key={mode}
                src={SHOWCASE_IMAGES[mode].primary}
                beforeAlt={active.beforeAlt}
                afterAlt={active.afterAlt}
                beforeLabel={copy.before}
                afterLabel={copy.after}
                controlLabel={copy.compareLabel}
                hint={copy.compareHint}
                eager
              />
            </div>
            <div className="mt-3 text-center" aria-live="polite">
              <div data-mode-caption className="mb-2">
                <p className="text-sm font-semibold text-foreground">
                  {active.title}
                </p>
              </div>
              <p className="mx-auto max-w-sm text-[11px] leading-relaxed text-muted-foreground">
                {copy.conceptNotice}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Section
        id="features"
        className="rounded-t-[36px] bg-card py-14 md:py-20"
      >
        <SectionHeading
          title={home.features.title}
          subtitle={home.features.subtitle}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {BODY_EDITOR_MODES.map((value) => {
            const item = copy.modes[value];
            return (
              <article
                key={value}
                data-showcase-mode={value}
                className="overflow-hidden rounded-[28px] bg-background"
              >
                <div className="grid grid-cols-2 gap-px">
                  <DiptychPhoto
                    src={SHOWCASE_IMAGES[value].primary}
                    alt={item.beforeAlt}
                  />
                  <DiptychPhoto
                    src={SHOWCASE_IMAGES[value].primary}
                    side="after"
                    alt={item.afterAlt}
                  />
                </div>
                <div className="flex justify-between px-5 pt-3 text-[11px] font-medium text-muted-foreground">
                  <span>{copy.before}</span>
                  <span>{copy.after}</span>
                </div>
                <div className="p-5 pt-4">
                  <h3 className="font-display text-2xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <a
                    href="#try"
                    onClick={() => previewSample(value, "primary")}
                    className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-4"
                  >
                    {item.cta}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
          {copy.conceptNotice}
        </p>
      </Section>

      <Section id="samples" className="py-10 md:py-12">
        <SectionHeading title={copy.sampleLabel} />
        <div className="grid max-w-sm grid-cols-3 gap-3">
          {BODY_EDITOR_MODES.map((value) => (
            <a
              key={value}
              href="#try"
              aria-label={copy.modes[value].cta}
              aria-current={
                sample?.id === `${value}-primary` ? "true" : undefined
              }
              onClick={() => previewSample(value, "primary")}
              className={cn(
                "block overflow-hidden rounded-xl border border-border text-left transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-ring",
                sample?.id === `${value}-primary` &&
                  "border-primary ring-2 ring-primary/20",
              )}
            >
              <DiptychPhoto
                src={SHOWCASE_IMAGES[value].primary}
                alt={copy.modes[value].beforeAlt}
              />
              <span className="flex min-h-10 items-center justify-center px-1 text-xs font-semibold text-foreground">
                {copy.modes[value].label}
              </span>
            </a>
          ))}
        </div>
        <p className="mt-3 max-w-sm text-xs leading-relaxed text-muted-foreground">
          {copy.sampleNotice}
        </p>
      </Section>

      <Section id="examples" className="bg-card py-14 md:py-20">
        <SectionHeading
          title={copy.examplesTitle}
          subtitle={copy.examplesSubtitle}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {BODY_EDITOR_MODES.map((value) => (
            <figure key={value} data-secondary-mode={value}>
              <PhotoComparison
                src={SHOWCASE_IMAGES[value].secondary}
                beforeAlt={copy.modes[value].secondaryBeforeAlt}
                afterAlt={copy.modes[value].secondaryAfterAlt}
                beforeLabel={copy.before}
                afterLabel={copy.after}
                controlLabel={`${copy.modes[value].label}: ${copy.compareLabel}`}
                hint={copy.compareHint}
              />
              <figcaption className="mt-4 flex items-center justify-between gap-3">
                <span className="font-display text-xl font-semibold text-foreground">
                  {copy.modes[value].title}
                </span>
                <a
                  href="#try"
                  onClick={() => previewSample(value, "secondary")}
                  className="inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-primary hover:underline underline-offset-4"
                >
                  {copy.modes[value].cta}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          {copy.conceptNotice}
        </p>
      </Section>

      <Section id="details" className="py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading
              title={copy.detailTitle}
              subtitle={copy.detailSubtitle}
            />
            <div className="flex flex-wrap gap-2">
              {[copy.detailFace, copy.detailClothes, copy.detailBackground].map(
                (label: string) => (
                  <span
                    key={label}
                    className="rounded-full bg-accent px-3 py-2 text-xs font-semibold text-foreground"
                  >
                    {label}
                  </span>
                ),
              )}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {copy.detailNotice}
            </p>
          </div>
          <div className="grid items-start gap-5 sm:grid-cols-2">
            {(["slim", "muscle"] as const).map((value) => (
              <figure
                key={value}
                className="overflow-hidden rounded-[24px] bg-card"
              >
                <div className="grid grid-cols-2 gap-px overflow-hidden">
                  {(["before", "after"] as const).map((side) => (
                    <div
                      key={side}
                      className="relative aspect-[3/4] overflow-hidden"
                    >
                      <div
                        className="absolute inset-0 scale-[2.3]"
                        style={{
                          transformOrigin:
                            value === "slim" ? "50% 12%" : "50% 20%",
                        }}
                      >
                        <DiptychPhoto
                          src={SHOWCASE_IMAGES[value].primary}
                          side={side}
                          alt={
                            side === "before"
                              ? copy.modes[value].beforeAlt
                              : copy.modes[value].afterAlt
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <figcaption className="flex justify-between px-3 py-3 text-[11px] text-muted-foreground">
                  <span>{copy.before}</span>
                  <span>{copy.after}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Section>

      <Section id="how-it-works" className="bg-card py-14 md:py-20">
        <SectionHeading title={home.howItWorks.title} />
        <ol className="grid gap-6 md:grid-cols-3">
          {home.howItWorks.steps.map((step: Item, index: number) => (
            <li key={step.title} className="border-t border-primary/20 pt-5">
              <span
                className="font-display text-3xl font-semibold text-primary"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-12 grid gap-7 border-t border-border pt-8 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {copy.preparation.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {copy.preparation.description}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {copy.preparation.linkBefore}
              <Link
                to="/{-$lang}/body-editor"
                params={{ lang: langParam }}
                className="font-semibold text-primary underline underline-offset-4"
              >
                {copy.preparation.linkText}
              </Link>
              {copy.preparation.linkAfter}
            </p>
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
              {copy.privacy.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {copy.privacy.description}
            </p>
          </div>
        </div>
      </Section>

      <Section id="pricing" className="py-12 md:py-16">
        <div className="flex flex-col justify-between gap-5 rounded-[28px] border border-border bg-card px-6 py-7 md:flex-row md:items-center md:px-8">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-semibold text-foreground">
              {home.pricing.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {copy.pricingNote}
            </p>
          </div>
          <Button asChild className="h-12 shrink-0 rounded-full px-6">
            <a href="#try">{copy.heroCta}</a>
          </Button>
        </div>
        {packs.length > 0 && (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {packs.map((pack) => (
              <div
                key={pack.key}
                className="rounded-2xl border border-border p-6"
              >
                <h3 className="text-lg font-semibold">
                  {home.pricing.packs[pack.key as "starter" | "pro"]}
                </h3>
                <p className="mt-2 font-display text-3xl">
                  {formatPrice(pack.price!, pack.currency)}
                </p>
                {pack.credits !== null && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {home.pricing.credits.replace(
                      "{credits}",
                      String(pack.credits),
                    )}
                  </p>
                )}
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="size-4" aria-hidden="true" />
                  {home.pricing.neverExpire}
                </p>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section id="faq" className="bg-card py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <SectionHeading title={home.faq.title} />
          <div className="divide-y divide-border">
            {home.faq.items.map(
              (item: { question: string; answer: string }) => (
                <details key={item.question} className="group py-5">
                  <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-5 text-base font-semibold text-foreground">
                    <h3>{item.question}</h3>
                    <span
                      aria-hidden="true"
                      className="text-xl text-primary group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 pr-6 text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </details>
              ),
            )}
          </div>
        </div>
      </Section>

      <Section id="tools" className="py-14 md:py-20">
        <SectionHeading title={home.tools.title} />
        <div className="grid gap-5 md:grid-cols-3">
          {home.tools.items.map((item: Item & { key: string }) => {
            const to = toolRoute(item.key);
            if (!to) return null;
            return (
              <article key={item.key} className="border-t border-border pt-5">
                <h3 className="text-lg font-semibold">
                  <Link
                    to={to}
                    params={{ lang: langParam }}
                    className="text-primary underline underline-offset-4 hover:text-foreground"
                  >
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
        <div className="mt-14 rounded-[32px] bg-accent px-6 py-9 text-center md:mt-20 md:px-10 md:py-12">
          <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
            {copy.closingTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            {copy.closingDescription}
          </p>
          <Button asChild size="lg" className="mt-6 h-12 rounded-full px-7">
            <a href="#try">
              {copy.heroCta}
              <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </Section>
    </div>
  );
}
