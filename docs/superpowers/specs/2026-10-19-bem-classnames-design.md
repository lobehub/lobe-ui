# Stable BEM class names for public components

Date: 2026-10-19
Discussion doc: https://claude.ai/code/artifact/f5b1bcdd-33bd-470a-9d0e-ae7c41240546

## Why

Component styles are compiled by StyleX into hashed class names that can change on every build. Downstream apps therefore have no stable hook to override a component's internals with plain CSS. Before v6 they used antd's `.ant-*` classes; v6 removed antd and those selectors went dead. lobehub #21046 deleted 14 files' worth of dead overrides, and some of the intent they carried (compact Switch / Slider / InputNumber in the ChatInput params panel, a 400px max height on the message action-bar submenu, Skeleton line heights in AgentProfileCard) has no way back in today.

Success: every public component exposes a documented, stable set of global class names, and a downstream rule such as `.lobe-switch__thumb { … }` overrides the internal style without `!important`.

## Goals

- Every public component renders a stable block class on its root and a stable element class on each stylable part.
- One naming scheme across the whole library, documented on each component's docs page.
- A test that fails when a public component ships without its block class.
- Downstream (lobehub canary) can re-apply the lost overrides against the new names.

## Non-goals

- No BEM modifier classes (`--checked`, `--filled`). State and variants are `data-*` attributes (see below).
- Existing `lobe-*` class names are not renamed, deprecated or removed.
- No restyling: StyleX stays the source of styles and rendered output does not change. The one internal change allowed is moving defaults out of inline `style` (see below).

## Anti-goals

- A naming scheme that needs a second downstream migration later. Names shipped here are public API; renaming one is a breaking change.
- Overrides that only work with `!important` or with selectors longer than one class plus one attribute.

## Naming contract (decided)

1. **Block** = the component's exported name in kebab-case, prefixed `lobe-`: `Switch` → `lobe-switch`, `ActionIcon` → `lobe-action-icon`.
2. **Subpath components carry their namespace** in the block: `@lobehub/ui/mdx` `Tabs` → `lobe-mdx-tabs`, `@lobehub/ui/chat` `ChatItem` → `lobe-chat-chat-item`. Root-entry components have no namespace. Builder's call, recorded here: `@lobehub/ui/form` (`src/FormKit`) uses `form` as its namespace; a single-component subpath whose component shares its name (`./pro-table` → `ProTable`) uses the plain block, `lobe-pro-table`.
3. **Element** = `lobe-<block>__<element>`, where `<element>` is the component's `classNames` slot key in kebab-case: `classNames.header` → `lobe-highlighter__header`.
4. Components without a `classNames` prop get slots for their stylable parts in the same change, so the slot key and the element class are always the same word.
5. **Compound components:** each atom is an element of the parent block: `SelectTrigger` → `lobe-select__trigger`, `PopoverPopup` → `lobe-popover__popup`.
6. Elements are flat: never `__a__b`. Builder's call, recorded here: a nested slot path joins with a hyphen (`classNames.header.cell` → `lobe-table__header-cell`); a slot group that is passed through to another public component (Table `pagination.*`) defers to that component's own block. Function-valued slots still get their static element class.
7. A nested component keeps its own block. A part that is also another component carries both classes: Highlighter's copy button has `lobe-highlighter__copy` and `lobe-action-icon`.
8. Builder's call, recorded here: when an existing class already equals the block name on a non-root node (Table: `.lobe-table` sits inside `div.lobe-table-wrapper`), that node keeps being the block and the outer node becomes an element (`lobe-table__wrapper`). Internal CSS is never retargeted to make room.
9. The stable class goes on the same DOM node that receives the matching `classNames` slot. The user's `className` / slot class is appended after it.
10. Parts rendered in a portal (popup, positioner, backdrop) must carry their element class, because descendant selectors from the root do not reach them.
11. Existing ad-hoc `lobe-*` classes (`lobe-select-arrow`, `lobe-chat-item-bubble`, …) stay exactly as they are; the BEM classes are added next to them.

## State and variants (decided)

