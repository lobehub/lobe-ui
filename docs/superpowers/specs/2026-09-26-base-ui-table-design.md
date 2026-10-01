# base-ui Table (batch ten)

Data table for `@lobehub/ui/base-ui`, built on TanStack Table v9 with an antd-shaped `columns` / `dataSource` API. Goal: remove every downstream import of antd `Table` and `@ant-design/pro-components` `ProTable`.

Downstream numbers come from the 2026-09-26 sweep (lobehub canary `3112b80e`, lobehub-cloud PR #1844 branch).

## Scope

Downstream reach:

- 18 files import antd `Table` directly (oss 10, cloud 8)
- 11 oss files go through `src/components/InlineTable`, a wrapper around antd `Table`
- 3 cloud files use `ProTable` from `@ant-design/pro-components` (`subscription/usage/.../SpendTable`, `WorkspaceBilling/Usage/SpendDetail/WorkspaceSpendTable`, `subscription/referral/.../ReferralTable`)
- 8 files override `.ant-table-*` styles

Usage across the 18 direct files:

| Feature                                                                                           | Usage                                                                                                                    |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| column `title` / `render` / `key` / `dataIndex` / `width`                                         | 74 / 67 / 60 / 52 / 52 column objects                                                                                    |
| column `sorter`                                                                                   | 28 local comparators; `sorter: true` + `onChange` for server sort (oss `Settings/stats/.../UsageTable`, the 3 ProTables) |
| column `filters` + `onFilter`                                                                     | 3 columns, all in cloud `WorkspaceBilling/Usage/ActivityLog`                                                             |
| column `align` / `onCell` / `ellipsis` / `fixed` / `sortDirections` / `defaultSortOrder`          | 6 / 5 / 2 / 1 (`right`) / 4 / 1                                                                                          |
| `pagination`                                                                                      | `false` ×13; object ×5 (`pageSize`, `defaultPageSize`, `showSizeChanger`, `onShowSizeChange`)                            |
| `scroll`                                                                                          | `x` ×7 (`'max-content'` or a number), `y` ×3 (sticky header)                                                             |
| `size`                                                                                            | `small` ×14, `middle` ×2                                                                                                 |
| `rowKey` / `rowClassName` / `onRow` / `loading` / `bordered` / `locale.emptyText` / `tableLayout` | 14 / 5 / 3 / 3 / 4 / 2 / 1                                                                                               |

Unused downstream, and out of v1: row selection, expandable rows, virtual scrolling, summary rows, tree data, column resizing, multi-column sort, controlled `sortOrder`, custom `filterDropdown`, filter search, array `dataIndex` paths, `sticky` offsets.

## Dependency

`@tanstack/react-table@^9.2.4` in `dependencies` (pulls `@tanstack/table-core` and `@tanstack/react-store`). tsdown externalizes it like every other runtime dependency.

v9 specifics that shape the implementation:

- `useTable({ features, columns, data })`, not v8's `useReactTable`.
- Features and row models are registered once at module scope:

```ts
const features = tableFeatures({
  columnFilteringFeature,
  columnPinningFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  rowPaginationFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});
```

- `data` falls back to a module-scope `EMPTY_DATA` constant, never an inline `[]`.
- `manualSorting` / `manualPagination` switch those models off for server-driven tables.

## Files

```
src/base-ui/Table/
  Table.tsx            root: builds TanStack columns + options, renders wrapper, table, pagination
  TableHeader.tsx      thead: sort button, filter trigger, aria-sort
  TableBody.tsx        tbody: rows, cells, empty state
  FilterMenu.tsx       header filter: base-ui DropdownMenu with checkbox items
  toColumnDefs.ts      antd-shaped columns → TanStack ColumnDef
  type.ts
  style.ts
  index.ts
  index.mdx
  demos/               basic, sorting, filters, pagination, server (manual sort + pagination), scroll (x + sticky y + fixed right), bordered, loading
  __tests__/
    toColumnDefs.test.ts
    Table.test.tsx
```

`src/base-ui/index.ts` gets `export { default as Table } from './Table'; export * from './Table';`.

## Types

```ts
export type SortOrder = 'ascend' | 'descend';

export interface TableColumn<T> {
  align?: 'left' | 'center' | 'right';
  className?: string;
  dataIndex?: Extract<keyof T, string>;
  defaultSortOrder?: SortOrder;
  ellipsis?: boolean;
  filters?: { text: ReactNode; value: string | number | boolean }[];
  fixed?: 'left' | 'right';
  key?: Key;
  onCell?: (record: T, index: number) => TdHTMLAttributes<HTMLTableCellElement>;
  onFilter?: (value: string | number | boolean, record: T) => boolean;
  render?: (value: any, record: T, index: number) => ReactNode;
  sortDirections?: SortOrder[];
  sorter?: boolean | ((a: T, b: T) => number);
  title?: ReactNode;
  width?: number | string;
}

export interface TablePaginationConfig {
  current?: number;
  defaultCurrent?: number;
  defaultPageSize?: number;
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  showSizeChanger?: boolean;
  total?: number;
}

export interface TableSorterResult<T> {
  column?: TableColumn<T>;
  columnKey?: Key;
  order?: SortOrder;
}

export interface TableProps<T> {
  bordered?: boolean;
  className?: string;
  classNames?: { body?: string; cell?: string; header?: string; row?: string; wrapper?: string };
  columns: TableColumn<T>[];
  dataSource?: T[];
  emptyText?: ReactNode;
  loading?: boolean;
  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, (string | number | boolean)[] | null>,
    sorter: TableSorterResult<T>,
  ) => void;
  onRow?: (record: T, index: number) => HTMLAttributes<HTMLTableRowElement>;
  pagination?: false | TablePaginationConfig;
  ref?: Ref<HTMLDivElement>;
  rowClassName?: string | ((record: T, index: number) => string);
  rowKey: Extract<keyof T, string> | ((record: T) => Key);
  scroll?: { x?: number | string | 'max-content'; y?: number | string };
  size?: 'small' | 'middle';
  style?: CSSProperties;
  styles?: {
    body?: CSSProperties;
    cell?: CSSProperties;
    header?: CSSProperties;
    row?: CSSProperties;
    wrapper?: CSSProperties;
  };
  tableLayout?: 'auto' | 'fixed';
}
```

Column id: `key ?? dataIndex`; `toColumnDefs` throws in dev when a column has neither and is sortable or filterable.

## Behavior

### Sorting

- A column is sortable when `sorter` is set. Clicking the header button cycles through `sortDirections` (default `['ascend', 'descend']`) then back to unsorted. One sorted column at a time.
- `sorter` as a function: local sort through `sortedRowModel`, using the comparator as the TanStack `sortingFn` (descend negates it).
- `sorter: true` on any column sets `manualSorting`; the table does not reorder rows, it reports the new sort through `onChange`.
- `defaultSortOrder` seeds the initial sorting state.
- The `th` carries `aria-sort="ascending" | "descending" | "none"`; the sort control is a `button` inside the header cell with an up/down caret that highlights the active direction.

### Filtering

- A column with `filters` gets a filter icon button in its header. It opens a base-ui `DropdownMenu` of checkbox items (one per filter) plus a "Reset" item. Toggling a checkbox applies immediately.
- `onFilter` runs locally through `filteredRowModel`: a row passes a column's filter when any selected value returns `true`.
- Active filters tint the icon `colorPrimary`. `onChange` receives the filter map keyed by column id (`null` when cleared).

### Pagination

- `pagination={false}` renders every row.
- Otherwise the table paginates with `paginatedRowModel` and renders base-ui `Pagination` below, right-aligned, `size="small"`. Default page size 10.
- `pagination.total` set → `manualPagination`: rows are rendered as given, `total` drives the pager, page changes are reported through `pagination.onChange` and `onChange`.
- `current` / `pageSize` are controlled when passed; `defaultCurrent` / `defaultPageSize` seed internal state.
- Local sort or filter changes reset the page to 1.

### Scrolling and fixed columns

- The table sits in a wrapper with `overflow: auto`.
- `scroll.x`: sets the table's `min-width` (`'max-content'` → `width: max-content`).
- `scroll.y`: sets the wrapper's `max-height`; `thead` becomes `position: sticky; top: 0`.
- `fixed: 'left' | 'right'` pins the column through `columnPinningFeature`; pinned cells get `position: sticky` with the offset from TanStack's pinning API and a `colorBgContainer` background, plus a shadow edge when the wrapper is scrolled.

### Rows and cells

- Row key from `rowKey` (string field or function) → TanStack `getRowId`.
- `onRow` attributes spread onto the `tr`; rows with `onClick` get `cursor: pointer`.
- `rowClassName` and `onCell` output merge onto `tr` / `td`.
- `ellipsis` → single line with `text-overflow: ellipsis` and the full text in `title` when it is a string.
- `align` sets `text-align` on both header and body cells.
- `tableLayout` passes through to `table-layout`.

### Loading and empty

- `loading`: rows stay rendered; an overlay with base-ui `Spin` covers the body. With no rows, the body shows a centered `Spin` at a 120px min height.
- No rows and not loading: `emptyText` if given, else lobe-ui `Empty` (compact).

## Styling

- Wrapper radius `borderRadiusLG` when `bordered`; otherwise no outer border.
- Header: `colorFillQuaternary` background, 13px, weight 500, `colorTextSecondary`.
- Rows: 1px `colorBorderSecondary` bottom border; hover `colorFillQuaternary`.
- Padding: `small` 8px / 12px, `middle` (default) 12px / 16px.
- `bordered`: every cell gets a `colorBorderSecondary` border, outer container 1px `colorBorderSecondary`.
- Numbers use `tabular-nums` in body cells.

## Tests

`toColumnDefs.test.ts`: id resolution, `dataIndex` accessor, `render` signature `(value, record, index)`, comparator wiring and descend negation, `onFilter` wiring, `sorter: true` marks manual sorting.

`Table.test.tsx`:

- renders headers and rows; `rowKey` string and function
- header click cycles ascend → descend → none; `aria-sort` follows; rows reorder for comparator columns
- `sorter: true`: rows keep order, `onChange` receives `{ columnKey, order }`
- filter menu toggles rows via `onFilter`; reset clears; `onChange` receives the filter map
- pagination: page size, page change, reset to page 1 on sort; `pagination.total` keeps rows as given
- `pagination={false}` renders all rows and no pager
- `onRow` click fires; `rowClassName` applied
- `loading` shows the spinner overlay; empty shows `emptyText` or `Empty`
- `scroll.y` makes the header sticky; `fixed: 'right'` cell has sticky positioning

## Docs

`index.mdx` (category Data Display) with the demos listed under Files.

## Downstream migration (after release)

lobehub (canary):

- 10 direct files: import change; `locale={{ emptyText }}` → `emptyText`; drop `.ant-table-*` overrides.
- `src/components/InlineTable`: wraps base-ui `Table`; its 11 consumers do not change. Its `hoverToActive` styling moves to `classNames.row`.
- `Settings/stats/.../UsageTable` keeps `sorter: true` + `onChange`.

lobehub-cloud (main):

- 8 direct files: import change; drop `.ant-table-*` overrides in `WorkspaceSettings/tableStyles.ts`, `SpendInsights/MemberTable`, `WorkspaceAuditLog`. `BacktestView` replaces the `'ant-table-row-selected'` class with its own selected class.
- 3 `ProTable` files → base-ui `Table`. `request` + `params` become an SWR hook that takes `{ current, pageSize, sort }`; `sorter: true` + `onChange` feed that hook; `pagination.total` from the response. `valueType: 'dateTime' | 'digit'` become `render` calls to the existing date / number formatters. `search={false}` / `options={false}` are dropped. `ReferralTable`'s full variant relies on ProTable's generated search form (columns without `hideInSearch`) and `headerTitle`; both become plain markup above the table: a heading plus a filter bar of base-ui `Input` / `Select` feeding the SWR hook's params.
- Remove `@ant-design/pro-components` from `package.json` once nothing imports it.

## Lint ban (separate PR, after downstream migrates)

- `antd`: `Table` named import, `antd/{es,lib}/table` paths.
- `@ant-design/pro-components`: whole package, message pointing to base-ui `Table`.
