# Table engine adapter and ProTable for v6

Date: 2026-10-13
Branch: four PRs into `v6` (rebase-merge), see [PR split](#pr-split)
Source on master: #710 (Table antd API), #712 + d22b4cf1 (ProTable, own entry), b9af52f7, ea442cbc, #713 (ProTable polish, Table variants), released as v5.63.0 (`6c2a1237`)

## Goal

v6 ships master's antd-shaped `Table` and `ProTable` with the same declarative API that business code uses, minus the deprecated aliases, without `@rc-component/table`. The rendering engine sits behind an internal adapter, so nothing public reveals which engine draws the table. Internal state changes (selection, expand, filter dropdown, sort hover, ProTable loading/toolbar) re-render only the rows they affect.

Success:

- Every ported master Table and ProTable suite passes, plus the new render-count and engine tests.
- `rg "@rc-component|rc-table" src package.json` prints nothing.
- The browser checklist in [Tests](#tests) passes via the `local-testing` skill.
- `pnpm type-check` passes; lint passes on touched files.

## Decisions

| #   | Question                  | Decision                                                                                                     |
| --- | ------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | Engine replacing rc-table | Our own JSX on `@tanstack/react-table` v9 (already a dep); `@tanstack/react-virtual` for `virtual`           |
| 2   | Public layers             | Two: Table atoms (stateless DOM parts) and the declarative `Table`. ProTable is declarative only, no atoms   |
| 3   | Adapter boundary          | Layout only (approach A). Sort, filter, selection and pagination stay in our hooks ported from master        |
| 4   | Adapter visibility        | Internal. No `engine` prop, no provider, no exported adapter type                                            |
| 5   | API parity                | Master v5.63 declarative API, minus deprecated aliases and rc-only props; removed items get codemod rules    |
| 6   | Render granularity        | Internal state changes are O(affected rows); consumer prop changes follow normal React                       |
| 7   | ProTable headless hook    | Not exported. Its hooks stay internal                                                                        |
| 8   | Class names               | Keep `lobe-table-*` / `lobe-pro-table-*` next to StyleX classes; tests and downstream overrides rely on them |

## Current state

- v6 `src/Table`: pre-#710 StyleX table on TanStack v9, small API (`columns`, `dataSource`, `pagination`, single sort, filter menu, `fixed`, `scroll`).
- master `src/base-ui/Table`: antd API on `@rc-component/table`; our own `useTableState` / `useSorter` / `useFilter` / `useSelection`; antd-style styles (920 lines); ~5k lines of tests across 16 suites.
- master `src/base-ui/ProTable`: 905-line `ProTable.tsx` plus `SearchForm`, `LightFilter`, `ColumnSetting`, `FieldControl`, `renderValue`, `useFetchData`, `useSearchForm`, `useColumnRequest`, `locale`; entry `@lobehub/ui/base-ui/pro-table`; 4 suites.

What rc-table does on master, and therefore what we now own:

- Header grouping (colSpan / rowSpan) and `convertChildrenToColumns`
- Fixed-column sticky offsets measured through a hidden measure row; fixed-column scroll shadows
- Split header table when `scroll.y` / `sticky` is set, scroll-synced
- Expanded rows, tree indent, expanded-key state, `onCell` row/col spans, `Summary` (`fixed` top/bottom)
- `VirtualTable`, `EXPAND_COLUMN`, `INTERNAL_COL_DEFINE`, `components` overrides, `Reference.scrollTo`

## Architecture

```
src/Table/
  Table.tsx            declarative shell (~250 lines)
  atoms/               stateless DOM parts (public)
  engine/              types.ts (contract) + tanstack.ts (only file importing @tanstack/*)
  store/               per-instance TableStore + selector hooks
  pipeline/            normalizeColumns, useTableState, useSorter, useFilter, useSelection,
                       useExpandable, useBreakpoint
  render/              HeaderCell, SorterTitle, FilterDropdown, BodyRow, SelectionCell,
                       ExpandCell, Summary, LoadingSkeleton, useColumnWidths, useScrollShadow
  semantic.ts  style.ts  marker.stylex.ts  type.ts  index.ts
src/ProTable/
  ProTable.tsx         composes hooks → parts → <Table> (~250 lines)
  hooks/               useDensity, useFullscreen, useColumnsState, useProPagination,
                       useSearchForm, useFetchData, useColumnRequest, useProSelection, useProColumns
  parts/               Toolbar, TableAlert, SearchForm, LightFilter, ColumnSetting, FieldControl
  renderValue.tsx  locale.ts  style.ts  type.ts  index.ts
```

Every file stays under 300 lines (components) / 500 lines (others).

### Engine contract (`engine/types.ts`)

The engine turns a normalized column tree and already-processed rows into a layout model. It knows nothing about antd props, sorting, filtering, selection or the DOM.

```ts
interface TableEngineInput<T> {
  columns: EngineColumn<T>[];
  data: readonly T[];
  getRowKey: (record: T, index: number) => Key;
  getChildren?: (record: T) => readonly T[] | undefined;
  expandedKeys: ReadonlySet<Key>;
  columnWidths: ReadonlyMap<string, number>;
  virtual?: { rowHeight: number; viewport: () => HTMLElement | null };
}

interface TableModel<T> {
  headerRows: HeaderCellModel<T>[][];
  leafColumns: LeafColumnModel<T>[];
  rows: RowModel<T>[];
  virtual?: {
    items: VirtualItem[];
    totalSize: number;
    scrollTo: (config: TableScrollToConfig) => void;
  };
}
```

- `EngineColumn`: `id`, `width`, `fixed`, `align`, `ellipsis`, `className`, `render`, `onCell`, `onHeaderCell`, `children`, `meta` (replaces `INTERNAL_COL_DEFINE`, e.g. `col` className for the selection / expand columns).
- `HeaderCellModel`: column, `colSpan`, `rowSpan` (TanStack placeholder headers fold into the parent's `rowSpan`), fixed info.
- `LeafColumnModel`: column, index, `fixed`, `stickyOffset`, `edge: 'lastLeft' | 'firstRight' | undefined`.
- `RowModel`: `key`, `record`, `index`, `depth`, `hasChildren`, `expanded`.
- TanStack mapping: `getHeaderGroups` for header rows; `columnPinningFeature` + `columnSizingFeature` fed from `columnWidths` for offsets; `rowExpandingFeature` + `createExpandedRowModel` with `getSubRows` for tree data; `useVirtualizer` from `@tanstack/react-virtual` for the window.
- Virtual and non-virtual share one row-rendering path; virtual adds top / bottom spacer rows.

### Atoms (`atoms/`, public)

Same pattern as `src/Accordion` / `src/Drawer`: StyleX `style.ts`, `marker.stylex.ts`, a context for `size` / `variant` / `rowHoverable`.

| Atom                                        | Element                      | Notes                                                       |
| ------------------------------------------- | ---------------------------- | ----------------------------------------------------------- |
| `TableRoot`                                 | `div.lobe-table-wrapper`     | context provider                                            |
| `TableContainer`                            | `div.lobe-table-container`   | scroll owner; shadow state via data attributes              |
| `TableElement`                              | `table.lobe-table`           | `tableLayout`                                               |
| `TableColGroup`                             | `colgroup` / `col`           | widths, `selection-col` / `expand-icon-col` classes         |
| `TableHeader`                               | `thead.lobe-table-thead`     |                                                             |
| `TableBody`                                 | `tbody.lobe-table-tbody`     |                                                             |
| `TableRow`                                  | `tr.lobe-table-row`          | selected / expanded / `level-N`                             |
| `TableHeaderCell`                           | `th.lobe-table-cell`         | `fixed`, `stickyOffset`, `edge`, `aria-sort`                |
| `TableCell`                                 | `td.lobe-table-cell`         | `fixed`, `stickyOffset`, `edge`, `ellipsis`, `align`, spans |
| `TableExpandedRow`                          | `tr.lobe-table-expanded-row` |                                                             |
| `TableSummary`                              | `tfoot.lobe-table-summary`   | `.Row` / `.Cell`; `fixed` top / bottom                      |
| `TableTitle` / `TableFooter` / `TableEmpty` |                              |                                                             |

Rules:

- No state, no engine knowledge. Sticky behaviour comes from `fixed` / `stickyOffset` / `edge` props only.
- `components` overrides (antd `TableComponents`, now our own type) reach atoms as the base-ui `render` prop; atoms never read `components`.
- Semantic `classNames` / `styles`: master's `semantic.ts` ports with `cx` → `clsx`, minus the legacy flat-key folding (aliases removed). The shell passes resolved slot values to each atom.
- Styles: master's antd-style sheet is rewritten in StyleX: variants `filled` / `outlined` / `borderless` / grouped, sizes `small` / `middle` / `large`, Pagination area, selection / expand columns, sorter and filter triggers.

### Declarative Table pipeline

```
props → ① normalize → ② data ops → ③ store → ④ engine → ⑤ render
```

1. **normalize** (`pipeline/normalizeColumns.ts`, pure): `columns` or `<Table.Column>` children → merge `column` defaults → assert unique keys → `responsive` filter → resolve `EXPAND_COLUMN` / `SELECTION_COLUMN` placement (selection inherits a neighbour's `fixed`, an unfixed expand column before a fixed selection column follows it) → `EngineColumn` tree. Selection and expand columns get a component `render` (`<SelectionCell>` / `<ExpandCell>`) instead of state-capturing closures. Memoized on `columns`, `column`, `children`, `screens`, and the structural parts of `rowSelection` / `expandable`.
2. **data ops**: master's `useTableState`, `useSorter`, `useFilter` and pagination port as-is and produce the current page `rows`. `onChange` keeps master semantics including the single-object sorter compatibility for multi-sort. `useSelection` keeps its derivation (checkStrictly conduct, preserve cache, Shift range, `SELECTION_ALL` / `INVERT` / `NONE`) but no longer builds columns; it writes to the store and exposes actions.
3. **store** (`store/`): one `TableStore` per instance on `useSyncExternalStore` with selectors, no new dependency. Holds selected / half-selected keys, expanded keys, and sort / filter display state. Hooks: `useRowSelected(key)`, `useRowExpanded(key)`, `useColumnSort(id)`, `useColumnFilter(id)`, `useSelectionSummary()`. `useExpandable` owns controlled / uncontrolled `expandedRowKeys`, `defaultExpandAllRows`, `expandRowByClick`, `rowExpandable`.
4. **engine**: `useTableEngine(input)` from the contract above; `expandedKeys` come from the store.
5. **render** (`render/`):
   - `HeaderCell` subscribes to its own column's sort / filter state and renders `SorterTitle` / `FilterDropdown`.
   - `BodyRow` is `memo` on `record`, `key`, `index`, `depth`, `columns`, `rowCtx`, where `rowCtx = useMemo(onRow, rowClassName, components, semantic)`. Selected / expanded state is read from the store inside the row. Column `shouldCellUpdate` is honoured.
   - `useColumnWidths` measures leaf widths (hidden measure row + `ResizeObserver`) for fixed offsets and the split header's `colgroup`.
   - `useScrollShadow` reads container scroll position for `edge` shadows.
   - Split header: with `scroll.y` or `sticky`, header and body are two `TableElement`s sharing one `TableColGroup`, with synced `scrollLeft`.
   - Pagination stays in Table with master's placement logic.

`ref` keeps master's shape: a Proxy of the root element with `nativeElement` and `scrollTo({ index | key | top, align, offset })`. Virtual uses the engine's `scrollTo`; otherwise the container scrolls to the row's `offsetTop`.

Edge cases:

- Duplicate column keys: dev warning (as master).
- `virtual` without numeric `scroll.y`: dev warning, render non-virtual.
- Any record with a `children` array (or `expandable.childrenColumnName`) switches to tree mode, as antd.

### Render granularity targets

Problems on master that this design removes:

- `useSelection.transformColumns` depends on the selected key set, so one checkbox click rebuilds every column and re-renders every cell; `rowClassName` also depends on it.
- `rcColumns` depends on `sortStates` / `filterStates`, so header-only state invalidates body cells.
- `normalizeClassNames` / `normalizeStyles` and ProTable's `rowSelection` / `pagination` / `locale` produce new objects every render; any ProTable state change re-renders every row.

Targets, enforced by tests:

| Action                                                 | Body rows rendered                                                           |
| ------------------------------------------------------ | ---------------------------------------------------------------------------- |
| Toggle one row checkbox                                | ≤ 1 (+ header cell)                                                          |
| Toggle one `expandedRowRender` row                     | ≤ 1 + its expanded row                                                       |
| Expand one tree node                                   | its new children mount; existing rows re-render only if their `index` shifts |
| Open a filter dropdown / hover a sorter                | 0                                                                            |
| ProTable loading, density menu open, alert, fullscreen | 0                                                                            |
| Parent re-render with new inline `onRow`               | all (normal React)                                                           |

### ProTable

- `src/base-ui/ProTable` → `src/ProTable`, entry `@lobehub/ui/pro-table` (`package.json` exports, `tsconfig`, `vitest`, `docs.config` aliases). Imports: `@lobehub/ui/base-ui/form` → `@lobehub/ui/form`, `@/base-ui/*` → flattened paths, `antd-style` → `clsx` / StyleX.
- Public API is master v5.63 minus `ghost`. Customization stays on the existing slots: `searchFormRender`, `toolBarRender`, `tableAlertRender`, `tableAlertOptionRender`, `tableExtraRender`, `tableRender`, `actionRef`, `formRef`.
- `ProTable.tsx` composes internal hooks and parts. `useProColumns` maps `valueType` / `valueEnum` / `renderText` to Table `render`, memoized on `columns`, the columns-state map and locale.
- Everything passed to `<Table>` is stable (`useMemo` / `useEventCallback`).
- `TableAlert` reads selection from the Table store through an internal, undocumented `storeRef` on Table; ProTable keeps no display copy of selected keys. Controlled `rowSelection.selectedRowKeys` still works.
- Styles: `style.ts` → StyleX, keeping `lobe-pro-table-*` classes.

## Removed API and codemod

New rule `packages/codemod/src/rules/v6/tableProps.ts` (pattern of `videoProps.ts`), listed in `docs/migration-v6.mdx`:

| v5                                                                                             | v6                                                                |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `bordered`                                                                                     | `variant="outlined"`                                              |
| `expandedRowRender`, `expandIcon`, `indentSize`, `childrenColumnName`, `expandIconColumnIndex` | `expandable.*`                                                    |
| `classNames` / `styles` `cell`, `row`, `wrapper`, string `header` / `body`                     | `body.cell`, `body.row`, `section`, `header.cell`, `body.wrapper` |
| `emptyText`                                                                                    | `locale.emptyText`                                                |
| `size="medium"`                                                                                | `size="middle"`                                                   |
| `pagination.position`                                                                          | `pagination.placement`                                            |
| `locale.filterCheckall`                                                                        | `locale.filterCheckAll`                                           |
| `measureRowRender`                                                                             | removed (flagged)                                                 |
| ProTable `ghost`                                                                               | removed                                                           |
| `@lobehub/ui/base-ui/pro-table`                                                                | `@lobehub/ui/pro-table`                                           |

Public types formerly aliased from rc-table (`TableComponents`, `TableRenderedCell`, `TableScrollToConfig`) become our own declarations with the same shape.

## Dependencies

- Add `@tanstack/react-virtual`.
- Keep `@tanstack/react-table`; only `engine/tanstack.ts` imports it.
- `@rc-component/table` never enters v6.

## Tests

- **Ported acceptance suites**: master's Table suites (`Table`, `TableColumns`, `TableExpandable`, `TableFilter`, `TableLocale`, `TablePagination`, `TableProps`, `TableSelection`, `TableSemantic`, `TableSorter`, `TableSorterTooltip`, `TableSummaryStickyVirtual`, `TableCompat`, `columnUtils`, `selectionUtils`, `useSorter`, `useTableState`) and ProTable suites (`ProTable`, `ProTableGaps`, `ProTableLocale`, `SearchLabel`), changing only import paths. Cases for removed aliases, `TableBordered` and `measureRowRender` are dropped; alias behaviour is covered by codemod tests instead.
- **Render-count tests** for the targets table above, using a render spy in column `render` / `components.body.row`.
- **Engine unit tests** (`engine/tanstack.test.ts`): header colSpan / rowSpan for grouped columns, pinning offsets and edges from given widths, flattened expanded tree with depth, virtual window and `scrollTo`.
- **Codemod tests** for every row in the removed-API table.
- **Browser checklist** (`local-testing` skill, headless Playwright for resize per the hidden-tab gotcha): sticky header, fixed-column shadows while scrolling, split-header scroll sync, virtual + fixed + expand, tree data indent, summary `fixed`, ProTable search form collapse / toolbar / column setting.

## PR split

| PR            | Scope                                                                                                                                                                                                                                                                                                                                                                         | Depends on |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| A — sync      | Merge master through v5.63.0 into `v6`. Port Pagination (jump, size, semantic), Select (searchKeepsValue), dashboard Surface / MetricStrip / StatCard tweaks and i18n `table` resources to StyleX. Resolve `src/base-ui/Table` and `src/base-ui/ProTable` by not taking master's version, and do not add `@rc-component/table`, so later syncs treat those commits as merged. | –          |
| B — Table     | atoms, engine, store, pipeline, render, styles, ported + new Table tests                                                                                                                                                                                                                                                                                                      | A          |
| C — ProTable  | `src/ProTable`, entry wiring, ported ProTable tests                                                                                                                                                                                                                                                                                                                           | B          |
| D — migration | `tableProps` codemod rule + tests, `docs/migration-v6.mdx`, Table / ProTable `index.mdx` and demos                                                                                                                                                                                                                                                                            | B, C       |

## Out of scope

- A public headless `useProTable` or runtime-pluggable engine.
- Column resizing by drag, row pinning, server-side virtual loading.
- Any change to v5 / master.
