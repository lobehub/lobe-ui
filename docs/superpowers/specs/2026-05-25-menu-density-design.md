# Menu Density Refactor — Design Spec

**Date:** 2026-05-25
**Status:** Approved (brainstorm)
**Scope:** lobe-ui base-ui menu surfaces

## Problem

The current menu items in lobe-ui base-ui components feel oversized — described as "feature phone" aesthetics. Item min-height of 36px with 8/12 padding and 14/20 type results in a loose vertical rhythm out of step with modern compact menus (Linear ~28, Raycast ~32, macOS native ~22–24).

A secondary structural issue: `src/Menu/sharedStyle.ts` lives outside `src/base-ui/` but is the styling source for all base-ui menu surfaces. The non-base-ui top-level `src/DropdownMenu/` and `src/ContextMenu/` folders contain legacy component files that are no longer wired into `index.ts` (only `index.ts` re-exports from base-ui).

## Goals

1. Tighten menu density to a macOS-native-style baseline (C-tier).
2. Relocate `sharedStyle.ts` into `src/base-ui/` so the styling module sits inside the layer that owns it.
3. Remove dead code in `src/DropdownMenu/` and `src/ContextMenu/`.

## Non-Goals (Out of Scope for This PR)

- Density adjustments to other components (Modal, Input, Tabs, Tooltip, Form, Button, etc.) — each gets its own follow-up brainstorm.
- Changes to `src/base-ui/Select` **trigger** sizes (small/middle/large = 24/32/40 stay).
- Changes to `src/Menu/Menu.tsx` (antd-wrapped Menu has its own ConfigProvider tokens; not visually a base-ui menu).
- Exposing density as a runtime CSS variable / `density` prop — no consumer requirement at this time.

## Scope (Components Affected)

| Component                  | Surface                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| `src/base-ui/DropdownMenu` | popup, item, submenu trigger, checkbox/switch item, separator, group label, header, footer |
| `src/base-ui/ContextMenu`  | popup, item, separator, group label (reuses sharedStyle)                                   |
| `src/base-ui/Select`       | **option list only** (`renderOptions`, group label, separator). Trigger sizes untouched.   |
| `src/EditorSlashMenu`      | popup, item, group label, icon — visually a menu, naturally inherits C                     |

## Design

### Token Table (C-tier)

Single-line item is the canonical baseline. All measurements assume single-row item; multi-line forms (label + desc stacked) grow naturally and are not the design target.

Notation: `padding-block / padding-inline`. Group label uses `block-start block-end / inline`.

| Token                           | Current                                        | New (C)                           | Notes                                                                       |
| ------------------------------- | ---------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------- |
| `item.min-height`               | 36                                             | **24**                            | core                                                                        |
| `item.padding-block / inline`   | 8 / 12                                         | **2 / 8**                         |                                                                             |
| `item.font-size / line-height`  | 14 / 20                                        | **13 / 16**                       |                                                                             |
| `item.border-radius`            | `cssVar.borderRadiusSM`                        | unchanged                         | keep token, not literal                                                     |
| `icon` container                | 16×16, mr 8                                    | **14×14, mr 6**                   | add `& svg { width:100%; height:100% }` to scale consumer icons (see below) |
| `popup.padding`                 | 4                                              | **2**                             |                                                                             |
| `popup.border-radius`           | `cssVar.borderRadius`                          | unchanged                         |                                                                             |
| `popup.min-width`               | 120                                            | unchanged                         |                                                                             |
| `groupLabel.padding`            | block 8/4, inline 12                           | **block 4/1, inline 8**           | top / bottom / inline                                                       |
| `groupLabel.font / line`        | 12 / 16                                        | **11 / 14**                       |                                                                             |
| `separator.margin-block`        | 4                                              | **2**                             |                                                                             |
| `header.padding-block / inline` | 8 / 12                                         | **4 / 8**                         |                                                                             |
| `footer.padding-block / inline` | 8 / 12                                         | **4 / 8**                         |                                                                             |
| `desc.font / line`              | 12 / 16                                        | **11 / 14**                       | multi-line only                                                             |
| `extra.padding-inline-start`    | 16                                             | **12**                            |                                                                             |
| `extra.font`                    | 12                                             | **11**                            |                                                                             |
| `submenuArrow`                  | 20×20, padding-inline-start 8                  | **16×16, padding-inline-start 6** |                                                                             |
| hover / active / transition     | colorFillTertiary / Secondary / 150ms ease-out | unchanged                         |                                                                             |

