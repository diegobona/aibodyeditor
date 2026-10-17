# MVP live validation — 2026-10-16

## Focused editing topic pages — 2026-10-17

- Added public SSR pages `/ai-muscle-generator`, `/leg-lengthener` and `/waist-slimmer` through the existing ToolPage. Static mode/strength/case mappings live in `config/editing-topics.ts`; original English copy and mirrored Chinese dictionaries live under `libs/i18n/locales/*-editing-topics.ts`.
- Each page starts empty with its own mode/strength and optional filled instructions. A filtered real-results gallery supports draggable comparisons and Try, loading existing case recipes into the same uploader. Replacing a case with a device photo keeps the selected settings; generation uses the current fields and existing auth/credit APIs. Existing guides and homepage remain on their current layouts.
- Registered the routes in the central tool registry, SEO registry and sitemap; header/footer/related links follow the registry, and the homepage guide list includes all three. SEO checks now distinguish tool navigation from policy/footer links and allow the existing homepage edit CTA on policy pages.
- Validation: 5 targeted browser scenarios passed (26.8s), typecheck passed (34.9s), Cloudflare build passed (1m9s), all 10 indexable pages passed SEO checks and three local Workers SSR responses were 200. Existing chunk-size warnings remain. No real AI call, credit debit, database mutation, deployment or Git push.

## Continue editing from My works — 2026-10-17

- Saved-work cards now hand off a five-minute, account-bound job reference through this tab's sessionStorage and open the localized homepage editor. No image bytes or prompt text are persisted. Explicit selection clears earlier local result recovery so it cannot replace the chosen work.
- The editor initializes the account balance, retrieves the job's server-owned mode/intensity and loads the protected output through the existing `continue=1` entitlement/ownership check. The file becomes the left input, right result/metadata are cleared, instructions start empty, and mobile shows Original. No API/schema/billing changes or generation on load.
- Failed loads retain a retryable reference; new photo/sample selection cancels it. Account changes and expired references are rejected. Insufficient balance uses the existing credit-pack dialog. Saved-work preview/download/delete behavior remains available.
- Verification: 6 handoff unit tests and 4 related browser scenarios passed, including actual saved-card navigation, retained preview/download/delete, subsequent exact-byte generation, balance gating and retry. Typecheck passed (37.4s), Cloudflare build passed (2m19s; existing chunk-size warnings), and Workers SSR returned 200. A disposable real-auth account was cleaned up; generation/storage responses were fixtures. No real AI generation, credit debit, deployment or Git push.

## Guest → welcome credits → credit packs — 2026-10-17

- Each account receives 10 ordinary welcome credits, usable for new photos or continued edits. Initialization uses a same-origin, authenticated POST and the shared transactional repository. Both initialization and direct first-generation fallback use the same existing `body_edit_trial:<userId>` ledger ID. PostgreSQL locks the user row before checking/granting; legacy trial entries prevent another grant. No schema migration is required.
- The editor initializes/refetches the balance after login, shows balance/cost and preserves the current images/settings. Email login and signup share the same dialog; signup no longer opens a separate tab from the editor. No generation starts automatically after authentication. Guest success keeps its download available and invites account login for the welcome credits.
- An insufficient balance changes the main action to Get credits. Expected quota exhaustion opens an informational dialog, without a red technical error. The dialog explicitly states that packs are not yet available; checkout remains deferred. Continuing loads the original output bytes without charging, and the next generation uses the normal 10-credit reserve/refund path.
- Verification: 151 focused unit tests and 12 related browser scenarios passed. Coverage includes once-only grants, legacy markers, refund/retry, cookie-owned guest continuation, in-place login/signup with retained settings, and exhausted-balance dialogs. Typecheck passed (11.5s), Cloudflare production build passed (30.0s; existing chunk-size warnings), and local Workers SSR returned 200 with the updated welcome-credit FAQ. Browser generation/auth/storage responses used fixtures; no real provider call, checkout, deployment or Git push was performed.

## Continue editing — 2026-10-17

