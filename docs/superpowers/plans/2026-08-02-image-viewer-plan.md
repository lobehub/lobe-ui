# Image viewer rewrite — implementation plan

Spec (source of truth for all behavior): `docs/superpowers/specs/2026-08-02-image-viewer-design.md`
Branch: `worktree-image-viewer`. Tasks run sequentially; each ends with its own gitmoji commit.

## Global Constraints

- **Zero comments, zero JSDoc** in all code. No section headers, no "what" comments, no task references. The only permissible comment is a workaround for a specific external bug or a hidden invariant a reader would otherwise reverse — default is none.
- Max 500 lines per file; React components under 300 lines.
- ESM only, React 19. Internal imports use the `@/` alias (e.g. `@/Icon`, `@/base-ui/zIndex`). Client components start with `'use client'`.
- Styling via antd-style `createStaticStyles` in `style.ts` (follow `src/Image/style.ts` and `src/base-ui/Drawer/style.ts` patterns). Theme values via `cssVar`.
- Motion: import from `'motion/react'`; gate animation exactly the way `src/base-ui/Drawer` does with MotionProvider/reduced-motion (read `src/base-ui/Drawer/atoms.tsx` before writing any animation code).
- Overlay z-index via `useLayerZIndex('modal', …)` from `src/base-ui/zIndex` (see `src/base-ui/Drawer/atoms.tsx:96`).
- After each task: `pnpm vitest run src/Image` (plus any other touched test paths), `npx eslint --fix <changed files>`, `pnpm type-check`. Never lint the whole repo.
- Commit message style gitmoji + commitlint, e.g. `✨ feat(image): …`, `♻️ refactor(image): …`. Never bump versions, never add co-authors.
- No `antd` or `rc-*` imports anywhere under `src/Image/` when the branch is complete. Lobe-ui's own components (`@/Skeleton`, `@/ActionIcon`, `@/Flex`, `@/Icon`, `@/Tooltip`, `@/base-ui/Toast`) are allowed and encouraged.
- Scale convention everywhere: **scale is relative to fit** (fit = 1). Fit = contain in viewport minus 24px margin per edge, never exceeding natural size. `maxScale` default 8. Wheel-close threshold: accumulated `|deltaY| ≥ 100`. Scroll-close re-arms after ≥300ms wheel idle. Chrome fade-in delay ~150ms. Reduced-motion fallback: 150ms plain fades.

## Task 1: De-antd thumbnail Image + PreviewGroup registration context

**Goal:** `src/Image` renders thumbnails without antd and exposes the registration context the viewer will consume. The viewer itself does not exist yet; preview clicks route to a stub.

Files: `src/Image/Image.tsx`, `src/Image/PreviewGroup.tsx`, `src/Image/type.ts`, `src/Image/style.ts`, `src/Image/index.ts`, `src/Image/viewer/registry.ts` (new), colocated tests.

Requirements:

- `Image.tsx` renders its own `<img>` (no antd `Image`):
  - Preserve existing props/behavior: `variant` (cva variants in style.ts unchanged), `actions` + `alwaysShowActions` overlay, `objectFit` (default `'cover'`), `maxHeight`/`maxWidth` (default `'100%'`), `minHeight`/`minWidth`, `width`/`height`, `classNames.{image,wrapper}`, `styles.{image,wrapper}`, `className`, `style`, `onClick`, `ref` (outer Flexbox div), all standard `<img>` attrs passed through (`alt`, `title`, `crossOrigin`, …).
  - `loading='lazy'` default (overridable).
  - `isLoading` renders lobe-ui `@/Skeleton` sized by width/height/min/max props (check `src/Skeleton` API; keep the current shape: rounded rect placeholder, clickable wrapper preserving `onClick`).
  - `onError` → swap to `FALLBACK_DARK`/`FALLBACK_LIGHT` (existing constants in style.ts) by `useThemeMode().isDarkMode`; a subsequent `src` prop change resets the error state.
  - `size?: number | string` acts as width+height shorthand (both set unless explicit width/height given).
  - When preview is enabled (default true): cursor `zoom-in` on the image, click calls `openPreview(entry)` from `viewer/registry.ts`.
