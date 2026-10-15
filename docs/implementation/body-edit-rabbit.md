# Rabbit API body photo editing

The homepage and published guides share one AI editing flow. Guests get one successful edit per browser without signing in; signed-in edits require existing credits. Users choose an original photo, one of four modes and a continuous intensity from 1 to 100 (default 70), then explicitly generate a result to compare and download. Moving the slider makes no provider call. Promotional concept photos remain labeled as illustrations rather than outputs from this editor. See [guest trial implementation](body-guest-trial.md) for ownership, limits and migration details.

## Configuration and protocol

The server reuses the existing variables in the root `.env` for local development, or Worker secrets and variables in deployment. Never expose the key through `VITE_*`, a browser payload or Git.

```dotenv
OPENAI_API_KEY="<your Rabbit API key>"
OPENAI_BASE_URL="https://api.tu-zi.com/v1"
```

The fixed gateway model is `gpt-image-2.5-1k` in `config/body-editor.ts`. It is the user's selected gateway alias; do not replace it with an official OpenAI model ID. `AI_PROVIDER` does not select this adapter. These OpenAI variables also affect existing OpenAI chat and text-to-image integrations, so their key must belong to the configured gateway.

[Rabbit's image documentation](https://api.tu-zi.com/docs/api/images) establishes multipart `POST /v1/images/edits` with `model`, `prompt` and `image`, and URL or Base64 results in `data[]`. Its editing example requests `response_format=url`. Generic documentation allows `url` or `b64_json` subject to model and channel support; it does not establish the exact alias's default format or guarantee that alias's Base64 support. The [endpoint matrix](https://api.tu-zi.com/docs/use-cases/endpoint-matrix) distinguishes model visibility from endpoint compatibility.

On 2026-10-14, `GET /v1/models` confirmed access to the exact alias, and one real `POST /v1/images/edits` succeeded using a fictional, clothed adult original with Slim/Balanced. The response used `data[].url` on `apioss8.sydney-ai.com` under `/ximg/`. The materializer downloaded and validated a 2,001,365-byte PNG (1086 × 1448); the result is saved at `test-results/body-edit-live-result.png`. Visual inspection confirmed slimmer waist/arm contours, with some pose and background variation. This one live check does not establish quality for every mode or guarantee identity/pixel preservation. Mock tests do not establish live image quality or supplier pricing.

## Server architecture

- `libs/ai/body-edit.ts` constructs the fixed prompt and multipart request, validates signatures and enums, bounds provider responses and materializes supported results.
- `libs/ai/body-editor-service.ts` coordinates input hashing, job reservation, generation, private result storage and terminal transitions through injected dependencies.
- `libs/credits/body-edit-repository.ts` owns account debit/refund, persistent jobs and idempotency. New body edits pass zero trial credits. `body-guest-repository.ts` separately reserves free guest jobs without auth users or credit transactions. PostgreSQL uses transactions and locks; local SQLite uses an immediate transaction. D1 is not activated for this flow.
- `libs/storage/body-edit-results.ts` stores generated results privately in Node development or the dedicated Worker R2 binding.
- `apps/tanstack-app/src/lib/body-edit-api.ts` validates HTTP requests and exposes safe DTOs. `body-edit-server.ts` resolves server authentication, database and storage dependencies per request. Route files are thin adapters.

Uploaded originals are passed to the image provider for the requested edit and are not persistently stored by the application's server. Selecting a file initially creates a local preview; submitting an edit sends it for processing. Browser state may retain the original while the user signs in. Provider retention is separate from the application's result storage and is not claimed to be controlled by this code.

## HTTP contract

| Request | Behavior |
| --- | --- |
| `GET /api/body-edit` | Public availability, `costCredits`, `freeTrialEdits: 0`, `guestTrialEdits: 1`; no credentials |
| `POST /api/body-edit/guest-session` | Same-origin initialization of an opaque HttpOnly guest cookie and remaining allowance; no generation |
| `GET /api/body-edit?requestId=<UUID>` | Account/guest owner lookup when the initial response was lost before a job ID was received |
| `POST /api/body-edit` | Account or guest, same-origin multipart `image`, `mode`, `intensity`, `requestId`, optional `instructions` |
| `GET /api/body-edit/{jobId}` | Account/guest owner status and result links |
| `GET /api/body-edit/{jobId}/image` | Owner-checked image bytes, with private no-store headers |
| `GET /api/body-edit/{jobId}/image?download=1` | The same owner-checked bytes with an attachment filename |

Submission accepts one nonempty PNG, JPEG or WebP image up to 10 MB. MIME must match its signature. Signature checks identify the container; they do not fully decode the photo, verify its subject or guarantee usable anatomy. The multipart body has a separate bounded overhead allowance. Mode, intensity and optional instructions are validated before credit reservation. Instructions may specify the body-change target within server-owned preservation/output rules; client fields cannot override the model or credentials. See [optional instructions](body-edit-instructions.md) for normalization, precedence and limits.

`requestId` is a client-generated UUID. Reusing it for the same owner and identical image, MIME, mode, intensity and normalized instructions returns the existing job; a different payload is rejected. Blank instructions retain the historical hash format. A processing duplicate returns HTTP 202 with `jobId`, `status: "processing"`, `retryAfterSeconds` and `Retry-After`. Success returns `jobId`, `status: "succeeded"`, private result/download paths, mode, intensity, charged credits, balance and `reused`; raw instructions are not included.

Errors use `error.code` and, when known, `jobId` and `error.refunded`. Status and image access resolve the current account, reject banned users and verify the owner before reading result bytes. Responses do not expose storage keys, another account's result, credentials or raw provider errors.

Before submission, the browser saves the request UUID and account ID in session storage. After a reload, it uses the authenticated request lookup to recover a job even if the initial response was lost before a job ID arrived. A same-payload retry retains that UUID; it must not generate a new UUID just because a response was lost. Once the job ID is known, status requests recover a completed result without another generation request. The original image is only in browser memory, so a recovered result remains downloadable after reload but cannot be compared with the lost local original.

## Credits and job lifecycle

Application cost is `BODY_EDIT_CREDIT_COST` in `config/credits.ts`: currently 15 credits per signed-in edit. This policy is separate from Rabbit's cash price. The browser guest allowance provides one free successful edit. Signing in grants no additional body-edit trial; existing account balances are preserved.

Account reservation records the job and debit atomically. The canonical consumption description is `ai_body_edit`; historical `body_edit_trial` labels remain readable. A failed account edit returns consumed credits once. Guest reservations cost zero credits and use a separate table; a failed guest edit restores its opportunity subject to retry limits.

Persistent states are `processing`, `succeeded` and `failed`. Duplicates do not start a second provider call or charge again. A processing job past its deadline is failed and refunded when reconciled. A late result cannot turn an already failed/refunded job into success; newly stored late output is removed. The deadline combines provider timeout, result-fetch timeout and storage allowance.

Preflight checks the key, gateway URL and private storage before reservation. Missing configuration returns `NOT_CONFIGURED` without charging. Provider rejection, timeout, malformed output or storage failure becomes a failed job with a refund path. A supplier may still charge an uncertain request even when this app returns the user's credits, so provider requests are never automatically repeated.

## Private result storage

Node development writes only generated results under the repository's `data/body-edits`, outside `public`. Keys derive from a validated job UUID and inferred format. Creation does not overwrite existing files; reads reject unsupported paths and symbolic-link result files. This directory is a local development store, not production hosting or a public asset path.

Workers require a dedicated `BODY_EDIT_RESULTS_BUCKET` binding. `apps/tanstack-app/wrangler.jsonc` names `aibodyeditor-private-results`; create it in the deployment account and bind it before enabling production editing. From the TanStack app directory:

```powershell
pnpm exec wrangler r2 bucket create aibodyeditor-private-results
```

Keep public access and custom public domains disabled for this results bucket. The app never falls back to public-upload `R2_BUCKET` or `R2_PUBLIC_URL`. Missing private storage makes editing unavailable. Results and downloads go through the owner API instead of an R2 public URL.

Provider Base64 data is validated and stored privately. For URL output, the server accepts only `apioss<digits>.sydney-ai.com` with an `/ximg/` path, never a browser-supplied URL. It requires HTTPS and the standard port, rejects credentials/fragments/redirects, and applies timeout, size and signature checks before storage. The lower-level provider URL is temporary; it is not exposed as a durable public result path.

The first live check returned `apioss8`, but a later Muscle/Balanced request returned `apioss28`. An exact single-host allowlist incorrectly rejected the latter with `INVALID_RESPONSE`, even though generation succeeded. The numbered-node rule fixes that routing variation without accepting arbitrary subdomains or lookalike domains. On 2026-10-14, the same previously rejected response downloaded successfully after the fix (2,020,304-byte PNG at `test-results/body-edit-cdn-fixed-result.png`), with no second generation request. Failures now log job/model/stage/code and safe provider diagnostics, including the result hostname; raw errors, full signed URLs and image content remain excluded.

Node-fix verification: 256 related unit tests and 11 editing E2E tests passed, together with fresh typecheck/build and Workers SSR/configuration smoke checks. The live generated result was inspected. TEST-CATALOG records the initial E2E setup timeout under concurrent build load and the successful independent rerun.

## Modes, intensity and user flow

| Mode | Intended change |
| --- | --- |
| `slim` | Restrained waist and upper-arm contours |
| `muscle` | Athletic shoulders and arms under original clothes |
| `proportions` | Shoulder, waist and leg balance in original framing |
| `breast` | Fuller clothed bust silhouette, retaining neckline and coverage |

Shared prompt instructions preserve identity, face, age, expression, pose, camera angle, lighting, background, outfit design/coverage, framing and aspect ratio, while allowing fabric contours and folds to adapt to the changed body. Integer strengths 1–100 continuously interpolate mode-specific relative visual targets: waist/arm/thigh narrowing, shoulder width and muscle volume, leg-to-torso proportion, or clothed bust fullness/projection. These are approximate prompt guides, not measured physical changes or provider API parameters. High strength explicitly requests a substantial transformation, including muscular/bodybuilder volume where applicable. Users must review the result.

Multipart requests carry `intensity` as a canonical integer string; the service and response expose a number. Validation rejects fractions, out-of-range values, whitespace, exponent/hex forms, empty strings and duplicate intensity fields before credits are reserved. Existing `subtle`, `balanced`, `noticeable` requests remain accepted as 25, 50, 80. Historical named request hashes remain unchanged for safe retries. The existing text DB column stores new numeric strings and normalizes historical names on read; no destructive migration is needed. Credit metadata records the exact numeric strength; every strength costs the same 15 credits.

### Continuous intensity verification (2026-10-14)

Related verification passed: 295 units, 23 browser E2E cases, uncached typecheck/build, and Workers SSR checks for `/`, `/body-editor`, `/skinny-filter`, `/breast-expansion`. Turbo now includes root shared libraries/configuration in its global dependency hash; previously a shared-prompt-only edit could incorrectly reuse a prior build or typecheck cache entry.

Bounded live checks used only the original halves of this project's fictional-adult concepts, never private user photos. Thirteen explicit Rabbit calls returned ten valid PNGs (1086 × 1448), one 502 and two timeouts. Source/strength comparison images and safe manifests are ignored under `test-results/body-intensity-live/`. Slim and Muscle were compared at 20/90; Proportions at 20/90 after strengthening the leg-to-torso target and landmark instructions. Breast's first 20/90 pass was conservative; its final prompt increases the bust-volume target and explicitly changes the underlying clothed contour. A final strength-70 call succeeded after the new strength-90 call timed out. The final breast prompt therefore has a successful default-strength check, not a completed multi-strength quality sweep. These observations are a spot check; generation is stochastic and neither monotonic visible change nor exact geometry can be promised for arbitrary photos. CLI tests bypass app credits and preserve response files before CDN downloads to avoid accidental paid re-generation.

The shared uploader provides local preview, mode/intensity choices, sign-in guidance with the image retained, configured cost/trial information, pending status, localized errors, original/result comparison and owner download. Samples load their original half into that uploader. Selecting a sample alone generates nothing; submitting it uses the same authenticated credit flow as a local photo. The marketing gallery still contains three concept directions while the working editor supports all four modes.

The result viewer fetches the owner image API with same-origin credentials, validates HTTP status, MIME and the 10 MB limit, then displays a local blob URL. This matters in Node development: Nitro's Vite middleware classifies `Sec-Fetch-Dest: image` as a static asset, so direct `<img src="/api/body-edit/.../image">` requests return 404 without reaching the authenticated route, although document navigation and ordinary fetch work. No authentication or file-publicity changes are needed. The blob URL is revoked on replacement/unmount, and pending fetches are aborted.

The preview reserves 320 px on mobile and 420 px on larger screens while loading or failing. Comparison controls appear only after the generated image decodes. Two automatic image-GET retries are followed by a localized Reload image action if needed. Reloading retrieves the saved output; it never submits another edit or consumes credits. The original preview stays available in an uninterrupted tab, but a full browser/development reload still discards the in-memory original as documented above.

## Local adapter smoke command and verification

The development smoke command defaults to a dry run and sends no request:

```powershell
pnpm exec tsx scripts/body-editor-smoke-test.ts --input "apps/tanstack-app/public/favicon-32x32.png" --mode slim
```

This fixture checks construction, not portrait quality. With credentials configured, `--execute --output <new-file-prefix>` opts into one potentially billable provider edit. The direct adapter command is separate from website jobs, account credits and private downloads. Use an approved original portrait for a live check; do not repeat paid calls as a regression suite. Neither command prints API keys or raw provider errors.

Final verification on 2026-10-14: 246 unit tests across eight suites passed, including transport, result materialization, API ownership, service lifecycle, real SQLite credit transactions and storage. The related Playwright group passed 34/34 (11 editing contracts, 15 homepage, eight entrypoint regressions), with browser auth/provider responses mocked and database cleanup disabled. A browser walkthrough and desktop/mobile screenshots confirmed the upload-first layout. Fresh typecheck, Cloudflare production build and SEO audit passed; the build retains its existing large-chunk warning. Evidence is under `test-results/live-edit-*.log` and TEST-CATALOG section 31.

The configured Neon database received only the reviewed additive `0006_body_image_edit.sql` migration. Its existing setup has no Drizzle migration journal; historical migrations were not replayed. Node development at port 7001 reports editing available. Local Workers preview at port 7003 returned HTTP 200 for the SSR homepage and configuration API, without SSR errors; editing correctly reported unavailable because deployment secrets/database bindings are not configured there. The temporary Workers preview was stopped. This verifies Worker rendering and preflight, not production editing or deployment. Production still needs the actual Hyperdrive configuration, server secrets and dedicated private R2 bucket.
