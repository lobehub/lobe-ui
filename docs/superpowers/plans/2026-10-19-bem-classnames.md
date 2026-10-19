# Stable BEM Class Names Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every public lobe-ui component renders stable `lobe-<block>` / `lobe-<block>__<element>` classes plus lobe-ui-owned `data-*` attributes, documented per component and enforced by a test.

**Architecture:** Each component gets a `stable.ts` manifest built with a typed `stableClasses()` helper on top of the existing `bem()` (`src/utils/bem.ts`). The component reads class names and data attributes from that manifest; the docs page renders the same manifest; one guard test renders a fixture per component and checks the DOM against the manifest. Rollout goes in batches, each removing its components from a `PENDING` list until it is empty.

**Tech Stack:** React 19, StyleX, `@base-ui/react`, vitest + jsdom + `@testing-library/react`, `@playwright/test` (browser script), docs-kit MDX.

**Spec:** `docs/superpowers/specs/2026-10-19-bem-classnames-design.md`

## Global Constraints

- Block: `lobe-<kebab(ExportName)>`; subpath components prefix their namespace: `lobe-mdx-tabs`, `lobe-chat-chat-item`; `@lobehub/ui/form` uses namespace `form`; `./pro-table` → `lobe-pro-table`.
- Element: `lobe-<block>__<element>`; element = `classNames` slot key in kebab-case, except when the slot lands on a differently named DOM part, then the DOM part name wins (`lobe-popover__positioner`, `__viewport`, `__popup`). Nested slot paths join with `-` (`lobe-table__header-cell`). Elements are flat, never `__a__b`.
- Aliased slots on one node produce one class named after the part (Select `dropdown`/`popup` → `lobe-select__popup`; `item`/`option` → `lobe-select__option`).
- Overlays (Popover, Tooltip, Modal, Drawer, DropdownMenu, ContextMenu, Toast): block class on the visible popup box; trigger / positioner / backdrop / viewport are elements.
- When an existing class already equals the block on a non-root node, that node stays the block and the outer node becomes `__wrapper` (Table).
- No `--modifier` classes. base-ui state stays on base-ui's own `data-*`. lobe-ui's own `variant`, `size`, `shadow`, `glass` and non-base-ui states (e.g. Highlighter `expanded`) are `data-*` on the block root: enum → `data-<prop>="<value>"`, boolean → attribute present (`""`) or absent.
- Portal parts (popup, positioner, backdrop) mirror the block root's lobe-ui `data-*` attributes.
- When two blocks share one node (ActionIcon → Button root), only the outer component writes lobe-ui `data-*`.
- Stable class goes on the same node as the matching slot; order in `clsx`: stable class first, then slot class, then user `className`.
- Existing ad-hoc `lobe-*` classes are never renamed or removed; BEM classes are added next to them. Internal CSS is never retargeted.
- Component-own defaults move out of inline `style` into StyleX (or a CSS variable with a fallback); values passed explicitly through props stay inline.
- Icon gains `lobe-icon`; `anticon` stays in this project.
- Exempt from the guard test: ConfigProvider, MotionProvider, Freeze, FocusScope, FontLoader, GlobalFocusRing, the `icons`, `storybook`, `spline` subpaths, and compound atoms (covered through their root).
- Release: additive only, `✨ feat` (minor) per PR. Never bump versions.
- Zero comments / JSDoc in new code unless they record a workaround or a non-obvious invariant (user rule).
- Lint / format / typecheck only changed files: `pnpm exec eslint <files>`, `pnpm exec prettier --check <files>`; never `pnpm lint` / `pnpm prettier` repo-wide.

## Review Focus