- `viewer/registry.ts` (stub for Task 3): exports `openPreview(entry: PreviewEntry): void` (no-op for now) and the `PreviewEntry` type: `{ element: HTMLImageElement; src: string; previewSrc?: string; options: ResolvedPreviewOptions }`.
- `PreviewGroup.tsx` — own context, no antd:
  - Provider registers child Images on mount: `{ id, getElement, src, previewSrc }`; unregister on unmount. Read order is DOM order (sort with `compareDocumentPosition` at read time, not registration time).
  - `enable={false}` renders children with no context (Images behave standalone).
  - `preview?: boolean | ImagePreviewOptions` stored as group-level config; `preview={false}` disables preview for all children. Per-image `preview` object overrides group keys.
  - `Image.PreviewGroup` static property preserved on the exported component (check `src/Image/index.ts` for the current attach pattern and keep it).
- `type.ts` rewritten:
  ```ts
  interface ImagePreviewOptions {
    maxScale?: number;
    onOpenChange?: (open: boolean) => void;
    src?: string;
    toolbarAddon?: ReactNode;
  }
  type ImageProps = Omit<ComponentProps<'img'>, 'width' | 'height'> & {
    actions?: ReactNode;
    alwaysShowActions?: boolean;
    classNames?: { image?: string; wrapper?: string };
    height?: number | string;
    isLoading?: boolean;
    maxHeight?: number | string;
    maxWidth?: number | string;
    minHeight?: number | string;
    minWidth?: number | string;
    objectFit?: 'cover' | 'contain';
    preview?: boolean | ImagePreviewOptions;
    ref?: Ref<HTMLDivElement>;
    size?: number | string;
    styles?: { image?: CSSProperties; wrapper?: CSSProperties };
    variant?: 'borderless' | 'filled' | 'outlined';
    width?: number | string;
  };
  interface PreviewGroupProps {
    children?: ReactNode;
    enable?: boolean;
    preview?: boolean | ImagePreviewOptions;
  }
  ```
  Removed: `items`, `minScale`, `onVisibleChange`, `toolbarRender`/`imageRender`/`actionsRender`, all antd `PreviewConfig`/`GroupPreviewConfig` inheritance, `PreviewGroupPreviewOptions`.
- Delete `src/Image/components/` (Preview.tsx, usePreview.tsx, usePreviewGroup.tsx). Move nothing yet from `Toolbar.tsx` — leave the file in place untouched (Task 5 migrates it); it must no longer be imported by anything.
- `style.ts`: drop the `preview` and `mask` entries (rc-image selectors, now dead); keep the rest. Thumbnail cursor `zoom-in` only when preview enabled (style via a class toggled by prop, not inline).
- Update demos only if they reference removed API so the docs site still compiles (`src/Image/demos/*`); check `src/mdx/mdxComponents/Image.tsx` and `src/Markdown/Markdown.tsx` still type-check (Markdown renders `<PreviewGroup enable={…}>` — signature unchanged).
- Tests (new, colocated): thumbnail renders img with src/alt/objectFit; fallback swap on error; skeleton when isLoading; actions overlay visibility classes; PreviewGroup registers children in DOM order and unregisters on unmount; `enable={false}` yields no context; per-image preview=false wins over group.

## Task 2: useZoomPan geometry + wheel state machine

**Goal:** all viewer math and interaction semantics as a pure, heavily-tested module. No DOM viewer yet.

Files: `src/Image/viewer/geometry.ts`, `src/Image/viewer/useZoomPan.ts`, colocated tests.

`geometry.ts` — pure functions, exhaustively unit-tested:

- `computeFit(natural: Size, viewport: Size, rotate: 0|90|180|270): { width, height, x, y }` — contain within viewport minus 24px margin per edge; **never exceed natural size**; 90/270 swaps effective natural dims; result centered.
- `anchoredZoom(current: {scale,x,y}, targetScale, anchor: Point, fitRect): {scale,x,y}` — the image point under `anchor` (viewport coords) stays under it. Invariant tested directly.
- `clampPan({scale,x,y}, fitRect, viewport): {x,y}` — on an axis where the scaled image overflows the viewport, translation is clamped so no gap opens between image edge and viewport edge; on an axis where it fits, translation is 0 (centered).
- `rubberBand(value, min, max, factor=0.15)` — overshoot compressed linearly by factor; used during active drags, released values spring back to clamped.
- Scale bounds: min 1, max = `maxScale` (default 8). Double-click target: `max(2, naturalScale)` where `naturalScale` is the scale at which the image renders at 100% natural pixels (`naturalWidth / fitWidth`); double-click at scale > 1 returns to 1.
- Wheel zoom factor: `exp(-deltaY * 0.002)`, anchored at cursor.

