import { createFileRoute } from '@tanstack/react-router'
import { defaultLocale, locales } from '@libs/i18n'
import { SITE_URL } from '@/lib/seo'
import { ROBOTS_DISALLOW } from '@/lib/url-policy'

function buildRobotsTxt(): string {
  // Also block the localized copies (`/de/dashboard`) once more locales exist.
  const prefixes = ['', ...locales.filter((l) => l !== defaultLocale).map((l) => `/${l}`)]
  const disallow = prefixes.flatMap((prefix) =>
    ROBOTS_DISALLOW.filter((path) => !(prefix && path === '/api')).map((path) => `Disallow: ${prefix}${path}`),
  )

  return [
    'User-agent: *',
    'Allow: /',
    ...disallow,
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n')
}

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(buildRobotsTxt(), {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        }),
    },
  },
})
