# Header & Footer Slots for DropdownMenu and ContextMenu

## Summary

Add optional `header` and `footer` slots to the base-ui `DropdownMenu` and
`ContextMenu` components. Both currently render their popup contents solely from
a structured `items` array, leaving no way to embed custom content such as a
profile header or a pinned action footer. The slots accept arbitrary
`ReactNode`, sit pinned above and below a scrollable items region, and carry a
default divider border.

## Background / Current State

- `DropdownMenu` (`src/base-ui/DropdownMenu/`): config-driven. `items` prop
  generates the popup body; `children` is the trigger element. The popup is
  `<DropdownMenuPopup>{menuItems}</DropdownMenuPopup>`.
- `ContextMenu` (`src/base-ui/ContextMenu/`): imperative. `showContextMenu(items, options)`
  drives a single global `ContextMenuHost`. There is no JSX tree to compose into.
- `Popover` is out of scope — its `content` is already free `ReactNode`, so a
  header/footer can be composed directly inside `content`.
- Neither menu popup currently sets a `max-height`; long item lists overflow.
- base-ui's `Menu`/`ContextMenu` `Positioner` exposes the `--available-height`
  CSS variable, and `Popup` accepts arbitrary children. The design relies on
  both.

### Why `header`/`footer` props (not compound subcomponents)

base-ui favors composition, but a compound API does not fit here:
`ContextMenu` is purely imperative and has no JSX tree to compose into, and
`DropdownMenu`'s `children` slot is already the trigger. A `ReactNode` prop /
imperative option is the only API that covers both components consistently, and
it does not violate base-ui principles — it simply forwards named children into
`Menu.Popup`. Power users who want full composition can still drop down to the
exported `DropdownMenu*` atoms.

### Repo dual-maintenance note

The repo keeps two synchronized copies of these components:

- `src/base-ui/DropdownMenu/`, `src/base-ui/ContextMenu/` — the
  `@lobehub/ui/base-ui` subpackage (canonical implementation).
- `src/DropdownMenu/`, `src/ContextMenu/` — the `@lobehub/ui` main package.
  Their `index.ts` re-exports base-ui, but the implementation `.tsx` files are
  full duplicates kept byte-identical (verified: commit `e2bd53a4` edited both
  copies of `renderItems.tsx`).

Every code file changed under `src/base-ui/.../` must receive the identical
change in `src/.../`. Removing this duplication is out of scope.

## Scope

In scope: `header` and `footer` slots for `DropdownMenu` and `ContextMenu`.

Out of scope: `Popover` (already composable); a universal `max-height`/scroll
for menus without slots; search-input-in-header focus management; per-slot
`classNames`/`styles` override props; removing the dead duplicate directories.

## API

### DropdownMenu

`DropdownMenuProps` gains:

- `header?: ReactNode`
- `footer?: ReactNode`

### ContextMenu

- `ShowContextMenuOptions` gains `header?: ReactNode` and `footer?: ReactNode`.
- `ContextMenuState` gains `header?: ReactNode` and `footer?: ReactNode`;
  `showContextMenu` writes them into state; `closeContextMenu` clears them.
- `ContextMenuTriggerProps` gains `header?: ReactNode` and `footer?: ReactNode`,
  forwarded into the `showContextMenu` call.

All slots are plain `ReactNode`, default `undefined`.

## Rendering & Structure

Slots activate only when `header` or `footer` is set. When both are absent the
popup renders exactly as today — zero regression for existing menus.

With at least one slot present:

```
<Popup>                                  // with-slots modifier applied
  {header ? <div class={styles.header}>{header}</div> : null}
  <div class={styles.slotViewport}>{items}</div>
  {footer ? <div class={styles.footer}>{footer}</div> : null}
</Popup>
```

- Popup with-slots modifier: `display: flex; flex-direction: column;
  max-height: var(--available-height); overflow: hidden`.
- `header` / `footer`: `flex-shrink: 0` — stay pinned.
- `slotViewport`: `flex: 1; min-height: 0; overflow-y: auto` — items scroll
  between the pinned slots.

When no slot is present the popup keeps its current style, items remain direct
children, and no `max-height` is applied.

## Styling (`src/Menu/sharedStyle.ts`)

New style keys, shared by both components (both already import
`@/Menu/sharedStyle`):

- `header` — `padding-block: 8px; padding-inline: 8px`;
  `border-block-end: 1px solid` `colorBorderSecondary`.
