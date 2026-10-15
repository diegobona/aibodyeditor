# Guest Body Trial Implementation Plan

> **For agentic workers:** Execute inline, with plan review and verification before handoff.

**Goal:** One successful body edit per browser guest without signing in; signing in grants no additional free edit.

**Architecture:** A separate PG/SQLite guest-job repository implements the existing body-edit repository interface, sharing the provider pipeline and private result storage. An opaque HttpOnly cookie grants access; only its SHA-256 identifier is stored. Transactions enforce one pending/successful edit per guest and keyed network caps across cookie resets. Paid jobs and their credit ledger stay separate.

**Tech Stack:** TanStack Start, React, PostgreSQL/SQLite, Web Crypto, Vitest, Playwright, Cloudflare Workers.

## Acceptance and scope

- Fresh guest can generate, compare and download without login; failure releases the opportunity subject to retry limits.
- Duplicate requests reuse output; concurrent requests cannot get multiple free edits; refresh retains quota and result access. Other guests cannot read it.
- Same-origin POST initializes the guest cookie without generation or auth account creation. Production uses only trusted Cloudflare network identity, localhost a development identity; no raw IP storage.
- Authenticated submissions use credits without an extra trial grant; banned accounts cannot submit as guests. Guest downloads remain cookie-owned after login.
- $4.99 checkout remains a separate feature; no misleading purchase or subscription promises are introduced.
- Only TanStack exists in this repository.

## Task 1 — persistent allowance

- [x] Add catalog acceptance backlog.
- [x] Write and run failing `tests/unit/credits/body-guest-repository.test.ts` and `tests/unit/ai/body-guest-session.test.ts`.
- [x] Implement `config/body-guest.ts`, `libs/credits/body-guest-repository.ts`, `libs/ai/body-guest-session.ts`, PG/SQLite schema and `0007_body_guest_edit` migrations.
- [x] Verify actual SQLite transactions: retries, conflicts, concurrent requests, success/failure/timeouts, cross-owner isolation, network caps across cookie resets.

## Task 2 — HTTP and UI

- [x] Add failing HTTP contracts, wire optional guest access into `body-edit-api.ts`/`body-edit-server.ts`, add `/api/body-edit/guest-session` same-origin POST.
- [x] Initialize guest ownership and recovery in `use-body-edit.ts`; remove initial upload login gate; show sign-in guidance on exhaustion.
- [x] Update EN/ZH copy and public offer semantics; remove automatic account trial grants.

## Task 3 — verification and delivery

- [x] Walk real UI with mocked provider, then add E2E against observed DOM; never use real provider credits for regression.
- [x] Run affected unit suites, body-edit/homepage/entrypoint E2E, fresh typecheck/build, and Cloudflare preview SSR on a free port.
- [x] Update implementation/user docs and catalog; review migrations and ownership transitions; report exact checks and deployment prerequisites.