`useZoomPan.ts` — hook owning motionValues `{ scale, x, y, rotate, flipX, flipY }` plus:

- Derived state: `isClean` (scale===1 && rotate===0 && !flipX && !flipY), `isZoomed` (scale>1).
- `handleWheel(e)` state machine:
  - `ctrl`/`meta` wheel → anchored zoom from any state (this is trackpad pinch).
  - plain wheel while `isZoomed` → anchored zoom.
  - plain wheel while clean fit → accumulate `deltaY`; when accumulated `|deltaY| ≥ 100` → invoke `onCloseRequest` callback. Accumulator resets after 300ms wheel idle.
  - **Re-arm rule:** after any zoom mutation via wheel, the close accumulator is disarmed until ≥300ms of wheel idle (an overshooting zoom-out gesture must never dismiss).
  - Zooming below 1 clamps to exactly 1 and recenters (spring to x=0,y=0).
- `handleDoubleClick(point)` — toggle per double-click target above, anchored.
- Actions: `zoomIn()`/`zoomOut()` (step ×1.5, viewport-center anchored, clamped, disabled-state queryable), `reset()` (scale 1, x/y 0, rotate 0, flips off — animated), `rotateLeft()`/`rotateRight()` (±90°, resets scale to 1 and x/y to 0, fit recomputed for swapped aspect), `flipHorizontal()`/`flipVertical()`.
- Pan: `dragBy(delta)` applies rubber-banded translation; `dragEnd()` springs back to clamped values.
- `escIntent(): 'reset' | 'close'` — `'reset'` when not clean, `'close'` when clean.
- Constructor takes `{ natural, viewport, maxScale, onCloseRequest }`; exposes `setViewport`/`setNatural` for resize/source-swap.

Tests (fake timers for idle windows): fit cases (landscape/portrait/small-image-no-upscale/rotated), anchor invariant, clamp on both axes, rubber band, every wheel-machine transition incl. re-arm, double-click targets both directions, esc intent, action bounds.

## Task 3: Viewer shell — Dialog primitives + FLIP open/close + dual-source

**Goal:** clicking a thumbnail opens the real viewer: Medium-Zoom open/close with Base UI Dialog underneath. No deep-zoom gestures yet (wheel-close at fit works; zoom arrives in Task 4).

Files: `src/Image/viewer/ImageViewer.tsx`, `src/Image/viewer/useFlipTransition.ts`, `src/Image/viewer/registry.ts` (real implementation), `src/Image/style.ts` (viewer styles), i18n `image.close` key in `src/i18n/resources/{en,zhCn}/image.ts`, tests.

Requirements:

- `registry.ts`: real `openPreview(entry)` — renders a singleton viewer (module-level host: at most one open; opening while open closes the previous instantly). Viewer unmounts fully on close-complete.
- Shell: Base UI `Dialog.Root` (modal, controlled) + `Dialog.Portal` + `Dialog.Backdrop` + `Dialog.Popup`, following `src/base-ui/Drawer/atoms.tsx`; z-index `useLayerZIndex('modal')`. Backdrop: `colorBgLayout` at 90% (`color-mix`) + `backdrop-filter: blur(8px)`, fade in/out.
- FLIP (`useFlipTransition.ts`): on open, measure the thumbnail img `getBoundingClientRect()`; compute fit rect via Task 2 `computeFit`; position the viewer img at the fit rect and initialize the shared motionValues so it visually starts at the thumbnail rect (translate+scale transform only, no layout animation); spring to identity. Spring: `{ type: 'spring', visualDuration: 0.3, bounce: 0.15 }` as starting values (final tune happens in browser verification, Task 7).
  - The FLIP transform drives the **same motionValues** `useZoomPan` owns — one geometry source of truth; interrupting mid-flight continues from current values.