- `footer` — same padding; `border-block-start: 1px solid` `colorBorderSecondary`.
- `slotViewport` — `flex: 1; min-height: 0; overflow-y: auto`.
- popup with-slots modifier — `display: flex; flex-direction: column;
  max-height: var(--available-height); overflow: hidden`; applied additively
  (`cx`) on top of the existing `popup` style only when slots are present.

The divider is `colorBorderSecondary`, drawn full-width inside the popup's 4px
padding box — the same horizontal inset as the existing `separator` rule.
Padding values may be tuned during implementation to match menu-item insets.

## DropdownMenu atoms

`src/base-ui/DropdownMenu/atoms.tsx` gains thin styled-`div` atoms, exported via
`index.ts`:

- `DropdownMenuHeader`
- `DropdownMenuFooter`
- `DropdownMenuScrollViewport`

The `DropdownMenu` config component composes these internally, so the
high-level (`items` + `header`/`footer`) API and the low-level
atom-composition path stay consistent.

`ContextMenuHost` has no atoms layer — it renders `<div className={styles.header}>`,
`styles.slotViewport`, and `styles.footer` directly.

## Behavior Contract

- header/footer are NOT menu items: they are not registered with base-ui's
  roving focus, are not reachable by arrow keys, clicking them does not trigger
  item selection, and clicking them does not auto-close the menu.
- Closing the menu from inside a slot is the caller's responsibility:
  `DropdownMenu` via its controlled `open` prop, `ContextMenu` via
  `closeContextMenu()`. This is documented in both `index.md` files.
- The `ContextMenuHost` early-return guard (`!state.open && state.items.length === 0`)
  is unchanged. A menu with slots but an empty `items` array still renders the
  header/footer around an empty viewport.
- The popup open/close animation (`scaleY` on the Popup) is unchanged; the
  inner scroll viewport does not interfere with it.
- Submenu popups are unaffected — slots apply to the root popup only.

## Demos & Docs

New demo file per component (demos live in the shared demo directories
referenced by both doc pages):

- `src/DropdownMenu/demos/header-footer.tsx` — a `DropdownMenu` with a header
  (label/avatar) and a footer (a pinned action), with enough items to show the
  viewport scrolling.
- `src/ContextMenu/demos/header-footer.tsx` — `showContextMenu(items, { header, footer })`.

Docs — add a "Header & Footer" section (with a `<code src=...>` block) and the
new API rows to all four pages:

- `src/DropdownMenu/index.md` and `src/base-ui/DropdownMenu/index.md`
- `src/ContextMenu/index.md` and `src/base-ui/ContextMenu/index.md`

## Testing

Vitest unit tests:

- `DropdownMenu`: renders `header`/`footer` inside the popup; arrow-key
  navigation skips them; items sit inside the scroll viewport; with neither
  slot the popup structure matches the pre-change output.
- `ContextMenu`: `showContextMenu(items, { header, footer })` renders both in
  the host; `closeContextMenu()` clears them from state.

## Files

Code — edit the base-ui copy and apply the identical change to the main-package
duplicate:

- `src/{base-ui/,}DropdownMenu/type.ts`
- `src/{base-ui/,}DropdownMenu/DropdownMenu.tsx`
- `src/{base-ui/,}DropdownMenu/atoms.tsx`
- `src/{base-ui/,}DropdownMenu/index.ts` (export the new atoms)
- `src/{base-ui/,}ContextMenu/store.ts`
- `src/{base-ui/,}ContextMenu/ContextMenuHost.tsx`
- `src/{base-ui/,}ContextMenu/ContextMenuTrigger.tsx`

Single-copy:

- `src/Menu/sharedStyle.ts`
- `src/DropdownMenu/demos/header-footer.tsx` (new)
- `src/ContextMenu/demos/header-footer.tsx` (new)
- `src/DropdownMenu/index.md`, `src/base-ui/DropdownMenu/index.md`
- `src/ContextMenu/index.md`, `src/base-ui/ContextMenu/index.md`
- Unit tests alongside the components.

## Risks

- Dual-maintenance: easy to forget the duplicate directory. Mitigated by listing
  both paths explicitly in the Files section.
- An inner `overflow-y: auto` viewport may briefly show a scrollbar during the
  open `scaleY` animation; acceptable, and observable in the demo.
- `--available-height` only constrains the popup when the menu would otherwise
  exceed the viewport; in normal cases the popup remains content-sized.
