# Live Demo Single Preview — Design

Date: 2026-07-12
Status: approved

## Problem

Two issues in the docs-site demo editing experience (`site/components/Demo/`):

1. **Duplicate playground.** Opening the source editor on an editable demo renders a second, live-evaluated preview at the bottom of `LiveEditor`, visually identical to the canonical preview already shown at the top of the demo frame. Edits should render back into the top preview instead.
2. **Disconnected imports block.** The read-only imports `<pre>` (`.demo-live-editor__imports`) has its own tinted background and border, making it read as a separate block from the editable source beneath it.

## Decisions

- **Swap timing:** the top preview switches from canonical to live rendering as soon as the first live candidate is ready ("ready-then-swap"). Until then, and whenever the editor is collapsed, the canonical preview shows. Closing the editor reverts to canonical; the edit session is preserved.
- **Imports treatment:** one unified code surface. Imports share the editable area's background and padding, distinguished only by dimmed text and a thin vertical gutter line on the left. No separating border, no background split.
- **Mechanism:** lift the live-evaluation state into a hook owned by a lazily loaded component that renders both the preview slot and the editor — no portals, no element-passing callbacks.
- **Live indicator:** a small "live" chip appears in the preview slot while live rendering is active.

## Architecture

### `useLiveDemo` hook (new: `site/components/Demo/useLiveDemo.ts`)

Extract the evaluation engine from `LiveEditor.tsx` largely as-is: scope loading, `splitLiveSource` / `transformLiveSource`, `renderElementAsync`, generation tracking, candidate promotion, failure fallback, reset-signal handling, and revision-tag guards.

Signature:

```ts
useLiveDemo(demo: DemoModule, resetSignal: number): {
  editableSource: string;
  setEditableSource(value: string): void;
  sourceParts: ReturnType<typeof splitLiveSource>;
  diagnostics: LiveDiagnostic[];
  scopeStatus: 'loading' | 'failed' | 'ready';
  candidates: PreviewCandidate[];
  activeCandidate?: PreviewCandidate;
  pendingCandidate?: PreviewCandidate;
  promoteCandidate(candidate: PreviewCandidate): void;
}
```

### `LiveDemo` component (replaces `LiveEditor.tsx`)

A single lazily loaded component (keeping `react-live` out of the main bundle) that owns `useLiveDemo` and renders the whole demo body when an editable demo's editor has been opened:

1. **Preview slot** — reuses the existing `demo-frame__viewport` / `demo-frame__preview` structure and `data-demo-appearance` / `data-demo-viewport` attributes, so appearance, viewport, and `layout` (`center` / `bare`) controls apply identically to live output. Contents:
   - editor expanded **and** an active candidate exists → the candidate stage (`CandidateSlot` stack with active/candidate/fallback generations, unchanged mechanics) plus the "live" chip;
   - otherwise → `CanonicalPreview`.
2. **Source panel** — unified code surface:
   - read-only imports: dimmed text, left gutter line (2px, `--docs-border-strong`), same background and padding rhythm as the editable area, keeps `aria-label="Read-only imports"` and `tabIndex={0}`;
   - editable `SourceEditor` (unchanged);
   - status / diagnostics rows below the code surface (unchanged styling).

The bottom `demo-live-editor__preview` block and its CSS are removed.

### `Demo.tsx` changes

- When `resolvedEditable && editorOpened`, render `<LazyLiveDemo …/>` in place of both the preview (`EmbeddedPreview` / `IsolatedPreview`) and the source panel. Props: `appearance`, `viewport`, `style`, `layout`, `expanded`, `resetSignal`, `demo`.
- Suspense fallback while the chunk loads: the current `EmbeddedPreview` plus the existing "Loading source editor…" status row — no flash.
- The `Activity`-based session preservation stays: once opened, `LiveDemo` remains mounted; collapsing the editor hides the source panel (`expanded=false`) and the preview slot falls back to canonical.
- Non-editable demos are untouched.

## Behavior details

- **Failure handling:** unchanged generation/fallback mechanics — a failing candidate never blanks the preview; the previous active generation stays visible and diagnostics render under the editor. Before the first successful candidate, canonical remains.
- **Reset:** the existing reset signal restores pristine source; the preview stays live (a new candidate from pristine source replaces the edited one).
- **Isolated (`iframe`) demos:** no editable+isolated demo exists today. If the combination appears, the live stage renders embedded (replacing the iframe) while the editor is expanded, reverting to the iframe when collapsed.

## Testing

- `Demo.test.tsx`: assert a single preview slot exists after opening the editor; canonical content is replaced once a live candidate promotes; collapsing the editor restores canonical.
- Live editor tests: retarget from `LiveEditor` to `LiveDemo` / `useLiveDemo`; keep coverage of scope failure, transform diagnostics, candidate promotion, and reset.
- Add assertions for the unified code surface: imports rendered inside the same surface with the gutter marker, no separating border block.

## Out of scope

- Editor feature additions (autocomplete, formatting).
- Changes to the demo compiler (`site/compiler/demo/`).
- Standalone demo pages (`/~demos/...`).