- Close (clean fit state): click on image, click on backdrop, Esc, or wheel-close signal (Task 2 accumulator) → re-measure the thumbnail rect **at close time**, spring back, then unmount. If the thumbnail is disconnected or its rect is fully outside the viewport → centered fade-out (opacity + slight scale-down) instead.
- Dual-source: viewer img starts from the thumbnail's `currentSrc`; when resolved `preview.src` differs, preload it in the background and swap `src` in place on load (rendered size already fixed by fit rect, so the swap is seamless); on preload error stay on the thumbnail source silently.
- Close button: top-right circular (`colorBgContainer` + `boxShadowTertiary`, matches existing style language), ActionIcon + lucide `X`, i18n `image.close` ("Close" / "关闭"), added to both locale files.
- Cursor on viewer image in fit state: `zoom-out`.
- Chrome (close button; later toolbar/arrows) fades in with ~150ms delay so the opening FLIP is unobstructed.
- Motion gating: MotionProvider-off / reduced-motion → open and close are 150ms opacity fades, no FLIP.
- `onOpenChange(true|false)` fires at open start / close start (merged group+image options).
- Viewport resize while open: re-run `computeFit`, update motionValue targets.
- Tests (jsdom; FLIP visuals verified in browser in Task 7): click opens dialog with img[src]; backdrop/image click and Esc close and unmount; onOpenChange both directions; dual-source: mock preload success swaps src, failure keeps original; `preview={false}` never opens; second open closes the first (singleton).

## Task 4: Deep-zoom gesture integration

**Goal:** the full desktop interaction model inside the open viewer.

Files: `src/Image/viewer/ImageViewer.tsx` (wiring), possibly `src/Image/viewer/useViewerGestures.ts`, tests.

