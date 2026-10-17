/**
 * PUBLISHED tool pages only. A tool is added here the day its page ships with
 * full content (never as an empty shell) — every link to tools (homepage
 * features, "More AI Photo Tools", footer, Related Tools) is generated from
 * this list, so no link ever points at a page that doesn't exist yet.
 *
 * `key` matches `t.toolPages.<key>` and `t.home.tools.items[].key`.
 * Anchor text for links to a tool = its core keyword (`t.toolPages.<key>.keyword`),
 * never "click here" / "learn more".
 *
 * /virtual-try-on is out of scope — never add it.
 */
export const TOOL_PAGES = [
  { key: 'bodyEditor', to: '/{-$lang}/body-editor' },
  { key: 'skinnyFilter', to: '/{-$lang}/skinny-filter' },
  { key: 'breastExpansion', to: '/{-$lang}/breast-expansion' },
  { key: 'muscleGenerator', to: '/{-$lang}/ai-muscle-generator' },
  { key: 'legLengthener', to: '/{-$lang}/leg-lengthener' },
  { key: 'waistSlimmer', to: '/{-$lang}/waist-slimmer' },
] as const

export type ToolKey = (typeof TOOL_PAGES)[number]['key']
export type ToolRoute = (typeof TOOL_PAGES)[number]['to']

/**
 * Homepage feature (h3 key) -> tool key its in-text link points to.
 * Only rendered when that tool is published (in TOOL_PAGES).
 */
const FEATURE_TOOL: Record<string, string> = {
  slim: 'skinnyFilter',
  muscle: 'muscleGenerator',
  proportions: 'legLengthener',
  batch: 'bodyEditor',
}

export function toolRoute(key: string): ToolRoute | undefined {
  return TOOL_PAGES.find((tool) => tool.key === key)?.to
}

export function featureToolRoute(featureKey: string): ToolRoute | undefined {
  const toolKey = FEATURE_TOOL[featureKey]
  return toolKey ? toolRoute(toolKey) : undefined
}

/** Published sibling tools of a tool page (for its Related Tools section). */
export function siblingTools(key: ToolKey) {
  return TOOL_PAGES.filter((tool) => tool.key !== key)
}
