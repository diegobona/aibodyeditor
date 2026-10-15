# Optional Body Edit Instructions Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development for independent domain/UI work, review and verify together. Keep all existing guest-trial changes in this checkout.

**Goal:** Keep the four modes and intensity slider, with optional body-edit instructions and an input example; empty input retains existing behavior.

**Architecture:** A shared normalizer bounds/normalizes text. The provider prompt treats a nonempty request as the specific body-change target, overriding preset area suggestions while retaining identity, clothing, scene, framing and output instructions. The HTTP adapter validates the same text before reservation; the service hashes it into idempotency and the browser captures it in each attempt. Store no raw instructions in job tables, ledger, logs or session storage; the persisted hash is sufficient for retry detection and server-side recovery.

**Tech Stack:** TanStack Start, React, shared TypeScript AI adapter, existing PG/SQLite repositories, Vitest and Playwright.

## Scope and acceptance

- Four modes and 1–100 strength remain; instructions are optional and do not generate on typing.
- A compact, accessible optional section contains a labeled textarea, example and 500-character limit/counter. Pending or uncertain requests lock it. Login retains its value; a replacement photo clears photo-specific instructions.
- Normalize CRLF to LF and trim outer whitespace; reject non-string input, unsupported control characters, more than 500 UTF-16 code units and duplicate/multipart-file fields before any reservation/provider execution with `INVALID_INSTRUCTIONS`/400. Blank and omitted input are equivalent.
- Empty instructions preserve the old prompt and input fingerprint byte-for-byte, including legacy intensity names. A changed nonempty instruction with the same request UUID conflicts through both paid and guest repositories; replay does not generate/charge twice.
- Nonempty instructions refine, restrict or replace preset body targets (e.g. waist only or wider shoulders); omitted body regions retain their original appearance. User text cannot select model/endpoint/key or override adult/clothed-subject, identity, clothing coverage, scene, frame or single-image output rules. Do not promise perfect adherence.
- Same provider, private storage, guest allowance, cost/refund and ownership paths. No new database schema, secrets, endpoints, quick-target presets, mask or checkout.
- No paid provider calls for regression. If a bounded live quality spot-check is run, use the project's existing fictional clothed-adult original, at most two explicit calls, save output before further inspection and record limitations; do not automatically retry.

## Task 1 — shared domain (assigned worker)

Files: `config/body-editor.ts`, new `libs/ai/body-edit-instructions.ts`, `libs/ai/body-edit-prompts.ts`, `libs/ai/body-edit.ts`, `libs/ai/body-editor-service.ts`, and related unit tests.

- [x] Write failing tests for normalization/limits, blank prompt compatibility, custom scope precedence and service fingerprint compatibility/variation.
- [x] Run focused Vitest and inspect expected failures.
- [x] Implement `normalizeBodyEditInstructions(value?: unknown): string`, with `bodyEditConfig.maxInstructionsLength = 500` and optional `instructions?: string` on adapter/service types. Return normalized instructions from prepare; use those for prompt/provider execution.
- [x] Preserve the old fingerprint for blank input. For nonempty input hash an unambiguous versioned JSON prefix plus original image bytes; allocate based on actual encoded prefix size, avoiding the old fixed 128-byte overhead.
- [x] Run related domain tests, including actual provider multipart capture and repository conflict/zero-extra-call integration.

## Task 2 — HTTP boundary (root)

Files: `apps/tanstack-app/src/lib/body-edit-api.ts`, `tests/unit/ai/body-edit-api.test.ts`, `tests/unit/ai/body-guest-api.test.ts` as needed.

- [x] Write failing tests: trimmed text forwarded, blank compatible, excessive/duplicate/file/control values rejected before service, guest and paid same contract; client prompt/model override remains ignored.
- [x] Parse/normalize one optional `instructions` field, validate with adapter preparation, pass to shared service. No raw instruction data in config/status/error/log DTOs.
- [x] Verify HTTP contracts green.

## Task 3 — browser and translations (assigned worker)

Files: uploader, `libs/react-shared/hooks/use-body-edit.ts`, EN/ZH locales, then focused E2E scenarios after browser walkthrough.

- [x] Add localized optional section/textarea, example, counter, maxLength and contextual explanation that instructions apply during generation; the outline continues to reflect mode/strength.
- [x] Preserve default simple flow/mobile layout. Keep text on mode/strength changes and login; clear on selecting a new photo/sample or editing another photo. Disable edits while pending/uncertain.
- [x] Capture normalized text in each attempt and multipart `instructions`, omitting blank values; retry uses the original snapshot. No raw text added to persisted session storage.
- [x] Classify `INVALID_INSTRUCTIONS` as a known precharge failure, show a localized correction message and unlock settings while retaining the input; never poll/retry it as an uncertain charged request.
- [x] Walk desktop/mobile UI using mocked generation, then write E2E for request payload, optional blank path, locking, login retention, no-call typing, and HTTP 400 invalid-instruction correction/unlocking. Update existing layout checks only for actual intended UI changes.

## Task 4 — review, integration and evidence (root)

User clarification during delivery: keep verification bounded. Complete the related new/critical-flow tests, typecheck, one build and required minimal Workers smoke; no additional review rounds or broader SEO/full-suite reruns. The single already-started live waist-only call timed out; do not repeat it or start the second proposed call.

- [x] Review domain/UI changes against requirements and ask a code reviewer for concrete defects; fix verified findings.
- [x] Run related unit/E2E suites, fresh `pnpm typecheck --force`, one `pnpm build --force` via existing Corepack shim, and minimal local Workers SSR/configuration smoke on a free port. No new indexable page or SEO structure changes; broader SEO audit omitted per the user's verification-scope clarification.
- [x] Record the live spot-check timeout separately from mock contract success; visual adherence remains unverified. Do not repeat paid calls or add unverified quick-target shortcuts.
- [x] Update implementation/user docs, TEST-CATALOG results, plan checkboxes and report shipped behavior, checks and remaining limitations. Do not deploy or commit unrelated prior changes.

