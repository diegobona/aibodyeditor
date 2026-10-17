/**
 * Single source of truth for page SEO: title, description, canonical, hreflang,
 * Open Graph / Twitter and JSON-LD.
 *
 * Every route's `head` must come from `seo(pageId, { lang })`. Do not hand-write
 * <title>/<meta>/<link rel=canonical> in routes.
 *
 * Rules enforced here (see /seo-checklist.md):
 * - Canonical origin is always https://aibodyeditor.net (no www, https only).
 * - Canonical has no trailing slash and no query string / hash.
 * - Default locale (en) has no URL prefix; other locales use /<lang>/.
 * - No `<meta name="keywords">`. Ever.
 * - Non-indexable pages get `robots: noindex, nofollow` and no hreflang.
 */
import { config } from '@config'
import {
  defaultLocale,
  locales,
  translations,
  isValidLocale,
  type SupportedLocale,
  type Translations,
} from '@libs/i18n'
import { localizedPath } from '@/lib/i18n-path'
import { AGGREGATE_RATING, getCreditPacks } from '@/lib/public-offer'

export const SITE_URL = 'https://aibodyeditor.net'
export const SITE_NAME = config.app.name
export const DEFAULT_OG_IMAGE = `${SITE_URL}/android-chrome-512x512.png`

const OG_LOCALES: Record<string, string> = {
  en: 'en_US',
  de: 'de_DE',
  es: 'es_ES',
  fr: 'fr_FR',
  it: 'it_IT',
  pt: 'pt_BR',
}

type JsonLd = Record<string, unknown>

interface PageContext {
  t: Translations
  lang: string
  url: string
}

interface PageDefinition {
  /** Path in the default locale, e.g. '/' or '/slim-body-editor'. */
  path: string
  /** false => noindex,nofollow + excluded from hreflang. (Sitemap is a separate whitelist.) */
  indexable: boolean
  /** For noindex pages: still let crawlers follow links (e.g. tool stubs linking back home). */
  follow?: boolean
  meta: (t: Translations) => { title: string; description: string }
  jsonLd?: (ctx: PageContext) => JsonLd[]
}

/**
 * One SoftwareApplication shared by the homepage and topic guides. Offers
 * describe configured credit packs only; a planned free edit is not an offer.
 * aggregateRating is only emitted when AGGREGATE_RATING holds real data.
 */
function softwareApplicationJsonLd(
  t: Translations,
  url: string,
): JsonLd {
  const offers: JsonLd[] = []
  for (const pack of getCreditPacks()) {
    if (pack.price === null) continue
    offers.push({
      '@type': 'Offer',
      name: t.home.pricing.packs[pack.key],
      description: pack.credits !== null ? t.home.pricing.credits.replace('{credits}', String(pack.credits)) : undefined,
      price: pack.price.toFixed(2),
      priceCurrency: pack.currency,
      url,
    })
  }

  const data: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${SITE_URL}#editor`,
    name: SITE_NAME,
    url,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    description: t.home.metadata.description,
  }
  if (offers.length) data.offers = offers
  if (AGGREGATE_RATING) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: AGGREGATE_RATING.ratingValue,
      ratingCount: AGGREGATE_RATING.ratingCount,
      bestRating: AGGREGATE_RATING.bestRating,
    }
  }
  return data
}

