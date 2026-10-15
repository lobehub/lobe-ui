# Video: a player with sections and markers

Date: 2026-10-12
Branch: from `v6` (lands in #706 before 6.0.0 stable)
Design canvas: https://claude.ai/artifact/Vxe7gmBvQk1kuMEuDbUGS6

## Goal

Replace `src/Video` (a native `<video>` plus a hover mask) with a player that covers everything the lobe-chat acceptance player does today (`lobe-chat/src/features/Acceptance/Viewer/Evidence/Video/`), with the domain-specific parts left to lobe-chat:

- **In lobe-ui:** sections on the timeline, point markers, marker captions over the frame, hover frame preview, frame stepping, playback speed, fullscreen, focus-scoped keyboard, load-error recovery, and a player handle that business code can drive.
- **Stays in lobe-chat:** reviewer notes, drawn regions, the range lane, the dispute button. They plug in through the parts API and the `overlay` slot.

Success: lobe-chat's `VideoEvidencePlayer` and `VideoReviewStage` can be rebuilt on `Video.Root` and its parts with no private copy of the clock, timeline or control bar, and the plain uses (markdown, mdx, `Portal/LocalFile/VideoPreview`) render with `<Video src>` alone.

## Decisions

| #   | Question                                                                           | Decision                                                                                                                                                                      |
| --- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | How sections sit on the timeline                                                   | **Segmented rail** (YouTube-style): each section is a segment; the hovered one grows                                                                                          |
| 2   | Dense sections (acceptance allows up to 100 marks, `MAX_VERIFY_EVIDENCE_CHAPTERS`) | **Narrow sections merge**: a section under 12 px joins its neighbour; its start stays as a 1 px hairline                                                                      |
| 3   | API shape                                                                          | **Preset + parts**: `<Video>` for the common case, `Video.Root` + parts + hooks for composition                                                                               |
| 4   | Where the preset's controls live                                                   | **Over the frame, auto-hiding**; a `Controls` placed after `Frame` sits below and never hides                                                                                 |
| 5   | Hover thumbnail                                                                    | **Probe video, on by default**, `thumbnails={false}` turns it off                                                                                                             |
| 6   | Business access                                                                    | **Player handle** via `ref` on `<Video>` / `Video.Root`, and `useVideoPlayer()` for reactive reads outside the tree                                                           |
| 7   | Play / pause icons                                                                 | **Solid** (filled); the bar's icon **morphs** between play and pause (clip-path polygon transition, off under reduced motion); the center play button stays a static triangle |
| 8   | Sound                                                                              | **Mute button** in the bar (no volume slider)                                                                                                                                 |

## Public API

### Data

```ts
interface VideoSection {
  start: number;
  title: string;
}

interface VideoMarker {
  color?: 'success' | 'warning' | 'error' | 'info' | (string & {});
  content?: ReactNode;
  key?: Key;
  label?: ReactNode;
  time: number;
}
```

- A section ends where the next one starts; the last ends at `duration`. Sections are sorted by `start` internally.
- If the first section starts after 0, the gap before it is an untitled segment.
- `content` is what the caption and the hover preview show; `label` is the short heading (e.g. "Check").
- Semantic colors map to `--lobe-color-success/warning/error/info`; any other string is used as a CSS color.

### Player handle

```ts
interface VideoState {
  activeMarkers: VideoMarker[];
  activeSection?: VideoSection;
  duration: number;
  muted: boolean;
  paused: boolean;
  rate: number;
  size?: { height: number; width: number };
  status: 'loading' | 'ready' | 'error';
  time: number;
}

interface VideoPlayer {
  getState(): VideoState;
  pause(): void;
  play(): Promise<void>;
  requestFullscreen(): Promise<void>;
  readonly root: HTMLDivElement | null;
  seek(seconds: number): void;
  setMuted(muted: boolean): void;
  setRate(rate: number): void;
  step(frames: number): void;
  subscribe(listener: (state: VideoState) => void): () => void;
  toggle(): void;
  toggleMute(): void;
  readonly video: HTMLVideoElement | null;
}
```

Two ways to get it:

```tsx
const ref = useRef<VideoPlayer>(null);
<Video ref={ref} src={src} />;
ref.current?.seek(52);

const player = useVideoPlayer();
<Video player={player} src={src} sections={sections} markers={markers} />;
const time = useVideoState(player, (s) => s.time);
```

`useVideoPlayer()` creates the store before the player mounts; `ref` and `player` expose the same object. When both are passed, `ref` receives `player`.

### `Video.Root`

| Prop                                           | Type                                  | Default              |
| ---------------------------------------------- | ------------------------------------- | -------------------- |
| `src`                                          | `string`                              | required             |
| `poster`, `autoPlay`, `loop`, `preload`        | as `<video>`                          | `preload="metadata"` |
| `muted`                                        | `boolean` (initial mute state)        | `false`              |
| `onMutedChange`                                | `(muted: boolean) => void`            | —                    |
| `sections`                                     | `VideoSection[]`                      | `[]`                 |
| `markers`                                      | `VideoMarker[]`                       | `[]`                 |
| `fps`                                          | `number`                              | `30`                 |
| `playbackRates`                                | `number[]`                            | `[0.5, 1, 1.5, 2]`   |
| `defaultPlaybackRate`                          | `number`                              | `1`                  |
| `onRateChange`                                 | `(rate: number) => void`              | —                    |
| `onMarkerClick`                                | `(marker: VideoMarker) => void`       | —                    |
| `onError`                                      | `(event) => void`                     | —                    |
| `onRetry`                                      | `() => Promise<unknown> \| void`      | —                    |
| `onPlay`, `onPause`, `onEnded`, `onTimeUpdate` | media events                          | —                    |
| `player`                                       | `VideoPlayer` from `useVideoPlayer()` | —                    |
| `ref`                                          | `Ref<VideoPlayer>`                    | —                    |
| `children`                                     | `ReactNode`                           | —                    |

Root renders the focusable wrapper (`tabIndex={0}`) that owns keyboard handling and fullscreen.

### Parts

| Part                | Role                                                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `Video.Frame`       | the `<video>` at its intrinsic aspect ratio; children render as layers over it                                                             |
| `Video.Caption`     | active markers' `label` + `content` over the frame; `action?: (marker) => ReactNode`                                                       |
| `Video.CenterPlay`  | solid play button while paused at the start                                                                                                |
| `Video.Timeline`    | the segmented rail, markers, scrubbing, hover preview; children render as extra lanes under the rail; `thumbnails?: boolean`               |
| `Video.Controls`    | the control bar; overlays and auto-hides inside `Frame`, sits below and stays visible after it; `frameStep?: boolean`, `extra?: ReactNode` |
| `Video.SectionList` | sections as clickable chips (not in the preset)                                                                                            |

Hooks: `useVideo(selector?)` inside a Root, `useVideoPlayer()`, `useVideoState(player, selector)`.

### `<Video>` preset

Root + `Frame` (`Caption`, `CenterPlay`, `Controls`) with `Timeline` inside `Controls`. Root props plus:

| Prop                           | Type                                  | Default                                       |
| ------------------------------ | ------------------------------------- | --------------------------------------------- |
| `thumbnails`                   | `boolean`                             | `true`                                        |
| `captions`                     | `boolean`                             | `true` (initial state of the captions toggle) |
| `frameStep`                    | `boolean`                             | `false`                                       |
| `overlay`                      | `(state: VideoState) => ReactNode`    | —                                             |
| `width`, `height`, `maxHeight` | `number \| string`                    | `maxHeight` none                              |
| `className`, `style`           | root                                  | —                                             |
| `classNames`, `styles`         | `{ root, frame, timeline, controls }` | —                                             |

### Mapping from lobe-chat data

| `VerifyEvidenceChapter` / annotation | Video                                                                        |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| `kind: 'step'`                       | `{ start: t, title: label }` in `sections`                                   |
| `kind: 'check'`                      | `{ time: t, color: 'success', label: 'Check', content: note }` in `markers`  |
| `kind: 'flag'`                       | `{ time: t, color: 'warning', label: 'Flag', content: note }` in `markers`   |
| reviewer note with `time`            | `{ time: start, color: 'error', content: comment }`; its region in `overlay` |
| range lane                           | a child of `Video.Timeline` reading `useVideo()`                             |
| dispute button                       | `Video.Caption action`                                                       |
| remembered speed                     | `defaultPlaybackRate` + `onRateChange`, stored by lobe-chat                  |

## Internals

### State

The playhead changes on every painted frame, so it does not go through React context. Each Root owns a small external store (`createVideoStore`: state, `setState`, `subscribe`). Context carries only the store reference; parts read slices with `useSyncExternalStore` through `useVideo(selector)`. The time readout and the playhead re-render per frame; `Frame`, `Caption` and `SectionList` re-render only when their slice changes. `activeSection` and `activeMarkers` are derived in the store so the per-frame update compares by reference.

### Clock

`useVideoClock` is ported from lobe-chat's:

- `requestVideoFrameCallback` drives `time` while playing, `requestAnimationFrame` as the fallback.
- The painted-frame time (the frame actually on screen) is tracked while playing and cleared on every deliberate seek, so pausing never leaves the playhead a frame past the picture.
- `muted` follows `volumechange`, so a mute from the native fullscreen UI stays in sync.
- `status` follows `loadedmetadata` / `error`; `size` comes from `videoWidth` / `videoHeight`.
- `step(frames)` lands on frame centres: `(frameOf(t) + frames + 0.5) / fps`, clamped to `[0, duration]`.
- No localStorage: rate persistence is the caller's job.

### Files (`src/Video/`, each under 300 lines)

| File                                                           | Contents                                                                                                                                                               |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.ts`                                                     | assembles `Video` with `Root`, `Frame`, `Caption`, `CenterPlay`, `Timeline`, `Controls`, `SectionList` (same pattern as `Image.PreviewGroup`); exports hooks and types |
| `Video.tsx`                                                    | the preset                                                                                                                                                             |
| `type.ts`                                                      | public types                                                                                                                                                           |
| `style.ts`, `marker.stylex.ts`                                 | StyleX styles; the hover marker for ancestor `:hover`                                                                                                                  |
| `store.ts`, `context.ts`, `useVideo.ts`, `useVideoPlayer.ts`   | store, context, selector hooks, player handle                                                                                                                          |
| `useVideoClock.ts`                                             | per-frame clock                                                                                                                                                        |
| `time.ts`                                                      | `formatTime`, `frameOf`, `steppedTime`, `sectionAt`, `markersAt`, `mergeSegments` (pure)                                                                               |
| `parts/Root.tsx`, `Frame.tsx`, `Caption.tsx`, `CenterPlay.tsx` |                                                                                                                                                                        |
| `parts/Timeline.tsx`, `HoverPreview.tsx`                       | rail and probe preview                                                                                                                                                 |
| `parts/Controls.tsx`, `SectionMenu.tsx`, `RateMenu.tsx`        | bar and its menus                                                                                                                                                      |
| `parts/SectionList.tsx`, `LoadError.tsx`                       |                                                                                                                                                                        |
| `useKeyboard.ts`                                               | key map for Root                                                                                                                                                       |
| `demos/`, `index.mdx`                                          | docs                                                                                                                                                                   |

### Reuse

- `useChromeIdle` moves from `src/Image/viewer/` to `src/internal/` and drives both the image viewer and the Video controls' auto-hide.
- `DropdownMenu` renders the section menu and the speed menu.
- Labels come from `@/i18n/useTranslation` with a new `src/i18n/resources/en/video.ts` (Play, Pause, Mute, Unmute, Previous frame, Next frame, Speed, Captions, Fullscreen, Sections, Reload, Download, Load failed, Seek), following `image`.
- lucide `Play` / `Pause` rendered with `fill="currentColor"` for the solid icons.

### Styling

- The player chrome is dark in both themes (fixed values in `style.ts`, not theme tokens): it sits on the black letterbox and must not flash white around a dark recording.
- Bar scrim: `linear-gradient(transparent, rgb(0 0 0 / 72%))` over the bottom 120 px when overlaid; `#151515` when below.
- Rail 4 px, hovered segment 8 px, 3 px gaps, playhead 12 px, marker dots 8 px above the rail.
- Focus ring on Root: `0 0 0 2px var(--lobe-color-primary-border)` on `:focus-visible`.
- Motion (segment grow, chrome fade) is skipped under `prefers-reduced-motion`.

## Behaviour

### Timeline

- **Merge rule.** `mergeSegments(sections, duration, trackPx)` walks sections in order; a section narrower than 12 px joins the previous visual segment (the first joins the next). Merged starts are returned as hairline positions. Recomputed when a `ResizeObserver` reports a new track width.
- **Hover.** The segment under the pointer grows to 8 px. The preview shows the exact section for the hovered time, so merging changes only the drawing. Within 1.2 % of the track from a marker, the preview snaps to the marker's time and shows its `label` and `content`.
- **Scrub.** Pointer down seeks; pointer capture keeps dragging outside the rail.
- **Markers.** Each is a `<button>` with an `aria-label` of time + label + content. Click or Enter pauses, seeks, turns captions on, and fires `onMarkerClick`. A marker's `pointerdown` stops propagation so pressing it never starts a scrub.
- **Accessibility.** The rail is `role="slider"` with `aria-valuemin/max/now` and `aria-valuetext="1:04 of 2:14, Create agent"`.

### Hover preview

- A hidden muted `<video>` with the same `src` is created on first hover, not on mount, and paints into a 176 × 99 canvas on `seeked`.
- Seeks queue behind each other; only the latest pending time runs next, so a fast sweep never stalls on stale frames.
- Cross-origin sources without CORS still paint (the canvas is tainted but never read).
- Not created on devices without hover (`(hover: none)`); `thumbnails={false}` shows time + section only.

### Caption

- A marker with `content` is shown from half a frame before `time` until 2 s after it. Every marker on that same time shows together, so none hides behind another.
- The captions toggle appears only when at least one marker has `content`.

### Controls

- **Inside `Frame`:** visible while paused, while the pointer is over the player, while focus is inside, or while a menu is open; hidden 2 s after the last pointer move during playback. On touch, the first tap reveals the controls instead of toggling playback.
- **After `Frame`:** always visible.
- **Items:** play/pause, mute (`Volume2` / `VolumeX`), time (`m:ss / m:ss`), the section chip (current section title; opens the section menu), captions toggle, speed menu, fullscreen. `frameStep` adds previous/next frame buttons and a `frame 1920` readout.

### Frame

- Click toggles playback; double-click toggles fullscreen.
- `CenterPlay` shows while paused at `time < 0.05`.
- Aspect ratio comes from metadata (16:9 until it loads); with `maxHeight`, width is `min(100%, maxHeight × aspect)`.

### Keyboard

Only while Root has focus; a focused `<button>` keeps Space and Enter.

| Key       | Action                                  |
| --------- | --------------------------------------- |
| Space, K  | play / pause                            |
| `,` / `.` | previous / next frame                   |
| ← / →     | seek 1 s (Shift: 5 s)                   |
| J / L     | previous / next rate in `playbackRates` |
| M         | mute / unmute                           |
| F         | fullscreen                              |
| C         | captions                                |

### States

- **Loading:** controls render at 40 % opacity with `pointer-events: none`.
- **Error:** `LoadError` over the frame with Reload (awaits `onRetry`, then `video.load()`) and a Download link to `src`.

## Migration (v5 → v6)

Removed props:

| v5 prop                                                                      | v6                                                                                   |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `variant`                                                                    | removed; the frame is borderless; wrap in `Block` for a border                       |
| `preview` (hover mask)                                                       | removed; controls replace it                                                         |
| `isLoading`                                                                  | removed; render `Skeleton` yourself                                                  |
| `size`                                                                       | `width` / `height`                                                                   |
| `maxWidth`, `minWidth`, `minHeight`                                          | `style`                                                                              |
| `classNames.mask`, `styles.mask`                                             | removed                                                                              |
| `classNames.wrapper` / `classNames.video`, `styles.wrapper` / `styles.video` | `classNames.root` / `classNames.frame`, `styles.root` / `styles.frame`               |
| `ref: Ref<HTMLDivElement>`                                                   | `ref: Ref<VideoPlayer>`; the element is `player.root`                                |
| native `<video>` attribute spread                                            | only the listed media props and events pass through; use `player.video` for the rest |

Changes in this repo:

- `src/mdx/mdxComponents/Video.tsx` drops `preview={false}` and keeps its markdown radius and margin through `style`.
- `src/Markdown` video rendering keeps passing `componentProps.video` to `Video`.
- `src/types/index.ts` `VideoProps` (the raw HTML alias) is no longer used by `Video`; it stays exported for the existing type users.

Codemod and guide:

- `packages/codemod`: add `Video` to `src/transforms/v6/data/changed-components.json` so rule R5 reports every `Video` import, and add a report rule that flags the removed props above on `<Video>` JSX with the replacement in the message.
- `docs/migration-v6.mdx`: a `Video` row in **Components** linking to `/components/video#migrating-from-v5-video`, and a `ref` entry in **Behavior changes**.
- `src/Video/index.mdx`: a "Migrating from v5 Video" section with the table above.

## Testing

Vitest (jsdom), colocated:

- `time.test.ts`: `frameOf` at frame boundaries, `steppedTime` never skips or repeats a frame, `sectionAt` with an untitled leading gap, `markersAt` window and same-frame grouping, `mergeSegments` at several widths (none merged, chains merged, first section merged forward, hairline positions).
- `store.test.ts`: slice subscribers fire only on change; `activeSection` / `activeMarkers` keep identity between frames inside the same section.
- `useVideoPlayer.test.tsx`: `useVideoState` outside the tree updates on seek; `ref` and `player` are the same object; methods are no-ops before mount.
- `Timeline.test.tsx`: pointer down seeks; marker click pauses, seeks and fires `onMarkerClick` without scrubbing; slider aria values.
- `Controls.test.tsx`: mute button toggles `video.muted` and its label; captions toggle hidden without marker content; `frameStep` adds the frame buttons; section menu seeks.
- `useKeyboard.test.tsx`: each key; Space on a focused button does not toggle playback.
- `LoadError.test.tsx`: Reload awaits `onRetry` before `load()`.

jsdom has no media pipeline: tests stub `HTMLMediaElement.prototype` (`play`, `pause`, `load`, `currentTime`, `duration`) and drive `loadedmetadata` / `seeked` by hand.

Browser check with the `local-testing` skill against the dev server: demos for plain, sections + markers, 40 dense sections, controls below with `frameStep`, error state; light and dark theme; 360 px width.

## Docs demos (`src/Video/demos/`)

- `index.tsx`: `<Video src>` only.
- `sections.tsx`: sections + markers with captions.
- `dense.tsx`: 40 sections to show the merge rule.
- `review.tsx`: parts composition with controls below, `frameStep`, a custom lane under the timeline, and an outside list driven by `useVideoPlayer()`.
- `error.tsx`: a broken `src` with `onRetry`.

## Out of scope

- Sprite / WebVTT storyboard thumbnails.
- Subtitle tracks (`<track>`), picture-in-picture, a volume slider (mute only).
- Nested sections (sections containing steps).
- Mobile-specific gestures (double-tap seek).
