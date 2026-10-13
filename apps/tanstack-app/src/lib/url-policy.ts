/**
 * URL policy shared by the request middleware (src/start.ts), robots.txt and
 * the sitemap. Pure functions, no framework imports, so it is easy to test.
 */
import { defaultLocale } from '@libs/i18n'
import { SITE_URL } from '@/lib/seo'
import { stripLocalePrefix } from '@/lib/i18n-path'

export const CANONICAL_HOST = new URL(SITE_URL).host // aibodyeditor.net

/**
 * Path prefixes that must never be indexed nor appear in the sitemap.
 * Matched after stripping a locale prefix (`/de/dashboard` -> `/dashboard`).
 */
export const NOINDEX_PREFIXES = [
  '/dashboard',
  '/admin',
  '/api',
  '/signin',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/payment-success',
  '/payment-cancel',
] as const

/** Prefixes disallowed in robots.txt (exactly what the SEO spec asks for). */
export const ROBOTS_DISALLOW = ['/dashboard', '/admin', '/api', '/signin', '/signup'] as const

function matchesPrefix(path: string, prefix: string): boolean {
  return path === prefix || path.startsWith(`${prefix}/`)
}

export function isNoindexPath(pathname: string): boolean {
  const path = stripLocalePrefix(pathname)
  return NOINDEX_PREFIXES.some((prefix) => matchesPrefix(path, prefix))
}

/**
 * Returns the URL to 301 to, or null if the request URL is already canonical.
 *
 * - `http://` or `www.` on the production domain -> https://aibodyeditor.net
 * - trailing slash -> stripped (`/foo/` -> `/foo`)
 * - default-locale prefix -> stripped (`/en/foo` -> `/foo`, `/en` -> `/`)
 *
 * Other hosts (localhost, preview URLs) only get the path rules.
 */
export function getCanonicalRedirect(input: {
  host: string
  proto: string
  pathname: string
  search: string
}): string | null {
  const host = input.host.toLowerCase()
  const isProdHost = host === CANONICAL_HOST || host === `www.${CANONICAL_HOST}`

  let pathname = input.pathname.replace(/\/{2,}/g, '/')
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.replace(/\/+$/, '') || '/'
  }
  const first = pathname.split('/')[1] ?? ''
  if (first === defaultLocale) {
    pathname = pathname.slice(first.length + 1) || '/'
  }

  const needsHostFix = isProdHost && (host !== CANONICAL_HOST || input.proto !== 'https')
  const needsPathFix = pathname !== input.pathname

  if (!needsHostFix && !needsPathFix) return null
  const origin = isProdHost ? SITE_URL : `${input.proto}://${input.host}`
  return `${origin}${pathname}${input.search}`
}
