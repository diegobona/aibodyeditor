import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { siblingTools, toolRoute, type ToolKey } from '@/lib/tools'
import { Section, SectionHeading } from '@/components/page-section'
import { UploadDropzone } from '@/components/home/upload-dropzone'
import { RealResultsGallery } from '@/components/home/real-results-gallery'
import { REAL_RESULT_CASES, REAL_RESULT_IMAGES, type EditorSample } from '@/components/home/showcase-data'
import { editingTopic } from '../../../../config/editing-topics'

type Item = { title: string; description: string }

const linkClass = 'font-semibold text-primary underline underline-offset-4 hover:text-foreground'

/**
 * Shared LAYOUT for tool pages (h1 → What Is → How to → Tips → FAQ → Related Tools).
 * The CONTENT is per page in libs/i18n en.ts `toolPages.<key>` and must be
 * written originally for each page — never reuse paragraphs across tools.
 *
 * Fully server-rendered. The upload widget is the only interactive island and
 * holds no indexable text. Visible breadcrumb mirrors the BreadcrumbList JSON-LD.
 *
 * Images: /examples/<imageSlug>-before.svg and -after.svg (≥300×300, realistic alt).
 */
export function ToolPage({ toolKey, imageSlug }: { toolKey: ToolKey; imageSlug?: string }) {
  const { t, langParam } = useTranslation()
  const common = t.toolPages.common
  const page = t.toolPages[toolKey]
  const topic = editingTopic(toolKey)
  const [sample, setSample] = useState<EditorSample>()
  const [pending, setPending] = useState(false)
  const chooseExample = (key: (typeof REAL_RESULT_CASES)[number]['key']) => {
    if (pending) return
    const recipe = REAL_RESULT_CASES.find(item => item.key === key)!
    const item = t.home.realResults[key]
    setSample({ id: key, src: REAL_RESULT_IMAGES[key], alt: item.beforeAlt, afterAlt: item.afterAlt,
      mode: recipe.mode, intensity: recipe.intensity, instructions: item.instructions })
  }
  const siblings = siblingTools(toolKey)
  const inlineSibling = page.what.sibling as { key: string; before: string; after: string } | undefined
  const inlineSiblingRoute = inlineSibling ? toolRoute(inlineSibling.key) : undefined

  return (
    <div className="bg-background">
      <section id="try" className="scroll-mt-20 pt-8 pb-20 md:pb-24">
        <div className="container flex max-w-6xl flex-col items-center px-4 text-center md:px-6">
          <nav aria-label={common.breadcrumbLabel} className="self-start">
            <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <li>
                <Link to="/{-$lang}" params={{ lang: langParam }} className="hover:text-foreground">
                  {common.homeName}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-4" />
              </li>
              <li aria-current="page" className="font-medium text-foreground">
                {page.breadcrumb}
              </li>
            </ol>
          </nav>
          <h1 className="mt-10 font-display text-6xl font-semibold leading-none tracking-tight text-foreground md:text-8xl">
            {page.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {page.hero.subtitle}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {common.editorIntro}
          </p>
          <UploadDropzone key={toolKey} defaultMode={topic?.mode ?? (toolKey === 'breastExpansion' ? 'breast' : 'slim')}
            defaultIntensity={topic?.intensity}
            defaultInstructions={topic?.instructionCase ? t.home.realResults[topic.instructionCase].instructions : ''}
            sample={sample} onSampleClear={() => setSample(undefined)} onPendingChange={setPending}
            preserveSettingsOnPhotoChange={Boolean(topic)} className="mt-10 w-full max-w-2xl text-left" />
          <p className="mt-5 text-sm text-muted-foreground">{page.hero.note}</p>
        </div>
      </section>

      {topic && <RealResultsGallery caseKeys={topic.cases} title={page.examples.title} description={page.examples.description}
        pending={pending} onTry={chooseExample} />}

      {/* What Is [keyword] */}
      <Section id="what" className="rounded-t-[40px] bg-card">
        <div className={topic ? 'mx-auto max-w-3xl' : 'grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start'}>
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              {page.what.title}
            </h2>
            <div className="mt-8 flex flex-col gap-5 text-[17px] leading-relaxed text-muted-foreground">
              {page.what.paragraphs.map((paragraph: string) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
              <p>
                {page.what.linkBefore}
                <Link to="/{-$lang}" params={{ lang: langParam }} className={linkClass}>
                  {common.homeLinkText}
                </Link>
                {page.what.linkAfter}
              </p>
              {inlineSibling && inlineSiblingRoute && (
                <p>
                  {inlineSibling.before}
                  <Link to={inlineSiblingRoute} params={{ lang: langParam }} className={linkClass}>
                    {t.toolPages[inlineSibling.key].keyword}
                  </Link>
                  {inlineSibling.after}
                </p>
              )}
            </div>
          </div>
          {!topic && <figure className="rounded-3xl bg-background p-3">
            <div className="grid grid-cols-2 gap-2">
              <img
                src={`/examples/${imageSlug}-before.svg`}
                alt={page.what.figure.beforeAlt}
                width={600}
                height={600}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full rounded-2xl object-cover"
              />
              <img
                src={`/examples/${imageSlug}-after.svg`}
                alt={page.what.figure.afterAlt}
                width={600}
                height={600}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full rounded-2xl object-cover"
              />
            </div>
            <figcaption className="px-2 pb-1 pt-3 text-[15px] text-muted-foreground">{page.what.figure.caption}</figcaption>
          </figure>}
        </div>
      </Section>

      {/* How to ... */}
      <Section id="how-to" className="bg-card pt-4">
        <SectionHeading title={page.howTo.title} />
        <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {page.howTo.steps.map((step: Item, index: number) => (
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

      {/* [keyword] Tips */}
      <Section id="tips">
        <SectionHeading title={page.tips.title} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {page.tips.items.map((tip: Item) => (
            <article key={tip.title} className="rounded-3xl bg-card p-7">
              <h3 className="text-xl font-bold text-foreground">{tip.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{tip.description}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* FAQ: same items as the FAQPage JSON-LD */}
      <Section id="faq" className="bg-card">
        <div className="mx-auto max-w-3xl">
          <SectionHeading title={page.faq.title} />
          <div className="flex flex-col gap-3">
            {page.faq.items.map((item: { question: string; answer: string }) => (
              <div key={item.question} className="rounded-3xl bg-background px-6 py-5">
                <h3 className="text-lg font-bold text-foreground">{item.question}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Related Tools: home (anchor "AI body editor") + published siblings (anchor = their keyword) */}
      <Section id="related">
        <SectionHeading title={common.relatedTitle} />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl bg-card p-6">
            <h3 className="text-lg font-bold">
              <Link to="/{-$lang}" params={{ lang: langParam }} className={linkClass}>
                {common.homeLinkText}
              </Link>
            </h3>
            <p className="mt-2 text-[15px] text-muted-foreground">{common.homeLinkDescription}</p>
          </div>
          {siblings.map((tool) => (
            <div key={tool.key} className="rounded-3xl bg-card p-6">
              <h3 className="text-lg font-bold">
                <Link to={tool.to} params={{ lang: langParam }} className={linkClass}>
                  {t.toolPages[tool.key].keyword}
                </Link>
              </h3>
              <p className="mt-2 text-[15px] text-muted-foreground">{t.toolPages[tool.key].related.description}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