Requirements (all semantics come from Task 2's machine — this task wires DOM events to it):

- Wheel listener (non-passive, on the popup): routes to `handleWheel`; ctrl/cmd+wheel prevented-default and zooms from any state; plain wheel zooms when zoomed, accumulates toward close when clean fit.
- Double-click on image: `handleDoubleClick` anchored at cursor.
- Pointer drag when zoomed: `setPointerCapture`, `dragBy` per move, `dragEnd` on release (spring back into clamp); cursor `grab`/`grabbing` while zoomed.
- Click-vs-drag discrimination: pointer movement > 4px between down and up suppresses the click-to-close.
- While zoomed, plain click on the image does **not** close; backdrop click still closes.
- Esc layering via `escIntent()`: `'reset'` → animated reset to clean fit (stay open); `'close'` → close. Intercept Base UI's Esc handling so the dialog doesn't self-close on the first Esc when dirty.
- Keyboard: `+`/`=` zoom in, `-` zoom out, `0` reset — same steps as toolbar actions.
- Close-branch rule: clean fit → FLIP back (Task 3 path); dirty (zoomed/rotated/flipped) → centered fade-out.
- Tests: wheel at fit accumulates → close fires; wheel when zoomed zooms and never closes; re-arm (fake timers) — zoom-out overshoot then immediate scroll does not close, 300ms idle then scroll closes; ctrl+wheel zooms at fit; dblclick toggles; drag suppresses click-close; Esc layering both branches; keyboard shortcuts.

## Task 5: Toolbar — copy/download, rotate/flip, scale indicator

**Goal:** the bottom-center floating toolbar, fully wired.

Files: `src/Image/viewer/Toolbar.tsx` (migrated from `src/Image/components/Toolbar.tsx`, which is deleted), `src/Image/viewer/ImageViewer.tsx` (mount), style.ts, i18n `image.zoomReset` key (en + zhCn), tests.

Requirements:

- Bottom-center floating pill (existing `toolbar` style: outlined variant, `borderRadiusLG`), same 150ms-delayed chrome fade-in.
- Contents in order: flip horizontal, flip vertical, rotate left, rotate right, zoom out, **scale percentage**, zoom in, copy, download, then `toolbarAddon` (from merged group+image options).
- Scale percentage: displayed as rendered-px / natural-px (`Math.round(displayedWidth / naturalWidth * 100)%`), so 100% = pixel-perfect; it is a click target that calls `reset()`; tooltip i18n `image.zoomReset` ("Reset Zoom" / "重置缩放").
- Zoom buttons call Task 2 `zoomIn`/`zoomOut` (×1.5, viewport-center anchored); disabled at min/max bounds.
- Rotate/flip buttons call Task 2 actions (rotate resets scale/pan per Task 2 semantics, animated; flips mirror instantly).
- Copy/download logic migrated **unchanged** from the old `src/Image/components/Toolbar.tsx` (fetch → blob → clipboard/anchor, filename+extension helpers, loading states), except: antd `message` → base-ui imperative `toast` (`src/base-ui/Toast`). ToastHost is not globally mounted — mount one inside the viewer portal so feedback works standalone. Keep the i18n success/failure messages.
- Copy/download operate on the currently displayed source (hi-res once swapped).
- Delete `src/Image/components/` remnants; nothing under `src/Image` may import antd after this task (verify with grep, it is part of the task).
- Tests: renders all controls; zoom buttons disable at bounds; percentage reflects scale and resets on click; copy/download success + failure → toast (mock fetch/clipboard); toolbarAddon renders.

## Task 6: Gallery navigation

**Goal:** PreviewGroup-driven multi-image navigation inside the viewer.

Files: `src/Image/viewer/ImageViewer.tsx`, `src/Image/PreviewGroup.tsx` (expose ordered list to viewer), style.ts, i18n `image.prev`/`image.next` keys (en + zhCn), tests.

Requirements:

- When the opened Image belongs to a PreviewGroup, the viewer receives the ordered entry list and the clicked index.
- Chrome: circular prev/next buttons vertically centered left/right (same circular style language; a button hides at its end — no wrap-around); count pill top-center "current / total" (outlined pill style). Absent entirely for standalone images or groups of one.
- Keyboard `←`/`→` = prev/next; ends no-op.
- Switch animation: current image fades out with slight scale-down (~0.96), next fades in; transform resets to clean fit for the new image; dual-source strategy runs per image; wheel/Esc/close semantics unaffected.
- Group-level `preview` options apply to every image; per-image options override per key (`toolbarAddon`, `maxScale`, `onOpenChange`, `src`).
- Close after navigation: FLIP returns to the **currently displayed** image's thumbnail when visible; fade-out otherwise (Task 3 fallback).
- Tests: open at clicked index; arrows/keyboard navigate and stop at ends; counter updates; transform resets between images; close-after-navigate targets the current entry's element; group options merge.

## Task 7: Docs, demos, and final verification

**Goal:** docs site reflects the new viewer; whole branch verified in a real browser.

Files: `src/Image/index.mdx`, `src/Image/demos/*`, docs registration files as needed, any straggler fixes.

Requirements:

- Rewrite `index.mdx` for the new API (preview options table: `src`, `maxScale`, `onOpenChange`, `toolbarAddon`; interaction model summary; breaking-change note listing removed antd passthrough).
- Demos: update existing (`index`, `Gallery`, `Fallback`, `CustomActions`) to the new API; add a dual-source demo (`preview={{ src }}` low-res → hi-res) and a deep-zoom demo (large image showcasing wheel zoom + pan). New demos must be registered wherever the docs frozen demo inventory requires (grep the repo for how recent commits registered new demos, e.g. `git log --grep="frozen inventory" -3` and follow that pattern; sidebar needs no change — atom pages self-derive).
- Verify `src/index.ts` public exports unchanged (`Image`, `PreviewGroup`, types); `src/mdx/mdxComponents/Image.tsx` and `src/Markdown/Markdown.tsx` compile and behave (Markdown's implicit `<PreviewGroup enable>` path).
- Full check battery: `pnpm vitest run src/Image src/Markdown`, scoped eslint on all files changed across the branch, `pnpm type-check`, `pnpm lint:circular`.
- Browser verification against the dev server (`pnpm dev`) using agent-browser, per the repo's local-testing conventions: FLIP open/close from a real thumbnail (smoothness, correct origin/return), wheel-at-fit closes, ctrl+wheel and dblclick zoom, drag pan with clamping, Esc layering, toolbar actions (copy/download show toasts), gallery arrows/keyboard/counter, dual-source swap visible on throttled network, dark + light themes, `prefers-reduced-motion` fallback. Fix what you find; report anything left.