1. A user `className` (or slot class) passed to a component must be appended, never replace the stable class. → Guard test renders every fixture a second time with `className="user-x"` and asserts both classes on the block node (Task 2).
2. A user swapping the element through base-ui's `render` prop must keep the stable class. → Button batch adds `Button render={<a href="#" />}` keeps `lobe-button` (Task 6).
3. An explicit prop value must still beat downstream CSS, while defaults must not. → Skeleton test: default renders no inline `height`; `height={20}` renders inline `height: 20px` (Task 8).
4. Variant-dependent overrides on portal parts. → Select test: `variant="borderless"` open popup carries `data-variant="borderless"` and `lobe-select__popup` (Task 7).
5. Two blocks on one node writing `data-*` twice. → ActionIcon test: root has `lobe-action-icon` and `lobe-button`, exactly one `data-variant`, equal to ActionIcon's prop (Task 6).

---

## File Structure

| File                                                                           | Responsibility                                                                                   |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `src/utils/bem.ts` (modify)                                                    | add `stableClasses()` and `toDataAttributes()` next to `bem()`                                   |
| `src/utils/bem.test.ts` (modify)                                               | unit tests for both helpers                                                                      |
| `src/<Component>/stable.ts` (create, one per component)                        | that component's manifest; export name `<camelCase>Classes` (`switchClasses`, `chatItemClasses`) |
| `tests/stableClasses.test.tsx` (create)                                        | guard test: export coverage, block on root, manifest elements present, user className kept       |
| `tests/stableClasses.fixtures.tsx` (create)                                    | `FIXTURES`, `EXEMPT`, `PENDING`                                                                  |
| `docs/stable-classes/StableClassTable.tsx` (create)                            | renders a manifest as a table on docs pages                                                      |
| `docs/styling-overrides.mdx` (create) + `docs.config.ts` (modify `publicDocs`) | the public contract for downstream                                                               |
| `docs/styling-overrides/OverrideDemo.tsx` (create)                             | demo with unlayered override CSS, used by the browser check                                      |
| `tests/stable-classes-override.browser.ts` (create)                            | Playwright script asserting overrides win against the static docs build                          |
| `docs/superpowers/plans/2026-10-19-inline-defaults-audit.md` (create)          | inline `style` audit, consumed by every batch                                                    |

PR split: PR 1 = Tasks 1–5 (helpers, guard, docs, pilot, verification, audit). Then one PR per batch task (6–11), each branched from master after the previous PR merges. Task 12 rides on the last batch PR.

---

### Task 1: `stableClasses()` and `toDataAttributes()`

**Files:**

- Modify: `src/utils/bem.ts`
- Test: `src/utils/bem.test.ts`

**Interfaces:**

- Consumes: `bem(block: string): BEM` (existing).
- Produces:

  ```ts
  export interface StableClassManifest<E extends string> {
    block: string;
    elements: readonly E[];
    dataAttributes?: readonly string[];
  }
  export interface StableClasses<E extends string> {
    (element?: E): string;
    block: string;
    elements: readonly E[];
    dataAttributes: readonly string[];
  }
  export const stableClasses: <const E extends string>(
    manifest: StableClassManifest<E>,
  ) => StableClasses<E>;
  export const toDataAttributes: (
    attrs: Record<string, string | number | boolean | null | undefined>,
  ) => Record<`data-${string}`, string>;
  ```

  `manifest.block` is the unprefixed name (`'switch'`); `.block` on the result is prefixed (`'lobe-switch'`). `dataAttributes` lists unprefixed kebab names (`'variant'`, `'expanded'`).

- [ ] **Step 1: Write the failing tests** in `src/utils/bem.test.ts`:
  - `stableClasses({ block: 'switch', elements: ['thumb'] })` → `()` is `'lobe-switch'`, `('thumb')` is `'lobe-switch__thumb'`, `.block` is `'lobe-switch'`, `.elements` equals `['thumb']`, `.dataAttributes` equals `[]`.
  - `// @ts-expect-error` on `switchClasses('track')` (type-level guard against typos).
  - `toDataAttributes({ variant: 'filled', size: 'small', shadow: true, glass: false, expanded: undefined, level: 2 })` equals `{ 'data-variant': 'filled', 'data-size': 'small', 'data-shadow': '', 'data-level': '2' }`.
  - `toDataAttributes({ iconPosition: 'end' })` equals `{ 'data-icon-position': 'end' }` (camelCase → kebab).
