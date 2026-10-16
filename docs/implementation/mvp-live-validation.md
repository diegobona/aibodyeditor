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
