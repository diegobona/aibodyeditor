import { createFileRoute, Link } from '@tanstack/react-router'
import { Check, Star } from 'lucide-react'
import { Button } from '@libs/react-shared/ui/button'
import { useTranslation } from '@/hooks/use-translation'
import { routeHead } from '@/lib/seo'
import { featureToolRoute, toolRoute } from '@/lib/tools'
import { Section, SectionHeading } from '@/components/page-section'
import { AGGREGATE_RATING, formatPrice, getCreditPacks } from '@/lib/public-offer'
import { UploadDropzone } from '@/components/home/upload-dropzone'

/**
 * Homepage — core keyword: "ai body editor".
 *
 * SEO contract (see /seo-checklist.md):
 * - exactly one <h1> ("AI Body Editor"); everything else is h2 > h3 > p
 * - all copy, links and image alt are server-rendered (only the upload
 *   widget is interactive and it carries no indexable text)
 * - internal links use <Link> (real <a href>) with keyword anchor text
 * - prices come from lib/public-offer, the same source as the JSON-LD Offer
 */
export const Route = createFileRoute('/{-$lang}/(root)/')({
  head: routeHead('home'),
  component: HomePage,
})

type Item = { title: string; description: string }

function RatingSummary() {
  const { t } = useTranslation()
  if (AGGREGATE_RATING) {
    const { ratingValue, ratingCount, sourceName } = AGGREGATE_RATING
    return (
      <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
        <span>
          {ratingValue.toFixed(1)} / 5 · {ratingCount} · {sourceName}
        </span>
      </p>
    )
  }
  // Reserved slot: visible only in development, never shipped as fake social proof.
  if (!import.meta.env.DEV) return null
  return (
    <p className="mx-auto max-w-md rounded-xl border border-dashed border-input px-4 py-2 text-xs text-muted-foreground">
      {t.home.rating.placeholder}
    </p>
  )
}

