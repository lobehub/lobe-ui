# Image viewer rewrite — Medium-Zoom core, custom engine

**Date:** 2026-08-02
**Scope:** `src/Image/` — full rewrite of `Image.tsx`, `PreviewGroup.tsx`, new `viewer/` module. Export paths unchanged (`Image`, `PreviewGroup`, `Image.PreviewGroup` from `@lobehub/ui`).
**Release:** one major bump (semantic-release, breaking types).

## Goal

Replace the antd/rc-image preview with a self-built viewer whose baseline is the Medium Zoom experience — click a thumbnail and it FLIP-animates from its in-document rect to a centered fit-to-screen position over a fading backdrop; dismiss returns it to its live origin rect — then extend that baseline with deep zoom, pan, rotate/flip, copy/download toolbar, and gallery navigation. The `Image` component itself drops antd entirely.

## Non-goals

- Touch gestures beyond basic usability (pinch-zoom, swipe-to-dismiss, swipe-to-navigate) — next iteration. This version guarantees: tap to open/close, double-tap zoom, one-finger pan.
- Toolbar auto-hide on idle — v1 chrome is always visible.
- `getContainer` / custom portal target — zero downstream usage.
- EXIF orientation handling.

## Downstream usage audit (lobe-chat, 2026-08-02)

Full scan of lobe-chat established the real compatibility surface:

- 21 `<Image>` sites: 20 preview-enabled (18 via default), 1 `preview={false}`, 1 object form using **only `preview.src`** (low-res thumbnail, hi-res preview).
- `PreviewGroup`: 7 sites, all prop-less (4 named import, 3 `Image.PreviewGroup`). `Markdown` wraps content in an implicit `<PreviewGroup enable={enableImageGallery}>` — every Markdown consumer depends on it.
- **Zero** usage of `toolbarAddon`, `imageRender`, `actionsRender`, `toolbarRender`, `onVisibleChange`, `onOpenChange`, `minScale`, `maxScale`, `items`, `mask`, `visible`, `getContainer`, `rootClassName`, preview `styles`.
- Non-preview props in use: `alt`, `src`, `style`, `className`, `classNames`, `styles`, `width`, `height`, `size`, `maxHeight`, `objectFit`, `variant`, `isLoading`, `actions`, `alwaysShowActions`, `title` — all preserved.

Conclusion: the preview API can be redesigned freely; required compat is the `preview` boolean toggle, `preview.src`, prop-less `PreviewGroup` (+ `enable`), and the `Image.PreviewGroup` static.

## Architecture

```
src/Image/
  Image.tsx              # self-rendered <img>: loading=lazy, onError → FALLBACK svg,
                         #   variant/skeleton/actions preserved; click opens viewer
  PreviewGroup.tsx       # own context: child Images register {src, previewSrc, ref}
                         #   in DOM order; exposes ordered list + navigation
  viewer/
    ImageViewer.tsx      # Base UI Dialog.Root/Portal/Backdrop shell (focus trap, Esc,
                         #   scroll lock, aria-modal) + full image + chrome
    useFlipTransition.ts # open/close choreography: rect measurement + motion springs
    useZoomPan.ts        # transform state machine {scale, x, y, rotate, flipX, flipY}
    Toolbar.tsx          # migrated copy/download logic; antd message → base-ui toast
  type.ts / style.ts / index.mdx / demos/
```

Principles:

- **Single source of truth for geometry.** The FLIP open/close animation and the zoomed-state transform drive the same motionValues (translate/scale/rotate). No handoff seam; interrupting mid-animation continues from current values. React re-renders are not on the per-frame path.
- **Dialog primitives own the overlay lifecycle** (same pattern as `base-ui/Drawer`): portal, backdrop, focus management, Esc plumbing, body scroll lock, accessibility. `@base-ui/react@1.6.0` already a dependency.
- **De-antd surface:** antd `Image`, antd `PreviewGroup`, antd `message` all removed from this component. `ImageProps` re-declared on `ComponentProps<'img'>`, no antd type inheritance.
- **Singleton:** at most one viewer open; opening while open closes the previous.
- Motion gated through `MotionProvider` / `useReducedMotion`; z-index from theme tokens.

## Interaction model

### Open

- Click thumbnail → backdrop fades in (`colorBgLayout` at 90% + 8px backdrop blur), image springs (FLIP) from thumbnail rect to fit rect.
- **Fit** = contain within viewport minus a 24px margin per edge, **never exceeding natural size** (small images center at natural size — faithful to Medium).
- **Dual-source:** when `preview.src` differs from the thumbnail src, FLIP launches immediately with the already-decoded thumbnail source; the hi-res source loads in the background and swaps in place on load. On hi-res failure, silently stay on the thumbnail source.

