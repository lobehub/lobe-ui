# Search Panel Redesign — Design Spec

Date: 2026-07-16
Scope: `packages/docs-kit/site` — header search dialog UI, search data layer, recents persistence.

## Goal

Replace the current flat-list search dialog with a split-view command-palette panel: dense grouped results on the left, a live preview pane with section anchors on the right, and a populated empty state (recent pages + curated explore links).

## Visual design (chosen: S1 split view + E1 empty state)

### Panel shell

- Frosted-glass dialog: `color-mix(in srgb, var(--docs-surface-raised) 92%, transparent)` + `backdrop-filter: blur(20px)` (disabled under `prefers-reduced-motion` as today for the backdrop; the dialog blur stays since it is static).
- Width `min(100%, 44rem)`, max-height `min(37rem, calc(100dvh - 2rem))`, radius `var(--docs-radius-lg)`, layered shadow as today.
- Layout rows: input row / split body / footer.

### Input row

- Search icon, input, `esc` kbd hint (replaces the X close button; backdrop click and Escape still close).
- Same height and typography as current.

### Split body

- Two panes: result list (~55% width, right border `--docs-border-subtle`) and preview pane (`--docs-surface-muted`-tinted background).
- Below `48rem` viewport width: preview pane is not rendered, single-pane full-screen dialog (current mobile behavior otherwise unchanged).

### Result list (left pane)

- Grouped by `category`. Group header: 10px uppercase letter-spaced `--docs-text-subtle` label.
- Row anatomy (single line, ~36px): leading icon chip (24px, rounded, subtle bg) + title with `<mark>` term highlight + trailing `↵` hint on the active row only.
- Icon per group: Components `Box`, Guides `PenLine`, Recent `History`, Explore `Sparkles` (lucide). Unknown categories fall back to `FileText`.
- Active row: `--docs-surface-hover` background + `--docs-border-subtle` outline; mouse hover moves activation as today.
- When a body match has no title match, append a dimmed inline excerpt fragment after an em dash, single line, ellipsized.

### Preview pane (right)

- Shows the active hit: category label (uppercase, subtle), title (15px, 650), excerpt with term highlight (multi-line, up to ~6 lines, ellipsized), then "On this page" anchor list from `subResults`.
- Anchor rows: `› {title}`, clicking or pressing Enter while an anchor is focused navigates to that sub-result pathname (includes hash).
- If the hit has no `subResults` (manifest fallback), the anchors block is omitted.
- Empty-state preview works identically for Recent/Explore entries.

### Empty state (no query)

- Left pane shows two groups:
  - **Recent** — up to 5 recently visited search results from localStorage, each row has a trailing `✕` remove button (visible on hover/active).
  - **Explore** — first 5 entries from the site nav/document manifest order.
- Panel opens at full height so starting to type causes no layout jump.
- If there are no recents, only Explore renders.

### Footer

- Keeps kbd hints; adds `→ jump to section`. Hints: `↑↓ navigate`, `↵ open`, `→ jump to section`, `esc close`.

### Keyboard model

- `↑`/`↓`: move active row through the flat ordered list (group headers skipped), wrapping.
- `↵`: open active row (or focused anchor).
- `→`: move focus from input/list into the preview anchor list (first anchor). `↑`/`↓` then move within anchors.
- `←` (or any character typed): return focus to the input/list context.
- `Esc`: close. Tab focus trap unchanged.
- ARIA: listbox/option semantics kept; preview pane is an `aria-live="polite"` region labelled by the active option. Anchor rows are buttons with `tabindex="-1"` — reachable only via `→`/arrow keys, never via Tab, so the existing focus trap order is unaffected.

## Data layer (chosen: minimal SearchHit extension + client-side highlight)

### Types

```ts
interface SearchSubResult {
  pathname: string;
  title: string;
}

interface SearchHit {
  category?: string; // NEW — grouping key
  excerpt: string;
  id: string;
  pathname: string;
  section?: string;
  subResults?: SearchSubResult[]; // NEW — preview anchors
  title: string;
}
```