- [ ] **Step 2: Run** `pnpm vitest run src/utils/bem.test.ts` — expect FAIL (`stableClasses` not exported).
- [ ] **Step 3: Implement** both in `src/utils/bem.ts`; `stableClasses` wraps `bem(manifest.block)` and attaches `elements` / `dataAttributes`. Keep the existing `bem` export and its cache unchanged.
- [ ] **Step 4: Run** the same command — expect PASS; `pnpm exec eslint src/utils/bem.ts src/utils/bem.test.ts` clean.
- [ ] **Step 5: Commit** `✨ feat(utils): add stableClasses manifest and toDataAttributes`.

### Task 2: Guard test with export coverage

**Files:**

- Create: `tests/stableClasses.test.tsx`, `tests/stableClasses.fixtures.tsx`

**Interfaces:**

- Consumes: `StableClasses` (Task 1).
- Produces (in `tests/stableClasses.fixtures.tsx`):

  ```ts
  export interface StableFixture {
    classes: StableClasses<string>;
    render: (props: { className?: string }) => ReactElement;
    portal?: boolean;
    conditional?: readonly string[];
  }
  export const FIXTURES: Record<string, StableFixture>;
  export const EXEMPT: Record<string, string>;
  export const PENDING: readonly string[];
  ```

  Keys are export keys: root exports by name (`'Switch'`), subpath exports as `'<subpath>/<Name>'` (`'chat/ChatItem'`, `'form/Form'`, `'pro-table/ProTable'`). `EXEMPT` values are the reason (`'no DOM'`, `'atom of Select'`, `'icons subpath'`, `'not a component'`). `render` must forward `className` to the component. `conditional` lists manifest elements this fixture is allowed not to render.

- [ ] **Step 1: Write the guard test** with four `describe` blocks:
  1. `coverage`: import each entry (`@/index`, `@/chat`, `@/mobile`, `@/mdx`, `@/awesome`, `@/brand`, `@/color`, `@/dashboard`, `@/FormKit`, `@/ProTable`); collect PascalCase value exports that are functions or objects with `$$typeof`; expect every key to be in exactly one of `FIXTURES`, `EXEMPT`, `PENDING`, and expect no key in those lists that is not exported.
  2. `block`: for each fixture, render; if `portal`, expect `document.body.querySelector('.' + classes.block)` not null; else expect `container.firstElementChild` to have class `classes.block`.
  3. `elements`: for each fixture, every `classes.elements` entry not in `conditional` must match at least one node in `document.body`.
  4. `user className`: render with `className: 'user-x'`; the block node has both `classes.block` and `user-x`.
- [ ] **Step 2: Fill the lists.** `FIXTURES` = `{}`; `EXEMPT` = the spec's exempt set plus every atom and non-component the coverage block finds; `PENDING` = every remaining key, sorted. Note the `icons` / `storybook` / `spline` subpaths are not imported at all, so they need no entries.
- [ ] **Step 3: Run** `pnpm vitest run tests/stableClasses.test.tsx` — expect PASS (coverage complete, no fixtures yet). Temporarily delete one `PENDING` key and confirm the coverage block FAILS naming it; restore.
- [ ] **Step 4: Commit** `✅ test: guard stable class names on public components`.

### Task 3: Docs listing and the override guide

**Files:**

- Create: `docs/stable-classes/StableClassTable.tsx`, `docs/styling-overrides.mdx`, `docs/styling-overrides/OverrideDemo.tsx`
- Modify: `docs.config.ts:27` (`publicDocs`)

**Interfaces:**

