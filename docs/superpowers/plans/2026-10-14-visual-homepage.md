# Visual Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Build a photo-led homepage with original, clearly labeled AI concept examples for Slim, Muscle and Proportions, while preserving the shared local-only editor and SSR SEO.

**Architecture:** A shared comparison component renders aligned halves of generated photographic diptychs and exposes a native accessible range control. A small static asset manifest describes six original examples. The TanStack homepage owns active showcase mode and sample selection; the existing uploader accepts an optional sample and mode without introducing API calls. English copy is mirrored in Chinese. Existing topic routes retain the same editor.

**Tech Stack:** React 19, TanStack Start, Tailwind CSS, built-in imagegen, Playwright.

## Acceptance and scope

- [x] Record plain-language acceptance scenarios in `tests/e2e/TEST-CATALOG.md` before implementation.
- [x] Review the plan against the user-approved photo-first design. Only the current TanStack app exists.
- [x] Preserve current uncommitted changes. No deployment, Git push, database or billing changes.

## Original assets

- [x] Generate six original concept diptychs with the built-in imagegen tool. Each image has equal portrait halves and consistent adult subject, clothes, pose, camera, background and light.
- [x] Save browser-ready WebP files under `apps/tanstack-app/public/examples/v2/`; inspect them and record prompts in `docs/implementation/homepage-image-prompts.md`.
- [x] Describe actual subjects in translated alt text. Mark examples as AI-generated concepts, not results from this app.

## Components and homepage

- [x] Create `libs/react-shared/components/photo-comparison.tsx`: SSR-visible photos, equal half framing, a keyboard/touch native range, before/after labels, eager hero only. No provider or router dependencies.
- [x] Create `apps/tanstack-app/src/components/home/showcase-data.ts`: mode types and six asset paths, no hardcoded visible copy.
- [x] Extend `apps/tanstack-app/src/components/home/upload-dropzone.tsx` with optional selected mode/sample props. Selecting a real file clears sample state and preserves blob cleanup, file limits, validation and coming-soon notice.
- [x] Rewrite `apps/tanstack-app/src/routes/{-$lang}/(root)/index.tsx`: 40/60 hero with three example controls; three photo-led mode cards and supplementary sample gallery; compact editor under `#try`; two closeup examples; short preparation/privacy/how-to sections; compact pricing state, FAQ, SEO guide links and closing CTA.
- [x] Preserve one `AI Body Editor` h1, `routeHead('home')`, SSR body/alt/keyword links and existing anchors. No invented ratings, guarantees or free-edit pricing.
- [x] Add `home.showcase` keys in both locale files. Retain current public editor availability and guide distinctions.

## Verify, test and document

- [x] Inspect desktop and mobile in Codex browser (agent-browser CLI is unavailable). Check primary photo is visible early, range and mode/sample controls work and layout does not overflow.
- [x] Write `tests/e2e/specs/visual-homepage.spec.ts` against actual DOM. Cover mode changes, keyboard comparison, sample/reset/file replacement, no upload requests, decoded six images, responsive layout, SSR copy and original alt.
- [x] Update existing `editor-entrypoints.spec.ts` assertions only where layout intentionally changes; preserve shared-editor and SEO regression coverage.
- [x] Run `E2E_SKIP_CLEANUP=true npx --yes pnpm@9.4.0 exec playwright test --config=tests/e2e/playwright.config.ts visual-homepage.spec.ts editor-entrypoints.spec.ts`.
- [x] Run `npx --yes pnpm@9.4.0 typecheck`, `npx --yes pnpm@9.4.0 build`, SEO audit, and a local Workers SSR preview using the fresh build.
- [x] Review the diff, update test catalog results, and document UI behavior/asset provenance. Deliver homepage screenshot and verification results.

User AGENTS.md requires acceptance scenarios before code and E2E code after the real UI is inspected; this sequence takes precedence over generic test-first skill guidance. User already authorized implementation and generation; continue in the current branch and checkout without a separate execution approval.