- Credit eligibility: the canonical body-edit cost is now 10. The continuation helper requests the private image with `continue=1`; the server checks the current account's database balance (at least 10), login, ban status and image ownership. Plain preview/download remains available to the owner, including guests. No purchase-history requirement and no debit on this read. The following generation reserves 10 credits through the existing transactional service; older jobs still refund their stored original cost.
- Added Continue editing to successful generated outputs in both workbench and compact editors. Saved example previews do not expose the action. A shared client helper fetches the same-origin private result with credentials, validates MIME, input byte limit and image decoding, and creates the next File from the original bytes without canvas conversion.
- A preparation lock prevents duplicate submissions and freezes the photo/settings/example controls while loading. On success, only local result/case/metadata state is cleared; the current editable settings stay, and the new original is marked `generated`. Mobile returns to the Original tab. A failed load preserves both images and can be retried. Navigation aborts pending loads; an account switch cannot apply an earlier owner's asynchronous result.
- The next explicit Edit Photo uses the normal submission path and a new request ID, carrying the continued file and the current settings. Guest allowance remains consumed after a successful free edit. A guest continuation click prompts login without discarding the result; insufficient account credits preserve both images.
- Verification: 136 focused unit tests and four related browser scenarios passed (8.9s), covering fresh settings/exact file bytes, guest login, balance 9/10, failure/retry, mobile tab state and compact editing. Typecheck and Cloudflare production build passed; local Worker preview returned SSR homepage/editor HTML with status 200 and the updated 10-credit FAQ. All generation responses were fixtures; no real AI generation, credit debit, deployment or Git push occurred.

## Output specifications — 2026-10-17

- Added shared image-file metadata formatting and display. Pixel width/height come from the loaded original image's natural dimensions; bytes and format come from the existing authenticated preview response. Supports PNG/JPEG/WebP and localized decimal byte/kB/MB formatting. Invalid/unavailable metadata stays hidden.
- Specifications appear in the editor footer (both workbench and compact tool-page layouts), saved-work cards and the large-image dialog. Result metadata is associated with the task ID and disappears when the result is cleared or unavailable. No new endpoint, schema, AI request or additional metadata fetch was introduced.
- Validation: 11 format/size/invalid-data tests and two targeted browser scenarios passed; fixture downloads were byte-identical to the preview source, and clearing an uploaded/generated result removed the previous specifications. Typecheck passed.
- Cloudflare production build passed; the Worker preview returned the SSR homepage/editor with status 200. No deployment or Git push was performed.

## Public policies and deletion instructions — 2026-10-17