- Consumes: `StableClasses` (Task 1).
- Produces: `export function StableClassTable({ of }: { of: StableClasses<string> }): ReactElement` — a table with columns `Class` and `Part` (`block` / element name), followed by the `data-*` attribute names, each rendered as code. Component docs use it as:

  ```mdx
  import { StableClassTable } from '../../docs/stable-classes/StableClassTable';
  import { switchClasses } from './stable';

  ## Class names

  <StableClassTable of={switchClasses} />
  ```

  (Adjust the relative path for subpath components; `docs/design-tokens.mdx` already imports local TSX the same way.)

- [ ] **Step 1: Write the guide** `docs/styling-overrides.mdx`, sections: Class names (block / element, examples `.lobe-switch`, `.lobe-switch__thumb`, `.lobe-popover__popup`), State and variants (`.lobe-switch[data-checked]`, `.lobe-button[data-variant="filled"]`, portal parts mirror `data-*`), Cascade (override CSS must be unlayered or in a layer declared after `lobe-base, lobe-popup, lobe-ui`; explicit props render inline and beat global CSS), Stability (names are public API; old ad-hoc `lobe-*` classes keep working). Embed `OverrideDemo`.
- [ ] **Step 2: Write `OverrideDemo`**: a `<style>` tag with `.lobe-switch__thumb { background: rgb(255, 0, 0); } .lobe-popover__popup { border-radius: 3px; } .lobe-draggable-panel__content { background: rgb(0, 0, 255); }`, then a `Switch`, a `Popover` with `open`, and a `DraggablePanel`. Each element gets an `id` the browser script targets (`override-switch`, `override-popover`, `override-panel`).
- [ ] **Step 3: Register** `'docs/styling-overrides.mdx'` in `publicDocs`. Restart `pnpm dev`; the page loads at `/styling-overrides` with a matching `<title>` (404s return 200, so check the title).
- [ ] **Step 4: Commit** `📝 docs: add styling overrides guide and class name table`.

### Task 4: Pilot — DraggablePanel, Switch, Popover

**Files:**

- Create: `src/DraggablePanel/stable.ts`, `src/Switch/stable.ts`, `src/Popover/stable.ts`
- Modify: `src/DraggablePanel/atoms.tsx:38` and its `panel(...)` call sites; `src/Switch/atoms.tsx`, `src/Switch/Switch.tsx`; `src/Popover/PopoverStandalone.tsx:105-112`, `src/Popover/atoms.tsx`, `src/Popover/PopoverInGroup.tsx`; the three `index.mdx`; `tests/stableClasses.fixtures.tsx`

**Interfaces:**

- Produces: `draggablePanelClasses` (elements `content`, `handle`, `toggle`; data `placement`), `switchClasses` (elements per Recipe, at least `thumb`), `popoverClasses` (elements `trigger`, `positioner`, `viewport`, `arrow`; block on the popup).
- Recipe (every batch repeats it per component):
  1. Write `stable.ts` using the Global Constraints naming rules.
  2. Root (or overlay popup) gets `classes()`; each part gets `classes('<element>')`, ordered before slot and user classes; portal parts too.
  3. Spread `toDataAttributes({...})` on the block root and every portal part, only for lobe-ui-owned props.
  4. Move component-own inline defaults per the audit (Task 5 — the pilot does its own three components by hand).
  5. Count `rg -c "lobe-" src/<Component>` before and after: no existing `lobe-*` string disappears.
  6. Add the fixture, remove the key from `PENDING`, add the `## Class names` section to `index.mdx`.

