import { createFileRoute } from '@tanstack/react-router'
import { routeHead } from '@/lib/seo'
import { ToolPage } from '@/components/tool-page'

export const Route = createFileRoute('/{-$lang}/(root)/ai-muscle-generator')({
  head: routeHead('muscleGenerator'),
  component: () => <ToolPage toolKey="muscleGenerator" />,
})
