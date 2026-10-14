# Live body contour preview

The editor overlays a target outline on the selected original photo before generation. Photo analysis runs locally in the browser; selecting a photo, moving the strength slider, changing modes and adjusting outline alignment do not call the image-edit endpoint or consume credits.

## Flow

1. Selecting a photo lazily loads a browser worker and the self-hosted pose/segmentation model.
2. The worker detects body landmarks and extracts the visible person's contour from its segmentation mask. Analysis is retained for the selected photo.
3. Shared geometry derives a target contour from those landmarks, the chosen mode and the continuous 1–100 strength. The overlay updates without another detection request.
4. Replacing the photo cancels the old analysis and clears its alignment. A late result cannot overwrite the next photo's preview.
5. Generation continues through the existing authenticated API with the original file, mode and strength. The overlay is not burned into the submitted photo.

## Meaning of the outline

The outline is a geometric target guide. Shared configuration supplies the relative visual targets used by the preview and provider prompt, but this does not make the provider a deterministic shape renderer. A volume target also needs an approximation when displayed as a two-dimensional width. The guide does not guarantee that generated pixels, muscle size or clothing contours will match it exactly.

Person segmentation describes the visible outer silhouette, including clothing; it does not reveal anatomy hidden by clothes or identify internal breast boundaries. Occlusion, loose clothing and difficult poses can reduce recognition quality. Manual outline alignment helps position a guide; it is not an additional provider edit-region parameter. Recognition failure leaves the normal photo-generation flow available.

## Runtime and privacy

Vision code is loaded only after a photo is selected and runs outside the main UI thread. Model/runtime downloads are static assets; user photo pixels are sent only to the local worker until the user explicitly starts generation. Initial model loading and analysis can take time, while subsequent slider movements only update local geometry. No model or worker is required for server rendering.

## Verification

Acceptance scenarios and final verification results are recorded in `tests/e2e/TEST-CATALOG.md`. Tests cover real local inference, live contour updates without generation, mode switching, photo replacement, failed recognition and the existing editing flow.

2026-10-14: 327 unit tests across 10 suites and 30 browser E2E cases passed. After the final mobile replacement-button adjustment, all seven contour E2E cases passed again. Fresh typecheck/build and four Workers SSR pages passed; the built production client also completed real local inference with no browser errors. No paid image-generation calls were needed. The fixed model/runtime assets are checksum-verified and lazily served from this origin; their first-use transfer is about 15.7 MB before transport compression. Gallery sample selection retains its previous lightweight preview; device-photo uploads receive the live contour overlay.
