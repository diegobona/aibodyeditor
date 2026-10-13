import { useParams, useRouterState } from '@tanstack/react-router'
import {
  translations,
  locales,
  defaultLocale,
  isValidLocale,
  type RoutableLocale,
  type SupportedLocale,
  type Translations,
} from '@libs/i18n'
import { createNextTranslationFunction } from '@libs/validators'
import { localizedPath, stripLocalePrefix, toLangParam } from '@/lib/i18n-path'

export function useTranslation() {
  const params = useParams({ strict: false }) as { lang?: string }
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  // Locale comes from the URL path only (no cookie / Accept-Language).
  // Typed as SupportedLocale (all dictionaries) so shared components can keep
  // locale-specific branches for languages added later.
  const locale = (
    params?.lang && isValidLocale(params.lang) ? params.lang : defaultLocale
  ) as SupportedLocale
  const t = translations[locale] as Translations

  const tWithParams = createNextTranslationFunction(t)

  /**
   * Language switching is a plain URL navigation (full page load so the
   * server renders the target language).
   */
  const changeLocale = (newLocale: RoutableLocale) => {
    window.location.href = localizedPath(stripLocalePrefix(pathname), newLocale)
  }

  return {
    t,
    tWithParams,
    locale,
    /** Value for the optional `{-$lang}` route param: `undefined` for the default locale. */
    langParam: toLangParam(locale),
    locales,
    defaultLocale,
    changeLocale,
    isDefaultLocale: locale === defaultLocale,
  } as const
}
