# Unified real example presets

**Goal:** Replace three concept samples and the lower gallery with ten real, interactive example presets at the top of the homepage.

**Design:** Shared case data supplies one original/result pair, mode, intensity and exact submitted extra instructions per case. Selection applies settings and loads the sample when no device photo is present. A device photo is preserved while trying recipes, with an explicit action to use the sample instead. The right-hand saved result and its metadata stay fixed while editor controls change. Never generate on selection.

- [x] Define acceptance scenarios before code.
- [x] Extend the uploader's preset input and settings/photo callbacks with race-safe loading and pending locks; keep standalone guides working.
- [x] Render ten scrollable thumbnail choices, fixed real comparison and explicit sample action; remove duplicate lower gallery.
- [x] Add EN/ZH strings and update docs in parallel.
- [x] Walk the real UI, write/update related E2E against the DOM, run related tests, typecheck and one build. No paid requests or broad review.

## Workbench follow-up (approved)

Replace the vertical preset list and repeated comparison metadata with a full-width top case strip and a desktop original/result/settings workbench. Start empty (Slim 70). Case choice defaults to full photo + recipe loading; an explicit settings-only switch preserves the current photo/result. Show result directly, retain it when settings change, clear it on new photo. Mobile uses image tabs. Preserve guides, billing and recovery behavior; verify only related flows plus typecheck and build.

Completed: workbench, explicit switch, empty initial state, direct results, mobile tabs, updated copy/docs and 9 related passing flows; typecheck/build/Workers SSR passed.
