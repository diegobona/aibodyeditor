# Unified Editor Entry Points Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development to implement and review these tasks. Repository instructions require acceptance scenarios before implementation and E2E code after browser verification.

**Goal:** Make the homepage and Body Editor page clear entry points to one product while preserving the Body Editor page's SEO purpose.

**Architecture:** Keep the shared UploadDropzone and existing indexable URLs. Group header links under Tools using server-rendered links, describe topic pages as guides to the same editor, and remove unsupported manual-slider and batch claims.

**Tech Stack:** TanStack Start, React, TypeScript, Tailwind, shared English/Chinese i18n, Playwright.

## Tasks

- [x] Record acceptance scenarios in `tests/e2e/TEST-CATALOG.md` before changing UI.
- [x] Update `libs/i18n/locales/en.ts` and mirror the affected keys in `zh-CN.ts`: homepage overview, Body Editor guide, related-page references, Tools labels and shared editor availability.
- [x] Update `global-header.tsx`: desktop Tools disclosure with SSR links and mobile Tools grouping; retain auth controls and per-page start CTA.
- [x] Update `tool-page.tsx` and `home/upload-dropzone.tsx`: clarify that all topic pages use the same editor and show current preview-only availability.
- [x] Update `src/lib/seo.ts`: describe the same application on every topic page, retain topic-specific WebPage/FAQ/breadcrumb data, and omit the planned free-edit Offer.
- [x] Verify desktop/mobile navigation, page differentiation and photo preview in the browser.
- [x] Write `tests/e2e/specs/editor-entrypoints.spec.ts` against the verified UI. Check navigation, shared preview behavior, page-specific content and SSR SEO. Run with `E2E_SKIP_CLEANUP=true` because these tests create no users.
- [x] Run typecheck, fresh Cloudflare build, SEO audit and the related E2E spec. Review the diff and record results in the catalog.

## Verification results

- Typecheck: passed.
- Fresh Cloudflare build: passed; existing >500 kB chunk warnings remain.
- Node development SEO audit: all checks passed for the four indexable pages and existing URL policies.
- Workers local preview: homepage and Body Editor returned HTTP 200 with SSR content.
- Related E2E: 8 passed, 0 failed; test-user cleanup skipped.
- Browser walkthrough: desktop, 768px desktop breakpoint, 390px mobile navigation and local PNG preview passed using the Codex browser (agent-browser CLI unavailable).
- Source/doc review: approved. Changes remain local on `codex/unify-editor-entrypoints`.

## Constraints

Keep `/`, `/body-editor`, sibling routes, canonical URLs, sitemap whitelist and keyword anchors. Preserve SSR copy and internal links. Do not add AI processing, billing, database writes or a second editor. Do not commit, push or deploy as part of this change.
