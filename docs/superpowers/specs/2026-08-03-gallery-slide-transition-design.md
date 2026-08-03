# Gallery switch — carousel slide transition

**Date:** 2026-08-03
**Scope:** `src/Image/viewer/` — `useFlipTransition.ts` (`switchTo`), `useGalleryNav.ts`, tests. No public API change.
**Base:** worktree-image-viewer (PR #593), on top of the Medium-Zoom viewer.

## Goal

Replace the gallery switch's exit-then-enter fade (`switchTo` today: fade out + scale to 0.96 → swap src → fade in) with a full-viewport carousel push: the outgoing image slides out of one screen edge while the incoming image pushes in from the opposite edge, both moving simultaneously at full opacity.

## Behavior

- **Direction.** `next` pushes the new image in from the right while the old one exits left; `prev` mirrors. Applies to arrow buttons and `←`/`→` keys alike.
- **Distance.** One viewport width per image: outgoing translates `0 → -direction × viewportWidth` (composed on top of whatever transform it already carries), incoming starts at `+direction × viewportWidth` and springs to `0`. No opacity change on either.
- **Spring.** `visualDuration: 0.3` matching `OPEN_SPRING`, but `bounce: 0` — an overshooting full-viewport push would visibly slide past and snap back.
- **Reduced motion / `animated: false`.** Degrades to the current pure crossfade (no scale, no slide) — unchanged code path.

## Architecture — imperative ghost clone

`switchTo(apply)` becomes `switchTo(apply, direction: 1 | -1)`:

1. `stopAll()`; remove any ghost left by an interrupted previous switch.
2. Clone the live viewer `<img>` via `cloneNode` and insert it into the popup beside the original. The clone inherently captures the outgoing visual state — src, fitRect positioning styles, and the current zoom/rotate/flip transform string. Set `pointer-events: none` and `aria-hidden="true"`; strip the `id` if present. React never renders it; no handlers survive cloning.
3. Run `apply()` immediately (index/src/natural swap + zoom-state reset, exactly today's body), then `transform.x.jump(direction × viewportWidth)` and spring `x → 0`.
4. Animate the ghost by driving a progress value `0 → 1` with the same spring, writing `translateX(-direction × viewportWidth × p) <captured transform>` each frame. On settle (or the `SETTLE_FALLBACK_MS` timer), remove the ghost node and mark `transitioningRef` false.

Rationale over the alternatives: a React two-slot render or a sliding track would break the single-`<img>` assumption shared by gestures, FLIP open/close, and the dual-source refit; the clone is invisible to all of them.

### Wiring

- `useGalleryNav.goTo` computes `direction = Math.sign(nextIndex - indexRef.current)` and forwards it. `apply` now runs at slide start instead of after a fade-out, so `switchingRef` clears almost immediately — rapid arrow-key presses interrupt cleanly (step 1 removes the prior ghost and the new push takes over from the current position) instead of hitting today's ~150 ms dead window.
- Viewport width comes from the existing `viewport` value already flowing through `ImageViewer` (`getFitRect`'s source), not a fresh `window.innerWidth` read.

## Edge cases

- **Switch while zoomed/rotated/flipped.** The ghost slides out carrying the zoomed visual as-is; the incoming image arrives at clean fit. Same reset semantics as today, just visible during exit.
- **Dual-source hi-res landing mid-push.** The refit animates `scale`/fitRect only; the push owns `x`. Orthogonal axes — both proceed.
- **Close during push.** `close()` already `stopAll()`s; add the ghost to that cleanup so it never outlives the viewer.
- **Interrupted switch.** New `switchTo` or `close` removes the in-flight ghost immediately; the fallback timer guarantees removal even if the spring is cancelled by something else.

## Testing

- `useFlipTransition.test.ts`: `switchTo` gains direction-aware cases — ghost inserted with cloned transform and removed on settle; incoming `x` jumps to `±viewportWidth` then animates to 0; interruption removes the prior ghost; `animated: false` keeps the fade path ghost-free.
- `ImageViewer.gallery.test.tsx`: switch assertions updated from opacity-fade expectations to slide expectations; rapid-nav case asserts no dead window and a single surviving ghost.
