import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import { Button } from "@libs/react-shared/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { routeHead } from "@/lib/seo";
import { toolRoute } from "@/lib/tools";
import { Section, SectionHeading } from "@/components/page-section";
import { formatPrice, getCreditPacks } from "@/lib/public-offer";
import { ExamplePlayground } from "@/components/home/example-playground";
import { BODY_EDIT_MODES, type BodyEditMode } from "../../../../../../config/body-editor";

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
  const [editMode, setEditMode] = useState<BodyEditMode>("slim");
  const [editingPending, setEditingPending] = useState(false);
  const packs = getCreditPacks().filter((pack) => pack.price !== null);

  return (
    <div className="bg-background">
      <ExamplePlayground selectedMode={editMode} onModeChange={setEditMode} pending={editingPending} onPendingChange={setEditingPending} />

      <Section
        id="features"
        className="rounded-t-[36px] bg-card py-14 md:py-20"
      >
        <SectionHeading
          title={home.features.title}
          subtitle={home.features.subtitle}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BODY_EDIT_MODES.map((value) => {
            const label = home.upload.modes[value];
            return (
              <article
                key={value}
                data-showcase-mode={value}
                className="overflow-hidden rounded-[28px] bg-background"
              >
                <div className="flex h-full flex-col p-5">
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {home.modeGuide.descriptions[value]}
                  </p>
                  <a
                    href="#try"
                    aria-disabled={editingPending}
                    onClick={(event) => {
                      if (editingPending) { event.preventDefault(); return; }
                      setEditMode(value);
                    }}
                    className="mt-auto inline-flex min-h-10 items-center gap-2 pt-4 text-sm font-semibold text-primary hover:underline underline-offset-4"
                  >
                    {home.modeGuide.cta.replace("{mode}", label)}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      <Section id="details" className="py-14 md:py-20">
        <SectionHeading title={copy.detailTitle} subtitle={copy.detailSubtitle} />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { title: copy.detailFace, description: copy.detailFaceHint },
            { title: copy.detailClothes, description: copy.detailClothesHint },
            { title: copy.detailBackground, description: copy.detailBackgroundHint },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">{copy.detailNotice}</p>
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
