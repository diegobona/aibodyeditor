# Live body editing delivery

User requests the website's core editor actually call Rabbit `gpt-image-2.5-1k`. The earlier adapter is a foundation, not the completed product. Implement the full flow in the single TanStack app.

- [x] Define TEST-CATALOG 31 before implementation.
- [x] Verify the exact gateway protocol/model with primary docs and one real request using a fictional adult original; do not print credentials.
- [x] Implement persistent jobs, atomic credits, one account trial, request idempotency, failure refunds and private results in shared libraries.
- [x] Wire authenticated thin POST/status/image API routes with same-origin and owner checks and configuration preflight.
- [x] Wire the existing uploader into four modes, three intensities, pending/error/result/comparison/download states; keep original file through sign-in and changing modes.
- [x] Update EN/ZH editor, guide, privacy, FAQ and credit labels to describe real editing. Keep concept-asset disclosures truthful.
- [x] Apply only the reviewed additive job migration to the configured database; no destructive schema push.
- [x] Verify UI in browser, then write E2E against real DOM with provider mocks isolated from paid calls. Test server lifecycle/auth/credits and recovered results independently.
- [x] Run related public/core E2E, shared tests, fresh typecheck/build, SEO and Workers SSR/API preview; inspect actual canary output.
- [x] Update docs/catalog with evidence and any actual operational limitation.

HTTP contract: POST /api/body-edit multipart image/mode/intensity/requestId, GET same path public availability/cost/trial configuration; GET /api/body-edit/$jobId private status, GET /api/body-edit/$jobId/image private result/download. Stable JSON successful status 'succeeded' includes jobId, result imageUrl/downloadUrl/mode/intensity, credits charged/balance and reused. Processing duplicates return 202 with jobId, status 'processing', retryAfterSeconds. Error envelope contains error.code and refunded when applicable.

Authenticated GET /api/body-edit?requestId=<UUID> supports reload recovery before the job ID arrives. Session storage retains account/request/job identifiers, never the original photo. Verification: 246 unit tests, 34 related E2E tests, fresh typecheck/build/SEO and Workers SSR/config preflight passed. One real Slim/Balanced provider request returned a validated PNG. Local editing is configured; production deployment requires real Worker secrets, Hyperdrive and private R2 provisioning.

Credits reuse the existing GPT image policy of 15 per image, independent of the supplier's cash price. Existing one-trial setting becomes one authenticated account bonus, uniquely recorded. Original photos are passed directly to the provider and are not persistently stored. Base64 outputs are private in R2 for Workers and workspace data/body-edits for Node local development. Complete jobs provide recovery and download through authenticated ownership checks.
