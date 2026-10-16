# Real results gallery implementation plan

**Goal:** Expand the homepage proof gallery to ten actual editing cases covering all four modes and custom instructions, with at least six distinct fictional adult subjects.

**Architecture:** Reuse qualified saved provider outputs. Create new fictional source portraits with built-in imagegen, then run missing edits through the existing app endpoint. Never use a concept edit as an actual result. Keep source/result hashes and request metadata. Render the gallery from typed showcase data with translated captions, mode/intensity/request details, six initial cards and four expandable cards; retain SSR content and lazy image loading.

- [x] Record acceptance criteria before implementation.
- [x] Reuse the two existing cases; generate missing edits with at most two concurrent provider requests and no automatic paid retries. Later user steering adds dresses/skirts/shorts, a Black man and woman, and an East Asian woman. Eight distinct subjects appear in the final selection; older Muscle/Proportions outputs are superseded by these more diverse subjects.
- [x] Assemble ten unretouched before/after WebP pairs and update provenance.
- [x] Implement gallery data, EN/ZH captions, accessible expansion and three-column desktop/two-column tablet/one-column mobile layout.
- [x] Walk the actual page, then update/run only focused gallery E2E; run typecheck and one build. Update implementation/user docs with results.

Execution stays inline to honor the user's request for speed and limited review. Only the existing TanStack app is in scope.
