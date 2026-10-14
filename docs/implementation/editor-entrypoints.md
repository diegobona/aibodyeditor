# Homepage and topic-page entry points

The homepage introduces AI Body Editor, its editing modes and pricing. `/body-editor` provides a body-reshaping guide with photo preparation advice, examples, limitations and FAQs. The topic page uses the same editor as the homepage; it does not expose a separate manual editor or additional region sliders.

The header groups published topic pages under Tools. Its desktop disclosure uses native `details` and `summary` so tool links remain in server-rendered HTML. The mobile menu shows the same Tools group. Keyword anchors, footer links, canonical URLs and sitemap paths are retained.

JSON-LD describes one AI Body Editor application with a shared `@id`. Each topic page has its own WebPage, FAQ and breadcrumb data. A planned free edit is not emitted as an available Offer; configured credit-pack offers still come from the existing public-offer data.

Both entry points reuse `UploadDropzone`, with Slim, Muscle, Proportions and Breast choices and three intensity levels. Selection previews the original locally; explicit submission uses the shared authenticated Rabbit editing API. The uploader displays cost/trial information, pending/error states, real result comparison and private download.

Topic pages provide relevant examples and guidance while using the same editing flow. The clothed bust guide defaults to Breast. Authentication, atomic trial/credit charging, failure refunds, recoverable jobs and private result storage are described in `body-edit-rabbit.md` and verified in TEST-CATALOG section 31.

Verification covers desktop and mobile navigation, photo preview and mode selection, page-specific content, and SSR metadata and links. Run `editor-entrypoints.spec.ts` with `E2E_SKIP_CLEANUP=true`: this public-page suite creates no users and needs no database cleanup.
