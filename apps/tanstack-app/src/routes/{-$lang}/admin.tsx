import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SidebarProvider, SidebarTrigger } from '@libs/react-shared/ui/sidebar'
import { AppSidebar } from '@/components/admin/app-sidebar'
import { requireAdmin } from '@/lib/auth-guard'
import { seo } from '@/lib/seo'
import { stripLocalePrefix } from '@/lib/i18n-path'

/**
 * Back office: client-rendered only (`ssr: false`, inherited by every /admin/*
 * child) and noindex. src/start.ts also sends `X-Robots-Tag: noindex`.
 */
export const Route = createFileRoute('/{-$lang}/admin')({
  ssr: false,
  // One head for every /admin/* page; canonical follows the actual leaf path.
  head: ({ params, matches }) =>
    seo('admin', {
      lang: params.lang,
      path: stripLocalePrefix(matches[matches.length - 1]?.pathname ?? '/admin'),
    }),
  beforeLoad: async ({ params }) => {
    await requireAdmin({ params })
  },
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-grow">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