/** BreadcrumbList; must mirror the visible breadcrumb on the page. */
function breadcrumbJsonLd(items: Array<{ name: string; url: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

type ToolPageKey = 'bodyEditor' | 'skinnyFilter' | 'breastExpansion'

/** Each topic page describes the same app and retains its own FAQ and breadcrumb. */
function toolPageJsonLd(key: ToolPageKey) {
  return ({ t, lang, url }: PageContext): JsonLd[] => {
    const page = t.toolPages[key]
    return [
      softwareApplicationJsonLd(t, canonicalUrl('/', lang)),
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: page.hero.title,
        description: page.metadata.description,
        url,
        about: { '@id': `${SITE_URL}#editor` },
      },
      faqPageJsonLd(page.faq.items),
      breadcrumbJsonLd([
        { name: t.toolPages.common.homeName, url: canonicalUrl('/', lang) },
        { name: page.breadcrumb, url },
      ]),
    ]
  }
}

/** FAQPage from the exact Q&A items rendered on the page. */
function faqPageJsonLd(items: Array<{ question: string; answer: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

/**
 * Page registry. Add one entry per new route, then wire the route's `head` to
 * `seo('<id>', { lang: params.lang })`. Indexable pages must ALSO be added to
 * the sitemap whitelist in `src/lib/sitemap.ts`.
 */
const PAGES = {
  home: {
    path: '/',
    indexable: true,
    meta: (t) => t.home.metadata,
    jsonLd: ({ t, url }) => [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url,
        inLanguage: 'en',
        description: t.home.metadata.description,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/android-chrome-512x512.png`,
      },
      softwareApplicationJsonLd(t, url),
      faqPageJsonLd(t.home.faq.items),
    ],
  },
  bodyEditor: {
    path: '/body-editor',
    indexable: true,
    meta: (t) => t.toolPages.bodyEditor.metadata,
    jsonLd: toolPageJsonLd('bodyEditor'),
  },
  skinnyFilter: {
    path: '/skinny-filter',
    indexable: true,
    meta: (t) => t.toolPages.skinnyFilter.metadata,
    jsonLd: toolPageJsonLd('skinnyFilter'),
  },
  breastExpansion: {
    path: '/breast-expansion',
    indexable: true,
    meta: (t) => t.toolPages.breastExpansion.metadata,
    jsonLd: toolPageJsonLd('breastExpansion'),
  },
  signin: { path: '/signin', indexable: false, meta: (t) => t.auth.metadata.signin },
  signup: { path: '/signup', indexable: false, meta: (t) => t.auth.metadata.signup },
  forgotPassword: { path: '/forgot-password', indexable: false, meta: (t) => t.auth.metadata.forgotPassword },
  resetPassword: { path: '/reset-password', indexable: false, meta: (t) => t.auth.metadata.resetPassword },
  paymentSuccess: { path: '/payment-success', indexable: false, meta: (t) => t.payment.metadata.success },
  paymentCancel: { path: '/payment-cancel', indexable: false, meta: (t) => t.payment.metadata.cancel },
  dashboard: { path: '/dashboard', indexable: false, meta: (t) => t.dashboard.metadata },
  myWorks: { path: '/my-works', indexable: false, meta: (t) => t.myWorks.metadata },
  admin: { path: '/admin', indexable: false, meta: (t) => t.admin.metadata },
  notFound: { path: '/404', indexable: false, meta: (t) => t.notFound.metadata },
} satisfies Record<string, PageDefinition>

export type PageId = keyof typeof PAGES

export interface SeoOptions {
  /** The route's `{-$lang}` param (undefined = default locale). */
  lang?: string
  /** Override the registry path (for dynamic routes, e.g. `/blog/my-post`). */
  path?: string
  title?: string
  description?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  /** Extra JSON-LD blocks appended to the page's defaults. */
  jsonLd?: JsonLd[]
}

type MetaTag =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }

export interface SeoHead {
  meta: MetaTag[]
  links: Array<{ rel: string; href: string; hrefLang?: string }>
  scripts: Array<{ type: string; children: string }>
}

type HeadMatch = { globalNotFound?: boolean; status?: string }

/**
 * Route `head` factory — use this in every route instead of calling seo() directly:
 *   head: routeHead('bodyEditor')
 *
 * When the request ends in a 404 (e.g. `/body-editor/extra` fuzzy-matches the
 * /body-editor route), the matched page must NOT emit its own title/canonical/
 * index robots. The NotFound component then supplies a noindex title instead.
 */
export function routeHead(page: PageId, options: Omit<SeoOptions, 'lang'> = {}) {
  return ({ params, matches }: { params: { lang?: string }; matches: HeadMatch[] }) => {
    if (matches.some((m) => m.globalNotFound || m.status === 'notFound')) {
      return { meta: [], links: [], scripts: [] }
    }
    return seo(page, { ...options, lang: params.lang })
  }
}

/** Translations for a `{-$lang}` param (used in `head()`, outside React). */
export function getTranslations(lang?: string): Translations {
  const locale = (lang && isValidLocale(lang) ? lang : defaultLocale) as SupportedLocale
  return translations[locale] as Translations
}

/**
 * Normalize a path for canonical use: drop query/hash, collapse slashes,
 * strip trailing slash (root stays '/').
 */
export function normalizePath(path: string): string {
  const clean = path.split(/[?#]/)[0].replace(/\/{2,}/g, '/')
  const withLead = clean.startsWith('/') ? clean : `/${clean}`
  return withLead.length > 1 ? withLead.replace(/\/+$/, '') : '/'
}

/**
 * Absolute canonical URL. Root is `https://aibodyeditor.net` (no trailing slash).
 */
export function canonicalUrl(path: string, lang: string = defaultLocale): string {
  const localized = normalizePath(localizedPath(normalizePath(path), lang))
  return localized === '/' ? SITE_URL : `${SITE_URL}${localized}`
}

function serializeJsonLd(data: JsonLd): string {
  // Escape `<` so content can never close the <script> tag.
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/**
 * Build a TanStack Router `head()` return value for a page.
 *
 * @example
 * export const Route = createFileRoute('/{-$lang}/(root)/')({
 *   head: ({ params }) => seo('home', { lang: params.lang }),
 * })
 */
export function seo(page: PageId, options: SeoOptions = {}): SeoHead {
  // A lang segment that is unknown (or the unprefixed default, e.g. `/en/x`) never
  // gets an indexable head: the route 404s / redirects anyway.
  const badLang =
    options.lang !== undefined && (options.lang === defaultLocale || !isValidLocale(options.lang))
  const def: PageDefinition = badLang ? PAGES.notFound : PAGES[page]
  const opts: SeoOptions = badLang ? {} : options
  const lang = opts.lang ?? defaultLocale
  const t = getTranslations(lang)
  const base = def.meta(t)
  const title = opts.title ?? base.title
  const description = opts.description ?? base.description
  const path = opts.path ?? def.path
  const url = canonicalUrl(path, lang)
  const ogImage = opts.ogImage ?? DEFAULT_OG_IMAGE

  const meta: MetaTag[] = [
    { title },
    { name: 'description', content: description },
    { property: 'og:type', content: opts.ogType ?? 'website' },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: ogImage },
    { property: 'og:locale', content: OG_LOCALES[lang] ?? 'en_US' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage },
  ]

  const links: SeoHead['links'] = [{ rel: 'canonical', href: url }]

  if (def.indexable) {
    meta.push({ name: 'robots', content: 'index, follow, max-image-preview:large' })
    for (const locale of locales) {
      links.push({ rel: 'alternate', hrefLang: locale, href: canonicalUrl(path, locale) })
    }
    links.push({ rel: 'alternate', hrefLang: 'x-default', href: canonicalUrl(path, defaultLocale) })
  } else {
    meta.push({ name: 'robots', content: def.follow ? 'noindex, follow' : 'noindex, nofollow' })
  }

  const jsonLd = [...(def.jsonLd?.({ t, lang, url }) ?? []), ...(opts.jsonLd ?? [])]
  const scripts = jsonLd.map((data) => ({
    type: 'application/ld+json',
    children: serializeJsonLd(data),
  }))

  return { meta, links, scripts }
}
