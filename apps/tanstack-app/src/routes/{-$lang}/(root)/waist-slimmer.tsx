import { createFileRoute } from '@tanstack/react-router'
import { routeHead } from '@/lib/seo'
import { ToolPage } from '@/components/tool-page'

export const Route = createFileRoute('/{-$lang}/(root)/waist-slimmer')({
  head: routeHead('waistSlimmer'),
  component: () => <ToolPage toolKey="waistSlimmer" />,
})
