# v6 sync with master v5.64.1: DatePicker on rc-picker and Table polish

Date: 2026-10-14
Branch: `feat/v6-sync-master-5.64` → `v6`, one PR, merged with a **merge commit** (not squash)
Source on master: 6c2a1237 (v5.63.0, last synced by 39601e62) .. bb465179 (v5.64.1)

## Goal

v6 matches master v5.64.1 for every component touched since v5.63.0, in v6's form: StyleX + `style.css`, flat `src/<Name>` directories, `--lobe-*` tokens from `theme.css`, no antd / antd-style.

Commits in scope (everything on master since v5.63.0, release commits excluded):

| Commit          | Area                     | What changes                                                                                                                             |
| --------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 3490f2d1 (#714) | Table, dashboard, tokens | Table dark surfaces, outlined shadow, light filled surface; `--lobe-fill-border*` tokens; dashboard borders                              |
| df46262f (#715) | Table                    | Vertical centering, `FixedFrost` continuous frost, translucent fills, rowSpan dividers, outlined bottom border, scrollbar chrome removed |
| e3f182c0 (#716) | dashboard                | AuthLayout panel and grid background                                                                                                     |
| 143973c7        | Table                    | `FixedFrost` guard when `ResizeObserver` is missing                                                                                      |
| dcf5f6e3 (#719) | DatePicker               | rc-picker engine, antd-aligned API, Dayjs values                                                                                         |
| 20c4e04e (#720) | DatePicker               | Size to content by default                                                                                                               |

Why a fresh merge: #717 was squash-merged (`6c9bd0b2` has one parent), so v6 lost the master ancestry from 39601e62. `git merge origin/master` re-conflicts on Table / ProTable files already rewritten in v6.

## Decisions

| #   | Question           | Decision                                                                                                          |
| --- | ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| 1   | DatePicker engine  | `@rc-component/picker ~1.12.2` (same range as antd 6.6). The only `@rc-component/*` package allowed in v6         |
| 2   | DatePicker API     | master v5.64.1 API: Dayjs values, `picker` / `mode`, typeable input, presets, time, multiple, Semantic DOM        |
| 3   | Deprecated aliases | Removed: `min` / `max`, `footer`, `size="middle"`, `bordered`, `onSelect`. Codemod rewrites them                  |
| 4   | Range picker names | Keep both `DatePicker.RangePicker` and `DateRangePicker` (+ `DateRangePickerProps`); not an alias to remove       |
| 5   | v6's own picker    | Deleted: `CalendarPanel.tsx`, `calendar.ts`, `PickerShell.tsx`, the `Date`-based types and tests                  |
| 6   | Table polish       | Port all master Table / dashboard style and behaviour changes onto the v6 engine; keep `lobe-table-*` class names |
| 7   | Delivery           | One PR, four commits (see [Commits](#commits))                                                                    |

## rc-picker dependency

Measured on an isolated install (`@rc-component/picker@1.12.2`, react / react-dom / dayjs external):

- 9 runtime packages: picker, trigger, util, motion, overflow, portal, resize-observer, plus `react-is`, `is-mobile`, `clsx`, `@babel/runtime`. No antd component package.
- 114.6 KB min, 41.2 KB gzip. Picker 65.9K, trigger 16.4K, util 9.0K, motion 7.5K, the rest under 5K each.
- Peers: react >= 16.9 (trigger >= 18); dayjs is an optional peer and already a lobe-ui dependency.
- Its `es/` build uses extensionless imports: plain Node ESM `import('@rc-component/picker')` fails with `Cannot find module …/es/PickerInput/RangePicker`; CJS works. Bundlers are fine.

Consequences:

- `package.json` `dependencies` gains `@rc-component/picker` only. The single master import of `@rc-component/util` is replaced by a local helper, so util stays transitive.
- `packages/docs-kit/vite.config.ts` `ssr.noExternal` gains `/^@rc-component\//` (as master #719).
- ESLint `no-restricted-imports` bans `@rc-component/*` everywhere except `src/DatePicker/**`.
- `migration-v6.mdx` notes the SSR caveat for consumers that externalize dependencies in Node.

## DatePicker port

### Files

master `src/base-ui/DatePicker/*` → v6 `src/DatePicker/*`. Not carried over: `ALIGNMENT.md`, `ARCHITECTURE-DECISION.md` (master-only history; this spec records the v6 decisions).

Import rewrites:

| master                                                                                   | v6                                                     |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `@/base-ui/zIndex`                                                                       | `@/internal/zIndex`                                    |
| `@/base-ui/Input/style`                                                                  | `@/Input/style`                                        |
| `@/base-ui/Button`                                                                       | `@/Button`                                             |
| `@/base-ui/focusRing`                                                                    | `@/styles/stylex/focusRing`                            |
| `@/ThemeProvider/AppElementContext`                                                      | `@/ConfigProvider/AppElementContext` (`useAppElement`) |
| `@/utils/styleEngine`                                                                    | removed with the antd-style styles                     |
| `@/hooks/useFloatingLayer`, `@/i18n/*`, `@/MotionProvider`, `@/Icon`, `@/ConfigProvider` | unchanged                                              |

i18n resources `src/i18n/resources/{en,zhCn}/datePicker.ts` take master's content.

A popup mounted on `document.body` takes its theme from v6's `data-theme` attributes. Inside a `ThemeScope`, it mounts into the scope's portal container instead of reading ThemeProvider's css-var scope.

### Styling

master `style.ts` (1043 lines, antd-style, `prefixCls = 'lobe-picker'`) splits into:

- StyleX `style.ts` for elements lobe renders: input shell (reuses `@/Input/style` variants and sizes), presets sidebar, footer actions.
- `src/DatePicker/style.css` under `@layer lobe-ui` for DOM rendered by rc-picker, keyed on `.lobe-picker-*`, using `--lobe-*` tokens only.

Behaviour kept from master: `lobe-picker-slide-up` motion, `shadow` prop, `filled` default in dark mode, size-to-content default (#720).

### API changes from master

| Removed            | Use                    | Codemod                              |
| ------------------ | ---------------------- | ------------------------------------ |
| `min` / `max`      | `minDate` / `maxDate`  | rename                               |
| `footer`           | `renderExtraFooter`    | rename (wrap a node as `() => node`) |
| `size="middle"`    | `size="medium"`        | literal rewrite                      |
| `bordered={false}` | `variant="borderless"` | rewrite when `variant` is absent     |
| `onSelect`         | `onCalendarChange`     | rename                               |

Consumers of v6 beta's `Date`-based DatePicker also get a `migration-v6.mdx` section: `dayjs(date)` in, `date?.toDate()` out, `mode` → `picker`, range clears to `null`.

### Internal consumer

`src/ProTable/parts/FieldControl.tsx` switches to Dayjs values and the new props.

## Table and dashboard port

The v6 Table renders through its own engine (`src/Table/render/*`) and keeps the `lobe-table-*` classes, so master's selector-based changes map onto `style.css` / StyleX in `src/Table`.

| master change                                                                                                                                                | v6 target                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Tokens `--lobe-fill-border`, `--lobe-fill-border-strong` (light `colorFill` / mix toward `colorText`; dark `colorFillSecondary` / `colorFill`)               | `theme.css` light and dark blocks                                                                                      |
| Dark `--lobe-table-surface` = `colorFillQuaternary`, `--lobe-table-cell-bg` = transparent                                                                    | `theme.css` dark block                                                                                                 |
| Dark filled / outlined: container one Quaternary layer, header one more; fixed / sticky / summary composite to match                                         | `src/Table` styles                                                                                                     |
| Outlined shadow matches Surface; light filled = `colorFillTertiary`                                                                                          | `src/Table` styles                                                                                                     |
| th / td vertically centred, virtual flex cells via `align-content`                                                                                           | `CellShell` / `VirtualBody` styles                                                                                     |
| `FixedFrost`: continuous sticky frost panes (16px blur) replacing per-cell `backdrop-filter`; skips the subscription when `ResizeObserver` is missing        | new `src/Table/render/FixedFrost.tsx` mounted from `TableView`; measures `.lobe-table-cell-fix-start/end` the same way |
| Translucent hover / selected fills; fixed cells transparent                                                                                                  | `src/Table` styles                                                                                                     |
| RowSpan side dividers; virtual row height lock                                                                                                               | `Body` / `VirtualBody`                                                                                                 |
| Outlined container draws the full border incl. bottom                                                                                                        | `src/Table` styles                                                                                                     |
| Custom sticky / virtual scrollbar chrome removed; `--lobe-table-canvas-default` removed                                                                      | `StickyScrollBar` styles, `theme.css`                                                                                  |
| Dashboard Surface dark `colorFillQuaternary`; ConsoleNav, FilterSidebar, FilterStrip, MetricStrip, PageSkeleton, Surface link borders → `--lobe-fill-border` | `src/dashboard/*/style.ts` (StyleX)                                                                                    |
| AuthLayout panel `colorBgContainer` + `colorBorder`, no Surface, grid bg `colorBgLayout`, dark grid lines (#716)                                             | `src/dashboard/AuthLayout`                                                                                             |

Tests: master `TableNoResizeObserver.test.tsx` is ported. Master Table test changes since v5.63.0 are ported where they apply to the v6 API.

## Commits

1. `Merge remote-tracking branch 'origin/master' …` recorded with `-s ours` (v6 already holds master up to v5.63.0); takes only the verbatim v5.63.0..v5.64.1 delta (DatePicker i18n, CHANGELOG). Master DatePicker files enter in commit 3 directly under `src/DatePicker`, so every commit passes the type-check hook.
2. `💄 style(table): port master v5.63.1–v5.63.4 Table and dashboard polish`
3. `✨ feat(datepicker): rc-picker engine with master v5.64 API`
4. `📝 docs(migration): DatePicker codemod rules and v6 guide`

## Tests

- The 10 ported DatePicker suites pass, minus the alias cases (deleted with the aliases).
- Table / ProTable suites pass, plus `TableNoResizeObserver`.
- Codemod fixtures for each DatePicker rule.
- `rg "@rc-component" src package.json` matches only `@rc-component/picker` (src/DatePicker and package.json).
- `rg "from '(antd|antd-style|@/base-ui)" src` prints nothing.
- `pnpm type-check` passes; eslint passes on changed files.
- Browser check via the `local-testing` skill on a freshly started dev server:
  - every DatePicker demo, light and dark; popup nested in Modal and Popover; RTL; first load of the docs page renders without SSR errors
  - Table demos: filled / outlined light and dark, fixed columns while scrolling (continuous frost), virtual + rowSpan, outlined bottom border with `scroll.y`
  - dashboard Surface and AuthLayout, light and dark
  - side-by-side screenshots against a master v5.64.1 dev server for the Table and dashboard pages

## Out of scope

- Upgrading `@rc-component/picker` past `~1.12.2` (follow antd).
- Replacing rc-picker with Base UI Calendar: upstream Calendar (mui/base-ui#1973) is not public in `@base-ui/react@1.9.0`. Revisit when it ships.

## Revision: own the picker core (supersedes decision 1)

Found during Task 3 verification: `@rc-component/picker` and its `@rc-component/*` dependencies publish extension-less ES modules. Since the root entry re-exports `DatePicker`, `import('@lobehub/ui')` from the built `es/` throws in plain Node ESM (any Vitest run or SSR that does not bundle dependencies). Before this branch the root entry loaded. Owner decision (2026-10-14): fork the picker into lobe-ui and maintain it; v6 goes back to zero `@rc-component/*` / `rc-*` packages.

### Source

- `@rc-component/picker` 1.12.2 at `a975a11f` (npm `gitHead`; upstream has no `v1.12.2` tag), MIT. About 10.5k TS lines without locales.
- The picker imports from other rc packages: `@rc-component/util` (13 helpers), `@rc-component/resize-observer` (2 uses), `@rc-component/overflow` (multiple-mode tags, 1 use), `@rc-component/trigger` (one 86-line wrapper, `PickerTrigger`).

### Boundary

Keep from the fork the date logic, which has no lobe-ui counterpart: the generate config (Dayjs), value parsing / formatting / masks, the range state machine (`useRangeValue`, `useRangeValueChange`, …), the panels (date, week, month, quarter, year, decade, time, date-time), presets and footer. Replace the infrastructure with what lobe-ui already has:

| rc implementation                                                                                   | lobe-ui replacement                                                                                                                                                                                                             |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@rc-component/trigger` + portal (`PickerTrigger`): placement, flip, click-outside close, container | Base UI `Popover.Root` (controlled `open`) with the v6 `PopoverPositioner` / `PopoverPortal` atoms, anchored to the input box: same positioning, collision handling, z-index layer and floating-layer nesting as every v6 popup |
| `@rc-component/motion` (`lobe-picker-slide-up-*` class sequence)                                    | `motion` through `useMotionComponent` + `AnimatePresence`, as Modal does                                                                                                                                                        |
| `@rc-component/util` (13 helpers)                                                                   | `useControlledState`, `useEventCallback` from `src/hooks`, `requestAnimationFrame`, es-toolkit `omit`; the remaining few-line helpers live in `core/utils`                                                                      |
| `@rc-component/resize-observer`                                                                     | a `useSize`-style hook                                                                                                                                                                                                          |
| `@rc-component/overflow` (multiple-mode `+N` tags)                                                  | generic `src/internal/overflow` (measures item widths, returns how many fit), reusable by Select later                                                                                                                          |

### Layout

```
src/DatePicker/
  core/            forked date logic (upstream layout: PickerInput/, PickerPanel/, hooks/, utils/,
                   generate/, locale/, interface.tsx, index.tsx) + LICENSE.md and a source note
  core/PickerPopup.tsx   replaces PickerTrigger (Popover atoms + Motion)
  (everything else as in Task 3: SinglePicker, RangePicker, usePickerShared, style.css, …)
src/internal/overflow/   generic overflow measurement
```

Source: `@rc-component/picker` 1.12.2 at `a975a11f` (npm `gitHead`; upstream has no `v1.12.2` tag), MIT. Trimmed on copy: `generate/` keeps Dayjs only (the `GenerateConfig` type stays generic, so `generatePicker` accepts any adapter); `locale/` keeps `common`, `en_US`, `zh_CN`; dayjs plugin imports get explicit `.js` extensions (dayjs has no `exports` map).

The forked logic keeps upstream structure and comments for now. Moving `style.css` to StyleX, splitting files over 500 lines and folding `usePanelKeyboard` into the panels are follow-up PRs; until then eslint style rules are relaxed for `core/`, type-check runs everywhere.

### Contract changes

- The popup is a Base UI Popover: `data-open`, `data-side`, `data-align` on the positioner / popup. rc-trigger's `-dropdown-hidden` and `-dropdown-placement-*` classes are gone; `.lobe-picker-dropdown` (+ `-range`, `-rtl`, `-multiple`) stays on the popup root.
- `transitionName` is gone from the props (it named rc-motion classes); the motion is lobe's own.
- `popupAlign` is gone (rc-trigger `AlignType`); `placement` and `getPopupContainer` stay.
- Closing on outside press ignores presses on the input box, which stays focused while the popup is open.

### Package and tooling

- `package.json`: drop `@rc-component/picker`; no `@rc-component/*` remains.
- eslint: the `@rc-component/*` / `rc-*` ban covers `src/**` with no DatePicker exception.
- docs-kit `ssr.noExternal` and the fixture test go back to their previous lists.
- codemod R6 drops the `@rc-component/picker` exemption and R12 also reports `transitionName` / `popupAlign`; the migration guide's SSR note and "the one `@rc-component/*` package" sentence go.
- Docs: "generated from `@rc-component/picker`" becomes "forked from `@rc-component/picker` 1.12.2".

### Tests

- The 11 DatePicker suites (200 tests) and the ProTable suites pass; changes limited to imports of `@rc-component/picker/*` (now core paths) and the open / closed helpers (`-dropdown-hidden` → popup presence).
- New tests: `PickerPopup` (anchoring, outside press closes but a press on the input does not, Escape, container / floating-layer nesting, z-index above a host Popover) and `src/internal/overflow`.
- `node --input-type=module -e "import('<repo>/es/index.mjs')"` succeeds after `pnpm exec tsdown`; the 8 docs-kit suites that import the built package pass.
- `rg "@rc-component|from 'rc-" src package.json` prints only the codemod / eslint test fixtures.
- Browser: the Task 3 checks again (demos light / dark, nested Modal / Popover, RTL, docs page SSR, widths vs master).

### Commits

5. `♻️ refactor(datepicker): fork @rc-component/picker 1.12.2 date logic into src/DatePicker/core` (copy + import paths; `@rc-component/trigger`, `util`, `overflow`, `resize-observer` stay as direct dependencies for this one commit so the suites stay green)
6. `♻️ refactor(datepicker): popup on Popover atoms and Motion, repo hooks, internal overflow; drop @rc-component deps`
7. `📝 docs(migration): DatePicker no longer depends on rc packages` (guide, R6 / R12, eslint, docs-kit revert)
