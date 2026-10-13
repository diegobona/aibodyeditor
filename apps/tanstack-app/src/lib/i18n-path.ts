import { defaultLocale, isValidLocale } from '@libs/i18n'

/**
 * URL <-> locale helpers.
 *
 * Rules:
 * - Default locale (en) has NO prefix: `/`, `/signin`.
 * - Other routable locales use a sub-directory: `/de`, `/de/signin`.
 * - Locale is derived from the path only.
 */

/** Value for the optional `{-$lang}` route param (`undefined` = default locale). */
export function toLangParam(locale: string | undefined): string | undefined {
  return !locale || locale === defaultLocale ? undefined : locale
}

/** Locale encoded in a pathname (falls back to the default locale). */
export function localeFromPath(pathname: string): string {
  const segment = pathname.split('/')[1] ?? ''
  return segment !== defaultLocale && isValidLocale(segment) ? segment : defaultLocale
}

/** Remove a routable non-default locale prefix: `/de/signin` -> `/signin`. */
export function stripLocalePrefix(pathname: string): string {
  const segment = pathname.split('/')[1] ?? ''
  if (segment !== defaultLocale && isValidLocale(segment)) {
    return pathname.slice(segment.length + 1) || '/'
  }
  return pathname || '/'
}

/** Build a path for a locale: (`/signin`, 'de') -> `/de/signin`; (`/`, 'en') -> `/`. */
export function localizedPath(path: string, locale: string = defaultLocale): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  const lang = toLangParam(locale)
  if (!lang) return clean
  return clean === '/' ? `/${lang}` : `/${lang}${clean}`
}