### Close (fit state)

- Click image / click backdrop / Esc / accumulated wheel `|deltaY| ≥ 100` → FLIP back to the thumbnail's **freshly re-measured** rect.
- Thumbnail no longer visible (scrolled away, virtualized out) → fall back to centered fade-out.
- Body scroll is locked while open (Dialog); "scroll to close" listens to wheel gestures, the page does not actually scroll.

### Deep zoom

- Entry: double-click (cursor-anchored, toggles fit ↔ max(2×fit, natural 100%)), ctrl/cmd+wheel (= trackpad pinch) from any state, toolbar ± buttons (viewport-center anchored).
- Zoomed state: plain wheel = cursor-anchored zoom; drag = pan with edge clamping + slight rubber band; plain click no longer closes (drag-misfire protection); backdrop click still closes.
- Scale is expressed relative to fit: min = 1 (below-fit gestures rubber-band back), `maxScale` default 8, configurable.
- Zooming back down snaps to fit and recenters. Scroll-to-close **re-arms only after ≥300ms wheel idle**, so an overshooting zoom-out gesture cannot accidentally dismiss.
- **Layered Esc:** in zoomed/rotated/flipped state, first Esc resets to clean fit; in clean fit state, Esc closes.
- Close animation branches on state: clean fit → FLIP back to thumbnail; dirty (zoomed/rotated/flipped) → centered fade-out (no distorted return trip).

### Rotate / flip

Toolbar buttons. Rotation steps 90° with fit recomputed for the swapped aspect and animated; flips mirror instantly. Any dirty state closes via fade-out (see above).

### Keyboard

- `Esc` — layered (reset, then close)
- `←` / `→` — gallery prev/next
- `+` / `-` — zoom; `0` — reset to fit

### Gallery (PreviewGroup)

- Floating circular arrows left/right (hidden at ends), count pill top-center ("2 / 5").
- Switching: current image fades out with slight scale-down, next fades in (no cross-image FLIP); transform resets to fit; dual-source strategy applies per image.
- Opening FLIP starts from the clicked thumbnail; closing FLIP returns to the **currently displayed** image's thumbnail if visible, else fades out.

## API (breaking, major)

```ts
interface ImagePreviewOptions {
  maxScale?: number; // relative to fit, default 8
  onOpenChange?: (open: boolean) => void;
  src?: string; // hi-res source
  toolbarAddon?: ReactNode;
}

interface ImageProps /* extends ComponentProps<'img'> minus conflicts */ {
  // all existing non-preview props preserved: actions, alwaysShowActions,
  // classNames, styles, isLoading, max/min W/H, objectFit, size, variant, ref…
  preview?: boolean | ImagePreviewOptions;
}

interface PreviewGroupProps {
  children?: ReactNode;
  enable?: boolean;
  preview?: boolean | ImagePreviewOptions; // group-level config
}
```

Removed (all zero-usage downstream): `items`, `minScale`, `onVisibleChange`, `imageRender`, `actionsRender`, `toolbarRender`, and all remaining antd `PreviewConfig` passthrough. `Image.PreviewGroup` static property preserved.

## Visual chrome

- Backdrop: `colorBgLayout` 90% + 8px blur. Close button top-right, circular, `colorBgContainer` + `boxShadowTertiary` — existing style language throughout (arrows, pills identical treatment).
- Toolbar: bottom-center floating pill (outlined variant + blur) — flip H/V · rotate L/R · zoom out · **scale percentage (click resets to fit — new)** · zoom in · copy · download · `toolbarAddon`.
- Chrome fades in ~150ms delayed so it never obstructs the opening FLIP; always visible in v1.
- Cursors: thumbnail hover `zoom-in`, fit state `zoom-out`, zoomed `grab`/`grabbing`.

## Edge handling

- Reduced motion / MotionProvider animations off → all transitions degrade to 150ms fades.
- Hi-res load failure → stay on thumbnail source. Full image failure → FALLBACK placeholder, zoom tools disabled. Copy/download failure → base-ui toast (behavior migrated from current Toolbar).
- SSR: `Image` renders server-side; viewer is client-only portal.

## Testing

- `useZoomPan` unit tests: fit computation, cursor-anchored zoom math, pan clamping, wheel state machine (fit-scroll closes / zoomed-wheel zooms / 300ms re-arm), layered Esc.
- Component tests (vitest + jsdom): open/close + `onOpenChange`, gallery registration order and navigation, dual-source swap, `preview={false}`, `enable`.
- Existing `Image` snapshots updated for the new thumbnail markup.
- Browser verification via the `local-testing` skill against docs demos (FLIP visuals, wheel semantics, keyboard); demos updated and registered in the frozen inventory.
