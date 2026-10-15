# Optional body-edit instructions

The four body modes and strength slider remain the default workflow. A compact **Extra instructions (optional)** section lets users describe a specific body-change target. It is shared by the homepage and all topic editors, including both guest and account requests. There are no shortcut presets or local masks in this change.

## Input and provider contract

`POST /api/body-edit` accepts one optional text field, `instructions`, alongside the original image, mode, intensity and request UUID. `normalizeBodyEditInstructions` in `libs/ai/body-edit-instructions.ts` converts CRLF/CR to LF and trims outer whitespace. The limit is 500 UTF-16 code units, matching textarea `maxLength` and the browser counter. Non-string/File values, duplicate fields, excess length and unsupported ASCII control characters are rejected with `INVALID_INSTRUCTIONS`/400 before a credit or guest reservation. Tab and newlines are allowed. Blank input is equivalent to an omitted field.

The shared AI preparation layer validates the same input. With no instructions, the exact previous prompt is retained. With instructions, the server frames the quoted request as the specific body target: it may refine, restrict or replace the preset's default areas. The selected mode is a starting direction, and strength guides degree of change. Conflicting per-mode numerical targets are omitted from this branch so “waist only” does not also ask for slimmer arms/thighs, and a fuller-hip request does not also ask for longer legs.

The preservation and output rules still apply: the same clothed adult, identity/face, outfit coverage, scene, frame and realistic rendering, with a single edited image. Text cannot select a provider, model, endpoint or key. These prompt instructions guide the model; they do not guarantee exact geometry, perfect preservation or compliance on every photo.

## Retries, ownership and data handling

Blank instructions retain the previous input hash, including historical named strengths. Nonempty instructions use a versioned, unambiguous encoded prefix plus the source bytes. The prefix is allocated from its encoded byte length, including multilingual text. Existing paid/guest repositories compare `input_hash`, so a repeated UUID with different instructions conflicts; an identical normalized payload reuses the existing job without another provider call or debit.

The browser captures normalized instructions in the in-memory attempt. An uncertain retry resends that snapshot and UUID, rather than reading mutable UI text. Reload recovery uses existing job/request IDs and owner checks. No raw instructions are added to job tables, credit metadata, status/config DTOs, logs or session storage; no migration is needed. Guest allowance, account credit cost/refunds and private output ownership continue through their existing paths.

`INVALID_INSTRUCTIONS` is a known precharge failure in the browser. It unlocks settings and preserves text for correction, without status polling or automatic resubmission. Settings, including this field, lock during pending/uncertain generation. Login and mode/strength changes retain the input. Choosing another photo/sample or editing another photo resets it.

The local outline continues to visualize the selected mode/strength. Extra instructions apply when generating; the outline does not parse them into a new target shape.

## Validation

Related unit and browser cases are listed under **Optional extra body-edit instructions** in `tests/e2e/TEST-CATALOG.md`. Provider responses are fixtures for regression. Any live quality spot-check uses existing fictional clothed-adult originals, at most two explicit requests, and is recorded separately from contract tests. A supplier response is saved before download, so downloading an existing result never requires another generation request.

On 2026-10-15 the single waist-only live request timed out before returning a usable result. It was not repeated, and the second proposed case was not run. Contract tests passed, but actual visual adherence for custom requests remains unverified. Per the user's instruction, verification stopped after related tests, typecheck, one build and the required minimal Worker runtime smoke; no broader audits or extra review rounds were added.
