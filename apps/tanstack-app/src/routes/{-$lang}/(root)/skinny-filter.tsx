import { createFileRoute } from '@tanstack/react-router'
import { routeHead } from '@/lib/seo'
import { ToolPage } from '@/components/tool-page'

/**
 * /skinny-filter — core keyword: "skinny filter" (title first + the only <h1>).
 * Copy: libs/i18n en.ts `toolPages.skinnyFilter` (original to this page).
 */
export const Route = createFileRoute('/{-$lang}/(root)/skinny-filter')({
  head: routeHead('skinnyFilter'),
  component: SkinnyFilterPage,
})

function SkinnyFilterPage() {
  return <ToolPage toolKey="skinnyFilter" />
}
