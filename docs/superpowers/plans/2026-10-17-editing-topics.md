# Editing Topic Pages Implementation Plan

> **For agentic workers:** Use inline execution for the user-approved scope; no delegated review or extra approval checkpoint. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish useful muscle, leg-length and waist-edit pages with real cases and exact Try recipes.

**Architecture:** Add static topic defaults in `config/editing-topics.ts`; extend the existing ToolPage and real-case gallery. Keep one editor, empty initial inputs, localized original copy and the current private generation/credit APIs.

**Tech Stack:** TanStack Start, React, shared i18n, existing real-result WebP assets, Playwright.

### Tasks
- [x] Record acceptance scenarios in `tests/e2e/TEST-CATALOG.md` before implementation.
- [x] Add config and EN/ZH topic copy; wire defaults, filtered case galleries and Try into `tool-page.tsx` and the existing uploader.
- [x] Add three routes, registry/SEO/sitemap entries, homepage links and matching SEO audit expectations.
- [x] Verify SSR content and editor flows; add focused `editing-topics.spec.ts` coverage for empty defaults, exact Try recipes, current-setting submission, metadata/FAQ/navigation and mobile width.
- [x] Run related Playwright tests, `pnpm typecheck`, `pnpm build`, `pnpm seo:audit` and a local Workers SSR smoke check. Update acceptance results and user documentation. Do not generate paid images, deploy or push.

Only TanStack exists. Existing user work stays in the current checkout; no unrelated refactor, new dependency, image generation or payment work.
