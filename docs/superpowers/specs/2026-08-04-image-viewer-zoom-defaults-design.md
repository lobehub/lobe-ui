# Image viewer — configurable open zoom, wheel direction split

**Date:** 2026-08-04
**Scope:** `src/Image/viewer/` — `geometry.ts`, `useZoomPan.ts`, `useViewerGestures.ts`, `useGalleryNav.ts`, `useRefitTransition.ts`, `Toolbar.tsx`, plus `type.ts` / `registry.ts` for the new options.
**Follows:** [2026-08-02-image-viewer-design.md](./2026-08-02-image-viewer-design.md) (PR #593, `77f19bd9`).
**Release:** minor — two additive options, no removals. Behavior of the default open size changes.

## Goal

Three pieces of feedback landed on the rewritten viewer:

1. Scrolling feels heavily damped.
2. The image can no longer be dragged around freely.
3. It should open at 100%, not fit-to-screen — fit makes screenshots unreadable.

(1) is a real defect with two independent causes. (3) is a real pain with the wrong prescription. (2) is a symptom of (3), not a defect in its own right.

## Non-goals

- **Unbounded pan is not restored.** rc-image lets a fit-sized image be dragged anywhere; no mainstream viewer does (Preview, Apple/Google Photos, Lightroom, Figma, Twitter all lock a non-overflowing image to center). Dragging a fully-visible image off-center yields no new information and costs the user their orientation. The underlying complaint — "I can't move the image" — is caused by fit-sized images never overflowing the viewport, so `panBounds` returns `{ 0, 0 }` (`geometry.ts:120`). Once the auto policy opens screenshots at 100%, the image overflows and pan works, with bounds intact.
- **`DEFAULT_RUBBER_BAND_FACTOR` (0.15) is unchanged.** Edge resistance is intentional feedback, not damping to tune away.
- Drag-to-dismiss at fit scale. Considered as a middle ground for (2); unnecessary once (3) lands.
- Content-aware sizing (detecting text in images). Over-engineering for the gain.

## Part 1 — Wheel

### 1a. Direction split

`handleWheel` currently gates all zooming behind `if (isPinch || zoomed)` (`useZoomPan.ts:275`), where `zoomed = scale > 1`. At the default fit state a plain wheel therefore **never zooms** — it falls through to the close accumulator and dismisses the viewer at `|deltaY| ≥ 100`. Scrolling up to zoom in does nothing at all. That dead response is what reads as "damping".

A second dead zone compounds it: after a wheel gesture zooms back down to exactly 1, `disarmedRef` stays true for `WHEEL_IDLE_MS` (300ms, `useZoomPan.ts:265-269`), during which **no** wheel event in **either** direction does anything.

New rule:

| `scale`       | `deltaY < 0` (up) | `deltaY > 0` (down)     |
| ------------- | ----------------- | ----------------------- |
| `> MIN_SCALE` | zoom in           | zoom out                |
| `= MIN_SCALE` | **zoom in**       | accumulate toward close |

Zoom-in is no longer conditioned on current scale, so the up-direction dead zone disappears entirely — including during the 300ms disarm window, which now only gates the close accumulator (its actual purpose: stopping an overshooting zoom-out from dismissing).

Dismiss is preserved and gains a cleaner rationale: scrolling down past the zoom floor is the continuation of the zoom-out gesture, the same model as pinch-below-1x-to-dismiss in iOS Photos.

Ctrl/cmd+wheel (trackpad pinch) keeps zooming from any state, unchanged.

### 1b. `deltaMode` normalization

`WheelLikeEvent` reads only `deltaY`; nothing in `src/Image/` reads `deltaMode`. Firefox on Windows/Linux reports `DOM_DELTA_LINE` with `deltaY ≈ 3` per notch:

```
wheelZoomFactor(3) = exp(-3 * 0.002) = 1.006   // 0.6% per notch
```

115 notches to double, versus 22% per notch on Chrome/Safari's pixel mode. This is literal, severe damping on an entire browser and is a defect independent of everything else here.

`wheelZoomFactor` takes a `deltaMode` argument and normalizes to pixels before applying `WHEEL_ZOOM_SENSITIVITY`: `DOM_DELTA_LINE` × 16, `DOM_DELTA_PAGE` × viewport height. The same normalized value feeds the close accumulator, so `WHEEL_CLOSE_THRESHOLD` stays meaningful cross-browser.

`WHEEL_ZOOM_SENSITIVITY` itself stays at 0.002.

## Part 2 — Configurable open zoom

### API

```ts
export interface ImagePreviewOptions {
  autoZoomThreshold?: number; // default 2, only read when defaultZoom === 'auto'
  defaultZoom?: 'auto' | 'actual' | 'fit'; // default 'auto'
  maxScale?: number;
  onOpenChange?: (open: boolean) => void;
  src?: string;
  toolbarAddon?: ReactNode;
}
```

Both options sit alongside `maxScale` on `ImagePreviewOptions` and are defaulted in `ResolvedPreviewOptions` (`registry.ts:5`), so they are settable per-image or once on `PreviewGroup`'s `preview`.

`autoZoomThreshold` is named for its gate, not its effect: it is read **only** in `'auto'` mode, and `actualSizeThreshold` would imply it also governs `'actual'`.

### Policy

```
naturalScale = effective natural width / fit-rect width      // geometry.ts:155, existing

initialScale = max(MIN_SCALE, switch (defaultZoom) {
  'fit'    → MIN_SCALE
  'actual' → naturalScale
  'auto'   → naturalScale <= autoZoomThreshold ? naturalScale : MIN_SCALE
})
```

The `max(MIN_SCALE, …)` floor matters for dual-source entries: `fillViewport` drops `computeFit`'s no-upscale cap (`geometry.ts:55-59`), so the fit rect can exceed natural size and `naturalScale` can land below 1. Without the floor, `'actual'` and `'auto'` would both compute an initial scale under the zoom floor that `clampScale` then silently corrects.

`MIN_SCALE` stays 1 = fit. The zoom floor does not move, so an image opened at 100% can always be zoomed back out to see the whole thing — the property that rules out redefining `scale = 1` as natural size.

Worked examples on a 1440p screen (~1400px usable width after the 24px margins):

| Image                         | `naturalScale` | `'auto'` (K=2)                           |
| ----------------------------- | -------------- | ---------------------------------------- |
| 2560px dual-window screenshot | 1.8            | 100% — text legible, overflows, pannable |
| 1600px screenshot             | 1.1            | 100%                                     |
| 6000×4000 photo               | 4.3            | fit — whole frame visible                |

### `maxScale` interaction

`clampScale` caps at `maxScale` (default 8), expressed relative to fit. A 12000px-wide image on a 1400px viewport has `naturalScale ≈ 8.6`, so `defaultZoom: 'actual'` would be silently clamped below true 100%. The effective cap becomes `max(maxScale, initialScale)`, making the requested initial zoom always reachable.

### Splitting `isClean`

The whole dismiss system keys off `isClean`, defined today as `|scale - 1| < ε` plus no rotation/flip (`useZoomPan.ts:129-136`). Opening at `scale = 1.8` makes it **false on open**, which breaks three of the four close paths:

| Site                     | Today                                  | Naively opening at 100%                                                      |
| ------------------------ | -------------------------------------- | ---------------------------------------------------------------------------- |
| `escIntent()` `:375`     | Esc closes                             | Esc resets to fit; two presses needed to close                               |
| `onImageClick` `:175`    | click closes                           | `isZoomed` short-circuits — click does nothing                               |
| `handleClose` `:171`     | `fade: false` → FLIP back to thumbnail | `fade: true` → **plain fade; the signature open/close choreography is lost** |
| wheel accumulator `:301` | armed                                  | blocked by `!isCleanState()`                                                 |

The fix is to separate the concepts currently conflated in one flag. The first draft of this spec split it in two and was wrong: dropping the cleanliness gate on the wheel accumulator broke three existing regression tests that (correctly) assert a **rotated or flipped** image at fit scale cannot be dismissed by scrolling. That guard belongs — it is the same principle as layered Esc, that state the user built is never discarded by a gesture which merely ran out of room. But restoring `isClean` verbatim is also wrong: an image opened at 100% and scrolled back down to fit is "changed" by that measure, and would become permanently undismissable by scroll.

Three axes, not two:

| Concept                              | Test                                                   | Governs                                                   |
| ------------------------------------ | ------------------------------------------------------ | --------------------------------------------------------- |
| `isAtFitFloor` (new, internal)       | `scale <= MIN_SCALE + ε`                               | routing a scroll down to zoom-out vs. dismiss             |
| `isOrientationClean` (new, internal) | rotation 0 && no flip                                  | arming the wheel close accumulator                        |
| `isClean` (name kept, basis changed) | `\|scale − initialScale\| < ε` && `isOrientationClean` | Esc close-vs-reset, click-to-close, FLIP-vs-fade on close |

All three coincide only when `initialScale === MIN_SCALE`, which is why one flag sufficed before.

With them split, an image opened at 100% is `isClean` — Esc closes on the first press, clicking the image closes, and close still FLIPs back to the thumbnail — while `scale > 1` makes `panBounds` non-zero, so pan is live from the moment it opens. Scrolling down zooms out to fit, at which point `isAtFitFloor` arms the accumulator and further scrolling dismisses.

`reset()` (`0` key, layered Esc) returns to `initialScale`, not to 1.

No dismiss behavior regresses: every existing wheel test passes unmodified, including the three rotate/flip guards.

## Touchpoints

| File                       | Change                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `geometry.ts`              | add `resolveInitialScale(policy, naturalScale, threshold)`; `wheelZoomFactor` takes `deltaMode`                                                                                                                                                                                                                                                                     |
| `useZoomPan.ts`            | accept `defaultZoom`/`autoZoomThreshold`; derive + hold `initialScale`; rebase `isClean`; add `isAtFitFloor` + `isOrientationClean`; `reset()` → `initialScale`; direction-split `handleWheel`; raise cap to `max(maxScale, initialScale)`; add `toggleActualSize`                                                                                                  |
| `useFlipTransition.ts`     | the open animation's resting scale was hardcoded to 1 on both the FLIP and fade paths; take `getInitialScale` instead                                                                                                                                                                                                                                               |
| `useViewerGestures.ts:175` | `onImageClick` gate `isZoomed` → `!isClean`, aligning click-to-close with Esc                                                                                                                                                                                                                                                                                       |
| `useGalleryNav.ts:93`      | `scale.jump(1)` → jump to the **incoming** image's `initialScale`, with orientation reset moved _before_ the natural sync since the resting scale is rotation-dependent                                                                                                                                                                                             |
| `Toolbar.tsx`              | new expand/shrink control bound to `toggleActualSize`, disabled when the fitted size already is 100%; new `image.actualSize` / `image.fitToScreen` messages. The percentage becomes an inert fixed-width readout — not a button, no hover affordance — so it stops shifting the controls beside it as the digit count changes; `image.zoomReset` is dropped with it |
| `ActualSizeIcon.tsx`       | new. lucide's Expand split into its four corners so each rotates 180° about its own quadrant centre, which reproduces Shrink exactly (verified: max deviation 1e-6 user units against the real Shrink path over 41 samples per corner). The toggle therefore morphs with a plain CSS transform — no path interpolation and no morphing dependency                   |
| `ImageViewer.tsx`          | thread `currentEntry.options.defaultZoom` / `.autoZoomThreshold` into `useZoomPan`; second indirect ref for `isTransitioning`                                                                                                                                                                                                                                       |
| `Image.tsx`                | default both options; drop the duplicate local `DEFAULT_MAX_SCALE` in favour of geometry's                                                                                                                                                                                                                                                                          |
| `type.ts` / `registry.ts`  | declare both options; default them in `ResolvedPreviewOptions`                                                                                                                                                                                                                                                                                                      |

`useRefitTransition.ts` needed no change: it reads the resting scale off the motion value (`scale.get()`) rather than assuming 1, so re-landing inside `setNatural` before it runs is enough. The re-land is skipped while a transition is in flight, where `.jump()` would kill the open FLIP's spring instead of joining it.

### Deliberately frozen

`initialScale` is computed at open (and on `natural` arrival) and then held. A viewport resize re-clamps pan but does **not** re-derive `initialScale` — otherwise resizing the window silently rescales an image the user is reading. Rotation likewise leaves `initialScale` alone; rotating already sets `isClean` false via the rotation term, so the layered-Esc behavior stays correct.

## Testing

The three-axis split means **no existing test needed modification** — 228 pre-existing assertions pass unchanged, which is the strongest available evidence that the dismiss system survived. The only test-file edit is the new required `getInitialScale` in `useFlipTransition.test.ts`'s options factory.

New coverage (32 assertions, `geometry.test.ts` + `useZoomPan.test.ts`):

- `resolveInitialScale` across all three policies: inclusive threshold boundary, caller-tuned threshold, the rotated edge, the `MIN_SCALE` floor when the fit rect upscales, and the zero-width fit rect guard.
- `normalizeWheelDelta` for pixel / line / page modes and the unknown-viewport fallback.
- Opening above the floor stays `isClean`, so `escIntent()` is still `'close'` — the guard that keeps single-press Esc, click-to-close and the FLIP close alive.
- Opening above the floor is immediately pannable (`isZoomed`, and `dragBy` actually moves).
- `reset()` returns to `initialScale`, not fit.
- The `maxScale` ceiling is raised so `'actual'` reaches 100% when `naturalScale > maxScale`.
- An image opened at 100%, scrolled back to fit, then scrolled again dismisses.
- Wheel direction split: scroll-up at the floor zooms instead of doing nothing; scroll-down at the floor still accumulates toward dismiss; scroll-up during the 300ms disarm window zooms rather than going dead.
- `deltaMode` line notches produce the same zoom factor and the same dismiss weight as their pixel equivalents.
- `toggleActualSize` in all three directions (fit → actual, actual → fit, arbitrary zoom → actual).
- The toolbar renders the new control in order, toggles it round-trip, and disables it when the fitted size already is 100%.

Still outstanding: browser verification via the `local-testing` skill — wheel feel at both ends, a wide screenshot demo opening 1:1 and panning, a large photo demo still opening fit.
