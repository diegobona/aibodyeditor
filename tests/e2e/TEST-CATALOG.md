# E2E 测试流程目录

## Invalidate saved case image when settings change — verified (2026-10-17)

- Changing a case's mode, intensity or extra instructions immediately removes its saved result and shows an explicit Edit Photo generation hint. Retain the original and current controls/outline. Returning controls to the old values does not restore the old result; choosing a case again does.
- This local change performs no generation or credit operation. Preserve existing actual generated-result handling, pending locks and exact submitted settings. Verify only these affected case flows.

Verification: all three targeted scenarios passed across the initial run and a two-case rerun (5.9 s): mode/intensity/instructions each remove the saved result, returning the intensity does not restore it, selecting the case again restores the reference, the original remains, settings-only changes invalidate the reference, and Breast 100 submission/recovery retains the current settings. The initial run hit the existing auth-readiness timeout and one test counted the placeholder icon as an image; its selector was narrowed to actual image elements. Typecheck passed (13.04 s); Workers build passed (32.704 s). No live generation or credit use.

## Top settings-only hint and simplified gallery Try — verified (2026-10-17)

- Hovering or keyboard-focusing the disabled top settings-only option while no photo is loaded explains that a photo must be uploaded first, with EN/ZH copy. Do not show this hint for an enabled option or when an existing edit is the reason for the disabled state.
- Gallery cards have no settings-only switches. Try always loads the chosen case's photo and exact recipe, irrespective of the top-strip preference, without generating an edit. Verify the hint and affected Try behavior only.

Verification: the final lightweight CSS hover/keyboard hint passed its targeted E2E (1.9 s). The gallery Try contract and existing top-strip settings-retention scenario each passed in targeted runs; combined runs also encountered the existing intermittent initial hydration/auth-readiness timeout. Final typecheck passed (12.565 s), Workers build passed (31.842 s). No live generation. Screenshot: `test-results/settings-only-upload-hint.png`.

## Clear selected photo — verified (2026-10-17)

- Add Clear photo beside Choose another photo. One click removes the selected photo, outline, case selection and displayed result, resets the file input and returns to the empty uploader. No server deletion, generation or credit use.
- Disable clearing during pending/uncertain edits. Check sample clearing, uploading the same file again and the existing pending lock only.

Verification: both targeted E2E scenarios passed (5.6 s): clearing a sample, choosing/clearing the same local file twice, and disabling Clear photo during pending generation. Typecheck passed (17.211 s); Workers build passed (59.554 s; existing chunk warnings). No live generation or database changes.

## Automatically scrolling example strip — verified (2026-10-17)

- Hide the top strip's native horizontal scrollbar and slowly scroll through the ten examples automatically, reversing gently at either end. Hover, keyboard focus, touch interaction, pending edits and reduced-motion preferences pause automatic movement; selection and manual navigation remain available.
- Check the hidden scrollbar, automatic movement and one exact recipe selection. No generation or broad audit.

Verification: the single targeted E2E passed (3.3 s), confirming hidden native scrollbar, automatic movement and exact Breast Subtle recipe selection with ten cases. Typecheck passed (22.695 s); Workers build passed (1m17.268s; existing chunk warnings). No generation calls. Screenshot: `test-results/example-auto-scroll.png`.

## Workbench private result image loading — verified (2026-10-17)

- The workbench loads existing private results using a same-origin authenticated fetch and displays a decoded blob URL, reusing the compact editor's loader. Direct image requests to the Node dev API may return static HTML/404 and must not be used.
- Preserve direct result display, stable frame height, existing download and mode/strength labels. Automatic retries and Reload image read only the saved result; neither creates another edit or charge.
- Reproduce the actual image-vs-fetch routing difference, recover the user's saved Breast 100 result, verify one debit and the unchanged 285 balance, then run only related E2E, typecheck and build.

Results: reproduced the direct-image HTML/404 versus fetch JSON/401 routing difference; the new regression failed before the fix. The existing real result recovered in the user's browser as a decoded 1086×1448 blob, without another provider request. Six related E2E scenarios passed (four initially; two hit the existing initial auth-readiness wait and passed on targeted rerun, 10.7 s). Coverage includes bounded result-GET retries/manual reload, same-request recovery, current settings, retained user instructions and download. Typecheck passed (18.903 s); Workers build passed (2m11.07s, existing chunk-size warnings). Evidence: `test-results/result-preview-recovery/`. No additional paid generation or broad audit.

## Neon connection failures during editing — verified with billing limitation (2026-10-16)

- Local PostgreSQL connections allow 15 seconds to establish, matching Workers, instead of failing after 3 seconds; enable TCP keepalive without replaying queries or generation requests.
- An identity/session database failure returns a private 503 SESSION_UNAVAILABLE response before either account or guest generation. It must not bypass login checks, expose database details, or discard recovery of an earlier uncertain edit.
- Verify recovery in the editor and live provider/storage behavior; distinguish actual integration results from mocked regression checks. Run the focused API/E2E tests, typecheck and build only.

Results: the real local terminal showed repeated Better Auth PostgreSQL connection timeouts before a new job existed. After increasing the Node pool connection timeout to 15 seconds/query timeout to 12 seconds and restarting the verified localhost:7001 process, the user's browser resolved its signed-in session and a Breast 100 submission returned INSUFFICIENT_CREDITS, with no provider call or debit. No balance, entitlement or existing job was changed. A separate one-shot shared-provider diagnostic generated Breast 100 from the fictional built-in original in 36.219 seconds (1086×1448); materialization and private Node storage write/read passed. This does not claim a successful charged account flow: the account has insufficient credits. 97 focused API tests and 2 related E2E tests passed (5.4 s; generation mocked in E2E). Typecheck passed (10.941 s), Workers build passed (30.731 s; existing chunk warnings), Workers SSR returned 200. Diagnostic artifacts: `test-results/db-connection-diagnostic/`.

## Current edit settings and interrupted generation — verified (2026-10-16)

- Reproduce Proportions/fullness sample -> manual Breast 100. Submit the current mode, strength and current instructions, not the original recipe. Clear inherited sample instructions on manual mode changes; retain user-authored instructions.
- Starting generation removes the saved example result. Pending, failed or uncertain requests never fall back to the old case image. Show the request state and its mode/strength in the result pane.
- A successful result displays the returned image and its actual mode/strength. Status recovery reuses the interrupted request ID and submitted settings; no new paid request is created by a setting change or automatic retry.
- Verify intercepted multipart payload, network interruption, exact recovery, user instructions and affected sample flows; run typecheck/build and related E2E without paid generation.

Results: before-fix reproduction submitted Breast 100 correctly but retained inherited fullness instructions after changing mode and redisplayed the saved Proportions sample after a network failure. After the fix both stale behaviors are absent. All 12 related E2E scenarios passed (55.9 s); the 2 new regressions passed again (6.6 s) after the recovery footer update. They verify live mode/strength, cleared inherited versus preserved user-authored text, no old-image fallback, original request-ID recovery and actual result metadata. Final typecheck passed (10.872 s), Workers build passed (29.912 s; existing chunk-size warning), Workers SSR returned 200. Provider rendering was mocked, not retried live. Evidence: `test-results/live-editor-settings/`.

## Per-case settings-only options — verified (2026-10-16)

- Remove the global gallery switch. Each of the ten cards has its own settings-only switch immediately after Try, initially off and independent of other cards and the top strip.
- Card Try uses that card's switch: off loads its photo and exact recipe; on preserves the editor photo/result and applies only the recipe. Switching alone changes no editor content and never generates.
- All card switches are disabled without a photo or during pending/uncertain edits. Preserve the 4/2/1 responsive layout, comparison sliders, all ten recipes and pending guards.
- Verify independent defaults/state, separation from the top switch, both Try behaviors, no selection-triggered generation, responsive layout, typecheck and build.

Results: 10 related E2E scenarios passed (50.5 s), including independent card defaults, separation from the top preference, photo/result retention and replacement, all ten Try recipes, pending guards and comparison controls. Browser walk confirmed Try followed by each option at 1440/1024/390px without overflow. Typecheck passed (12.985 s); Workers build passed (47.667 s; existing chunk-size warning). Workers SSR returned 200 with one switch per card, no gallery header switch and an empty initial editor. No paid generation. Evidence: `test-results/per-case-settings/`.

## Mirrored settings-only controls and compact gallery — verified (2026-10-16)

- Show the same controlled settings-only switch above both the top case strip and lower gallery. Both default off, share checked/disabled state, and stay disabled without a loaded photo or during pending/uncertain requests.
- Switching either control updates the other without changing current photo/result; choosing a case through either entry respects this state.
- Display 4 gallery cards per desktop row (1024px+), 2 on tablet (768px+) and 1 on phones. Preserve full portrait aspect ratio, sliders, Try actions, all ten cases and no horizontal page overflow.
- Verify bidirectional switch synchronization, gallery Try with settings-only on/off, responsive column counts, existing pending guard, related E2E, typecheck and build. No paid generation.

Results: 10 related E2E scenarios passed (50.5 s), including bidirectional checked/disabled synchronization, unchanged photo/result on toggling, all ten gallery Try actions, pending guards and 1/2/4 responsive columns. Browser walk confirmed smaller portraits and no mobile overflow. Typecheck passed (24.57 s), Workers build passed (1m17.851 s; existing chunk-size warning). No paid generation. Evidence: `test-results/gallery-compact/`.


## Restored real-case gallery and Try — verified (2026-10-16)

- All ten existing cases render below the editor in SSR HTML, in two desktop columns and one mobile column, including the two clearly labelled Breast cases.
- Each card has its own accessible original/actual comparison slider, mode, exact intensity, description, optional submitted instructions and Try link.
- Try scrolls to the editor and loads the same case photo and recipe as its top thumbnail. Settings-only preserves the current photo/result; no generation happens on Try. Pending/uncertain edits prevent Try from changing state.
- The workbench retains direct result display and an initially empty photo state. The lower gallery owns the unique #real-results anchor.
- Verify gallery slider keyboard/touch, all ten Try recipes, settings-only retention, pending lock, mobile overflow, typecheck and build; no paid generation.

