# Homepage photo upload

The homepage opens with its single local photo uploader directly below a compact `AI Body Editor` h1. In `#home-hero`, the `#try` entry occupies the left column and the concept comparison occupies the right; on mobile, the uploader comes first. Explanatory content and examples follow below. The page retains `routeHead('home')` and SSR-visible body copy, meaningful image alt, FAQ answers and keyword links to published guides.

## Assets and disclosure

Six original AI-generated concept diptychs live in `apps/tanstack-app/public/examples/v2`. Each is 1536 × 1024 with two equal 768 × 1024 portrait panels. The left panel represents an original concept and the right panel a modest corresponding change. These are fictional adults, not customers or results from the application's editor. The concept label appears above the hero image and disclosures accompany the galleries. Actual prompts, provenance and encoding details are in `homepage-image-prompts.md`.

After the user flagged an apparently reversed Slim comparison, full-image and CSS inspection confirmed the source halves were correctly mapped but the original Slim contours were not clear enough. The active Slim primary now uses `slim-editorial-v2.webp`, an edit of our own original asset with more consistent right-side slimming. Hero, feature card, detail views, sample picker and original sample preview all share that manifest entry. The old asset remains archived. Other mode mappings are unchanged.

WebP files total about 1 MB. The hero is eager/high priority; later examples and detail views load lazily. Repeated uses of a file share the browser cache. PNG originals are stored outside public assets for provenance.

## Interaction and shared code

`config/body-editor.ts` supplies three concept mode IDs for the showcase and four editing mode IDs for the uploader, including Breast. `showcase-data.ts` maps the concept modes to asset paths. The framework-independent `libs/react-shared/components/photo-comparison.tsx` displays each appropriate half with CSS and clips the original half over the edited concept using a native range. Home/End and arrow keys operate the control; a focus ring identifies it. Initial photos and labels render on the server. Selecting a hero mode updates the photos, alt and short caption, and selects the same mode in the uploader. The hero pairs the title and uploader with the comparison, mode controls and concept disclosure.

At slider position 0, only the edited half is visible and the Original label is hidden. At 100, only the original half is visible and the Edited label is hidden. Both labels remain in their correct positions at intermediate values. This prevents a full single-side photo from displaying the other side's label.

The homepage coordinates mode and sample selection. The separate `#samples` section contains sample thumbnails. Its links and the example Preview links point to `#try`, returning to the same uploader at the top. A sample loads its original half into that preview, selects the mode, clears the previous local file and resets the file input so the same file may be chosen again. A valid local file replaces the sample and creates a blob URL; that URL is revoked on replacement/unmount. Clearing a sample removes it. JPG/PNG/WebP and the 10 MB limit remain unchanged.

Selecting a file or sample only creates a local preview. Explicit submission through Edit my photo sends the original to the authenticated AI editing API, with four modes and three intensities. The uploader provides sign-in without losing the selected photo, cost/trial information, pending/error states, actual result comparison and private download. Topic guides reuse this same flow. See `body-edit-rabbit.md` for the provider, job and credit lifecycle.

## Content and pricing

Sequence: hero uploader and concept comparison → three photo-led goals → sample picker → three supplementary concepts → two detail comparisons → preparation/privacy/steps → compact pricing state → FAQ → guide links and CTA. English copy is mirrored in Chinese; only English is routable. FAQ text still comes from the same translations as FAQPage JSON-LD. Native details allow expansion without JavaScript. Reduced-motion preferences disable smooth anchor scrolling.

The uploader states the configured 15-credit editing cost and one account trial. Configured paid packs, if any, obtain prices and credits from `public-offer.ts`, which also supplies JSON-LD. There are no fabricated reviews or ratings.

## Verification

Acceptance scenarios are recorded in TEST-CATALOG sections 27, 29 and 30. Public Playwright coverage uses `E2E_SKIP_CLEANUP=true` and exercises this homepage alongside shared-editor/SEO regressions. Browser walkthrough, typecheck, production build, SEO audit and a local Workers SSR preview are required before delivery.

Verified on 2026-10-14: the related E2E group passed 18/18 (10 homepage, 8 entrypoint regressions), typecheck and a fresh production build passed, and SEO audit passed for all four indexable pages. Desktop/mobile screenshots were inspected. Local Wrangler preview on port 7003 served `/` and `/body-editor` with the correct SSR titles and the new concept/caption content, and the WebP asset returned `image/webp`. The temporary preview was stopped after verification. Port 7002 already belonged to another project's worker, so it was not used as proof for this app. The build retains existing warnings for chunks exceeding 500 kB.

After the Slim correction on the same date: E2E passed 20/20 (12 homepage, 8 entrypoint), including source-half transforms, Home/End/50% label states and the shared asset across cards/closeups/samples. Fresh typecheck and build passed. Workers preview on 7003 returned the new source in SSR and image bytes with a matching SHA-256; it was stopped afterward. Updated desktop/mobile and three comparison-state screenshots are under `test-results/concept-direction`. TEST-CATALOG section 29 contains the complete record.

After moving the uploader to the hero on the same date: E2E passed 23/23 (15 homepage, 8 entrypoint), including complete upload controls in the first viewport at 320/390/768/1280, desktop left/right alignment, file preservation through both mode controls, and samples returning to the hero without writes. Fresh typecheck and build, SEO audit and Workers SSR preview passed. Desktop/mobile screenshots are under `test-results/upload-first-homepage`; TEST-CATALOG section 30 has the logs. The temporary Workers server was stopped and the browser viewport reset. The build retains the existing large-chunk warning.

After activating real editing on the same date: 34/34 related E2E tests passed (11 editing, 15 homepage, eight entrypoint), with mocked auth/provider responses. Four modes and three intensity controls remain within the upload-first layout; refreshed desktop/mobile screenshots are in `test-results/upload-first-homepage`. Fresh typecheck/build/SEO and Workers SSR/config preflight passed. One separate real Rabbit request produced an inspected Slim result. TEST-CATALOG section 31 records the scope and production configuration still required.
