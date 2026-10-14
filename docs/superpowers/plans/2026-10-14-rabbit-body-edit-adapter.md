# Rabbit Body Image Edit Adapter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Prepare a server-side image-edit adapter for the user-selected Rabbit API `gpt-image-2.5-1k`, with four mode prompts and an explicit opt-in local smoke script; no paid calls until the user supplies a key.

**Architecture:** Shared logic belongs in `libs/ai`, fixed model/mode/intensity settings in `config/body-editor.ts`. Existing `OPENAI_API_KEY` and `OPENAI_BASE_URL` are reused without changing chat or general image-generation defaults. Native multipart fetch is used for this gateway because the installed OpenAI AI SDK requires `b64_json`, while Rabbit documents either URL or Base64 results. A native adapter can preserve both result types without downloading arbitrary remote URLs.

**Tech Stack:** TypeScript, Web APIs compatible with Workers, Vitest, tsx for the local script.

## Scope and contract

- [x] Add acceptance scenarios to TEST-CATALOG section 28 before implementation.
- [x] Keep homepage and guides in their current truthful preview state. Website authentication, billing, storage and result UI are a subsequent product activation task, outside this preparation step selected by the user.
- [x] Preserve the exact gateway model ID. Generic documentation establishes the image-edit protocol, but this exact alias, access, price and output quality remain unverified without a key.

## Prompt configuration

- [x] Add four service modes (Slim, Muscle, Proportions, Breast) without changing the three UI showcase modes.
- [x] Add subtle/balanced/noticeable intensity templates, shared identity/scene/clothing invariants and mode-specific targets. No exact centimetres, percentages, cup sizes or pixel-preservation promises.
- [x] Add prompt unit tests before implementation, then verify them.

## Transport

- [x] Create `libs/ai/body-edit.ts`: validate bytes and MIME, mode and intensity, read server-side credentials, normalize an HTTPS base URL, POST one image to `/images/edits`, use the selected model and generated prompt, bound response size, timeout/cancellation and zero implicit retries.
- [x] Normalize URL and Base64 results into a stable result shape; reject missing/invalid/oversized output and async-only responses with actionable error codes. Do not print credentials or provider bodies or download returned URLs.
- [x] Export from `libs/ai/index.ts`; keep unrelated providers/defaults unchanged.
- [x] Add meaningful mock HTTP contract tests for endpoint/form, image bytes, prompt, results, errors, missing credentials, cancellation and request count. Run red → green.

## Local validation and docs

- [x] Add `scripts/body-editor-smoke-test.ts`: default dry run validates input and prints non-secret request summary; `--execute` explicitly opts into a paid request after credentials are configured. Require an output path to save decoded Base64; URL results are reported without fetching them.
- [x] Update `env.example` comments with Rabbit base URL; do not write a real key or change `.env`.
- [x] Document exact environment settings, usage, prompts, model uncertainty and the remaining website activation steps in `docs/implementation/body-edit-rabbit.md`.

## Verification

- [x] Run prompt/transport unit tests, script dry run and existing public E2E (18 related cases, cleanup skipped).
- [x] Run typecheck and build; verify a local Workers SSR preview because shared AI exports change.
- [x] Review the adapter and test evidence, record preparation results in TEST-CATALOG, and report that live gateway compatibility/quality cannot be claimed before the user configures the key.
