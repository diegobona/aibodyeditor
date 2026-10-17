# Local photo contour analysis assets

The browser downloads these assets from this site's own origin only after a photo is
selected. Photo pixels stay in a dedicated browser worker and are never sent to a
remote detection service. The model is Pose Landmarker **lite**, float16, revision 1;
the JavaScript and WebAssembly runtime are `@mediapipe/tasks-vision` **0.10.21**.

`assets.json` records the exact upstream URLs, sizes, and SHA-256 digests. Runtime
requests do not use those upstream URLs. The unmodified upstream CommonJS bundle
is saved as `vision_bundle.js` and loaded into an `exports` object in a classic
worker. The resolver chooses either SIMD or non-SIMD WASM, never both.

- JavaScript runtime: 137,890 bytes
- SIMD loader and WASM: 9,778,316 bytes
- Non-SIMD fallback loader and WASM: 9,652,775 bytes
- Pose model: 5,777,746 bytes
- First-use browser transfer (SIMD, uncompressed): about 15.7 MB; subsequent photo
  analysis can reuse the browser's HTTP cache.

Run `node scripts/sync-body-preview-assets.mjs` from the repository to verify all
asset checksums. Add `--download` to restore missing or changed assets from the
pinned upstream sources, verifying the downloaded contents before saving them.

MediaPipe is Copyright Google LLC / The MediaPipe Authors, distributed under the
Apache License 2.0. The upstream license, including its third-party notices, is
included as `LICENSE.mediapipe`.

Official documentation:
https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js

The mask is an estimated visible-person segmentation, not a body measurement. The
worker traces its actual foreground edges; it does not fabricate a silhouette
from pose points. Unsupported devices, unreadable images, and missing usable
torso detections return an error so ordinary photo editing can remain available.

Only the analysis bitmap is resized to a maximum dimension of 1280, with width
rounded to a multiple of four. This keeps CPU float segmentation-mask rows
16-byte aligned; unaligned widths can abort MediaPipe 0.10.21 inference with
`Check failed: 1 == ChannelSize() (1 vs. 4)`. This applies to smaller images too.
The original image bytes and reported dimensions are preserved. Reproduced on a
1184×1328 continued result (previous analysis width: 1141; aligned width: 1140).

Breast target geometry additionally requires reliable shoulder/hip anchors,
uses torso-relative side bounds and excludes detected upper-arm/forearm paths.
Breast mode always displays a purple approximate chest-area ellipse alongside
the original outline, retaining the purple target contour when measurable
chest-side changes are available. Other modes do not display the chest ellipse.
Its position is estimated from shoulder and hip landmarks; the model is not a
dedicated chest segmentation model. The guide's horizontal and vertical radii scale continuously
with intensity using the shared fullness-to-width square-root conversion, with
the existing size at the default intensity of 70 as the reference. Stored region
radii remain unscaled, so repeated slider or alignment changes do not accumulate
scaling. Alignment and reset remain available even in this state; changing
intensity preserves the aligned center. The guide indicates requested strength
without claiming to predict an exact edited silhouette. Alignment affects only
the local preview. This does not replace or retrain the model, reveal hidden
anatomy, or alter generation inputs.