### pagefindEngine

- Map **all** `sub_results` (currently only the first is used) into `subResults`, skipping entries without a URL and the entry that duplicates the page root.
- `category` from `fragment.meta.category`; fallback: look up the manifest entry by pathname (the engine already receives documents via the resilient wrapper — pass a pathname→category map into `createPagefindEngine`).
- Build-time: emit `data-pagefind-meta="category:{category}"` on doc pages so the pagefind index carries it (compiler change in `site/compiler/search`).

### manifestEngine

- `category: document.category` (already the `section` value today), `subResults` omitted.

### Highlighting

- Pure UI concern. A `highlight.tsx` helper splits text by query terms (case-insensitive, prefix-tolerant: a term matches at word boundaries by prefix so "button" highlights in "buttons" and vice versa) and wraps matches in `<mark>`.
- No `dangerouslySetInnerHTML`; pagefind's HTML `excerpt` field stays unused (`plain_excerpt` as today).
- Known limitation: stemmed matches that share no prefix with the query are not highlighted. Accepted.

### Grouping & ordering

- Groups ordered by the rank of their best hit (engine result order defines rank). Hits within a group keep engine order.
- Result limit stays 10 per engine.

### Query latency

- Keystrokes fire `engine.preload(value)` fire-and-forget (not awaited) so pagefind prefetches index chunks immediately.
- `engine.search(value)` runs behind a ~150ms trailing debounce; the loading state is set on first keystroke and held through the debounce window so it does not flicker.
- The existing latest-request-wins guard is kept; an empty/whitespace query cancels the pending debounce and clears results synchronously.

### Recents

- `recentStore.ts`: localStorage key `lobedocs:search-recents`, stores `{category?, pathname, title}[]`, max 5, most-recent-first, deduped by pathname.
- Written on any activation (search result, Explore, or Recent entry); an existing pathname is re-bumped to the front.
- All storage access wrapped in try/catch (SSR, private mode, quota); failures degrade to empty recents.

## Component structure

All under `site/components/Search/`:

| File                    | Responsibility                                                 | Notes               |
| ----------------------- | -------------------------------------------------------------- | ------------------- |
| `SearchDialog.tsx`      | Shell: open/close, focus trap, keyboard routing, engine wiring | slimmed; <300 lines |
| `useSearchQuery.ts`     | Engine lifecycle + race guards (ported from current component) | logic unchanged     |
| `SearchResultList.tsx`  | Grouped list + empty-state groups                              |                     |
| `SearchPreviewPane.tsx` | Preview + anchors                                              |                     |
| `recentStore.ts`        | localStorage read/write/remove                                 |                     |
| `highlight.tsx`         | Term-split highlight renderer                                  |                     |
| `style.ts`              | All styles (may split if >500 lines)                           |                     |

`Header.tsx` trigger is unchanged.

## Error handling

- Engine failures: unchanged resilient failover (pagefind → manifest). UI treats missing `category` as group "Results" and missing `subResults` as no-anchors.
- localStorage failures: silent, recents disabled.
- Preview pane never blocks list interaction; it renders from already-fetched hit data only (no extra requests).

## Testing

Extend existing colocated tests (`SearchDialog.test.tsx`, engine tests):

- Grouping: hits render under category headers; group order follows best-hit rank.
- Highlight: title/excerpt marks for prefix matches; no marks for non-matching terms.
- Keyboard: `↑↓` wrap across groups, `→` into anchors, `↵` on anchor navigates with hash, `←` returns.
- Empty state: recents render from storage, `✕` removes, Explore falls back when empty.
- Recents persistence: activation writes, dedup + cap 5, storage errors tolerated.
- pagefindEngine: full `sub_results` mapping, category meta + manifest fallback.
- Mobile: preview pane absent below breakpoint (style-level, smoke via render width mock if feasible).

## Out of scope

- Search actions group (theme toggle, copy link) — deferred (was V3/S2).
- Query-term filter chips (`tab filter`).
- Engine/algorithm replacement; ranking changes beyond group ordering.