**Unchanged (kept as-is)**: `itemContent`, `labelGroup`, `itemContentAlignStart`, `iconAlignStart`, `label`, `danger`, `empty`, `popupWithSlots`, `slotViewport`, `positioner` (all animation/layout helpers — not density-related).

### Icon Sizing Strategy

User's choice of 14×14 icon container requires the SVG inside to render at 14×14 too. lucide-react and similar libraries hard-code `width="16" height="16"` SVG attributes when consumers write `<Icon size={16} />`. To force any consumer-passed icon to 14:

```ts
icon: css`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  width: 14px;
  height: 14px;
  margin-inline-end: 6px;

  & svg {
    width: 100%;
    height: 100%;
  }
`,
```

CSS `width: 100%` on a child SVG overrides the SVG's own `width` attribute. This works without consumer cooperation and avoids touching `IconProvider`.

### File Structure Changes

**Move**: `src/Menu/sharedStyle.ts` → `src/base-ui/DropdownMenu/sharedStyle.ts`

DropdownMenu becomes the canonical owner of shared menu primitives. ContextMenu, Select option list, and EditorSlashMenu import from there.

Import updates required in:

- `src/base-ui/DropdownMenu/atoms.tsx`
- `src/base-ui/DropdownMenu/renderItems.tsx`
- `src/base-ui/DropdownMenu/DropdownMenu.tsx`
- `src/base-ui/ContextMenu/renderItems.tsx`
- `src/base-ui/ContextMenu/style.ts` (currently `export { styles } from '@/Menu/sharedStyle'`)
- `src/base-ui/Select/parts.tsx`
- `src/base-ui/Select/renderOptions.tsx`
- `src/base-ui/Select/atoms.tsx`
- `src/base-ui/Select/Select.tsx`
- `src/EditorSlashMenu/atoms.tsx`

After the move, `src/Menu/sharedStyle.ts` no longer has any consumer (the antd-wrapped `src/Menu/Menu.tsx` doesn't import it). The file is deleted.

### Dead Code Removal

Top-level `src/DropdownMenu/index.ts` only re-exports `@/base-ui/DropdownMenu`. Files unreachable from any `index.ts` are removed:

**`src/DropdownMenu/`** — delete:

- `atoms.tsx`
- `DropdownMenu.tsx`
- `renderItems.tsx`
- `type.ts`

Keep: `index.ts`, `index.md`, `demos/`.

Top-level `src/ContextMenu/index.ts` only re-exports `@/base-ui/ContextMenu`. All non-`index.ts` files are dead:

**`src/ContextMenu/`** — delete:

- `ContextMenuHost.tsx`
- `ContextMenuTrigger.tsx`
- `imperative.tsx`
- `renderItems.tsx`
- `store.ts`
- `style.ts`
- `type.ts`

Keep: `index.ts`, `index.md`, `demos/`.

### Backwards Compatibility

All public exports remain on the same module paths. The visible change is purely visual (menu items render shorter/tighter). No prop renames, no API shape changes.

Risks:

- Consumer apps with menu items intentionally relying on 36-tall hit areas for touch accessibility — none known in the lobe-ui ecosystem.
- Snapshot tests of menu height/spacing — to be updated as part of the implementation.

## Verification Plan

1. **Visual smoke** in dumi dev server for affected demos:
   - `src/DropdownMenu/demos/*` (renders base-ui)
   - `src/ContextMenu/demos/*`
   - `src/base-ui/Select/demos/*` (option list density)
   - `src/EditorSlashMenu/demos/*`
2. **Lint and typecheck** scoped to modified files only.
3. **Spot-check** hover, active, disabled, danger, submenu trigger, checkbox/switch item, group label, header/footer slots, separator, kbd shortcut (`extra`).