Results: 9 related scenarios passed (8 initially; disabled-link guard rerun passed after bypassing Playwright's intentional aria-disabled actionability check). All ten gallery Try recipes and keyboard/touch sliders verified without generation requests. Typecheck passed (25.617 s), Workers build passed (1m22.319 s; existing chunk-size warning). Workers SSR returned 200 with 10 cards, 10 Try links, a unique #real-results anchor, one h1/canonical and an empty initial editor. Evidence: `test-results/gallery-try/`.


## Editor workbench and explicit preset behavior — verified (2026-10-16)

- Initial homepage has no selected example or loaded photo; Slim 70 and empty instructions, one upload canvas.
- Ten examples scroll horizontally above the editor. Default selection replaces photo and applies the exact recipe, displaying its saved edited half directly, with no comparison slider or duplicate settings.
- “Only apply settings” defaults off and is disabled without a photo. Toggling it changes no content. When enabled, case selection preserves the current original and its result while updating the recipe.
- Uploading another photo clears the previous result. Parameter changes retain the result with a regenerate notice. Only Edit Photo submits; pending and uncertain requests lock photo/settings/presets.
- Desktop original/result/settings share one wide workbench; mobile uses Original/Result tabs. No horizontal page overflow at 320, 390, 768 or 1440px.
- Verify exact submitted file/recipe, refunded failure, successful result/download, guide compatibility, typecheck and build without paid generation.

Results: all 9 related scenarios passed (7 in the first run, remaining 2 after correcting a fixture assertion and waiting for auth readiness). Typecheck passed (24.803 s); Workers build passed (1m16.422 s, existing chunk-size warning). Desktop/mobile visual walk confirmed direct result display and no page overflow. Workers preview returned 200 with 10 cases, one h1/canonical, no selected case or loaded photo. API generation and downloads were mocked; no paid generation. Evidence: `test-results/workbench/`.


## Unified real example presets — verified (2026-10-16)

- Show ten unique real cases in a scrollable thumbnail selector near the uploader, including all four modes and custom recipes. Right comparison uses the selected saved actual result and original, with fixed case mode/intensity/instructions in SSR HTML. Remove the duplicate lower gallery and all concept-only hero images.
- Selecting a case loads its original and exact settings when no device photo exists. Set mode/intensity and clear or fill instructions; expand instructions when nonempty. No generation or quota consumption. Rapid selection must resolve to the last chosen case and remain locked during pending/uncertain edits.
- After a user uploads a device photo, selecting cases applies settings while preserving that photo. An explicit Use this sample photo action replaces it. Replacing a sample with a device photo retains the recipe. Editing controls changes only the local target and submitted settings; the saved reference remains fixed and is labeled accordingly.
- Verify ten sources/people, fixed reference versus changed controls, recipe clearing and retention, mobile horizontal selector/desktop vertical selector, no horizontal page overflow, and zero selection-triggered generation POSTs. Run only related E2E, typecheck and build.

Verification: browser walk confirmed ten SSR choices, no duplicate gallery/concept hero, exact recipe loading, immutable saved reference, retained device photo/recipe, explicit sample replacement, empty-instruction clearing and horizontal mobile selector, with zero generation POSTs. Nine targeted E2E tests passed (37.0s): eight unified-preset scenarios plus the affected homepage entrypoint. They cover ten unique originals/people, all actual modes/intensities/instructions, 320/390/768/1280 layouts, keyboard/touch comparison, delayed-fetch races and one locally intercepted multipart submit/pending-lock/refund flow. Typecheck passed (21.928s), one build passed (1m17.817s; existing chunk-size warning), and Workers SSR returned 200 with ten examples, one h1/canonical, fixed saved-result metadata and no duplicate cards/concept labeling. No live provider requests, new image generation, full-suite run or broad audit.

## Unique people in every actual case — verified (2026-10-16)

- Replace the reused subjects in the fuller-figure and combined-edit cases with two newly generated adult originals and actual editor outputs. Keep ten cases and require ten distinct subjects/source hashes, including a white man, the existing Black man/woman and East Asian woman.
- Update translated alt text and provenance, retain the six-plus-four gallery interaction, and run the focused gallery E2E, typecheck and build only.

Verification: both new actual editor requests succeeded without retries. The two versioned assets replace the reused subjects. Public provenance contains ten different subject IDs and ten different source hashes. Two focused E2E cases passed (6.9s), including all asset decoding, unique originals, the white man, retained Black/East Asian subjects, expansion and mobile layout, with zero browse-triggered generation POSTs. Typecheck passed (33.878s) and one build passed (1m38.963s; existing chunk-size warning).

## Ten actual editing cases — verified (2026-10-16)

- Show ten traceable actual editor results covering Slim, Muscle, Proportions, Breast and optional custom instructions, with at least six distinct fictional adult subjects. Do not count strength variants as independent cases.
- Each card shows its original/result comparison, specific goal, mode, intensity and optional submitted instructions. Six cards appear initially; an accessible expansion reveals four more and can collapse them. All case copy/alt stays in SSR HTML, images load lazily, and mobile has no horizontal overflow.
- Expansion/comparison must not call generation APIs or change the uploaded photo. Keep one proof gallery and preserve the distinct hero/mode/detail roles.
- Verify the focused gallery flow, typecheck and build only; do not run broad audits or repeat paid requests automatically.

Verification: ten cases across eight subjects, including the requested Black man/woman and East Asian woman, with dress/skirt/shorts variety visible among the initial six. Browser walk and four related E2E cases passed (21.5s), covering SSR/SEO assets, gallery expansion/collapse, comparison endpoints, original preservation, decoded lazy-loaded assets and 390px overflow, with zero generation POSTs. Typecheck passed (27.498s), one build passed (1m2.761s; existing chunk-size warning), and Workers SSR returned 200 with all ten cases. Source/output hashes and source prompts are recorded alongside the public pairs.

## Homepage sections have distinct purposes and people — verified (2026-10-16)

- Hero trial thumbnails and illustrative preview use the existing lifestyle portraits, distinct from the two actual-result subjects. Selecting a thumbnail still loads that original into the editor without generating.
- Keep actual results in their dedicated proof section. Replace repeated mode-comparison cards with four text-only mode choices, preserving any selected photo when choosing a mode.
- Remove the extra concept gallery and replace repeated detail photos with concise face/clothing/background checks. Verify only affected homepage flows, typecheck/build and Workers SSR; no generation calls or broad review.

Verification: the browser walkthrough confirmed three distinct hero portraits, two separate actual-result subjects, no images in mode/detail sections, all four mode choices, retention of the selected original, and no horizontal overflow at 390px, with zero generation POSTs. Hero, mode cards and mobile detail screenshots were inspected. Three focused existing E2E cases passed (15.0s): SSR/SEO separation, mode selection versus sample loading, and the five distinct photo resources. Typecheck passed (25.88s), one build passed (1m21.368s; existing chunk-size warning), and Workers SSR returned 200 with the lifestyle hero, actual results, mode guide and no duplicate gallery. No paid image generation, full-suite run or broad review.

## Two real MVP edits and homepage proof — verified (2026-10-16)

- Make exactly two live requests with existing fictional clothed-adult originals: Breast at 70, and Slim at 70 with waist-only instructions. Do not retry or generate extra variants.
- Confirm successful private image downloads and exhausted guest allowance. Recover an existing result in the actual browser and download identical bytes without a new generation request. Cover failure restoration with the existing provider-failure fixture case, without spending on an intentional live failure.
- Add these two actual before/after results to a separate SSR-visible homepage section, labeled as actual editor output from AI-created sample portraits. Existing concepts retain their labels. Verify comparison interaction/mobile fit, typecheck and one build only.

Verification: exactly two live requests succeeded (Breast 69.7s, waist-only 37.5s), each returning a downloadable 1086×1448 PNG and reducing its isolated guest allowance from 1 to 0; neither returned 502. Actual browser recovery and download matched the saved bytes with zero generation POSTs, then exposed the exhausted-guest sign-in entry. The initial cold browser initialization timed out before generation; both live calls therefore used the real guest HTTP endpoint, followed by the successful browser recovery check. The existing simulated-provider-failure E2E passed (3.4s), confirming restoration without an intentional paid failure. Homepage SSR, both loaded assets, actual comparison clip movement and 390px overflow checks passed. Typecheck passed (35.368s), one build passed (1m36.687s; existing chunk-size warning), and Workers SSR returned 200 with the new title, image alt and result asset. No extra live requests, retries or broad review.

## Breast area remains visible with a valid target contour — verified (2026-10-16)

- In Breast mode, keep the chest-area ellipse visible whether or not visible torso-side contours can be deformed; it continues to resize with intensity and retain alignment.
- Keep the detected target contour when available, and label the solid target and dashed area separately. Other modes do not show a chest-area ellipse, and hide/show still controls the overlay.
- Reproduce both supplied screenshots using local inference only. Verify the visible-target and fallback-area UI flows, typecheck/build and Workers SSR; no paid generation or broad review.

Verification: both diagnostic screenshots returned reliable torso landmarks and usable Breast target contours. The UI previously hid the area whenever such a target existed. Both screenshots now retain their chest-area ellipse alongside the target, and both respond to intensity; the walkthrough screenshots were inspected, with two local worker analyses and zero generation POSTs. Two focused E2E cases passed (18.3s), covering real local inference, all modes, always-visible Breast area, mobile wrapping, and the existing fallback alignment/reset flow. Typecheck passed (14.487s), one build passed (1m19.542s; existing chunk-size warning), and local Workers SSR returned 200 with the heading and editor. Screenshot-based diagnosis verifies the display issue, not precise breast segmentation of the original photos.

## Breast area guide follows intensity — verified (2026-10-16)

- The fallback chest ellipse grows continuously as Intensity increases and shrinks when it decreases. Its default-strength size remains the same.
- Manual alignment retains the chosen center across slider changes. Repeated adjustment does not compound the radius scaling; reset restores the center while retaining the current intensity size.
- Original photo/contour, inference count and generation count remain unchanged while moving the slider. Verify the focused area-guide flow, typecheck/build and local Workers SSR only.

Verification: all 28 geometry tests passed. Local browser walkthrough using the prior supplied-photo analysis confirmed visible size changes at strengths 1 and 100 (both radii increased by about 54%), a stable aligned center, and reset without generation requests; both endpoint screenshots were inspected. Three focused browser cases passed: the expanded area-guide case plus existing alignment and mobile cases. The pointer test now hovers the handle before measuring drag coordinates so slider-induced scrolling has settled. Typecheck passed (24.133s), one build passed (1m20.957s; existing chunk-size warning), and local Workers SSR returned 200 with the heading and editor. No paid generation or broad review.

## Covered-chest preview remains visible and adjustable — verified (2026-10-16)

- Reproduce the original-only regression using locally detected contours from the supplied screenshot. Its shoulder/hip detections are reliable; the visible chest-height silhouette belongs to the arms.
- When no visible chest-side target can be computed, show a purple approximate chest-area guide and localized explanation. Keep alignment, keyboard/pointer adjustment, hide/show and reset reachable; do not deform the arms or claim the area guide predicts the result.
- Clear chest-side contours retain their target outline. Other modes and generation inputs remain unchanged. Verify the supplied screenshot locally, the focused browser regression, typecheck/build and a Workers SSR smoke; no paid generation or broad review.

Verification: local inference on the supplied screenshot returned reliable shoulder/hip landmarks, but the old availability check reported a target despite zero actual contour displacement. Availability now follows the computed paths. The browser walkthrough using that analysis confirmed the visible area guide, keyboard movement and reset with zero generation POSTs; its screenshot was visually inspected. All 27 geometry tests and three focused E2E cases passed (7.1s), including fallback-area pointer/keyboard adjustment, reset, hide/show, normal controls and mobile layout. Typecheck passed (25.87s), one build passed (1m13.782s; existing chunk-size warning), and local Workers SSR returned 200 with the heading and editor. This verifies preview behavior on a diagnostic screenshot, not precise reconstruction of occluded anatomy or generated-image quality.

## Breast preview excludes arm edges — previous verification (2026-10-15)

The original-only fallback and hidden alignment controls below caused the reported usability regression and are superseded by the 2026-10-16 area-guide behavior above. These earlier checks did not establish an improvement in real-photo chest recognition.

- Breast targets only plausible visible torso-side edges localized by reliable shoulder/hip points, keeping upper-arm and forearm contours fixed. Tilted torsos use body-relative coordinates.
- When no reliable visible chest-side edge is available (occlusion/uncertain pose), show the original outline and a localized explanation, keep normal generation available, and do not invent a target contour or ineffective alignment controls.
- Other modes, local inference, source pixels, provider prompts and credit paths stay unchanged. Verify targeted geometry tests and one browser regression plus the required typecheck/build; no paid generation, model replacement or broad audit.

Verification: 27 geometry tests passed, including the reproduced upper-arm/forearm expansion, missing/low-confidence pose, covered torso and recoverable manual alignment. A browser walkthrough and three focused E2E cases passed (4.5s): uncertain-chest original-only state, normal mode switching, hide/show/alignment and mobile controls. Typecheck (21.455s), one build (1m35.784s, existing chunk-size warning) and minimal local Workers SSR smoke passed. No paid image generation, model/asset replacement or broad review. The provided marked screenshot was unsuitable as a clean local-inference benchmark (no usable original contour was returned from its diagnostic crop); exact source-photo accuracy was not verified. Tests cover the corrected geometry/UI behavior, not hidden anatomical reconstruction.

## Optional extra body-edit instructions — implemented, contracts verified (2026-10-15)

- Keep four modes and the strength slider. Optional instructions can be opened, typed, cleared or left blank without any generation request; show a useful input example and character limit on desktop/mobile.
- An explicit edit submits the exact normalized instruction with the photo/mode/strength. Blank instructions retain the existing default flow, provider prompt and request hash.
- Instructions can narrow the edit to one area or replace the preset's target; preserve face, outfit/coverage, scene and framing. The local outline continues to show mode/strength rather than parsing free text.
- Lock text with the other settings during pending/uncertain requests. Retry uses the same instruction/request UUID. Login retains it; choosing another photo/sample resets it.
- Reject excessive, control-character, duplicate or file-valued instructions before billing/provider calls. Changed instructions with a reused UUID conflict; guest and paid paths share the contract and preserve existing quotas/refunds/privacy.
- Walk the real browser UI before writing E2E, with fixture provider responses. Run affected suites, typecheck/build, SEO and Workers SSR. Keep a bounded live spot-check separate from regression and record any quality limitations.

Verification completed within the user's requested scope:

- Shared domain: 288 tests across eight suites passed, including blank prompt/hash compatibility, normalization, UTF-8 prefix allocation, provider multipart, real SQLite guest/paid idempotency and no extra charge/provider call.
- HTTP: 96 tests across two suites passed. Both guest and account submissions forward normalized text; excessive/control/duplicate/File values return `INVALID_INSTRUCTIONS`/400 before execution.
- Browser: nine new instructions E2E cases passed (19.6s), covering optional/blank payloads, limits, no-call typing, settings/login retention, pending/uncertain locks, snapshot retry, ID-only session storage, correction after 400, photo/sample resets and mobile layout. Twenty existing editing/guest critical-flow cases also passed (1.0m). Provider/auth responses were fixtures and database cleanup was disabled.
- Fresh typecheck passed (18.355s), one Cloudflare production build passed (1m44.923s, existing chunk-size warnings). Minimal local Workers smoke returned 200 for SSR homepage with the optional control and 200 for config; editing correctly remained unavailable without production secrets/database bindings.
- One live `waist-only` generation was attempted with the existing fictional clothed-adult original. The provider request timed out (`TIMEOUT`); no result or visual adherence was verified. No second generation or automatic repeat was made. Quick-target shortcuts remain outside this change.
- No new database migration, environment variable, indexable route, checkout or deployment. No additional review rounds, full-suite reruns or broad SEO audit were performed after the user asked to keep verification bounded.

## Guest body edit trial — verified (2026-10-15)

- Fresh guest selects a photo, any mode and strength, generates without sign-in, compares and downloads the private result.
- One successful edit consumes the browser guest allowance. Refresh, another tab and a new request ID do not restore it; further generation prompts sign-in without a provider call.
- Provider failure/timeout releases the allowance, with bounded retries. Duplicate and concurrent submissions cannot execute multiple trials.
- Guest session initialization requires same origin. Another guest cannot poll, look up or download the result; ownership stays private after login.
- Signing in grants no new account trial; paid-account validation, balance deductions/refunds and banned-account checks remain enforced.
- Cookie resets remain bounded by persistent network quotas. Validation uses mocked provider responses and temporary databases, never live paid generation.
- Verify homepage and tool-page EN/ZH copy, desktop/mobile UI, focused E2E, typecheck/build and Workers SSR. Only TanStack remains in this repository.

Verification:

- 346 unit tests across 13 related suites passed; three additional opt-in tests passed against real PostgreSQL in an isolated, subsequently removed schema, including concurrent guest/network reservations.
- 50 Chromium E2E cases passed in 2.3 minutes: guest trial (4), editing (16), contour preview (7), entrypoints (8), homepage (15). Guest tests run real handlers, service, HttpOnly cookies and transactional SQLite; provider/object store/auth sessions are fixtures. No live paid generation or test-user cleanup against the configured database.
- The login/reload regression was reproduced before the fix and passed afterwards. Guest recovery remains cookie-owned after login; new signed-in submissions use account credits. Error messaging follows the original job's billing source.
- Fresh `pnpm typecheck --force` and `pnpm build --force` passed through Corepack pnpm 9.4.0 (an ignored PATH shim avoids the environment's incompatible pnpm wrapper). Existing chunk-size warnings remain.
- SEO audit passed. Workers local preview on port 7004 returned 200 with SSR guest copy for `/`, `/body-editor`, `/skinny-filter`, `/breast-expansion`; configuration returned 200 with editing unavailable because production secrets/database bindings are absent. This verifies rendering/preflight, not production generation.
- The configured development Neon database received only additive migration `0007_body_guest_edit`; 17 columns/four indexes verified. Actual development guest-session API returned 200, remaining 1, HttpOnly cookie and private/no-store. One initial transient 500 did not reproduce after server reload; unknown initialization failures now log only error name/code.
- Existing preview tests were aligned with the current four-mode slider, cropped sample blobs and sample sidebar; guest initialization POSTs are excluded from generation/mutation counts. Used Playwright for the browser walkthrough because `agent-browser` was unavailable. Only TanStack is maintained; checkout and deployment are outside this change.

## Unified edit action — verified (2026-10-14)

- Sample and uploaded photos use the exact English action label `Edit Photo` in every edit mode.
- The editor contains neither the sample-specific notice nor a `Clear sample` button. The sample sidebar keeps its notice, with `Edit Photo` wording.
- Selecting another sample or uploading a replacement photo remains available; choosing a sample does not generate an edit.
- Focused regression: the four mode submission cases and the live sample outline case in `body-editing.spec.ts`. Updated existing preview and entrypoint selectors; no new broad coverage.
- Verification: all 5 focused E2E cases passed (10.0s); fresh local `tsc --noEmit` and Cloudflare build passed, with existing chunk-size warnings. Provider responses were mocked; the full suite and adapted visual-homepage cases were not run.

## Sample portrait outline — verified (2026-10-14)

- Selecting a sample crops its original portrait half into the same local-photo input used by uploads, mounts the contour preview and starts local analysis once.
- Changing mode or intensity updates the target contour without rerunning analysis or sending an edit POST; the original contour stays unchanged.
- Explicit generation submits the prepared 768×1024 original portrait with the selected settings. Clearing the result removes its contour; uploading another photo starts fresh analysis.
- Focused regression: `body-editing.spec.ts` → `samples preview a live outline and send only the original portrait half`.
- Verification: 2 focused E2E tests passed (5.0s), covering the live sample outline and missing-task sample selection. Fresh local `tsc --noEmit` and Cloudflare `vite build` passed; existing chunk-size warnings remain. Outline analysis and edit responses were mocked; no provider generation, billing or full-suite checks.

## Sample placement and missing-request recovery — verified (2026-10-14)

- Sample portraits sit beside the homepage upload/editor area on desktop and stay adjacent on mobile. Selecting a sample only changes the preview; generation requires the edit button.
- A saved request without a job ID gets a 15-second upload/reservation grace period, measured from submission. Repeated `NOT_FOUND` responses then stop the spinner, clear the missing recovery record and unlock photo/sample selection.
- A request found during the grace period resumes its original job without another edit POST or charge.
- Verification: 6 focused body-editing E2E tests passed (17.5s), including stale recovery, a temporary lookup 404 during reload, sample submission/placement, ambiguous failures and mobile controls. Fresh local `tsc --noEmit` and Cloudflare `vite build` passed; existing chunk-size warnings remain. Used installed CLI wrappers because the environment's `pnpm` wrapper attempted an unrelated dependency reinstall. No full suite, provider generation or database writes were performed.

## Continuous body-edit intensity — implemented and verified (2026-10-14)

- The uploader exposes a labeled slider from 1 to 100, initially 70, with localized Subtle/Dramatic endpoints and an accessible numeric value out of 100.
- Pointer/touch and keyboard input can select intermediate values such as 37 and 73. Moving the slider or changing mode sends no edit POST.
- All four modes submit the exact numeric strength only on explicit generation. Server prompts interpolate mode-specific shape targets across the entire range.
- Pending and unresolved requests lock strength. Sign-in preserves the photo, mode and exact value. Uncertain retries preserve settings and request ID.
- Invalid, fractional and out-of-range strengths fail before billing/provider execution. Legacy named requests and saved jobs stay compatible.
- Mobile controls fit the viewport. Credit cost remains 15 at every strength.
- Verification: 295 related unit tests passed; 23 body-editing/entrypoint E2E tests passed; fresh uncached typecheck and Cloudflare build passed; Workers SSR smoke returned 200 with the slider, h1 and canonical on all four public pages. Desktop/mobile screenshots are under ignored `test-results/body-intensity-*.png`.
- Live quality checks: 13 bounded Rabbit requests on original fictional-adult samples produced 10 valid images; one request returned 502 and two timed out. All four modes returned usable edits. Slim and Muscle 20/90 and calibrated Proportions 20/90 were visually reviewed; Breast returned a final calibrated strength-70 edit after its strength-90 calibration request timed out. These samples do not establish strictly linear or repeatable output at every strength. No automatic paid retries or test-account credit deductions were performed.

本文档详细记录所有已实现的 E2E 测试用例，包含每个测试的具体步骤和验证内容。

> 编写规范和架构约定请查看 [`AGENTS.md`](./AGENTS.md)。

---

## 目录

### 已实现

- [1. 公共页面冒烟测试](#1-公共页面冒烟测试)
- [2. 认证流程测试](#2-认证流程测试)
- [3. 权限控制测试](#3-权限控制测试)
- [4. 仪表盘测试](#4-仪表盘测试)
- [5. 定价页测试](#5-定价页测试)
- [6. AI 功能页测试](#6-ai-功能页测试)
- [7. Stripe 支付流程测试](#7-stripe-支付流程测试)
- [8. 个人资料更新测试](#8-个人资料更新测试)
- [9. 修改密码测试](#9-修改密码测试)
- [10. 语言切换测试](#10-语言切换测试)
- [11. 上传页测试](#11-上传页测试)
- [12. 管理员面板测试](#12-管理员面板测试)
- [13. AI 对话（真实交互）](#13-ai-对话真实交互)
- [15. AI 图片生成（真实生成）](#15-ai-图片生成真实生成)
- [17. Creem 支付流程测试](#17-creem-支付流程测试)
- [18. PayPal 支付流程测试](#18-paypal-支付流程测试)
- [16. 管理员子页面筛选功能测试](#16-管理员子页面筛选功能测试)

- [21. 推荐返利系统测试](#21-推荐返利系统测试)
- [22. 管理员返利管理测试](#22-管理员返利管理测试)
- [23. 推荐佣金支付全流程测试](#23-推荐佣金支付全流程测试)
- [24. 管理员动态定价管理测试](#24-管理员动态定价管理测试)
- [25. Waffo 支付流程测试](#25-waffo-支付流程测试)
- [26. 同一编辑器的首页与专题入口](#26-同一编辑器的首页与专题入口)
- [27. 视觉优先首页与概念照片交互](#27-视觉优先首页与概念照片交互)

### 待实现 (Backlog)
- [19. 支付宝支付流程测试](#19-支付宝支付流程测试)
- [20. 博客功能测试](#20-博客功能测试)

### 追踪

- [Backlog 优先级汇总](#backlog-优先级汇总)
- [测试结果追踪](#测试结果追踪)

---

## 1. 公共页面冒烟测试

**文件：** `specs/public-pages.spec.ts` ｜ **优先级：** P0 ｜ **无需登录**

最基础的健全性检查，验证公共页面能正常打开、不报错。

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | 首页加载 | 打开 `/en` → 验证页面标题不含 error/500/404 → 验证 `<header>` 和 `<nav>` 可见 → 验证首屏 `<h1>` 标题可见 |
| 2 | 登录页加载 | 打开 `/en/signin` → 验证邮箱输入框、密码输入框、提交按钮均可见 |
| 3 | 注册页加载 | 打开 `/en/signup` → 验证姓名输入框（`#name`）、邮箱输入框、密码输入框、提交按钮均可见 |
| 4 | 忘记密码页加载 | 打开 `/en/forgot-password` → 验证邮箱输入框可见 → 验证表单内按钮可见 |
| 5 | 定价页加载 | 打开 `/en/pricing` → 验证标题不含错误 → 验证至少有一个含 ¥ 或 $ 价格的元素可见 |

---

## 2. 认证流程测试

**文件：** `specs/auth-flow.spec.ts` ｜ **优先级：** P0

完整的 注册 → 登录 → 登出 → 重定向 生命周期测试。

### 注册组

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | UI 表单注册 | 打开注册页 → 填写姓名/邮箱/密码 → 点击提交 → 等待 URL 离开 `/signup`（即注册成功后自动跳转） |
| 2 | API 注册 | 通过 `POST /api/auth/sign-up/email` 直接创建用户 → 验证返回 200 → 验证响应体包含 `user.email` |

### 登录 / 登出 / 重定向组

> 这组测试共用一个用户账号（在 `beforeAll` 中通过 API 注册一次），避免频繁注册触发限流。

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 3 | UI 表单登录 | 打开登录页 → 填写邮箱/密码 → 点击提交 → 等待 URL 离开 `/signin` |
| 4 | API 登录 | 通过 `POST /api/auth/sign-in/email` 登录 → 验证返回 200 |
| 5 | 登出后无法访问仪表盘 | 先 API 登录 → 访问仪表盘确认可进入 → 调用 API 登出 → 再次访问仪表盘 → 验证被重定向到 `/signin` |
| 6 | 已登录用户访问 /signin 重定向到 /dashboard | API 登录 → 访问 `/signin` → 验证被自动重定向到 `/dashboard` |
| 7 | 已登录用户访问 /signup 重定向到 /dashboard | API 登录 → 访问 `/signup` → 验证被自动重定向到 `/dashboard` |

---

## 3. 权限控制测试

**文件：** `specs/access-control.spec.ts` ｜ **优先级：** P0

验证保护页面的访问控制：未登录 → 重定向，无权限 → 403。

### 未认证访问组

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | /dashboard 重定向 | 未登录访问 `/dashboard` → 验证 URL 包含 `/signin` |
| 2 | /upload 重定向 | 未登录访问 `/upload` → 验证 URL 包含 `/signin` |
| 3 | /admin 重定向 | 未登录访问 `/admin` → 验证 URL 包含 `/signin` |
| 4 | /premium-features 重定向 | 未登录访问 `/premium-features` → 验证 URL 包含 `/signin` |

### 已认证非管理员访问组

> 共用一个普通用户账号（`beforeAll` 注册）。

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 5 | 普通用户访问 /admin 返回 403 | API 登录普通用户 → 访问 `/admin` → 验证返回 HTTP 403 或重定向到 signin |
| 6 | 普通用户可以访问 /dashboard | API 登录普通用户 → 访问 `/dashboard` → 验证停留在仪表盘页面 |

---

## 4. 仪表盘测试

**文件：** `specs/dashboard.spec.ts` ｜ **优先级：** P1

验证仪表盘页面功能，包括用户信息展示和标签页导航。

> 所有测试共用一个浏览器上下文（避免限流），按串行顺序执行。

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | 仪表盘加载并显示用户信息 | API 注册并登录 → 访问 `/dashboard` → 验证 URL 正确 → 验证 `<h1>` 可见 → 验证用户名显示在页面上 |
| 2 | 个人资料标签页显示邮箱和姓名 | 访问 `/dashboard` → 等待加载完成 → 验证用户姓名和邮箱都显示在页面上 |
| 3 | 可以在标签页之间导航 | 访问 `/dashboard` → 获取所有标签按钮 → 验证数量 > 1 → 点击第二个标签 → 验证未离开 dashboard 页面 |

---

## 5. 定价页测试

**文件：** `specs/pricing.spec.ts` ｜ **优先级：** P1 ｜ **无需登录**

验证定价页的计划卡片渲染和标签切换。

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | 渲染计划卡片 | 打开定价页 → 验证页面标题可见 → 验证至少有一个含价格符号的元素 |
| 2 | 卡片显示名称、价格和功能 | 打开定价页 → 验证 `<h3>` 计划名称数量 ≥ 1 → 验证 CTA 按钮数量 ≥ 1 |
| 3 | 卡片包含功能列表和勾选图标 | 打开定价页 → 验证功能列表项数量 ≥ 1 |
| 4 | 订阅 / 积分标签切换 | 打开定价页 → 检查是否有标签切换器 → 如果有，点击「积分」标签 → 验证价格仍然可见 → 切回「订阅」标签 → 验证价格可见 |

---

## 6. AI 功能页测试

**文件：** `specs/ai-features.spec.ts` ｜ **优先级：** P2

验证 AI 功能页面能正常加载并显示关键 UI 元素。**不会**实际调用 AI API 生成内容。

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | AI 对话页加载 | 打开 `/ai` → 如果未被重定向到登录页，验证文本输入区域（`<textarea>` 或 `contenteditable`）可见 |
| 2 | 图片生成页加载 | 打开 `/image-generate` → 验证提示词输入框可见 → 验证模型选择器（下拉框）存在 |
| 3 | 视频生成页加载 | 打开 `/video-generate` → 验证提示词输入框可见 → 验证模型选择器（下拉框）存在 |
| 4 | 图片生成页有生成按钮 | 打开 `/image-generate` → 验证页面上至少有一个按钮 |
| 5 | 模型目录不含已下线型号 | 打开 `/ai` → 打开模型下拉 → 可见 Qwen 3.7 Flash → 不可见 Qwen Turbo / DeepSeek Coder / GPT-5 Codex。打开 `/image-generate` → 可见 Qwen Image 3.0 Pro → 不可见 DALL-E 3 / Qwen Image Plus。打开 `/video-generate` → 可见 Seedance 2.5 → 不可见 Kling 2.5 / Wanxiang 2.6 |
| 6 | 视频生成页有生成按钮 | 打开 `/video-generate` → 验证页面上至少有一个按钮 |

---

## 7. Stripe 支付流程测试

**文件：** `specs/stripe-payment.spec.ts` ｜ **优先级：** P0

> ⚠️ **前置条件：**
> 1. 开发服务器在 7001 端口运行
> 2. `stripe listen --forward-to localhost:7001/api/payment/webhook/stripe` 正在运行
> 3. `.env` 中配置了 Stripe 测试模式的 API Key

完整的 Stripe 支付端到端流程，覆盖**订阅购买**和**积分购买**两个链路。使用测试卡号 `4242 4242 4242 4242` 模拟支付，不产生真实扣款。

> 所有测试共用一个浏览器上下文（`beforeAll` 注册），按串行顺序执行。

### A) 订阅购买流程

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | 点击 Stripe 订阅计划跳转到 Checkout | API 注册用户 → 打开定价页（默认"订阅"标签页） → 等待 plan cards 渲染完成 → 找到 "Stripe Monthly Plan" 标题 → 滚动到可见区域 → 点击对应的 CTA 按钮 → 等待 URL 跳转到 `checkout.stripe.com` |
| 2 | 完成 Stripe 订阅支付 | 重复步骤 1 跳转到 Stripe Checkout → 等待卡号输入框出现 → 填写卡号 `4242 4242 4242 4242` → 填写有效期 `12/30` → 填写 CVC `123` → 填写持卡人姓名 → 点击 "Subscribe" 按钮 → 等待重定向回 `/payment-success` → 验证 URL 包含 `payment-success` 和 `provider=stripe` |
| 3 | 支付成功页显示成功 UI | 重复步骤 2 完成支付 → 验证成功页 `<h1>` 标题可见 → 验证页面上有跳转到 `/dashboard` 的链接 |
| 4 | 支付取消页可正常访问 | 直接访问 `/payment-cancel` → 验证 URL 正确 → 验证页面标题可见 → 验证有返回 `/pricing` 的链接 |
| 5 | 仪表盘订阅标签显示计划详情 | 访问 `/dashboard` → 点击"Subscription Status"导航按钮 → 等待订阅数据加载 → **如果 webhook 已处理**：验证计划名称 "Stripe Monthly Plan" 可见 → 验证 "Active" 状态徽章可见 → 验证 "Start Date" 和 "End Date" 标签可见 → 验证 "Recurring" 付款类型徽章可见 → 验证进度条存在。**如果 webhook 未处理**：验证 "No Active Subscription Found" 提示可见 → 验证 "View Plans" 链接可见 |

### B) 积分购买流程

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 6 | 点击 Stripe 积分计划跳转到 Checkout | 打开定价页 → 点击「Credits / 积分充值」标签 → 等待积分计划卡片渲染 → 找到 "100 Credits Stripe" 标题 → 点击对应的 CTA 按钮 → 等待 URL 跳转到 `checkout.stripe.com` |
| 7 | 完成 Stripe 积分购买 | 重复步骤 6 跳转到 Stripe Checkout → 填写测试卡信息 → 点击 "Pay" 按钮 → 等待重定向回 `/payment-success` → 验证 URL 包含 `payment-success` 和 `provider=stripe` |
| 8 | 仪表盘积分标签显示余额更新 | 访问 `/dashboard` → 点击"Credits"导航按钮 → 验证 "Credit Balance" 标题可见 → 验证 "Available Credits" 标签可见 → 读取余额数值 → 验证 ≥ 100 → 验证 "Total Purchased" ≥ 100 → 如果 webhook 已处理，验证交易记录中出现 "Purchase" 类型条目 |

### Stripe 订阅支付完整链路图

```
用户登录
  ↓
打开 /pricing 定价页（"订阅"标签页）
  ↓
点击 "Stripe Monthly Plan" 的 CTA 按钮
  ↓
前端调用 POST /api/payment/initiate { planId: 'monthly', provider: 'stripe' }
  ↓
后端创建 Stripe Checkout Session → 返回 paymentUrl
  ↓
前端 window.location.href = paymentUrl
  ↓
浏览器跳转到 checkout.stripe.com（Stripe 托管页面）
  ↓
用户填写测试卡信息并点击 "Subscribe"
  ↓
Stripe 处理支付 → 重定向到 /payment-success?session_id=xxx&provider=stripe
  ↓
前端调用 GET /api/payment/verify/stripe?session_id=xxx 验证支付状态
  ↓
同时 Stripe 发送 webhook → stripe listen 转发到 /api/payment/webhook/stripe
  ↓
后端更新订单状态 → 创建/更新订阅记录
  ↓
用户在仪表盘"订阅"标签页看到：计划名称、Active 状态、起止日期、进度条
```

### Stripe 积分购买完整链路图

```
用户登录
  ↓
打开 /pricing 定价页 → 切换到「积分充值」标签页
  ↓
点击 "100 Credits Stripe" 的 CTA 按钮
  ↓
前端调用 POST /api/payment/initiate { planId: 'credits100', provider: 'stripe' }
  ↓
后端创建 Stripe Checkout Session → 返回 paymentUrl
  ↓
浏览器跳转到 checkout.stripe.com
  ↓
用户填写测试卡信息并点击 "Pay"
  ↓
Stripe 处理支付 → 重定向到 /payment-success?session_id=xxx&provider=stripe
  ↓
webhook 触发后端 → 查询 plan 的 credits 字段 (100) → 调用 creditService.addCredits()
  ↓
用户在仪表盘"积分"标签页看到：可用积分 ≥ 100、累计购买 ≥ 100、交易记录
```

---

## 8. 个人资料更新测试

**文件：** `specs/profile-update.spec.ts` ｜ **优先级：** P1

验证仪表盘中编辑个人资料的完整流程：进入编辑模式 → 修改姓名 → 保存 → 验证更新。

> 所有测试共用一个浏览器上下文（`beforeAll` 注册），按串行顺序执行。

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | 个人资料标签页显示用户名和编辑按钮 | API 注册用户 → 访问 `/dashboard` → 验证用户名可见 → 验证 "Edit" 按钮可见 |
| 2 | 可以进入编辑模式并修改姓名 | 访问 `/dashboard` → 等待用户名加载 → 点击 "Edit" 按钮 → 验证 `#name` 输入框可见 → 清空并填入新姓名 → 点击 "Save" → 等待编辑模式关闭（"Edit" 按钮重新出现） → 验证新姓名显示在页面上 |

---

## 9. 修改密码测试

**文件：** `specs/password-change.spec.ts` ｜ **优先级：** P2

验证仪表盘「账户」标签页的密码修改功能。

> 所有测试共用一个浏览器上下文（`beforeAll` 注册），按串行顺序执行。

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | 账户标签页显示修改密码区域 | API 注册用户 → 访问 `/dashboard` → 点击 "Account" 标签 → 验证 "Change Password" 文字可见 → 验证修改密码按钮可见 |
| 2 | 可以打开密码修改对话框并提交 | 访问 `/dashboard` → 切换到 "Account" 标签 → 点击 "Change Password" 按钮 → 等待对话框出现 → 填写当前密码 → 填写新密码 → 填写确认密码 → 点击提交 → 等待对话框关闭（表示修改成功） |
| 3 | 可以用新密码登录 | 创建全新浏览器上下文（无 cookie） → 用新密码调用 `signInViaAPI` → 验证返回 200 → 访问 `/dashboard` → 验证用户名可见（确认 session 有效） |

---

## 10. 语言切换测试

**文件：** `specs/i18n-switching.spec.ts` ｜ **优先级：** P2 ｜ **无需登录**

验证页面头部的语言切换功能，确保切换后 URL 更新、内容切换且选择持久化。

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | 首页使用默认英文语言 | 打开 `/en` → 验证 URL 包含 `/en` |
| 2 | 从英文切换到中文 | 打开 `/en` → 点击语言下拉菜单 → 选择"中文" → 等待页面跳转到 `/zh-CN/` → 验证 URL 包含 `/zh-CN` |
| 3 | 从中文切换回英文 | 打开 `/zh-CN` → 点击语言下拉菜单 → 选择 "English" → 等待页面跳转到 `/en/` → 验证 URL 包含 `/en` |
| 4 | 语言选择跨页面持久化 | 打开 `/zh-CN` → 导航到 `/zh-CN/pricing` → 验证 URL 仍是中文 → 导航到 `/zh-CN/signin` → 验证 URL 仍是中文 |
| 5 | 子页面双语言均可访问 | 访问英文定价页 `/en/pricing` → 验证标题可见 → 访问中文定价页 `/zh-CN/pricing` → 验证标题可见 |

---

## 11. 上传页测试（真实上传）

**文件：** `specs/upload-page.spec.ts` ｜ **优先级：** P2

验证上传页面的真实上传流程（成功上传 + 客户端校验）。需要已配置可用的存储服务（OSS/S3/R2/COS）。

> 测试共用一个浏览器上下文（`beforeAll` 注册），按串行顺序执行。

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | 上传页加载并显示存储服务选择器 | API 注册用户 → 访问 `/upload` → 验证页面标题可见 → 验证存储服务选择下拉框（`[role="combobox"]`）可见 |
| 2 | 成功上传图片并显示结果 | 使用 `input[type="file"]` 上传 1 张小尺寸 PNG → 等待 `POST /api/upload` 返回 200 → 验证上传后缩略图可见 → 验证查看文件链接可见 |
| 3 | 非图片文件被拒绝 | 上传 `.txt` 文件 → 验证提示 "Only image files are allowed" → 验证未出现上传结果 |
| 4 | 超过 1MB 文件被拒绝 | 上传 > 1MB 文件 → 验证提示 "File size must be less than 1MB" → 验证未出现上传结果 |

---

## 12. 管理员面板测试

**文件：** `specs/admin-panel.spec.ts` ｜ **优先级：** P3

验证管理员面板的核心功能：Dashboard 统计、子页面数据表、侧边栏导航和权限控制。

> 使用预置管理员账号 `admin@example.com` 登录（非测试创建，不会被 teardown 清理）。

### 管理员 Dashboard

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | 管理员 Dashboard 加载并显示统计卡片 | 用管理员账号 API 登录 → 访问 `/admin` → 验证 "Admin Dashboard" 标题可见 → 验证至少有 4 个统计卡片 |
| 2 | Dashboard 显示图表和今日数据 | 访问 `/admin` → 验证 "Today" 相关文字可见 → 验证 "Recent Orders" 相关文字可见 |

### 管理员子页面

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 3 | 用户管理页显示数据表 | 访问 `/admin/users` → 验证 "User Management" 标题可见 → 验证 `<table>` 存在 |
| 4 | 订阅管理页显示数据表 | 访问 `/admin/subscriptions` → 验证 `<table>` 存在 |
| 5 | 订单管理页显示数据表 | 访问 `/admin/orders` → 验证 `<table>` 存在 |
| 6 | 积分管理页显示数据表 | 访问 `/admin/credits` → 验证 `<table>` 存在 |

### 侧边栏导航

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 7 | 侧边栏导航跨页面跳转 | 访问 `/admin` → 点击侧边栏 "Users" 链接 → 验证 URL 包含 `/admin/users` → 点击 "Orders" 链接 → 验证 URL 包含 `/admin/orders` |

### 用户详情管理

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 8 | 管理员从用户列表进入用户详情页 | 访问 `/admin/users` → 等待表格加载 → 点击第一行用户链接 → 验证 URL 匹配 `/admin/users/<id>` → 验证显示 "Edit User" 标题 |
| 9 | 管理员通过 API 获取用户详情 | 获取管理员 session → `GET /api/users/<adminId>` → 验证返回 200 → 验证 `id` 和 `email` 正确 |
| 10 | 管理员通过 API 更新用户信息 | 创建测试用户 → 重新登录管理员 → `PATCH /api/users/<testUserId>` 更新名称 → 验证返回 200 → `GET /api/users/<testUserId>` 验证名称已更新 |
| 11 | 非管理员用户无法访问用户详情 API | 创建普通用户 → `GET /api/users/<randomId>` → 验证返回 401 或 403 |

### 权限控制

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 12 | 非管理员用户访问管理面板被拒 | 使用全新浏览器上下文（未登录） → 访问 `/admin` → 验证被重定向到 `/signin` 或显示 "Access Denied" |

---

## 13. AI 对话（真实交互）

**文件：** `specs/ai-chat.spec.ts` ｜ **优先级：** P2

> ⚠️ **前置条件：**
> 1. 至少一个 AI 提供商的 API Key 已配置（如 Qwen、DeepSeek、OpenAI 等）
> 2. 积分通过 `seedCredits()` 在 `beforeAll` 中直接写入数据库（500 credits）

真实发送消息、验证 AI 回复、检查积分不足提示。

> 所有测试共用一个浏览器上下文（`beforeAll` 注册 + 种子积分），按串行顺序执行。

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | 使用默认模型发送消息并获得回复 | API 注册用户 → `seedCredits(userId, 500)` → 访问 `/ai` → 等待页面渲染 → 点击 "New Chat" 清除示例消息 → 在 `<textarea>` 输入 "Hello, please respond with OK" → 点击 `button[aria-label="Submit"]` → 等待 `.is-user` 用户消息出现 → 等待 `.is-assistant` 助手消息出现 → 轮询直到助手消息文本非空（Streamdown 流式渲染） |
| 2 | 对话历史显示用户和助手消息正确排列 | 访问 `/ai` → 清除示例消息 → 输入 "Say the word PINEAPPLE" → 提交 → 等待用户和助手消息均出现 → 验证消息总数 ≥ 2 → 验证倒数第二条为 `.is-user`、最后一条为 `.is-assistant` |
| 3 | 积分不足时显示错误提示 | 新建浏览器上下文 → API 注册用户（不种子积分，余额为 0） → 访问 `/ai` → 清除示例消息 → 输入 "Hello" → 提交 → 验证 "Insufficient Credits" toast 或 `.bg-destructive/10` 错误区域出现 |

### 积分种子方式

```
beforeAll:
  signUpViaAPI → 获取 userId → seedCredits(userId, 500)
  
seedCredits 实现 (helpers/credits.ts):
  1. 连接 DATABASE_URL
  2. UPDATE user SET credit_balance = credit_balance + amount WHERE id = userId
  3. INSERT INTO credit_transaction (bonus 类型) 用于审计追踪
```

---

## 15. AI 图片生成（真实生成）

**文件：** `specs/ai-image-generate.spec.ts` ｜ **优先级：** P2

> ⚠️ **前置条件：**
> 1. 至少一个图片生成提供商的 API Key 已配置（当前使用 Qwen / Aliyun BaiLian）
> 2. 积分通过 `seedCredits()` 在 `beforeAll` 中直接写入数据库（500 credits）
> 3. 生成通常需要 5-15 秒，测试超时设置为 120 秒

真实调用 Qwen 图片生成 API，验证图片生成、下载、积分不足提示。

> 所有测试共用一个浏览器上下文（`beforeAll` 注册 + 种子积分），按串行顺序执行。

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | 使用默认 Qwen 模型生成图片 | API 注册用户 → `seedCredits(userId, 500)` → 访问 `/image-generate` → 验证 `<h1>` 标题可见 → 验证 Provider 下拉框（`[role="combobox"]`）默认 "Aliyun BaiLian" → 验证 Model 下拉框默认 "Qwen Image 3.0 Pro" → 在 `<textarea>` 输入 "A cute cat sitting on a table" → 点击 "Generate" 按钮 → 等待成功 toast "Image generated successfully!" 出现（超时 60 秒） → 验证 `img[alt="Generated image"]` 可见 → 验证图片 `src` 非空 → 验证 "Download" 按钮可见 |
| 2 | 生成后可以下载图片 | 访问 `/image-generate` → 输入提示词 → 点击生成 → 等待成功 toast → 验证 "Download" 按钮可见且可用 → 点击下载 → 验证无错误发生 |
| 3 | 积分不足时显示错误提示 | 新建浏览器上下文 → API 注册用户（不种子积分，余额为 0） → 访问 `/image-generate` → 输入提示词 → 点击生成 → 验证 "Insufficient Credits" toast 出现 |

### 积分种子方式

```
beforeAll:
  signUpViaAPI → 获取 userId → seedCredits(userId, 500)
  
seedCredits 实现 (helpers/credits.ts):
  1. 连接 DATABASE_URL
  2. UPDATE user SET credit_balance = credit_balance + amount WHERE id = userId
  3. INSERT INTO credit_transaction (bonus 类型) 用于审计追踪
```

### 页面选择器参考

```
通过 agent-browser 探索发现的选择器：
  - h1: "AI Image Generation"
  - 积分显示: text "credits: <number>"
  - Provider 下拉框: [role="combobox"] (第1个) — 默认 "Aliyun BaiLian"
  - Model 下拉框: [role="combobox"] (第2个) — 默认 "Qwen Image 3.0 Pro"
  - 提示词输入: <textarea> placeholder="Describe the image you want to generate..."
  - 生成按钮: button 包含 "Generate" 文字
  - 结果区域: h2 "Result"，状态 "Idle" / "Generating..."
  - 生成图片: img[alt="Generated image"]
  - 下载按钮: button 包含 "Download" 文字
  - 成功 toast: Sonner 通知 "Image generated successfully!"
  - 积分不足 toast: "Insufficient Credits"
```

> **注意：** 视频生成测试暂不添加，因生成时间较长（通常 1-5 分钟），不适合自动化测试的超时设置。

---

## 16. 管理员子页面筛选功能测试

**文件：** `specs/admin-filters.spec.ts` ｜ **优先级：** P3

> 使用预置管理员账号 `admin@example.com` 登录。

验证各管理员子页面的搜索和下拉筛选功能。搜索功能通过 URL 参数导航验证页面状态（绕过 Vue `useVModel` 的反应性时序问题），下拉筛选通过 Radix/Reka combobox 交互验证 URL 更新。

> **实现说明：**
> - `goToPage` 等待 `networkidle` 确保 SSR 水合完成（避免点击时 Vue 事件处理器未挂载）
> - `pickFromCombobox` 使用重试循环 + Escape 关闭已打开的下拉框（处理 Radix UI overlay 阻塞）
> - Next.js 订阅页使用 `paymentType` 参数，Nuxt 使用 `provider` 参数（测试自动检测）

### A) 用户管理页筛选

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | 搜索通过 URL 反映到页面状态 | 访问 `/admin/users?searchField=email&searchValue=admin&page=1` → 验证搜索输入框的值为 "admin" |
| 2 | 按角色筛选更新 URL | 访问 `/admin/users` → 在角色下拉框中选择 "Admin" → 等待 URL 包含 `role=admin` |
| 3 | 按封禁状态筛选更新 URL | 访问 `/admin/users` → 在封禁状态下拉框中选择 "Banned" → 等待 URL 包含 `banned=true` |
| 4 | 清除按钮重置所有筛选 | 访问带有多个筛选参数的 URL → 点击清除按钮 → 验证 URL 不再包含 `searchValue`、`role`、`banned` |

### B) 订阅管理页筛选

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 5 | 搜索通过 URL 反映到页面状态 | 访问 `/admin/subscriptions?searchField=userEmail&searchValue=test&page=1` → 验证搜索输入框值为 "test" |
| 6 | 按状态筛选更新 URL | 访问 `/admin/subscriptions` → 选择 "Active" → 等待 URL 包含 `status=active` |
| 7 | 第三筛选器更新 URL | 访问 `/admin/subscriptions` → 自动检测第三筛选器类型 → Next.js: 选择 "Recurring" → 验证 `paymentType=recurring`；Nuxt: 选择 "Stripe" → 验证 `provider=stripe` |

### C) 订单管理页筛选

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 8 | 按状态筛选更新 URL | 访问 `/admin/orders` → 选择 "Paid" → 等待 URL 包含 `status=paid` |
| 9 | 按提供商筛选更新 URL | 访问 `/admin/orders` → 选择 "Stripe" → 等待 URL 包含 `provider=stripe` |
| 10 | 组合筛选全部出现在 URL | 访问 `/admin/orders` → 选择 "Paid" → 再选择 "Stripe" → 验证 URL 同时包含 `status=paid` 和 `provider=stripe` |

### D) 积分管理页筛选

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 11 | 按类型筛选更新 URL | 访问 `/admin/credits` → 选择 "Purchase" → 等待 URL 包含 `type=purchase` |
| 12 | 搜索通过 URL 反映到页面状态 | 访问 `/admin/credits?searchField=userEmail&searchValue=admin&page=1` → 验证搜索输入框值为 "admin" |
| 13 | 清除按钮重置筛选 | 访问带有筛选参数的 URL → 点击清除按钮 → 验证 URL 不再包含 `searchValue`、`type` |

---

## 待实现的测试 (Backlog)

以下是已规划但尚未实现的测试用例。按优先级排列，实现后应迁移到上方对应章节。

### 17. Creem 支付流程测试

**计划文件：** `specs/creem-payment.spec.ts` ｜ **优先级：** P1

> ⚠️ **前置条件：**
> 1. `.env` 中配置了 Creem 测试模式的 API Key 和 Webhook Secret
> 2. Creem webhook 转发已配置到 `localhost:7001/api/payment/webhook/creem`
> 3. Creem 产品已创建并配置了 `creemProductId`

Creem 与 Stripe 流程类似，都是页面跳转到托管 Checkout 页面完成支付，通过 webhook 回调通知后端。

#### A) 订阅购买流程

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | 点击 Creem 订阅计划跳转到 Checkout | API 注册用户 → 打开定价页 → 找到 "Creem Monthly Plan" 标题 → 点击 CTA 按钮 → 等待 URL 跳转到 Creem Checkout 页面 |
| 2 | 完成 Creem 订阅支付 | 跳转到 Creem Checkout → 填写测试卡信息（Creem 测试模式下的测试卡号） → 点击支付按钮 → 等待重定向回 `/payment-success?provider=creem` |
| 3 | 仪表盘显示订阅详情 | 访问 `/dashboard` → 点击"订阅"标签 → 验证 "Creem Monthly Plan" 计划名称可见 → 验证 Active 状态可见 |

#### B) 一次性购买流程

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 4 | 点击 Creem 一次性计划跳转到 Checkout | 打开定价页 → 找到 "Creem Monthly Plan (One Time)" 标题 → 点击 CTA 按钮 → 等待 URL 跳转到 Creem Checkout |
| 5 | 完成 Creem 一次性支付 | 完成支付流程 → 验证重定向回 `/payment-success?provider=creem` |

#### Creem 支付链路图

```
用户登录
  ↓
打开 /pricing 定价页
  ↓
点击 "Creem Monthly Plan" 的 CTA 按钮
  ↓
前端调用 POST /api/payment/initiate { planId: 'monthlyCreem', provider: 'creem' }
  ↓
后端通过 Creem SDK 创建 Checkout Session → 返回 checkoutUrl
  ↓
浏览器跳转到 Creem Checkout 页面
  ↓
用户填写卡信息并支付
  ↓
Creem 处理支付 → 重定向到 /payment-success?provider=creem
  ↓
Creem 发送 webhook (checkout.completed / subscription.active)
  → 后端更新订单 → 创建/更新订阅
  ↓
用户在仪表盘查看订阅状态
```

---

## 18. PayPal 支付流程测试

**文件：** `specs/paypal-payment.spec.ts` ｜ **优先级：** P2

> ⚠️ **前置条件：**
> 1. `.env` 中配置了 PayPal **沙盒** Client ID 和 Secret（`PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`）
> 2. `.env` 中配置了沙盒买家账号（`PAYPAL_E2E_USER_NAME`, `PAYPAL_E2E_USER_PWD`）
> 3. `PAYPAL_SANDBOX="true"` 已设置
> 4. 沙盒环境的 Plan ID 已配置在 `config/payment.ts`（`paypalPlanId`）

PayPal 使用沙盒账户测试，用户跳转到 PayPal 授权页面，使用沙盒买家账号登录并确认支付。每个流程使用独立的浏览器上下文和用户，避免状态泄漏。

> 如果 `PAYPAL_E2E_USER_NAME` / `PAYPAL_E2E_USER_PWD` 未配置，所有测试自动跳过。

#### A) 一次性支付（One-time）

> 所有测试共用一个浏览器上下文（`beforeAll` 注册），按串行顺序执行。

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | 点击 PayPal 一次性计划跳转到 PayPal | API 注册用户 → 打开定价页 → 找到 "PayPal Monthly (One Time)" 标题 → 点击 CTA 按钮 → 等待 URL 跳转到 `sandbox.paypal.com` |
| 2 | 完成 PayPal 一次性支付并看到成功页 | 跳转到 PayPal → 使用沙盒买家账号登录（email → Next → password → Log In） → 点击 "完成购物" / "Pay Now" 按钮 → 等待重定向回 `/payment-success?provider=paypal` → 验证 `<h1>` 标题和 dashboard 链接可见 |
| 3 | 仪表盘订阅标签显示 PayPal 计划 | 访问 `/dashboard` → 点击"Subscription"标签 → 验证 "PayPal Monthly" 计划名称可见（或 "No Active Subscription" 如 webhook 未处理） → 如有计划则验证 "Active" 状态可见 |

#### B) 循环订阅（Recurring）

> 使用独立浏览器上下文和用户。

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 4 | 点击 PayPal 订阅计划跳转到 PayPal | API 注册用户 → 打开定价页 → 找到 "PayPal Monthly Plan" 标题 → 点击 CTA → 等待跳转到 `sandbox.paypal.com`（PayPal 订阅确认页面） |
| 5 | 完成 PayPal 订阅并看到成功页 | 使用沙盒买家账号登录 → 点击 "同意并订阅" / "Agree & Subscribe" 按钮（PayPal 订阅页面使用 iframe/Web Component 渲染，需跨 frame 搜索按钮） → 等待重定向回 `/payment-success?provider=paypal` |

#### C) 积分购买

> 使用独立浏览器上下文和用户。

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 6 | 完成 PayPal 积分购买并看到成功页 | API 注册用户 → 打开定价页 → 切换到"积分充值"标签 → 找到 "100 Credits PayPal" → 点击 CTA → 在 PayPal 沙盒完成支付 → 验证重定向回 `/payment-success?provider=paypal` |
| 7 | 仪表盘积分余额更新 | 访问 `/dashboard` → 点击"Credits"标签 → 轮询最多 6 次（每次间隔 10s）等待 webhook 处理 → 验证可用积分 ≥ 100 → 验证累计购买 ≥ 100 |

#### PayPal 支付链路图

```
用户登录
  ↓
打开 /pricing 定价页
  ↓
点击 "PayPal Monthly (One Time)" 的 CTA 按钮
  ↓
前端调用 POST /api/payment/initiate { planId: 'monthlyPaypalOneTime', provider: 'paypal' }
  ↓
后端调用 PayPal API 创建 Order → 获取 approve URL
  ↓
浏览器跳转到 sandbox.paypal.com（授权页面）
  ↓
用户使用沙盒买家账号登录 → 点击 "Pay Now" / "完成购物"
  ↓
PayPal 重定向到 /api/payment/return/paypal?order_id=xxx&token=xxx&PayerID=xxx
  ↓
后端自动 capture 订单 → 更新订单状态 → 创建订阅
  ↓
重定向到 /payment-success?provider=paypal
  ↓
用户在仪表盘查看订阅/积分状态
```

#### PayPal 沙盒页面选择器参考

```
通过 agent-browser 探索发现的选择器：

一次性支付 (Orders API) 登录页面:
  - 邮箱输入: #email (textbox "Email or mobile number")
  - 下一步按钮: #btnNext (button "Next")
  - 密码输入: #password (textbox "Password")
  - 登录按钮: #btnLogin (button "Log In")

一次性支付审批页面 (sandbox.paypal.com/checkoutnow):
  - PayPal 余额: radio "PayPal余额 首选" (默认选中)
  - 信用卡: radio "Visa 信用卡 ••••0522"
  - 支付按钮: button "完成购物" / "Pay Now" / "Complete Purchase"
  - 取消链接: link "取消并返回TinyShip"

订阅支付审批页面 (sandbox.paypal.com/webapps/hermes):
  ⚠️ 内容在 iframe 中渲染，需使用 frame.getByRole('button', ...) 搜索
  - 审批按钮: button "同意并订阅" / "Agree & Subscribe"
  - 取消按钮: button "取消并返回到TinyShip"

注意：PayPal 可能记住登录状态，跳过 email/password 步骤直接到审批页面。
测试代码需处理两种场景（全新登录 vs 已登录）。
```

---

### 19. 支付宝支付流程测试

**计划文件：** `specs/alipay-payment.spec.ts` ｜ **优先级：** P2

> ⚠️ **前置条件：**
> 1. `.env` 中配置了支付宝**沙盒**环境的 App ID、私钥和公钥
> 2. 支付宝沙盒环境已开通（参考 [支付宝沙盒文档](https://opendocs.alipay.com/open/00dn7o)）
> 3. `ALIPAY_SANDBOX=true` 已设置
> 4. 沙盒买家账号已准备好

支付宝使用 PC 网站支付（`alipay.trade.page.pay`），用户跳转到支付宝页面完成支付，支付宝通过异步通知（notify_url）回调后端。

#### A) 订阅购买

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | 点击支付宝计划跳转到支付宝 | API 注册用户 → 打开定价页 → 找到 "Alipay Monthly Plan / 支付宝月度" 标题 → 点击 CTA 按钮 → 等待 URL 跳转到 `alipay.com` 或 `alipaydev.com`（沙盒） |
| 2 | 在支付宝沙盒中完成支付 | 跳转到支付宝页面 → 使用沙盒买家账号登录并支付 → 等待重定向回 `/payment-success?provider=alipay` |
| 3 | 异步通知处理后仪表盘更新 | 支付宝发送异步通知到 `/api/payment/webhook/alipay` → 后端验签并更新订单 → 用户访问仪表盘验证订阅状态 |

#### 支付宝支付链路图

```
用户登录
  ↓
打开 /pricing 定价页
  ↓
点击 "Alipay Monthly Plan" 的 CTA 按钮
  ↓
前端调用 POST /api/payment/initiate { planId: 'monthlyAlipay', provider: 'alipay' }
  ↓
后端调用 alipay.trade.page.pay → 生成支付页面 URL
  ↓
浏览器跳转到 alipay.com / alipaydev.com（支付宝页面）
  ↓
用户登录沙盒买家账号 → 确认支付
  ↓
支付宝同步跳转到 /payment-success?provider=alipay
  ↓
同时支付宝异步通知 → POST /api/payment/webhook/alipay
  ↓
后端验签 → 更新订单状态 → 创建订阅
  ↓
用户在仪表盘查看订阅状态
```

> **注意：** 微信支付使用 Native 扫码支付（二维码），不适合 Playwright 自动化测试（无法模拟扫码），暂不计划添加。

---

### 20. 博客功能测试

**计划文件：** `specs/blog.spec.ts` ｜ **优先级：** P2

> ⚠️ **前置条件：**
> 1. 数据库已推送 `blog_post` 表（`pnpm db:push`）
> 2. 预置管理员账号 `admin@example.com` 可用

验证博客功能的完整流程：管理员创建/编辑/删除博客文章，公共页面展示已发布文章，权限控制。

> 管理员测试使用预置账号 `admin@example.com`（非测试创建，不会被 teardown 清理）。

#### A) 管理员博客管理

> 所有测试共用一个浏览器上下文（管理员登录），按串行顺序执行。

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | 管理员侧边栏显示博客入口 | 用管理员账号 API 登录 → 访问 `/admin` → 验证侧边栏包含 "Blog" 链接 → 点击链接 → 验证 URL 包含 `/admin/blog` |
| 2 | 博客列表页加载并显示数据表 | 访问 `/admin/blog` → 验证页面标题可见 → 验证 `<table>` 存在 → 验证 "New Post" 按钮可见 |
| 3 | 创建新博客文章 | 点击 "New Post" 按钮 → 验证 URL 包含 `/admin/blog/new` → 填写标题 "E2E Test Post" → 验证 slug 自动生成 → 填写摘要 → 在 Markdown 编辑器中输入内容 → 选择状态为 "Published" → 点击保存 → 等待重定向到 `/admin/blog` → 验证列表中出现 "E2E Test Post" |
| 4 | 编辑已有博客文章 | 在列表中找到 "E2E Test Post" → 点击编辑按钮 → 验证 URL 包含 `/admin/blog/` → 修改标题为 "E2E Test Post Updated" → 点击保存 → 等待重定向到列表 → 验证列表中标题已更新 |
| 5 | 删除博客文章 | 在列表中找到 "E2E Test Post Updated" → 点击删除按钮 → 验证确认对话框出现 → 点击确认删除 → 验证文章从列表中消失 |
| 6 | 非管理员用户无法访问博客管理页 | 新建浏览器上下文 → 注册普通用户 → 访问 `/admin/blog` → 验证被重定向到 `/signin` 或返回 403 |

#### B) 公共博客页面

> 需要先通过 API 创建一篇已发布和一篇草稿文章用于测试。

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 7 | 博客列表页加载并显示已发布文章 | 访问 `/blog` → 验证页面标题可见 → 验证至少有一篇文章卡片可见 → 验证卡片包含标题、摘要、日期 |
| 8 | 草稿文章不在公共页面显示 | 访问 `/blog` → 验证页面上不包含草稿文章的标题 |
| 9 | 博客详情页正确渲染 Markdown 内容 | 在博客列表点击文章卡片 → 验证 URL 包含 `/blog/` → 验证文章标题可见 → 验证作者信息可见 → 验证发布日期可见 → 验证 Markdown 内容已渲染（检查 `<h1>`/`<p>`/`<code>` 等 HTML 元素） |

#### C) 公共导航

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 10 | 网站头部导航包含博客链接 | 打开首页 `/` → 验证 `<header>` 中包含 "Blog" 链接 → 点击链接 → 验证 URL 包含 `/blog` |

#### 博客管理完整链路图

```
管理员登录
  ↓
打开 /admin/blog 博客管理页
  ↓
点击 "New Post" 按钮
  ↓
填写标题（自动生成 slug）、摘要、Markdown 内容、状态
  ↓
点击保存 → POST /api/admin/blog
  ↓
后端创建 blog_post 记录 → 重定向到列表
  ↓
已发布文章自动出现在 /blog 公共页面
  ↓
用户访问 /blog → 看到文章列表
  ↓
点击文章 → /blog/[slug] → Markdown 渲染展示
```

---

## 21. 推荐返利系统测试

**文件：** `specs/affiliate.spec.ts` ｜ **优先级：** P1

验证推荐返利系统的用户侧完整流程：推荐码生成、推荐链接 cookie 捕获、推荐码领取、仪表盘推荐标签页展示、提现请求。

> 需要显式配置 `AFFILIATE_ENABLED=true`（默认关闭）。

### A) 推荐码生成与仪表盘 API

> 所有测试共用一个浏览器上下文（`beforeAll` 注册），按串行顺序执行。

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | 推荐统计 API 返回推荐码和链接 | API 注册用户 → `GET /api/affiliate/stats` → 验证返回 200 → 验证响应包含 `referralCode`（8 字符）、`referralLink`（含 `?ref=`）、`commissionBalance`（≥ 0）、`commissionRate`（> 0）、`enabled`（true） |
| 2 | 推荐统计 API 多次调用返回相同推荐码 | 同一用户连续调用两次 `GET /api/affiliate/stats` → 验证两次返回的 `referralCode` 完全相同（幂等性） |

### B) 推荐链接 Cookie 捕获

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 3 | 访问带 ?ref= 的 URL 设置推荐 cookie | 新建浏览器上下文（未登录） → 访问 `/?ref=TESTCODE123` → 等待页面加载 → 验证浏览器 cookie 中存在 `referral_code=TESTCODE123` → 验证 URL 不再包含 `ref=` 参数 |

### C) 推荐码领取流程

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 4 | 完整推荐领取流程 | 用户 A（推荐人）API 注册 → `GET /api/affiliate/stats` 获取推荐码 → 新建浏览器上下文 → 访问 `/?ref={推荐码}` → 用户 B（被推荐人）API 注册 → `POST /api/affiliate/claim` → 验证返回 200 且 `applied` 为 true → 验证用户 A 的 `GET /api/affiliate/referrals` 返回 1 条记录 |
| 5 | 无推荐码时领取返回正常 | API 注册用户（无 cookie） → `POST /api/affiliate/claim` → 验证返回 200 且 `applied` 为 false 或 `noCode` 为 true |

### D) 仪表盘推荐标签页 UI

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 6 | 仪表盘显示推荐标签页 | API 注册用户 → 访问 `/dashboard` → 验证页面上有 "Affiliate" 或 "推荐" 标签按钮可见 → 点击该标签 → 验证推荐统计区域可见（佣金余额、佣金比例等） → 验证推荐链接输入框可见 |
| 7 | 仪表盘显示提现标签页 | 访问 `/dashboard` → 验证页面上有 "Withdrawal" 或 "提现" 标签按钮可见 → 点击该标签 → 验证提现表单可见（金额输入框、支付方式选择） |

### E) 提现请求

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 8 | 余额不足时提现失败 | API 注册用户 → `POST /api/withdrawal/request` body: `{ amount: "100", paymentMethod: "alipay", paymentAccount: "test@test.com" }` → 验证返回 400 且包含余额不足错误信息 |

### 推荐返利完整链路图

```
用户 A 注册
  ↓
GET /api/affiliate/stats → 生成推荐码 (lazy-generate)
  ↓
用户 A 分享推荐链接 example.com/?ref=ABCD1234
  ↓
用户 B 点击链接 → 中间件设置 referral_code cookie (30天)
  ↓
URL 参数 ?ref= 被自动清除
  ↓
用户 B 注册/登录
  ↓
前端调用 POST /api/affiliate/claim
  ↓
后端: user B.referredByCode = ABCD1234
  ↓
如果配置了 refereeSignupBonus > 0: 给用户 B 加积分
如果配置了 referrerSignupBonus > 0: 给用户 A 加积分
  ↓
用户 B 购买任何计划 → payment webhook 触发
  ↓
processReferralCommission → 计算佣金 → 写入 commission 表 → 增加用户 A 的 commissionBalance
  ↓
用户 A 在仪表盘"推荐"标签页看到佣金余额和推荐列表
  ↓
用户 A 在"提现"标签页提交提现申请
  ↓
管理员在 /admin/withdrawals 审批提现
```

---

## 22. 管理员返利管理测试

**文件：** `specs/admin-affiliate.spec.ts` ｜ **优先级：** P2

> 使用预置管理员账号 `admin@example.com` 登录。
> 依赖 `libs/database/seed.ts` 中的推广返利测试数据（3 个邀请用户, 3 条佣金记录, 2 条提现记录）。

验证管理员后台的佣金管理、提现管理页面，以及用户列表中推荐相关列的展示。

### A) 管理员佣金管理页

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | 佣金管理页加载并显示表格 | 用管理员账号 API 登录 → 访问 `/admin/commissions` → 验证页面标题 "Commission Records" 或 "佣金记录" 可见 → 验证 `<table>` 存在 |
| 2 | 佣金管理页有搜索字段下拉框 | 访问 `/admin/commissions` → 验证 `[role="combobox"]` 搜索字段下拉框可见 → 验证搜索输入框可见 |
| 3 | 佣金管理页搜索无报错 | 访问 `/admin/commissions` → 在搜索框输入 "admin" → 等待 1s → 验证页面标题仍然可见（页面未崩溃） |
| 4 | 佣金管理页有状态筛选 | 访问 `/admin/commissions` → 验证 `[role="combobox"]` 数量 ≥ 2（搜索字段 + 状态筛选） |

### B) 管理员提现管理页

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 5 | 提现管理页加载并显示表格 | 访问 `/admin/withdrawals` → 验证页面标题 "Withdrawal Requests" 或 "提现管理" 可见 → 验证 `<table>` 存在或显示空状态提示 |
| 6 | 提现管理页有搜索字段下拉框 | 访问 `/admin/withdrawals` → 验证 `[role="combobox"]` 搜索字段下拉框可见 → 验证搜索输入框可见 |
| 7 | 提现管理页搜索无报错 | 访问 `/admin/withdrawals` → 在搜索框输入 "admin" → 等待 1s → 验证页面标题仍然可见 |
| 8 | 提现管理页有状态筛选 | 访问 `/admin/withdrawals` → 验证 `[role="combobox"]` 数量 ≥ 2 |

### C) 管理员侧边栏导航

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 9 | 侧边栏包含佣金和提现入口 | 访问 `/admin` → 验证侧边栏包含 "Commissions" 或 "佣金管理" 链接 → 验证侧边栏包含 "Withdrawals" 或 "提现管理" 链接 |

### D) 用户管理页推荐列

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 10 | 用户列表视图筛选包含推荐列 | 访问 `/admin/users` → 等待表格加载 → 点击 "视图"/"View" 按钮 → 验证下拉菜单包含 "Referral Code/推荐码"、"Referred By/邀请人"、"Commission Balance/佣金余额" 三项 |
| 11 | 推荐列可以切换显示 | 访问 `/admin/users` → 点击 "视图" → 点击 "推荐码" 菜单项 → 关闭下拉 → 验证表头出现 "Referral Code/推荐码" |

### E) 用户管理 API 推荐信息

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 12 | 用户 API 返回推荐人信息 | `GET /api/admin/users?limit=50` → 验证返回 200 → 找到 `referredByCode` 非空的用户 → 验证该用户的 `referredBy` 对象包含 `email` 字段（即推荐码已被解析为实际用户信息） |

---

## 23. 推荐佣金支付全流程测试

**文件：** `specs/affiliate-commission.spec.ts` ｜ **优先级：** P0

> ⚠️ **前置条件：**
> 1. 开发服务器在 7001 端口运行
> 2. `stripe listen --forward-to localhost:7001/api/payment/webhook/stripe` 正在运行
> 3. `.env` 中配置了 Stripe 测试模式的 API Key
> 4. 显式配置 `AFFILIATE_ENABLED=true`（默认关闭）

验证推荐返利系统的完整支付链路：推荐人分享 → 被推荐人注册 → 被推荐人通过 Stripe 购买 → Webhook 触发佣金计算 → 推荐人余额增加。

这是捕获集成 bug（如 metadata 覆盖导致推荐信息丢失）的关键端到端测试。

> 所有测试共用浏览器上下文，按串行顺序执行。整体超时 3 分钟（含 Stripe + Webhook 处理）。

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | 被推荐人完成 Stripe 积分购买 | `beforeAll`: 用户 A（推荐人）API 注册 → `GET /api/affiliate/stats` 获取推荐码和初始余额 → 用户 B（被推荐人）设置 `referral_code` cookie → API 注册 → `POST /api/affiliate/claim` 领取推荐码 → **测试体**: 用户 B 打开定价页 → 切换到「积分充值」标签 → 找到 "100 Credits Stripe" → 点击 CTA → 跳转到 Stripe Checkout → 填写测试卡 `4242 4242 4242 4242` → 提交支付 → 验证重定向回 `/payment-success?provider=stripe` |
| 2 | 推荐人佣金余额增加 | 轮询用户 A 的 `GET /api/affiliate/stats`（最多 12 次，每次间隔 5s）→ 验证 `commissionBalance` 大于初始余额（$5 × 20% = $1.00 佣金） |
| 3 | 推荐人仪表盘显示佣金统计 | 用户 A 访问 `/dashboard` → 点击 "Affiliate" 标签 → 验证 "Commission Balance" 可见 → 通过 API 验证 `totalRegisteredReferrals ≥ 1` 且 `totalPaidReferrals ≥ 1` |
| 4 | 佣金记录包含购买用户信息 | `GET /api/affiliate/commissions?limit=10` → 验证返回 ≥ 1 条佣金记录 → 最新记录包含 `buyer.email`（含 @）、`orderAmount`、`commissionAmount > 0` |

### 推荐佣金完整链路图

```
用户 A（推荐人）注册
  ↓
GET /api/affiliate/stats → 获取推荐码 + 记录初始佣金余额
  ↓
用户 B（被推荐人）设置 referral_code cookie
  ↓
用户 B 注册 → POST /api/affiliate/claim → referredByCode 写入用户 B
  ↓
用户 B 打开 /pricing → 选择 "100 Credits Stripe" ($5)
  ↓
POST /api/payment/initiate → 创建订单
  → 查询用户 B 的 referredByCode → 解析推荐人 ID
  → 订单 metadata = { referralCode, referrerId, ...stripeMetadata }
  ↓
跳转到 checkout.stripe.com → 填写测试卡 → 支付
  ↓
Stripe 发送 webhook → stripe listen 转发到 /api/payment/webhook/stripe
  ↓
后端处理 webhook → processReferralCommission(orderId)
  → 读取订单 metadata.referrerId
  → 计算佣金 ($5 × 20% = $1.00)
  → 写入 commission 表
  → 增加用户 A 的 commissionBalance
  ↓
轮询用户 A 的 /api/affiliate/stats → 验证余额增加
  ↓
用户 A 仪表盘 → Affiliate 标签 → 看到佣金和推荐统计
```

---

## 24. 管理员动态定价管理测试

**文件：** `specs/admin-pricing.spec.ts` ｜ **优先级：** P2

> 使用预置管理员账号 `admin@example.com` 登录。

验证管理员后台的动态定价管理功能：列表页加载、创建/编辑/删除方案、导入静态配置、权限控制。不需要种子数据，测试中创建的方案在 afterAll 中自动清理。

### A) 列表页

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | 定价列表页加载并显示操作按钮 | 用管理员账号 API 登录 → 访问 `/admin/pricing` → 验证 "Pricing Plans" 标题可见 → 验证 "Create Plan" 链接可见 → 验证 "Import" 按钮可见 → 验证 "Subscription" / "Credits" 标签切换按钮可见 |
| 2 | 订阅/积分标签切换 | 访问 `/admin/pricing` → 点击 "Credits" 标签 → 验证 URL 仍为 `/admin/pricing` → 点击 "Subscription" 标签 → 验证 URL 正确 |

### B) 创建方案

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 3 | 创建方案页加载并显示分组卡片 | 访问 `/admin/pricing/new` → 验证 "Create Plan" 标题可见 → 验证 "Plan Information"、"Pricing"、"Provider Configuration"、"Display Settings" 四个区块可见 → 验证返回链接可见 |
| 4 | 创建新定价方案 | 填写英文名称/描述/时长标签/功能特性 → 切换到中文标签填写 → 输入金额 9.99 → 点击保存 → 验证重定向回列表页 |
| 5 | 新建方案出现在列表中 | 访问列表页 → 验证刚创建的方案名称可见 |

### C) 编辑方案

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 6 | 编辑页加载并显示已有数据 | 在列表页找到方案 → 点击编辑按钮 → 验证 URL 匹配 `/admin/pricing/<id>` → 验证 "Edit Plan" 标题可见 → 验证名称输入框包含正确值 |
| 7 | 更新方案名称 | 编辑页清空名称 → 输入新名称 → 保存 → 验证重定向回列表 → 验证新名称可见 |

### D) 切换激活状态

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 8 | 切换方案激活开关 | 在列表页找到方案行 → 点击 Switch → 等待 API 响应 → 验证状态改变 → 点击复原 |

### E) 删除方案

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 9 | 删除方案后从列表消失 | 接受确认对话框 → 点击方案行的删除按钮 → 等待删除 → 验证方案不再显示 |

### F) 导入静态配置

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 10 | 通过 API 导入静态配置方案 | POST `/api/admin/pricing-plans/import` → 验证返回 200 → 验证 `imported ≥ 0` |

### G) 表单交互

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 11 | 提供商配置区块根据所选提供商显示对应字段 | 默认 Stripe → 验证 "Stripe Price ID" 可见 → 切换到 WeChat → 验证显示 "无需额外配置" 提示 |
| 12 | i18n 标签切换保持各语言数据独立 | 英文标签填写名称 → 切换到中文标签 → 验证名称为空 → 填写中文名称 → 切回英文 → 验证英文名称恢复 |

### H) 权限控制

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 13 | 非管理员用户无法访问定价管理页 | 未登录访问 `/admin/pricing` → 验证重定向到 `/signin` 或返回 403 |
| 14 | 非管理员用户无法访问定价管理 API | 未认证调用 `GET /api/admin/pricing-plans` → 验证返回 401 或 403 |

---

## 25. Waffo 支付流程测试

**文件：** `specs/waffo-payment.spec.ts` ｜ **优先级：** P1 ｜ **需要登录 + Waffo Test API Key + Webhook 隧道**

> 前置条件：
> 1. 开发服务器运行在 7001 端口
> 2. 公网隧道转发到 `/api/payment/webhook/waffo`
> 3. `.env` 已配置 `WAFFO_MERCHANT_ID`、`WAFFO_PRIVATE_KEY`（Test 环境密钥）
> 4. 动态模式：`pricing_plan` 中已有真实 `PROD_xxx`；静态模式：`config/payment.ts` 的 `waffoProductId` 已替换
> 5. 完整结账用例需设置 `E2E_WAFFO_COMPLETE=true`

测试卡：`4576 7500 0000 0110`

| # | 测试名称 | 具体流程 |
|---|---------|---------|
| 1 | 订阅跳转 Waffo Checkout | API 注册 → 定价页点击 Waffo Monthly Plan → 验证跳转到 `checkout.waffo.ai` |
| 2 | 一次性跳转 Waffo Checkout | API 注册 → 点击 Waffo Monthly Plan (One Time) → 验证跳转到 Waffo |
| 3 | 积分包跳转 Waffo Checkout | API 注册 → 切换积分 Tab → 点击 100 Credits Waffo → 验证跳转到 Waffo |
| 4 | 完成订阅结账 | 跳转 Checkout → 使用测试卡支付 → 验证回到 `/payment-success`（需 webhook 隧道） |

---

## 26. 同一编辑器的首页与专题入口

**文件：** `specs/editor-entrypoints.spec.ts` ｜ **优先级：** P1 ｜ **无需登录或数据库写入**

**状态：** Green（2026-10-14，TanStack / Chromium：8 通过、0 失败）

| # | 测试名称 | 验收场景 |
|---|---------|---------|
| 1 | 桌面工具分组 | 首页顶栏使用 Tools 分组；打开后可访问 Body Editor、Skinny Filter、AI Breast Expansion；进入专题后菜单关闭 |
| 2 | 移动端导航 | 小屏幕展开主菜单，工具链接在 Tools 分组下；点击 Body Editor 后导航收起，页面标题可见 |
| 3 | 同一编辑入口 | 首页与 Body Editor 均提供相同的 Slim / Muscle / Proportions 模式和照片预览；明确编辑尚未上线；不提供虚构的逐部位滑杆或批量功能 |
| 4 | 专题内容定位 | 首页保留产品功能与价格总览；Body Editor 保留至少 400 英文词的原创身体重塑指导（照片选择建议、教程及 FAQ），并说明使用同一产品 |
| 5 | 本地照片预览 | 选择有效 PNG 可看到预览和替换入口；切换模式可见选中状态；提交显示尚未上线且照片未上传的提示 |
| 6 | SEO 不回退 | 四个可索引页均返回 200；首页与 Body Editor 的 H1、不同 title/canonical、专题内容存在于服务端 HTML；Tools 关闭时原始 `<header>` 仍含三个正确关键词的工具链接；JSON-LD 指向同一 AI Body Editor，不声明尚未上线的免费编辑 Offer；两页继续出现在 sitemap |

仅测试当前唯一应用 TanStack。运行时设置 `E2E_SKIP_CLEANUP=true`，不触发数据库测试用户清理。

验证顺序：先记录场景 → 实现 → 内置浏览器走查（桌面、768px 与 390px 手机、PNG 预览）→ 按真实 DOM 编写 E2E → 8/8 通过。当前环境未提供 `agent-browser` CLI，走查使用 Codex 内置浏览器。

类型检查、新鲜 Cloudflare 构建与 SEO 自查通过。Wrangler 本地 7002 预览中 `/` 和 `/body-editor` 均返回 200，含完整 SSR 标题、工具导航及预览提示；验证后关闭临时预览服务。构建保留已有的部分分块大于 500 kB 提示。

---

## 27. 视觉优先首页与概念照片交互

**文件：** `specs/visual-homepage.spec.ts` ｜ **优先级：** P1 ｜ **无需登录或数据库写入**

**状态：** Green（2026-10-14，TanStack / Chromium：本节 10 通过、0 失败；相关入口回归 8 通过、0 失败，整组 18/18）

| # | 测试名称 | 验收场景 |
|---|---------|---------|
| 1 | 首屏照片与概念说明 | 访问英文首页 `/` → 首屏保留唯一 `AI Body Editor` H1，主体照片在桌面和手机早期可见且可解码；照片、前后说明与描述实际人物的非空 alt 存在于服务端 HTML；展示清楚的 AI-generated concept 标识，说明图片用于表达目标，不声称为本产品已生成的真实结果 |
| 2 | 三个展示模式 | 首页默认展示 Slim → 依次切换 Muscle、Proportions 和 Slim → 模式有可识别的选中状态，主照片、标题与说明同步更新；切换不触发生成或上传请求 |
| 3 | 原生照片对比操作 | 前后对比使用有可访问名称的原生 range → 键盘方向键可改变对比位置且焦点可见；手机触摸可以改变位置；移动分界时两侧主体保持同一尺寸和位置，Before / After 说明仍清楚，不新增虚构的逐部位身体编辑滑杆 |
| 4 | 六个原始概念样例 | 滚动到模式卡片、样例与近景区 → 六张不同的原始概念资源均可加载并解码，每个样例都有描述实际人物或构图的 alt 和概念标识；模式卡片与补充样例能辨认 Slim / Muscle / Proportions，图片不存在拉伸或错误半图裁切 |
| 5 | 选择样例同步编辑器 | 点击各模式的样例入口 → 到达 `#try` 共享编辑器，显示所选样例预览并选中对应 Slim / Muscle / Proportions 模式；可继续切换模式和重新选样例；编辑器仍明确 AI editing is coming soon |
| 6 | 样例与自选照片替换 | 从样例预览开始选择有效 PNG → 样例状态被清除，自选文件以本地 blob 预览；再选文件可替换预览，再选概念样例可回到样例状态；提交仍显示尚未上线、照片未上传的提示；整个流程不发送 POST / PUT / PATCH / DELETE，不消耗积分或创建任务 |
| 7 | 主要入口到达编辑器 | 顶栏、首屏、模式卡片和末尾主要编辑入口均指向或滚动到首页 `#try`；到达后模式选择与照片选择可操作，页面没有要求先登录的新增阻碍；Body Editor 等专题仍使用现有共享编辑器 |
| 8 | 响应式无溢出 | 在 320 / 390 / 768 / 1280 px 宽度分别检查首屏、模式控制、对比组件、样例、编辑器、FAQ 与末尾入口 → 文档无横向溢出，内容与按钮不互相遮挡；图片保持比例，移动端控制可触摸操作，主要照片与概念说明可见 |
| 9 | SSR 与 SEO 回归 | 首页 HTTP 返回 200；服务端 HTML 包含唯一 H1、主体文案、照片 alt、概念标识、`#try` 和关键词内链；canonical 为 `https://aibodyeditor.net`，无查询、尾斜杠或 meta keywords；闭合 Tools 中保留 Body Editor / Skinny Filter / AI Breast Expansion 正确链接；首页与专题 sitemap 和同一产品 JSON-LD 身份不回退 |
| 10 | 可用状态诚实呈现 | 首页功能、编辑器、价格与 FAQ 的文案继续区分本地预览和计划中的 AI 编辑；不声明 AI 生成已上线，不虚构用户评价、效果保证、批量编辑或可用的免费编辑 Offer；英文根路径不受 Accept-Language 影响，`/en` 重定向到 `/`；中文镜像字典结构由类型检查验证，当前不开放中文 URL |

仅测试当前唯一应用 TanStack。运行时设置 `E2E_SKIP_CLEANUP=true`，拦截写请求以防止预览回归意外上传或写入；不使用真实人物上传、不注册测试用户、不触发数据库清理。首屏与全部六张资源的解码分开检查，惰性图片在滚动到相应区块后检查。

验证顺序：场景定义 → 实现 → Codex 内置浏览器桌面与手机走查 → 按真实 DOM 编写 `visual-homepage.spec.ts`，必要时调整第 26 节已有布局断言 → 运行相关 E2E 并更新本节状态及结果表。第 26 节已记录的 8/8 结果保留为此前入口改动的历史。

实测命令：`E2E_SKIP_CLEANUP=true npx --yes pnpm@9.4.0 exec playwright test --config=tests/e2e/playwright.config.ts visual-homepage.spec.ts editor-entrypoints.spec.ts`。整组 18/18 通过（52.0s），包含真实 Chromium 触摸手势、range 键盘与焦点、六张图片滚动解码、样例 → 本地文件 → 样例、无写请求、四个断点和原始服务端 HTML 断言。首次调试的两处测试预期已按真实行为修正：`/en` 的 Location 使用绝对 URL，顶栏入口文案为 Try photo preview。

桌面 1280×900 与手机 390×844 首屏截图保存为 `test-results/visual-homepage/home-desktop.png`、`home-mobile.png`；改成首屏截图后补跑该用例 1/1 通过（2.7s）。本节仅记录 E2E 的实测结果；类型检查、构建和 Workers 预览由本次实现的交付报告另行记录。

---

## 28. 兔子 API 身体编辑接入准备

**文件：** `tests/unit/ai/body-edit-prompts.test.ts`、`tests/unit/ai/body-edit.test.ts`、`tests/unit/ai/body-edit-smoke.test.ts`；公共页面回归继续使用 `visual-homepage.spec.ts` 和 `editor-entrypoints.spec.ts`。

**状态：** Preparation Green（2026-10-14：114/114 模拟单元/CLI 测试、18/18 公共 E2E；用户尚未配置兔子 API Key，真实渠道访问与编辑质量待验收）

| # | 验收场景 |
|---|----------|
| 1 | 四种服务模式 Slim / Muscle / Proportions / Breast 有独立目标，三档强度由服务端模板解释；保留同一人物、脸部、姿势、衣服与场景的共同约束，输出单张编辑照片，不承诺精确百分比或尺寸 |
| 2 | 指定 `gpt-image-2.5-1k`，复用服务端 OPENAI_API_KEY / OPENAI_BASE_URL，向 `/v1/images/edits` 发 multipart 原图与固定模板；不把模式、强度、input_fidelity 当作上游参数，不把密钥放入客户端 |
| 3 | PNG / JPEG / WebP 原图、输入限制、无效模式/强度、无密钥在请求前验证；请求有超时/取消且不隐式重试，避免重复计费 |
| 4 | 按实际字段处理 URL 或 Base64；验证 Base64 输出的签名格式与大小，URL 仅验证 HTTPS 地址、不下载其字节；空输出、异常协议、异步-only 响应、HTTP错误有稳定错误码；不记录密钥或完整上游响应 |
| 5 | 本地脚本默认 dry-run，不联网；只有显式 --execute 才使用配置的密钥发请求；测试均使用 mock，不产生付费调用 |
| 6 | 原有首页和指南仍如实说明预览/计划编辑状态，三模式展示、六图、共享预览和 SEO 行为不回退；相关公共 E2E 通过 |

此阶段仅准备共享服务端接入层和开发验证入口，不开放新的用户 API 或收费流程。具体渠道型号的访问权限、价格、真实编辑效果与延迟需在配置密钥后单独验收。

验证记录：提示词 34 例、HTTP 契约 72 例、CLI 子进程 8 例，共 114/114（1.78s）。提示词与适配器先对未实现版本验证 Red，再 Green；独立审查发现清理流的 `cancel()` 可能无限等待，新增 5 例先 Red 后 Green，确认清理不会拖住超时/取消/错误返回。CLI 测试隔离 `.env` 读取并拦截真实联网，验证默认 dry-run 零请求、单次 mock multipart、按真实输出格式写文件以及拒绝覆盖。

公共 E2E 为 `visual-homepage.spec.ts` + `editor-entrypoints.spec.ts`，18/18（48.6s），`E2E_SKIP_CLEANUP=true`，无数据库写入。`pnpm typecheck --force` 通过（无缓存），新增 shared/script/test 文件的独立严格 TypeScript 检查通过；`pnpm build --force` 通过（79.7s，无缓存），保留已有的分块体积提示。基于该构建的本地 Wrangler/Workers 7003 预览 `/` 和 `/body-editor` 返回 HTTP 200，含正确 SSR 内容，已关闭临时服务；不依赖已配置数据库或真实 AI Key。

日志：`test-results/body-edit-unit.log`、`body-edit-public-e2e.log`、`body-edit-typecheck.log`、`body-edit-build.log`、`body-edit-cf-preview.log`；本地 dry-run 输出为 `body-edit-dry-run.log`。本轮不新增或修改公开页面、用户文案、积分规则或 sitemap。

---

<!-- Comparison asset correction acceptance, recorded before changing the live asset. -->

## 29. 概念对比方向与 Slim 样例修正

**状态：** Green（2026-10-14，新增方向/资源回归 2/2；整组 TanStack / Chromium 20/20）

| # | 验收场景 |
|---|----------|
| 1 | 对照完整原始 diptych 与组件裁切，确认每个模式 Original concept 使用实际原始半图、Edited concept 使用编辑半图；不能只按生成提示词判断素材内容 |
| 2 | Slim 首屏、功能卡片、近景与所选样例使用同一已复核资源；编辑侧的腰部和上臂变化清楚、自然，服装、人物、姿势与背景保持一致，不出现其他身体部位反向变宽造成方向混淆 |
| 3 | range 两个端点分别显示完整编辑侧/原始侧，标签与 alt 和裁切方向一致；键盘、触摸、三模式切换、原图样例预览、SSR 与响应式行为不回退 |
| 4 | 新素材保留 AI-generated concept 说明，记录生成/编辑来源与实际视觉复核结果；相关 E2E、typecheck 与 build 通过 |

根因核对：CSS 对应关系没有反向；原始 Slim 图右腰更收，但局部轮廓变化混杂，在 50% 叠图下容易误读。使用内置 image_gen 编辑项目原始概念图，保存 `slim-editorial-v2.webp` 并更新唯一 manifest；左侧原始、右侧腰部/上臂/上段裤型自然同向收窄。旧图保留溯源。range 为 0 时隐藏 Original 标签，100 时隐藏 Edited 标签，50 时保留两标签。

验证顺序：先记录场景 → 查看原始双图和共享 CSS、独立视觉复核 → 修改素材与端点标签 → Codex 内置浏览器检查实际 Home/End/50 状态和原/编辑半图 → 按真实 DOM 扩展 `visual-homepage.spec.ts`。该 spec 12/12，`editor-entrypoints.spec.ts` 8/8，整组 20/20（48.7s）；E2E_SKIP_CLEANUP=true，无数据库写入。

无缓存 `pnpm typecheck --force` 与 `pnpm build --force` 通过（25.0s / 71.1s）；新 spec 独立 TypeScript 检查通过；构建保留已有分块体积提示。本地 Workers 7003 预览首页 HTTP 200，SSR 引用新版 Slim 图，图片 HTTP 200 且 SHA-256 与源文件一致；临时预览已停止。

截图：`test-results/concept-direction/home-desktop.png`、`home-mobile.png`、`slim-original.png`、`slim-edited.png`、`slim-compare.png`。日志：`test-results/concept-direction-e2e.log`、`concept-direction-typecheck.log`、`concept-direction-build.log`、`concept-direction-cf-preview.log`。实际编辑提示词记录在 `docs/implementation/homepage-image-prompts.md` 的新版 Slim 小节。

---

## 30. 上传优先首屏

**文件：** `specs/visual-homepage.spec.ts`；入口回归 `specs/editor-entrypoints.spec.ts`。

**状态：** Green（2026-10-14：上传优先新增 3/3，visual-homepage 15/15 + editor-entrypoints 8/8，整组 23/23）

| # | 验收场景 |
|---|----------|
| 1 | 桌面首屏左侧显示短小可见 H1 与可操作上传器，右侧为现有概念对比图；两栏顶部对齐，无大标题、长介绍和重复上传入口；320/390/768 px 手机/平板首先看到上传操作与模式/提交控件，比较图位于其后，无横向溢出 |
| 2 | 仅一个 #try 与一个文件输入，处于 #home-hero 内；JPG/PNG/WebP 本地预览、替换、模式切换、coming-soon 提示与不上传/不计费行为保持一致 |
| 3 | 顶栏、功能卡片、定价与末尾入口继续到顶部 #try；下方 #samples 选择样例也跳回顶部并显示对应原始半图，样例/文件/模式切换不重挂载上传器或丢失当前文件 |
| 4 | 右侧概念图的标签/对比方向、三模式切换及概念披露保持正确；SSR 保留唯一 H1、图片 alt、关键词内链、既有 head/canonical/sitemap；相关 E2E、typecheck 与 build 通过 |

实现：唯一 #try/UploadDropzone 移入首屏左栏，短 H1 保留；桌面右侧概念对比图，手机先上传再展示图。移除首屏长介绍、重复 CTA/徽标和模式长描述。原上传区改为 #samples，其真实链接选择原始样例并返回顶部同一个上传器。未新增公开文案或收费/API行为，所有显示文本仍来自已有 EN/ZH 字典。

验证顺序：场景 → 布局实现 → Codex 内置浏览器 1280/390 px 与样例返回走查 → 按真实 DOM 更新现有场景和新增 3 例 → 整组 23/23（1.3m）。第一次适配中的两个测试代码问题（samples 变量作用域、smooth-scroll 的等待范围）已修正，完整重跑通过；未发现 production 故障。E2E_SKIP_CLEANUP=true，拦截写请求，不注册或清理数据库用户。

无缓存 `pnpm typecheck --force`（23.7s）、`pnpm build --force`（77.8s）通过；新 spec 独立 TypeScript 检查通过。SEO audit 四个索引页及 noindex/404/重定向自查通过。Workers 7003 预览首页 HTTP 200，SSR 的唯一 H1/上传器位于 hero 内，概念图及下方 samples 存在；临时预览已停止。构建保留已有分块体积提示，浏览器临时 viewport 已恢复。

截图：`test-results/upload-first-homepage/home-desktop.png`、`home-mobile.png`。日志：`test-results/upload-first-homepage-e2e.log`、`upload-first-typecheck.log`、`upload-first-build.log`、`upload-first-seo.log`、`upload-first-cf-preview.log`。

---

## 31. 实际 AI 身体编辑

**状态：** Green（2026-10-14；实际接入 gpt-image-2.5-1k，本地可用；生产部署配置另行完成）

| # | 验收场景 |
|---|----------|
| 1 | 首页和三个指南的同一个编辑器支持 Slim/Muscle/Proportions/Breast 及三档强度；选本地原图或概念样例的原始半图，提交真正 POST 图片和模式至服务端；固定服务端模板调用兔子 images/edits，不由客户端指定密钥/模型/自由提示词 |
| 2 | 未登录提示登录并保留当前原图；登录用户获得已配置的一次账户试用；明确积分成本，生成中禁用重复操作，成功显示真实原图/结果、对比与下载，可换图继续编辑；失败显示可理解的本地化错误，不继续展示 coming soon |
| 3 | API 登录/禁用用户/同源/owner 权限一致；10MB/MIME/签名/枚举/requestId 在扣费前验证；Key 或存储未配置不扣费；用户 A 不可读取或下载用户 B 结果 |
| 4 | 同一用户请求 UUID 和输入 hash 支持幂等：processing 不重发提供商请求，成功可取缓存结果，不同 payload 复用 UUID 被拒绝；并发余额原子检查，试用 bonus 仅一次；失败/超时退款只一次且有 canonical 账本记录，stale/迟到结果不覆盖退款状态 |
| 5 | Base64 生成结果私有存储于本地开发目录/Workers R2，下载通过登录 owner API，不暴露原图；URL 输出处理遵循已核实协议，禁止任意服务端下载、泄露密钥或 raw provider error；结果可在响应丢失后按 job 查询，尚未收到 job ID 时按账户与请求 UUID 恢复，刷新不重复付费生成 |
| 6 | 所有页面移除核心 AI 编辑 coming-soon 声明，更新隐私、指南和FAQ；概念营销图仍清楚标识不作为实际结果，SSR/H1/head/canonical/关键词内链/sitemap不回退；新核心 E2E、现有公共回归、typecheck/build/SEO/Workers 验证通过 |
| 7 | 使用已配置兔子 Key 和一张项目虚构成人原图做一次真实 canary；记录实际 endpoint/model/result 字段及视觉检查，不把 mock 当真实效果，不输出密钥或执行批量收费测试 |

验证记录：共享单元测试 246/246（八个 suite，含真实 SQLite 事务与模拟 provider/API/storage）；相关 E2E 34/34（1.6m，body-editing 11 + visual-homepage 15 + editor-entrypoints 8）。E2E 使用模拟登录与生成响应、禁用全局数据库清理，不执行注册邮件或重复付费生成。已在浏览器走查真实页面并查看最新桌面/手机截图。覆盖四模式上传、强度、私有图片下载、重复点击、202 轮询、500 不确定响应复用 UUID、刷新前尚无 job ID 的恢复、失败退款提示与新请求、余额不足保留文件、原始样例半图、登录弹窗保留选择。

真实调用：仅一次 `POST https://api.tu-zi.com/v1/images/edits`，模型 `gpt-image-2.5-1k`，Slim/Balanced，使用项目虚构着装成人原图。返回 `data[].url`，下载器仅允许已核实的 `apioss8.sydney-ai.com/ximg/`，保存 1086×1448、2,001,365 bytes PNG 到 `test-results/body-edit-live-result.png`。目视确认腰部/上臂收窄，同时存在姿态/背景变化，不承诺像素或身份完全保留。其余模式经提示词与接口测试，未逐一发起付费实测。

新鲜 typecheck、Cloudflare build（44.097s）、SEO audit 与 diff whitespace 检查通过；构建保留已有大分块提示。Neon 仅应用新增任务表的 `0006_body_image_edit.sql`，未重放旧迁移或修改现有数据。7001 开发服务配置接口返回 available=true、costCredits=15、freeTrialEdits=1。临时 Workers 7003 首页/配置接口均 HTTP 200，无 SSR 错误；未配置部署密钥/数据库时正确返回 available=false。验证后关闭临时 Workers 服务、保留 7001。Workers 实际生图及线上部署未执行，仍需真实 Hyperdrive、密钥和私有 R2 配置。

日志：`test-results/live-edit-unit.log`、`live-edit-e2e.log`、`live-edit-typecheck.log`、`live-edit-build.log`、`live-edit-seo.log`、`live-edit-cf-runtime.log`；最新首屏截图在 `test-results/upload-first-homepage`。

---

### Backlog 优先级汇总

| 优先级 | 编号 | 测试名称 | 前置条件 | 预计用例数 |
|--------|------|----------|----------|-----------|
| P2 | 19 | 支付宝支付流程 | 支付宝沙盒 App ID/密钥 + 沙盒买家账号 | 3 |
| ✅ | 20 | 博客功能 | blog_post 表已创建 + 管理员账号 | 11 |
| ✅ | 27 | 视觉优先首页与概念照片交互 | TanStack 首页与原始概念照片实现、浏览器走查完成 | 10 |
| ✅ | 28 | 兔子 API 接入准备（模拟验收） | 共享适配器、四模式模板与本地试跑；真实调用待 Key | 114 单元/CLI + 18 公共回归 |
| ✅ | 29 | 概念对比方向与 Slim 样例修正 | 新版原创 Slim 图与共享端点标签实现、浏览器走查完成 | 2 新增 + 18 回归 |
| ✅ | 30 | 上传优先首屏 | 唯一上传器移入首屏、桌面/手机与样例返回走查完成 | 3 新增 + 20 回归 |
| ✅ | 31 | 实际 AI 身体编辑 | 真实兔子单次调用、四模式编辑器、任务/积分/私有结果及恢复链路 | 246 单元 + 34 E2E |

---

## 实时照片轮廓预览（Green，2026-10-14）

- 上传照片后，在浏览器中识别一次人物轮廓与关键点，显示分析中、成功、无法识别/加载失败状态；首次打开首页不加载识别模型。
- 原图上叠加原始轮廓与目标轮廓；1–100 滑杆和四种模式即时更新目标线，保留原图、姿势和强度选择。
- 拖动滑杆和调整定位不产生生图 POST、不扣积分、不重复识别；可关闭轮廓并重新打开。
- 可在需要时调整目标区域的位置；更换照片清除旧分析与手动定位，迟到的旧结果不能覆盖新照片。
- 无法识别时说明原因并保留换图/正常生成入口；轮廓被标为目标示意，不宣称精确生成结果。
- 点击生成仍发送原始图片与所选模式/数值，现有登录、计费、恢复、结果显示流程保持有效。
- 验证桌面与手机可见、触摸/键盘可操作、无横向溢出；用真实人物照片走查识别与即时变化，再编写 E2E。
- 完成相关 E2E、单元测试、typecheck、build、Cloudflare SSR/静态模型资源验证。

验收完成：327/327 单元测试（10 suites）；轮廓、编辑、入口 E2E 共30/30通过。手机换图按钮改为44px图标以免遮挡脸部后，相关7项轮廓 E2E再次全部通过（31.0s）。两项浏览器用例实际加载自托管 MediaPipe 模型，从项目原创成人照片识别人物轮廓，验证四模式/不同强度即时改变目标线、原始线不变、每张图仅启动一次分析且生图POST为0。另覆盖拖动/键盘校准、隐藏/恢复、换图取消旧结果、识别失败与手机布局。浏览器走查发现选图必须等待页面 hydration，正式用例等待编辑按钮启用后操作；无需修改产品登录流程。

最终无缓存 typecheck 11.364s、build 31.189s通过。Cloudflare本地7003上四个内容页SSR/单canonical均通过，并用生产客户端实际完成本地照片识别，浏览器无运行错误。运行时与模型6项SHA256校验通过；`.gitattributes`固定供应商文件字节，避免Windows换行转换破坏校验。保留原有构建大分块和npm配置提示。临时7003验证后关闭，7001开发服务保留。本轮没有调用付费生图API、修改用户积分或部署线上。

证据：`test-results/body-contour-unit.log`、`body-contour-e2e.log`、`body-contour-e2e-final.log`、`body-contour-typecheck.log`、`body-contour-build.log`、`body-contour-cf.log`；最终桌面/手机截图 `body-contour-final-desktop.png`、`body-contour-final-mobile.png`。

## 首页主要概念图加强（Verified，2026-10-14）

- Slim、Muscle、Proportions 的主要对比图呈现清晰差异：腰腹与上臂收窄；肩、胸与上臂更饱满；腰臀比例更明显。英语、中文标题、说明与主图 alt 对应变化。
- 保留原始 Before 输入；每张对比图为 1536×1024，原始样例为 768×1024。After 保持同一人物与相近姿势、衣物、背景构图，生成纹理仍有少量差异；主图引用 `/examples/v3/*-editorial.webp`。
- 首页三模式切换、滑杆方向、图片解码、原始样例与上传入口正常；现有 AI 概念图披露、标签及生活场景副图保持不变。
- 三张图经内置 imagegen 各编辑一次，重新拼接原始 Before 后保存 WebP。目视检查小尺寸三联预览，相关 E2E 5/5（14.7s），覆盖 SSR、切换、对比端点、六图解码及 sample outline/原图提交；fresh typecheck 和 Cloudflare build 通过，保留既有分块大小提示。未跑全量检查或调用项目 AI provider。生成提示词与资产路径记录在 `test-results/showcase-v3/generation-manifest.json`，预览为 `test-results/showcase-v3/showcase-preview.jpg`。

## 测试结果追踪

2026-10-14 结果破图恢复验收（Green）：实际根因是 Nitro dev 中间件将 `Sec-Fetch-Dest: image` 误分流到静态资源处理，私有动态图片接口返回 404；相同请求使用 `empty` 则正常进入路由（未登录401），直接文档导航也可读取 owner 的图片。原组件又没有稳定高度和加载错误处理，导致破图后区域塌成24px。修改为带同源凭证的 fetch → 校验 MIME/大小 → blob URL 展示；手机/桌面保持320/420px，有限两次自动 GET 重试，持续失败提供手动重载。结果解码后才出现比较控件，重载不 POST 生图、不扣积分；四模式正常流程增加 naturalWidth/naturalHeight 断言。

已在用户真实页面验证原有成功结果解码为1329×1183，320px预览区域正常，无新增生成调用；截图 `test-results/body-edit-result-display-fixed.png`。回归先复现 Red：原 img 请求失败后 naturalWidth 为0；模拟 Nitro 对直接 image 请求404后依旧 Red，带凭证 fetch 修复后进入验证。开发热更新期间还遇到 createStartHandler 模块失效，已重启本任务7001服务；未更改依赖或访问其他项目端口。

最终编辑 E2E 14/14（36.0s）通过，包含图片 GET 短暂失败自动恢复、持续错误有界重试及手动重载、慢图片稳定布局和四模式实际解码/下载。首轮暴露两个测试文本匹配歧义及开发环境废弃 effect 的重复 GET；已使用 exact 文案定位，并让废弃 effect 在开始联网前清理，整组重跑通过。新鲜 typecheck（25.074s）、build（1m19.261s）通过，保留已有大分块及混合动态/静态导入提示。证据：`test-results/body-edit-display-e2e-confirm.log`、`body-edit-display-typecheck.log`、`body-edit-display-build.log`。

最终 Workers 本地7003首页/配置接口均200，无SSR错误；部署密钥未配置时正确返回 unavailable。记录在 `test-results/body-edit-display-cf.log`，临时服务验证后关闭，7001保留；whitespace检查通过。

2026-10-14 返回图片节点修复验收（Green）：真实增肌请求返回 `apioss28.sydney-ai.com/ximg/`，旧实现只允许 apioss8，复现 INVALID_RESPONSE。已接受供应商 `apioss<数字>.sydney-ai.com` 节点，继续拒绝相似域名、其他子域、非 HTTPS、非标准端口和重定向。新增用例先 Red（四项失败）再 Green；相关八个单元 suite 256/256，通过错误原因/安全日志与退款断言。同一已生成结果成功下载为 2,020,304-byte PNG，无第二次生成；结果已目视检查。失败日志只含任务/型号/阶段/安全原因，不含密钥、完整图片 URL 或原始响应。

本轮编辑 E2E 首次与构建并行时有一项在提交前等待初始化按钮启用超过 5 秒；构建结束后整组独立重跑 11/11（24.7s）通过，无重试付费调用。新鲜 typecheck（30.718s）、build（1m9.394s）和 whitespace 检查通过；保留既有大分块警告。Workers 7003 的首页和配置接口均 200，无 SSR 错误，未配置生产密钥时 editing=false；临时服务已关闭，7001 开发服务保留。证据：`test-results/body-edit-diagnostic.log`、`body-edit-cdn-live.log`、`body-edit-cdn-unit.log`、`body-edit-cdn-e2e-confirm.log`、`body-edit-cdn-typecheck.log`、`body-edit-cdn-build.log`、`body-edit-cdn-cf.log`。

每次运行后在此记录结果：

| 日期 | 应用 | 通过 | 失败 | 跳过 | 备注 |
|------|------|------|------|------|------|
| 2026-02-25 | Next.js | 35 | 0 | 0 | 全部通过（含 Stripe 支付） |
| 2026-03-04 | Next.js | 3 | 0 | 0 | AI Chat 真实交互（ai-chat.spec.ts） |
| 2026-03-06 | Next.js | 3 | 0 | 0 | AI Image Generation 真实生成（ai-image-generate.spec.ts） |
| 2026-03-06 | Nuxt.js | 3 | 0 | 0 | AI Image Generation 真实生成（ai-image-generate.spec.ts） |
| 2026-03-06 | Next.js | 5 | 0 | 0 | Creem 支付流程（creem-payment.spec.ts） |
| 2026-03-06 | Nuxt.js | 5 | 0 | 0 | Creem 支付流程（creem-payment.spec.ts） |
| 2026-03-06 | Next.js | 7 | 0 | 0 | PayPal 支付流程（paypal-payment.spec.ts） |
| 2026-03-06 | Nuxt.js | 7 | 0 | 0 | PayPal 支付流程（paypal-payment.spec.ts） |
| 2026-03-08 | Nuxt.js | 88 | 0 | 0 | **全量回归** — 全部通过（5m19s） |
| 2026-03-08 | Next.js | 88 | 0 | 0 | **全量回归** — 全部通过（6m00s） |
| 2026-03-09 | Nuxt.js | 11 | 0 | 0 | 博客功能（blog.spec.ts）— 全部通过（16.6s） |
| 2026-03-09 | Next.js | 11 | 0 | 0 | 博客功能（blog.spec.ts）— 全部通过（43.4s） |
| 2026-03-09 | Nuxt.js | 11 | 0 | 0 | 博客增强后回归（blog.spec.ts）— 全部通过（15.9s） |
| 2026-03-09 | Next.js | 11 | 0 | 0 | 博客增强后回归（blog.spec.ts）— 全部通过（55.5s） |
| 2026-04-27 | Next.js | 105 | 0 | 0 | **SQLite/D1 分支全量回归 (PG)** — 全部通过（7.4m） |
| 2026-04-27 | Nuxt.js | 96 | 2 | 0 | **SQLite/D1 分支全量回归 (PG)** — 2 个超时 flaky（admin-panel 导航 + blog 创建）（7.4m） |
| 2026-04-27 | TanStack | 105 | 0 | 0 | **SQLite/D1 分支全量回归 (PG)** — 全部通过（6.5m） |
| 2026-04-28 | Next.js | 103 | 1 | 0 | **SQLite/D1 分支全量回归 (SQLite)** — 1 个 PayPal 沙盒超时（9.4m） |
| 2026-04-28 | Nuxt.js | 92 | 2 | 2 | **SQLite/D1 分支全量回归 (SQLite)** — 1 个 admin-filters flaky + 1 个 PayPal 沙盒超时（8.4m） |
| 2026-04-28 | TanStack | 103 | 1 | 0 | **SQLite/D1 分支全量回归 (SQLite)** — 1 个 PayPal 沙盒超时（8.3m） |
| 2026-05-26 | Next.js | 20 | 0 | 0 | **返利管理增强 (PG)** — affiliate + admin-affiliate 全部通过（1.5m） |
| 2026-05-26 | TanStack | 20 | 0 | 0 | **返利管理增强 (PG)** — affiliate + admin-affiliate 全部通过（49s） |
| 2026-05-26 | Nuxt.js | 20 | 0 | 0 | **返利管理增强 (PG)** — affiliate + admin-affiliate 全部通过（40s） |
| 2026-05-26 | Next.js | 20 | 0 | 0 | **返利管理增强 (SQLite)** — affiliate + admin-affiliate 全部通过（1.5m） |
| 2026-05-26 | TanStack | 20 | 0 | 0 | **返利管理增强 (SQLite)** — affiliate + admin-affiliate 全部通过（31s） |
| 2026-05-26 | Nuxt.js | 20 | 0 | 0 | **返利管理增强 (SQLite)** — affiliate + admin-affiliate 全部通过（30s） |
| 2026-05-26 | Next.js | 4 | 0 | 0 | **推荐佣金支付全流程 (PG)** — affiliate-commission 全部通过（52s） |
| 2026-05-26 | TanStack | 4 | 0 | 0 | **推荐佣金支付全流程 (PG)** — affiliate-commission 全部通过（59s） |
| 2026-05-26 | Nuxt.js | 4 | 0 | 0 | **推荐佣金支付全流程 (PG)** — affiliate-commission 全部通过（33s） |
| 2026-08-24 | Next.js | 6 | 0 | 0 | AI 功能页 + 新模型目录（ai-features.spec.ts） |
| 2026-08-24 | Nuxt.js | 6 | 0 | 0 | AI 功能页 + 新模型目录（ai-features.spec.ts） |
| 2026-08-24 | TanStack | 6 | 0 | 0 | AI 功能页 + 新模型目录（ai-features.spec.ts） |
| 2026-08-26 | Next.js | 4 | 0 | 0 | Waffo 支付（waffo-payment.spec.ts，含完整订阅结账 + webhook） |
| 2026-08-26 | Nuxt.js | 4 | 0 | 0 | Waffo 支付（waffo-payment.spec.ts，含完整订阅结账 + webhook） |
| 2026-08-26 | TanStack | 4 | 0 | 0 | Waffo 支付（waffo-payment.spec.ts，含完整订阅结账 + webhook） |
| 2026-08-30 | TanStack | 163 | 0 | 1 | **前台重设计分支全量回归 (PG)** — 全部通过（13.4m）；支付 spec 适配 provider tab |
| 2026-08-30 | Next.js | 163 | 0 | 1 | **前台重设计分支全量回归 (PG)** — 全部通过（12.6m） |
| 2026-08-30 | Nuxt.js | 163 | 0 | 1 | **前台重设计分支全量回归 (PG)** — 全部通过（11.5m）；creem 重试防冷路由 flaky |
| 2026-10-14 | TanStack | 8 | 0 | 0 | 首页与专题统一入口（editor-entrypoints.spec.ts）；公共页、无数据库写入；typecheck / fresh CF build / SEO audit / Workers SSR preview 通过 |
| 2026-10-14 | TanStack | 16 | 2 | 0 | 视觉首页相关 spec 首轮调试；修正新 spec 的绝对重定向 URL 与顶栏 CTA 文案预期 |
| 2026-10-14 | TanStack | 18 | 0 | 0 | visual-homepage.spec.ts 10/10 + editor-entrypoints.spec.ts 8/8（52.0s）；公共页、无写请求、跳过数据库清理 |
| 2026-10-14 | TanStack | 1 | 0 | 0 | 视觉首页首屏截图用例补跑（2.7s）；保存 1280×900 桌面与 390×844 手机截图 |
| 2026-10-14 | Shared / CLI | 114 | 0 | 0 | 兔子 API 准备：prompt 34 + transport 72 + CLI 8（1.78s）；全 mock，无真实提供商调用 |
| 2026-10-14 | TanStack | 18 | 0 | 0 | 兔子 API 准备的公共回归（48.6s）；无写请求、跳过数据库清理；fresh typecheck / build / Workers SSR preview 通过 |
| 2026-10-14 | TanStack | 20 | 0 | 0 | 概念方向修正：visual-homepage.spec.ts 12/12 + editor-entrypoints.spec.ts 8/8（48.7s）；无写请求、跳过清理；fresh typecheck / build / Workers SSR 新图验证通过 |
| 2026-10-14 | TanStack | 21 | 2 | 0 | 上传优先测试首轮适配；修正测试变量作用域及 smooth-scroll 等待范围，非 production 故障 |
| 2026-10-14 | TanStack | 23 | 0 | 0 | 上传优先：首页 15/15 + 入口 8/8（1.3m）；无写请求、跳过清理；fresh typecheck / build / SEO / Workers SSR 通过 |
| 2026-10-14 | Shared / TanStack | 280 | 0 | 0 | 实际编辑：246 单元 + 34 E2E（生成/登录 mock）；另一次真实 Slim/Balanced 成功；fresh typecheck/build/SEO/Workers SSR 与配置检查通过，本地 Neon 增量建表完成 |
| 2026-10-14 | Shared / TanStack | 267 | 0 | 0 | CDN 节点修复：256 单元 + 11 核心 E2E；真实 apioss28 返回结果下载成功；fresh typecheck/build/Workers SSR 与配置检查通过 |
| 2026-10-14 | TanStack | 14 | 0 | 0 | 结果破图修复：带登录态 fetch/blob 展示、稳定高度、有限自动重试/手动重载；真实已生成图片恢复，未新增付费调用；fresh typecheck/build通过 |

_每次测试运行后更新此表。_

### 2026-10-14：More editing concepts 生活场景对比增强

验收场景（素材替换前记录）：
- Slim / Muscle / Proportions 三张生活场景图在约 300px 宽卡片上呈现明显的腰腹收窄、肩胸手臂增肌、腰臀轮廓变化；保留同一人物、姿势、服装、光线与场景。
- 左半原始输入直接裁自原素材，仅做 WebP 重新编码；右半编辑概念增强。双图维持 1536×1024 和等宽半图，滑杆在 0 / 50 / 100 时方向正确、人物对齐、图片可解码。
- 点击三个生活场景 Preview 链接仍向唯一上传器加载原始半图和对应模式；AI-generated concept 披露与现有 SSR alt 保留。
- 桌面与手机实际走查；相关首页 E2E、typecheck、build 通过后记录结果。

状态：验收完成（2026-10-15）。内置 imagegen 编辑三张生活场景图，Proportions 追加一次腰臀轮廓增强；仅用 Sharp 裁取原始左半图、拼接新版右半图及 quality 90 WebP 编码。引用 `/examples/v3/*-lifestyle.webp`，每图 1536×1024，分别 265988 / 267294 / 205102 bytes；原素材保留。实际生成提示词与来源记录于 `docs/implementation/homepage-lifestyle-v3.json`。

桌面 1280×900 及手机 390×844 内置浏览器复核：0 / 50 / 100 对比方向正确，体型差异可见；生活场景 Preview Proportions 载入 768×1024 原始半图并选中对应模式。`agent-browser` 未安装，使用 Codex 内置浏览器完成同等走查。截图与三组对照预览保存在 `test-results/lifestyle-v3/`。

验证：相关 E2E 最终 5/5（16.2s；首页 SSR、全部对比端点、六图解码、主要/生活场景入口，以及原始半图提交的 provider mock 回归）。首轮 3/4，一条旧测试把 #try 内侧边样例说明计入上传器，按真实 DOM 改为 `[data-body-editor]` 范围后通过。`E2E_SKIP_CLEANUP=true`，无真实提供商调用或数据库清理。`pnpm typecheck --force` 通过（12.943s）；最终 `pnpm build --force` 通过（35.786s，无缓存）；Cloudflare workerd 7003 预览首页 SSR 200、三图 200 且解码/字节与源文件和构建产物一致，无 SSR 异常。日志 `typecheck.log`、`build.log`、`e2e-final.log`、`cf-check.log`；保留既有分块大小/混合 import 警告。仅 TanStack 为现有应用。

| 日期 | 应用 | 通过 | 失败 | 跳过 | 范围 |
| --- | --- | ---: | ---: | ---: | --- |
| 2026-10-15 | TanStack | 5 | 0 | 0 | More editing concepts 生活场景对比增强；类型检查、fresh CF build、Workers SSR/资产和桌面/手机走查通过 |
