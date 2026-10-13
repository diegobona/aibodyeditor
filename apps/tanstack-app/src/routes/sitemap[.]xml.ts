import { createFileRoute } from '@tanstack/react-router'
import { buildSitemapXml } from '@/lib/sitemap'

// Whitelist-only sitemap. Edit SITEMAP_PATHS in src/lib/sitemap.ts to add pages.
export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () =>
        new Response(buildSitemapXml(), {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        }),
    },
  },
})