- [ ] **Step 1: Add the three fixtures and remove them from `PENDING`.** Popover fixture uses `portal: true` and `defaultOpen`.
- [ ] **Step 2: Run** `pnpm vitest run tests/stableClasses.test.tsx` — expect FAIL on `block` / `elements` for Switch and Popover.
- [ ] **Step 3: Apply the Recipe** to the three components. DraggablePanel switches from `bem('draggable-panel')` to the manifest without changing any emitted class. Popover: `classNames.root` → `lobe-popover__positioner`, `classNames.content` → `lobe-popover__viewport`, popup box → `lobe-popover`.
- [ ] **Step 4: Add a Popover test** in `src/Popover/__tests__/stableClasses.test.tsx`: open popover; `.lobe-popover` is the node that has `className` from props; `.lobe-popover__positioner` has `classNames.root`; `.lobe-popover__viewport` has `classNames.content`.
- [ ] **Step 5: Run** `pnpm vitest run tests/stableClasses.test.tsx src/Popover src/Switch src/DraggablePanel` — expect PASS.
- [ ] **Step 6: Commit** `✨ feat: stable class names for DraggablePanel, Switch and Popover`.

### Task 5: Verify the cascade in a browser, then audit inline defaults

**Files:**

- Create: `tests/stable-classes-override.browser.ts`, `docs/superpowers/plans/2026-10-19-inline-defaults-audit.md`

- [ ] **Step 1: Write the browser script** following `tests/global-focus-ring.browser.ts` (takes the origin as `argv[2]`, Playwright `chromium`). Load `/styling-overrides`; assert: computed `background-color` of `#override-switch .lobe-switch__thumb` is `rgb(255, 0, 0)`; `#override-panel .lobe-draggable-panel__content` is `rgb(0, 0, 255)`; `document.querySelector('.lobe-popover')` (portal) has `border-radius` `3px`; the served CSS contains `@layer lobe-base, lobe-popup, lobe-ui`.
- [ ] **Step 2: Run against the static build:** `pnpm docs:build`, serve the output directory it prints (`python3 -m http.server 4173 -d <dir>`), then `pnpm exec tsx tests/stable-classes-override.browser.ts http://localhost:4173` — expect four `PASS` lines. If the layer assertion passes but an override fails, stop and report: the spec's cascade assumption is wrong and needs an owner decision before any batch.
- [ ] **Step 3: Write the audit.** Run `rg -n "style=\{\{" src --glob '*.tsx' --glob '!**/demos/**' --glob '!**/*.test.*' --glob '!**/__tests__/**'` (≈194 files). For each site in a public component, record one row: `file:line` · component · property · `default` (component-owned value → must move) or `prop` (explicit user value → stays inline) or `dynamic` (computed at runtime, e.g. measured sizes → stays). Group rows by the batch task that owns the component.
- [ ] **Step 4: Commit** `✅ test: verify stable class overrides beat StyleX layers` and `📝 docs: inline style defaults audit`. Open PR 1 (Tasks 1–5).

### Batch tasks (6–11)

Every batch task has the same steps; only the component list and the extra tests differ.

- [ ] **Step 1:** Add fixtures for the batch's components and remove them from `PENDING`.
- [ ] **Step 2:** Run `pnpm vitest run tests/stableClasses.test.tsx` — expect FAIL for exactly those components.
- [ ] **Step 3:** Apply the Recipe (Task 4) to each component, including the audit rows marked `default` for that component.
- [ ] **Step 4:** Add the batch's extra tests (listed per task), next to each component in `__tests__/`.
- [ ] **Step 5:** Run `pnpm vitest run tests/stableClasses.test.tsx` plus the batch components' folders — expect PASS. Lint and prettier-check the changed files only.
- [ ] **Step 6:** Spot-check three components of the batch in the browser via the `local-testing` skill: the classes and `data-*` are on the nodes the manifest says, and nothing changed visually.
- [ ] **Step 7:** Commit `✨ feat: stable class names for <batch name>` and open the batch PR.

### Task 6: Batch — buttons and text inputs

Button, ActionIcon, ActionIconGroup, CopyButton, DownloadButton, Burger, Input (Input, InputNumber, InputOTP, InputPassword, TextArea — each its own block), AutoComplete, SearchBar, EditableText, Hotkey, HotkeyInput.