- State that base-ui already exposes is targeted through base-ui's attributes: `.lobe-switch[data-checked]`, `.lobe-select__option[data-highlighted]`. lobe-ui adds nothing for these.
- lobe-ui's own props and states are exposed as lobe-ui-owned `data-*` attributes on the block root: `variant`, `size`, `shadow`, `glass`, and non-base-ui states such as Highlighter `expanded`.
- Builder's call, recorded here: when two blocks share one node (ActionIcon renders Button's root), only the component the user rendered writes the lobe-ui `data-*` attributes; the inner component does not.
- Builder's call, recorded here: portal parts (popup, positioner, backdrop) mirror the block root's lobe-ui `data-*` attributes, so `.lobe-select__popup[data-variant="borderless"]` works without a descendant selector.
- Value format (builder's call, recorded here): enum props as `data-<prop>="<value>"` (`data-variant="filled"`, `data-size="small"`); boolean props and states as a present / absent attribute (`data-shadow`, `data-expanded`), matching base-ui's convention.

## Inline defaults (decided)

A one-class rule cannot beat an inline `style`. About 313 `style={{` sites exist outside demos and tests (for example `src/Skeleton/Skeleton.tsx:20` sets `height: '1em'` inline by default).

- A component's own default values move out of inline `style` into StyleX (or a CSS variable with a fallback), so downstream CSS can override them.
- Values the user passes explicitly through props stay inline; an explicit prop beating global CSS is intended.
- This needs an audit of the inline sites on public components; the audit result is part of the plan.

## Overlay components and name conflicts (decided)

- When a slot key and the DOM part disagree, the element class is named after the DOM part. Popover: `classNames.root` lands on the Positioner → `lobe-popover__positioner`; `classNames.content` on the Viewport → `lobe-popover__viewport`. The old slot keys stay as prop aliases; no extra class is emitted for them.
- Aliased slots that hit the same node (Select `dropdown` / `popup`, `item` / `option`) produce one class, named after the part (`lobe-select__popup`, `lobe-select__option`).
- Overlay components without a single mounted root (Popover, Tooltip, Modal, Drawer, DropdownMenu, ContextMenu, Toast): the block class goes on the visible popup box. Trigger, positioner, backdrop and viewport are elements. The guardrail test opens the overlay before asserting.
- This amends rule 3: the slot key names the element unless it disagrees with the DOM part it lands on.

## Override priority (decided, must be verified)

`es/style.css` starts with `@layer lobe-base, lobe-popup, lobe-ui;` (`tsdown.config.ts:45`, enforced by `scripts/checkStylexBuild.ts`). Unlayered downstream CSS always wins over layered CSS, so a single-class downstream rule beats the StyleX rule. Before rolling out, verify this in a real browser against the built CSS, including a portal popup (`lobe-select__popup`) and a base-ui state selector (`.lobe-switch[data-checked]`). Builder's call, recorded here: the contract requires downstream overrides to be unlayered, or in a layer declared after `lobe-ui`; the docs say so. lobehub's overrides are emotion / `createStaticStyles` and therefore unlayered.

## Guardrails (decided)

- A test renders every public component (root entry and every subpath entry) and asserts its root carries `lobe-<block>`. Components that cannot render in jsdom without props get a minimal fixture; none may be skipped silently.
- Builder's call, recorded here: the test keeps an explicit, reviewed exemption list. Exempt: components that render no DOM (ConfigProvider, MotionProvider, Freeze, FocusScope, FontLoader, GlobalFocusRing), the `icons`, `storybook` and `spline` subpaths, and atoms (they are covered by rendering their Root). Flexbox / Center / Grid are in (Flex already ships `lobe-flex`).
- Use the existing `bem()` helper (`src/utils/bem.ts`, #742); DraggablePanel already follows this contract (`lobe-draggable-panel__content`, `data-placement`) and is the reference implementation.
- Each component's docs page lists its block, elements and lobe-ui `data-*` attributes. The list is generated from a single source per component so docs and code cannot drift. How that source is shaped and how docs-kit renders it is the builder's call.

## Icon `anticon` (decided: removed later)

`src/Icon/Icon.tsx:52` still renders `anticon`, and lobehub canary styles it in 5 files. In this project, `Icon` gains `lobe-icon` like every other component. Removing `anticon` is a separate follow-up after lobehub canary no longer references it.

## Downstream migration (decided)

Order: ship lobe-ui first, then migrate lobehub canary (PRs target `canary`). Builder's call, recorded here: the lobehub PR is a follow-up, not part of this plan; which #21046 overrides come back is decided there, with screenshots for the owner to approve.

- Re-apply the overrides lost in #21046 against the new names where the design still wants them.
- `SettingsSearch/anchor.tsx:88` `closest('.ant-form-item, .ant-collapse-header')` → the Form item and Collapse/Accordion header element classes.
- `CommandMenu/index.tsx:277` waits for `.ant-app`. No new lobe-ui API is needed: `ConfigProvider` already renders the app root with id `LOBE_THEME_APP_ID` (`'lobe-ui-theme-app'`), exported from `@lobehub/ui`.
- `Plugins/PluginAvatar.tsx:16` `className="ant-avatar"`: delete.
- `.anticon` rules (5 files) → `.lobe-icon`, then remove `anticon` from lobe-ui.

## Release

Additive only: `feat`, minor. Can ship in several PRs (for example by entry point), each a minor.

## Left to the builder

- The exact element list per component, following rules 3–9.
- Rollout order across components and how the work is split into PRs.
- How the docs page sources and renders the class-name list.
