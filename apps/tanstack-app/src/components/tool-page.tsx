import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { siblingTools, toolRoute, type ToolKey } from '@/lib/tools'
import { Section, SectionHeading } from '@/components/page-section'
import { ExamplePlayground } from '@/components/home/example-playground'
import type { BodyEditMode } from '../../../../config/body-editor'
import { editingTopic } from '../../../../config/editing-topics'

type Item = { title: string; description: string }

const linkClass = 'font-semibold text-primary underline underline-offset-4 hover:text-foreground'

/**
 * Topic-filtered homepage workbench followed by original topic guidance.
 * The CONTENT is per page in libs/i18n en.ts `toolPages.<key>` and must be
 * written originally for each page — never reuse paragraphs across tools.
 *
 * Fully server-rendered. The upload widget is the only interactive island and
 * holds no indexable text. Visible breadcrumb mirrors the BreadcrumbList JSON-LD.
 *
 * Real case images and editor actions come from the same homepage components.
 */
export function ToolPage({ toolKey }: { toolKey: ToolKey }) {
  const { t, langParam } = useTranslation()
  const common = t.toolPages.common
  const page = t.toolPages[toolKey]
  const topic = editingTopic(toolKey)
  const defaultMode = topic?.mode ?? 'slim'
  const [mode, setMode] = useState<BodyEditMode>(defaultMode)
  const [pending, setPending] = useState(false)
  useEffect(() => { setMode(defaultMode); setPending(false) }, [toolKey, defaultMode])
  const siblings = siblingTools(toolKey)
  const inlineSibling = page.what.sibling as { key: string; before: string; after: string } | undefined
  const inlineSiblingRoute = inlineSibling ? toolRoute(inlineSibling.key) : undefined

  return (
    <div className="bg-background">
      <ExamplePlayground key={toolKey} title={page.hero.title} caseKeys={topic?.cases}
        defaultIntensity={topic?.intensity}
        selectedMode={mode} onModeChange={setMode} pending={pending} onPendingChange={setPending}
        galleryTitle={page.examples?.title} galleryDescription={page.examples?.description}
        breadcrumb={<nav aria-label={common.breadcrumbLabel} className="mb-2 text-xs text-muted-foreground">
          <ol className="flex items-center gap-1.5">
            <li><Link to="/{-$lang}" params={{ lang: langParam }} className="hover:text-foreground">{common.homeName}</Link></li>
            <li aria-hidden="true"><ChevronRight className="size-3" /></li>
            <li aria-current="page">{page.breadcrumb}</li>
          </ol>
        </nav>} />

      {/* What Is [keyword] */}
      <Section id="what" className="rounded-t-[40px] bg-card">
        <div className="max-w-5xl">
            <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              {page.what.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{page.hero.subtitle}</p>
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
        <div className="max-w-5xl">
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
