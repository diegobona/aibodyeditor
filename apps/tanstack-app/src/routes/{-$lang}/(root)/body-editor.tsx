import { createFileRoute } from '@tanstack/react-router'
import { routeHead } from '@/lib/seo'
import { ToolPage } from '@/components/tool-page'

/**
 * /body-editor — core keyword: "body editor" (title first + the only <h1>).
 * Copy: libs/i18n en.ts `toolPages.bodyEditor` (original to this page).
 */
export const Route = createFileRoute('/{-$lang}/(root)/body-editor')({
  head: routeHead('bodyEditor'),
  component: BodyEditorPage,
})

function BodyEditorPage() {
  return <ToolPage toolKey="bodyEditor" imageSlug="body-editor" />
}
