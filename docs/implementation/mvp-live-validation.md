# MVP live validation — 2026-10-16

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