Input's docs page is `src/Input/index.md`, not `.mdx`; rename it to `index.mdx` so it can import the table (check `docs.config.ts` / docs-kit accept the rename and the URL stays the same).

Extra tests: `Button render={<a href="#" />}` keeps `lobe-button` (Review Focus 2). ActionIcon root has `lobe-action-icon` and `lobe-button`, exactly one `data-variant` equal to ActionIcon's `variant` (Review Focus 5).

### Task 7: Batch — choice and pickers

Checkbox, Radio, Slider, Segmented, ToggleGroup, Select, DatePicker, ColorPicker, ColorSwatches, Rate, Upload, ImageSelect, Tree.

Extra tests: Select open with `variant="borderless"` → popup has `lobe-select__popup` and `data-variant="borderless"` (Review Focus 4); `classNames.dropdown` and `classNames.popup` both land on the single `lobe-select__popup` node.

### Task 8: Batch — display and layout

A, Accordion, Alert, Anchor, Avatar, GroupAvatar, Badge, Block, Breadcrumb, Carousel, Collapsible, Descriptions, Divider, Empty, Flex (Flexbox, Center), Grid, GuideCard, Header, Icon, FileTypeIcon, MaterialFileTypeIcon, FluentEmoji, Image, Img, Layout, List, MaskShadow, Meta, Pagination, Progress, QRCode, Result, ScrollArea, ScrollShadow, SideNav, DraggableSideNav, Skeleton, SortableList, Spin, Statistic, Steps, Tabs, Tag, Text, Video.

Extra tests: Skeleton default renders no inline `height`, `height={20}` renders inline `height: 20px` (Review Focus 3). Icon root has both `lobe-icon` and `anticon`.

### Task 9: Batch — overlays

Tooltip, Modal, Drawer, DropdownMenu, ContextMenu, Toast, FloatingPanel, FloatingSheet, EditorSlashMenu, EmojiPicker.

All fixtures use `portal: true` and open state. Extra test per overlay: the block class is on the popup box, not the positioner; backdrop / positioner carry the root's lobe-ui `data-*`.

### Task 10: Batch — content and data

Highlighter, CodeDiff, CodeEditor, Markdown, Mermaid, HtmlPreview, Snippet, Form, Table, ProTable (`pro-table/ProTable`), and `@lobehub/ui/form` exports (`form/*`).

Extra tests: Table root is `lobe-table__wrapper`, the existing inner `.lobe-table` node is the block (fixture sets `classes` accordingly and the `block` check targets that node); `classNames.header.cell` → `lobe-table__header-cell`; Highlighter `defaultExpand` → `data-expanded` present.

### Task 11: Batch — subpaths

`chat/*`, `mobile/*`, `mdx/*`, `dashboard/*`, `awesome/*`, `brand/*`, `color/*` — every key still in `PENDING`.

Extra test: `mdx/Tabs` renders `lobe-mdx-tabs`, root `Tabs` renders `lobe-tabs`, no overlap.

### Task 12: Close the list

**Files:**

- Modify: `tests/stableClasses.fixtures.tsx`, `tests/stableClasses.test.tsx`

- [ ] **Step 1:** Delete `PENDING`; the coverage block now requires every export to be in `FIXTURES` or `EXEMPT`.
- [ ] **Step 2:** Run `pnpm vitest run tests/stableClasses.test.tsx` — expect PASS.
- [ ] **Step 3:** Re-run the Task 5 browser script against a fresh `pnpm docs:build` — expect four `PASS`.
- [ ] **Step 4:** Commit `✅ test: require stable class names on every public component`.

Follow-ups outside this plan: lobehub canary migration (re-apply #21046 overrides with screenshots for owner approval; SettingsSearch anchor; CommandMenu → `LOBE_THEME_APP_ID`; PluginAvatar; `.anticon` → `.lobe-icon`), then removing `anticon` from `src/Icon/Icon.tsx:52`.
