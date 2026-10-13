import { createFileRoute, notFound, Outlet, redirect } from '@tanstack/react-router'
import { defaultLocale, isValidLocale } from '@libs/i18n'
import { SharedAppProvider } from '@libs/react-shared/providers/app-context'
import { useTranslation } from '@/hooks/use-translation'

/**
 * Optional language segment.
 * - `/`, `/signin`         -> default locale (en), no prefix
 * - `/de`, `/de/signin`    -> other routable locales (none enabled yet)
 * - `/en/...`              -> 301 to the unprefixed URL (also enforced in src/start.ts)
 * - `/xx/...` (unknown)    -> 404
 */
export const Route = createFileRoute('/{-$lang}')({
  beforeLoad: ({ params, location }) => {
    const lang = params.lang
    if (lang === undefined) return
    if (lang === defaultLocale) {
      const path = location.pathname.slice(lang.length + 1) || '/'
      throw redirect({ href: path + (location.searchStr ?? ''), statusCode: 301 })
    }
    if (!isValidLocale(lang)) {
      throw notFound()
    }
  },
  component: LangLayout,
})

function LangLayout() {
  const { t, locale } = useTranslation()

  return (
    <SharedAppProvider value={{ t, locale }}>
      <Outlet />
    </SharedAppProvider>
  )
}