- Added SSR `/privacy`, `/terms` and `/deletion`, routeHead SEO, canonical URLs, sitemap entries, footer navigation and live auth-notice links. EN and ZH dictionaries share the same structure. The owner confirmed the public contact `zw83716@gmail.com` and operator name `AI Body Editor`; both live in `config/legal.ts`.
- Copy matches the implementation: local selection versus submission, Rabbit gateway and upstream processing, private results, 30-day expiry, session/guest cookies and necessary browser storage, task/billing records kept separately from image deletion. No unsupported provider zero-retention, no-training or deletion guarantees were added; no account deletion UI was introduced.
- Fixed the existing hourly cleanup to include `body_guest_edit`, not just registered-user results. It deletes the stored object and clears the image reference, while retaining guest-trial/task records. The same batch bound and deployed schedule are used.
- Targeted checks: seven history/retention tests; two browser tests covering SSR, policy navigation, auth links, canonical/sitemap and mobile overflow. Only fixture data is deleted; no AI calls.
- Typecheck and production build passed. Local Cloudflare preview returned 200 and SSR H1/contact content for `/privacy` and `/deletion`; the Node dev server on 7001 was left running. No deployment or Git push was performed for this change.
- Drafting references: [FTC privacy promises](https://www.ftc.gov/business-guidance/privacy-security), [ICO privacy-notice information](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/what-privacy-information-should-we-provide/). These pages describe implemented behavior and are not a certification of legal compliance.

## My works — 2026-10-17

- Added protected, noindex `/my-works` with desktop/mobile header links, 24-result pagination, authenticated blob previews, large-image dialog, download, deletion confirmation, empty and retry states. No additional AI calls or charges.
- `GET /api/body-edit/history?page=0` returns only successful, unexpired, non-deleted results for the signed-in user. `DELETE /api/body-edit/:id` requires the owner session and matching Origin. Deleting clears private storage first and then the job's result reference; billing/idempotency records remain intact. No schema migration is needed.
- The shared retention setting is 30 days. Image GET rejects expired results; history access cleans the owner's expired files. The custom Cloudflare entry schedules hourly bounded cleanup after deployment (up to 1,000 files/run). Node development cleans on history access; it does not run the Cloudflare schedule. No account deletion UI was added.
- Focused verification: six history/repository/permission tests plus 90 existing API tests passed; two browser tests passed for auth protection and preview/download/confirm-delete/empty/retry flow. Browser fixtures made no generation requests and did not touch existing users' images.
- Typecheck and Cloudflare production build passed. A local Worker preview on port 7011 returned SSR homepage HTML with its H1 and editor; the existing Node server on 7001 was preserved. The hourly schedule is configured but is not deployed or run automatically by Node development.

Exactly two new generation requests used the configured Rabbit gateway and the
actual guest HTTP handlers, Neon reservations and private Node result storage.
Inputs were existing fictional, clothed-adult sample originals. No requests were
retried, and no extra variants were generated.

| Case | Settings | Result |
| --- | --- | --- |
| Breast | Breast, intensity 70 | Succeeded in 69.7 s; visibly fuller clothed bust. |
| Waist only | Slim, intensity 70, explicit instructions to preserve arms, legs, shoulders and chest | Succeeded in 37.5 s; narrower waist while retaining the overall subject, outfit and gym scene. |

Both outputs are 1086 × 1448 PNGs. Both private attachment downloads succeeded,
and the corresponding guest allowance changed from 1 to 0. One actual browser
recovered the existing waist-only job and downloaded identical bytes, then showed
the exhausted-guest sign-in entry, without another generation POST. Initial cold
development-page initialization exceeded the walkthrough timeout before any
generation; the later browser recovery worked after the server warmed up.

Visual inspection found the requested changes and broad preservation of the
subject, clothing and scene. This is a two-image spot check, not a guarantee of
exact body measurements, pixel preservation or supplier reliability. Neither
request returned the previously observed 502. Failure-restoration regression uses
the existing simulated-provider-failure case rather than another billable call.

The homepage's separate **Actual results from this editor** section uses these
two outputs. Originals remain AI-created samples and are labeled accordingly.
Existing concept examples retain their own labels. Public diptychs are resized
and WebP-compressed without visual retouching; provenance and SHA-256 digests are
recorded in `apps/tanstack-app/public/examples/results-2026-10-16/provenance.json`.
Private guest sessions and raw live artifacts remain in ignored `test-results/`.

Targeted verification passed: the existing failure-restoration E2E (3.4 s),
homepage comparison interaction and 390 px layout, typecheck (35.368 s), one
production build (1m36.687 s; existing chunk-size warning), and a local Workers
SSR request with the actual-result heading, alt text and asset in server HTML.

## Homepage presentation

The hero's trial thumbnails and illustrative comparison now use the three
existing lifestyle portraits, distinct from the two actual-result subjects.
Actual output remains in its dedicated section with its provenance unchanged.
Four text-only mode cards explain what each mode edits and select a mode without
replacing an uploaded photo. The duplicate concept gallery is removed, and the
detail section contains face, clothing and background checks without more
portrait comparisons. This presentation update makes no generation requests.

## Expanded actual-result gallery (2026-10-16)

The homepage now publishes ten cases across ten distinct fictional adult subjects. The
first six include a Black woman, a Black man, and an East Asian woman. Outfits
include a crew-neck dress, an above-knee skirt, training shorts, tailored shorts,
and everyday trousers. The hero keeps its separate lifestyle concepts.

Cases cover preset Slim, Muscle, Proportions and Breast edits, plus shoulder-only,
waist-only, leg-proportion, slightly-fuller-figure and combined shoulder/waist
instructions. Each card exposes its mode, actual intensity, and submitted extra
instructions when present. Six cases display initially; a button reveals four
more, with all copy and meaningful alt text present in SSR HTML. Comparison and
expansion make no generation request and preserve the selected original.

The original two endpoint results were reused. New selected outputs came from
the same configured `editBodyImage`/prompt/materialization pipeline used by the
app; two selected new cases also exercised the guest endpoint. Three other
endpoint submissions hit the local guest rate limit before provider execution;
their missing outputs were generated through the shared editor pipeline. No
failed provider call was automatically retried. Later outfit and diversity
requests replaced selected cases; unused outputs stay in ignored test artifacts.

Built-in imagegen produced fictional **source portraits only**. Public diptychs
pair those originals with unretouched editor outputs, with resizing and WebP
compression only. Public `provenance.json` records the pipeline, mode, intensity,
subject, request metadata and SHA-256 digests; `source-prompts.json` records source
portrait prompts. Private cookies and provider download URLs stay out of public
assets. Ten pairs total approximately 1.65 MB and load lazily.

Focused verification: browser walk confirmed ten SSR cards, six initial cards,
eight people, requested people/outfits visible initially, expansion/collapse,
comparison endpoints, preserved selected photo and no overflow at 390 px, with
zero generation POSTs. Four related Playwright cases passed (21.5 s). Typecheck
passed (27.498 s), one Workers build passed (1m2.761 s; existing chunk-size
warning), and local Workers SSR returned 200 with all ten cases and the required
people. No full suite or broad review was run.

## Unique subjects correction (2026-10-16)

The fuller-figure and combined shoulder/waist cases originally reused the
Slim/shoulder subjects. They now use a new blonde woman in a black top and rust
skirt, and a new white man with auburn hair in a charcoal T-shirt and pale shorts.
Two actual edits ran through the existing shared editor pipeline, once each.
Versioned image URLs avoid stale cached pictures. Updated provenance confirms
ten different subject IDs and ten different original SHA-256 hashes; no two
cases reuse a person. Source prompts and translated alt text describe the new
subjects. The Black man/woman, East Asian woman, four modes and gallery controls
remain represented. The targeted gallery E2E now asserts all ten originals are
unique and that the white man appears after expansion. Two focused tests passed
(6.9 s), with zero generation POSTs during browsing. Typecheck passed (33.878 s)
and one build passed (1m38.963 s; existing chunk-size warning). Updated public
`source-prompts.json` includes both built-in imagegen source prompts, and raw
originals/results remain in `test-results/gallery-unique-2026-10-16/`.

## Unified homepage examples (2026-10-16)

The ten existing actual-result cases now supply the homepage's top example
selector, replacing the three concept thumbnails, concept comparison and separate
lower gallery. Each selection loads its exact mode, intensity and submitted extra
instructions; empty instructions clear the field, while nonempty instructions
open it. A selected device photo is preserved when applying a case recipe. The
explicit **Use this sample photo** action replaces it with the case original,
and choosing a device photo retains the loaded recipe.

The comparison retains the selected case's saved actual output and immutable
reference settings when editor controls change. Its copy distinguishes that
saved reference from a newly generated result. Browsing examples and applying
settings make no generation request. This update reuses the existing assets and
provenance; no new paid generation was needed.

Verification: the actual browser walk confirmed the ten-choice selector, exact
recipes, preserved device photo, explicit original replacement, instruction
clearing and fixed saved reference with no generation POSTs. Nine related E2E
tests passed (37.0 s), including keyboard/touch, 320/390/768/1280 layouts,
independent provenance uniqueness, delayed asset races and a locally intercepted
multipart submission with exact parameters, original-half PNG, pending locks and
failure restoration. Typecheck passed (21.928 s), one Workers build passed
(1m17.817 s; existing chunk-size warning), and Workers SSR returned 200 with ten
examples, one h1/canonical, no concept labeling and no duplicate result cards.

## Homepage workbench follow-up (2026-10-16, current behavior)

The editor now starts empty with Slim 70 and no example selected. Ten real cases form a horizontal top strip. Selecting a case defaults to loading both its original and exact recipe. An explicit **Only apply settings** switch defaults off, is disabled without a photo, and affects only the next selection. When enabled, selection retains the current photo and its corresponding saved/generated result. New photo uploads clear the old result; settings changes preserve it with a regeneration notice.

A shared desktop frame places original, direct result and settings side by side; mobile uses Original/Result tabs. Saved example results show only their edited half with the same image scale as the original. Repeated case parameters, prompts, replacement actions and the comparison slider were removed from the result pane. The settings CTA stays at the bottom, with scrollable controls. Guide pages retain their compact editor. Existing auth, quota, recovery and charge/refund logic are reused.

Verification: 9 related scenarios passed, including all ten exact recipes, default replacement, settings-only retention, successful result/download, failed generation/refund, delayed selection races, 320/390/768/1440 layouts and guide preview. Typecheck passed (24.803 s); one Workers build passed (1m16.422 s; existing chunk-size warning). Local Workers SSR returned 200 with ten cases and an empty editor. Generation requests were mocked; no paid calls. Logs and screenshots: `test-results/workbench/`.

## Restored real-case gallery and Try (2026-10-16)

The homepage again renders all ten actual cases below the workbench: two columns on desktop, one on mobile, each with an accessible before/after slider, exact recipe information and a Try link. Gallery and top-strip selections share one handler, including settings-only and pending/uncertain guards. The editor remains initially empty and keeps direct result display. The unique #real-results anchor now targets the gallery; top Breast cases are explicitly labelled Fuller/Subtle.

Verification: 9 related scenarios passed, including SSR content, all ten Try recipes, settings-only preservation, keyboard/touch comparison and pending lock/refund. Typecheck passed (25.617 s); Workers build passed (1m22.319 s, existing chunk-size warning). Workers SSR returned 200 with 10 cards and 10 Try links. No paid generation. Evidence: `test-results/gallery-try/`.

## Mirrored settings-only switches and four-column gallery (2026-10-16)

The top case strip and lower gallery now reuse one controlled settings-only switch component and one state. Checked and disabled states synchronize; changing the preference does not replace a photo/result. Existing selection and pending/uncertain guards are reused. Gallery layout is four columns at 1024px+, two at 768px+, and one below 768px, keeping original portrait ratios, comparison sliders and Try links.

Verification: 10 related E2E scenarios passed (50.5 s), typecheck passed (24.57 s), Workers build passed (1m17.851 s; existing chunk-size warning). Browser walk confirmed both synchronization directions, settings-only retention, compact portraits and no mobile overflow. No paid API calls. Evidence: `test-results/gallery-compact/`.

## Per-case settings-only selection (2026-10-16, current behavior)

The gallery header switch has been replaced with an independent default-off switch after each card's Try action. Each card stores its own preference. Gallery Try passes that explicit value to the shared selection handler, so the top-strip preference cannot change gallery behavior. The top switch applies only to top-strip selections. Toggling alone does not change the photo/result; pending/uncertain and missing-photo guards remain. Four/two/one columns and comparison sliders are preserved. Try copy is shortened to keep each action and option together in compact cards.

Verification: 10 related E2E scenarios passed (50.5 s), typecheck passed (12.985 s), Workers build passed (47.667 s; existing chunk-size warning). Browser walk confirmed independent selection behavior and no overflow at 1440/1024/390px. Workers SSR returned 200 with ten per-card options, no gallery header option and an empty initial editor. No paid generation. Evidence: `test-results/per-case-settings/`.

## Current editor settings and interrupted generation (2026-10-16)

The reported Proportions sample to Breast 100 flow was reproduced without paid calls. The multipart payload already contained Breast/100; the misleading image was the saved sample redisplayed after a network failure. Separately, inherited case instructions could remain after a manual mode change and override the new preset in the prompt.

The editor now tracks inherited instruction origin and clears only auto-filled case text when its mode changes. User-authored text remains. Starting submission clears the saved case reference; an interrupted/failed request displays No new result yet and recovery/error status, never the old case image. The result footer shows the submitted settings, or the actual returned mode/strength after success. Recovery keeps its existing request-ID/snapshot semantics.

Verification: 12 related E2E scenarios passed (55.9 s), with the two new regressions passing again after the recovery footer refinement (6.6 s). Final typecheck passed (10.872 s); Workers build passed (29.912 s, existing chunk-size warning). Workers SSR returned 200 with the expected homepage structure. No live provider generation was performed; actual rendering quality and the user's original network failure were not independently retested. Evidence: test-results/live-editor-settings/.

## Local Neon connection failure follow-up (2026-10-16)

Actual dev-terminal logs showed repeated Better Auth session reads failing with PostgreSQL connection timeouts, before a new edit job was reserved. A standalone SELECT succeeding once did not establish that the running application's session and generation flow worked. The Node pool previously allowed only 3 seconds to connect and 5 seconds per query. It now uses the existing Workers budgets (15 seconds connect, 12 seconds query), with TCP keepalive enabled. No SQL or generation operation is automatically replayed.

Unexpected identity resolution failures now return private HTTP 503 `SESSION_UNAVAILABLE` and translated copy, without falling back to guest generation. Uncertain client recovery remains locked to its original request ID; the new error is deliberately not treated as proof that an earlier interrupted attempt was never charged.

The verified localhost:7001 Vite process was restarted. In the user's actual Edge tab, session resolution succeeded and a manual Breast 100 submission returned `INSUFFICIENT_CREDITS`. It did not invoke the provider or consume credits. Existing balances and quota records were not modified. A separate one-shot diagnostic using the shared provider, response materialization and private Node result store generated the built-in fictional sample at Breast 100 in 36.219 seconds, with a 1086×1448 image and successful byte-for-byte storage read-back. This provider/storage check does not exercise account billing; a successful charged browser generation remains unverified because the account lacks credits.

Verification: 97 focused API tests and 2 E2E regressions passed (5.4 seconds, intercepted generation in E2E). Typecheck passed (10.941 seconds), Workers build passed (30.731 seconds), and local Workers SSR returned 200. Evidence, live result and current browser screenshot: `test-results/db-connection-diagnostic/`.

## Workbench saved-result preview recovery (2026-10-17)

The user's next real Breast 100 edit succeeded in 27.663 seconds. The stored PNG existed and decoded at 1086×1448 (2,288,028 bytes). Its ledger had exactly one 15-credit debit and the account balance was 285. The new workbench had reintroduced direct `<img src="/api/body-edit/.../image">` loading, bypassing the existing authenticated fetch/blob loader used by compact editing cards. The same local URL returned HTML/404 with image request headers, while an ordinary anonymous fetch reached the authenticated API and correctly returned JSON/401.

The workbench now reuses `BodyEditComparison` with no original/comparison control, fetching the private result with same-origin credentials and displaying a blob URL. Optional wrapper/frame classes preserve its full-height direct result layout. The shared loader retains two bounded automatic GET retries, manual Reload image, size/MIME validation and object URL cleanup. The redundant workbench image error/retry state has been removed.

The existing image recovered in the user's actual browser without resubmitting generation: the result decoded at 1086×1448 from a blob URL, showing Breast 100 and the existing download link. Screenshot and targeted diagnostics are in `test-results/result-preview-recovery/`. No new provider call was made for this repair.

## Brand mark and desktop viewport layout (2026-10-17)

The header now pairs a custom purple SVG body-contour/AI-spark mark with a compact sans-serif wordmark. Header height is 56px, its horizontal alignment matches the editor, and the homepage keeps one SSR H1 at 20–24px. Reduced section spacing and thumbnails bring the workbench higher in the page. Desktop workbench height follows `100dvh - 236px`, bounded to 320–720px; its settings scroll internally. The empty uploader drops its mobile minimum height on desktop so it fits the same frame. Replacement/clear controls sit in the Original header rather than covering the face. Saved diptychs explicitly clip their edited half, including when shorter photo frames create horizontal letterboxing.

Focused browser checks passed at 1024×600, 1280×720, 1366×768 and 1440×900 for empty and selected cases. Both the editor bottom and upload canvas stay in the first viewport, with a visible edit action. SSR keeps one H1 and the SVG returns 200. Clear-photo regression passed after the toolbar move. Typecheck/build passed; the final uploader CSS adjustment passed the focused viewport E2E (3.4 seconds). Evidence: `test-results/brand-first-viewport.png` and `test-results/brand-first-viewport-*.log`. No provider generation or account data was changed.
