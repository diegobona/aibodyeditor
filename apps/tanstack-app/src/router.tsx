import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { NotFound } from './components/not-found'

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    // Unmatched URLs (incl. /body-editor/extra) are handled at the root: HTTP 404,
    // our noindex NotFound page, and no partially-matched page's head/canonical.
    notFoundMode: 'root',
    defaultNotFoundComponent: NotFound,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
