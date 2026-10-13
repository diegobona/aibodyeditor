/**
 * Sitemap whitelist.
 *
 * The sitemap is NOT auto-discovered (no crawlLinks). It contains exactly the
 * paths listed in SITEMAP_PATHS. When a new indexable page ships, add ONE line
 * here (default-locale path, no trailing slash). Each path is emitted once per
 * routable locale with hreflang alternates.
 */
import { locales, defaultLocale } from '@libs/i18n'
import { canonicalUrl, normalizePath } from '@/lib/seo'
import { isNoindexPath } from '@/lib/url-policy'

export const SITEMAP_PATHS: readonly string[] = [
  '/',
  '/body-editor',
  '/skinny-filter',
  '/breast-expansion',
]

/** Whitelisted paths with any forbidden/noindex path removed (defence in depth). */
export function getSitemapPaths(): string[] {
  const seen = new Set<string>()
  for (const raw of SITEMAP_PATHS) {
    const path = normalizePath(raw)
    if (isNoindexPath(path)) {
      console.error(`[sitemap] refusing noindex path in SITEMAP_PATHS: ${raw}`)
      continue
    }
    seen.add(path)
  }
  return [...seen]
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function buildSitemapXml(): string {
  const urls: string[] = []
  for (const path of getSitemapPaths()) {
    const alternates = [
      ...locales.map((locale) => ({ hreflang: locale as string, href: canonicalUrl(path, locale) })),
      { hreflang: 'x-default', href: canonicalUrl(path, defaultLocale) },
    ]
    for (const locale of locales) {
      const links = alternates
        .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${escapeXml(a.href)}"/>`)
        .join('\n')
      urls.push(`  <url>\n    <loc>${escapeXml(canonicalUrl(path, locale))}</loc>\n${links}\n  </url>`)
    }
  }

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
}
