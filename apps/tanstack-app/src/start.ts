import { createMiddleware, createStart } from '@tanstack/react-start'
import { getCanonicalRedirect, isNoindexPath } from '@/lib/url-policy'

function firstHeaderValue(value: string | null): string | undefined {
  return value?.split(',')[0]?.trim() || undefined
}

/**
 * SEO request policy (runs for every page / API request):
 * 1. 301 to the single canonical origin + path (https, no www, no trailing
 *    slash, no `/en` prefix). Only GET/HEAD; never for server-fn RPC or /api.
 * 2. `X-Robots-Tag: noindex, nofollow` for back-office and auth paths.
 *
 * Language is never inferred from cookies or Accept-Language here.
 *
 * On Cloudflare, also add a "www -> apex" Redirect Rule and "Always Use HTTPS"
 * at the edge (see /seo-checklist.md); this middleware is the in-app fallback.
 */
const seoRequestMiddleware = createMiddleware().server(async ({ request, next, serverFnMeta }) => {
  const url = new URL(request.url)
  const isPageRequest =
    !serverFnMeta &&
    (request.method === 'GET' || request.method === 'HEAD') &&
    !url.pathname.startsWith('/_serverFn') &&
    !url.pathname.startsWith('/api/')

  if (isPageRequest) {
    const target = getCanonicalRedirect({
      host: firstHeaderValue(request.headers.get('x-forwarded-host')) ?? url.host,
      proto:
        firstHeaderValue(request.headers.get('x-forwarded-proto')) ?? url.protocol.replace(':', ''),
      pathname: url.pathname,
      search: url.search,
    })
    if (target) {
      return new Response(null, { status: 301, headers: { Location: target } })
    }
  }

  const result = await next()

  if (isNoindexPath(url.pathname)) {
    const response = new Response(result.response.body, result.response)
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return { ...result, response }
  }

  return result
})

export const startInstance = createStart(() => ({
  requestMiddleware: [seoRequestMiddleware],
}))
