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