function HomePage() {
  const { t, langParam } = useTranslation()
  const home = t.home
  const packs = getCreditPacks()

  return (
    <div className="bg-background">
      {/* Hero: h1 + upload first */}
      <section id="try" className="scroll-mt-20 pt-12 pb-20 md:pt-16 md:pb-24">
        <div className="container flex max-w-6xl flex-col items-center px-4 text-center md:px-6">
          <p className="rounded-full bg-card px-4 py-2 text-sm font-semibold text-primary shadow-[0_1px_2px_rgb(30_26_46/0.08)]">
            {home.hero.badge}
          </p>
          <h1 className="mt-6 font-display text-6xl font-semibold leading-none tracking-tight text-foreground md:text-8xl">
            {home.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {home.hero.subtitle}
          </p>
          <UploadDropzone className="mt-10 w-full max-w-2xl text-left" />
          <p className="mt-5 text-sm text-muted-foreground">{home.hero.note}</p>
          <div className="mt-4">
            <RatingSummary />
          </div>
        </div>
      </section>

      {/* What You Can Do */}
      <Section id="features" className="rounded-t-[40px] bg-card">
        <SectionHeading title={home.features.title} subtitle={home.features.subtitle} />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {home.features.items.map(
            (item: Item & { key: string; linkBefore?: string; linkText?: string; linkAfter?: string }) => {
              // In-text link only when the target tool page is published (lib/tools.ts).
              const to = featureToolRoute(item.key)
              return (
                <article key={item.key} className="rounded-3xl bg-background p-7">
                  <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{item.description}</p>
                  {to && item.linkText && (
                    <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                      {item.linkBefore}
                      <Link
                        to={to}
                        params={{ lang: langParam }}
                        className="font-semibold text-primary underline underline-offset-4 hover:text-foreground"
                      >
                        {item.linkText}
                      </Link>
                      {item.linkAfter}
                    </p>
                  )}
                </article>
              )
            },
          )}
        </div>
      </Section>

      {/* How It Works */}
      <Section id="how-it-works" className="bg-card pt-4">
        <SectionHeading title={home.howItWorks.title} />
        <ol className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {home.howItWorks.steps.map((step: Item, index: number) => (
            <li key={step.title} className="rounded-3xl border border-border p-7">
              <span className="font-display text-4xl font-semibold text-primary" aria-hidden="true">
                {index + 1}
              </span>
              <h3 className="mt-2 text-xl font-bold text-foreground">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* See It in Action */}
      <Section id="examples">
        <SectionHeading title={home.action.title} subtitle={home.action.subtitle} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {home.action.items.map(
            (item: { key: string; beforeAlt: string; afterAlt: string; caption: string }) => (
              <figure key={item.key} className="rounded-3xl bg-card p-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <img
                      src={`/examples/${item.key}-before.svg`}
                      alt={item.beforeAlt}
                      width={600}
                      height={600}
                      loading="lazy"
                      decoding="async"
                      className="aspect-square w-full rounded-2xl object-cover"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-card px-2.5 py-1 text-xs font-semibold text-foreground">
                      {home.action.before}
                    </span>
                  </div>
                  <div className="relative">
                    <img
                      src={`/examples/${item.key}-after.svg`}
                      alt={item.afterAlt}
                      width={600}
                      height={600}
                      loading="lazy"
                      decoding="async"
                      className="aspect-square w-full rounded-2xl object-cover"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                      {home.action.after}
                    </span>
                  </div>
                </div>
                <figcaption className="px-2 pb-1 pt-3 text-[15px] text-muted-foreground">{item.caption}</figcaption>
              </figure>
            ),
          )}
        </div>
      </Section>

      {/* Why aibodyeditor.net */}
      <Section id="why" className="bg-[#1E1A2E] text-white">
        <h2 className="mb-12 font-display text-4xl font-semibold tracking-tight md:text-5xl">{home.why.title}</h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {home.why.items.map((item: Item) => (
            <div key={item.title}>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#CFC9E0]">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Pricing: same numbers as the JSON-LD Offer */}
      <Section id="pricing">
        <SectionHeading title={home.pricing.title} subtitle={home.pricing.subtitle} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="flex flex-col rounded-3xl bg-card p-7">
            <h3 className="text-xl font-bold text-foreground">{home.pricing.free.name}</h3>
            <p className="mt-4 font-display text-4xl font-semibold text-foreground">{formatPrice(0, 'USD')}</p>
            <p className="mt-2 text-[15px] text-muted-foreground">{home.pricing.free.detail}</p>
            <div className="mt-auto pt-8">
              <Button asChild size="lg" className="h-12 w-full rounded-full">
                <a href="#try">{home.pricing.ctaFree}</a>
              </Button>
            </div>
          </div>
          {packs.map((pack) => (
            <div key={pack.key} className="flex flex-col rounded-3xl bg-card p-7">
              <h3 className="text-xl font-bold text-foreground">
                {home.pricing.packs[pack.key as 'starter' | 'pro']}
              </h3>
              <p className="mt-4 font-display text-4xl font-semibold text-foreground">
                {pack.price !== null ? formatPrice(pack.price, pack.currency) : home.pricing.comingSoon}
              </p>
              {pack.credits !== null && (
                <p className="mt-2 text-[15px] text-muted-foreground">
                  {home.pricing.credits.replace('{credits}', String(pack.credits))}
                </p>
              )}
              <p className="mt-2 flex items-center gap-2 text-[15px] text-muted-foreground">
                <Check className="size-4 text-primary" aria-hidden="true" />
                {home.pricing.neverExpire}
              </p>
              <div className="mt-auto pt-8">
                <Button asChild size="lg" variant="outline" className="h-12 w-full rounded-full">
                  <Link to="/{-$lang}/signup" params={{ lang: langParam }}>
                    {home.pricing.ctaPack}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ: text is identical to the FAQPage JSON-LD (same i18n source) */}
      <Section id="faq" className="bg-card">
        <div className="mx-auto max-w-3xl">
          <SectionHeading title={home.faq.title} />
          <div className="flex flex-col gap-3">
            {home.faq.items.map((item: { question: string; answer: string }) => (
              <div key={item.question} className="rounded-3xl bg-background px-6 py-5">
                <h3 className="text-lg font-bold text-foreground">{item.question}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* More AI Photo Tools: keyword anchors to tool pages */}
      <Section id="tools">
        <SectionHeading title={home.tools.title} />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {home.tools.items.map((item: Item & { key: string }) => {
            // Only published tools are listed; unbuilt ones never get a link.
            const to = toolRoute(item.key)
            if (!to) return null
            return (
              <div key={item.key} className="rounded-3xl bg-card p-6">
                <h3 className="text-lg font-bold">
                  <Link
                    to={to}
                    params={{ lang: langParam }}
                    className="text-primary underline underline-offset-4 hover:text-foreground"
                  >
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-2 text-[15px] text-muted-foreground">{item.description}</p>
              </div>
            )
          })}
        </div>
      </Section>
    </div>
  )
}
