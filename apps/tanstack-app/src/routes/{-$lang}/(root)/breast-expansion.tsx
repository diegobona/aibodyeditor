import { createFileRoute } from '@tanstack/react-router'
import { routeHead } from '@/lib/seo'
import { ToolPage } from '@/components/tool-page'

/**
 * /breast-expansion — core keyword: "ai breast expansion" (title first + the only <h1>).
 * Copy: libs/i18n en.ts `toolPages.breastExpansion` (original to this page).
 * Positioning: body proportions / garment silhouette on CLOTHED photos only.
 * Never write adult-oriented copy for this page.
 */
export const Route = createFileRoute('/{-$lang}/(root)/breast-expansion')({
  head: routeHead('breastExpansion'),
  component: BreastExpansionPage,
})

function BreastExpansionPage() {
  return <ToolPage toolKey="breastExpansion" imageSlug="breast-expansion" />
}
