import type {
  ColumnType as RcColumnType,
  Reference as RcReference,
  RenderedCell as RcRenderedCell,
  Summary,
  TableProps as RcTableProps,
} from '@rc-component/table';
import type {
  AriaAttributes,
  ComponentProps,
  CSSProperties,
  HTMLAttributes,
  Key,
  MouseEvent,
  ReactNode,
  Ref,
  TdHTMLAttributes,
  ThHTMLAttributes,
  UIEventHandler,
} from 'react';

import type { CheckboxProps } from '@/base-ui/Checkbox/type';
import type { PaginationProps, PaginationSemanticName } from '@/base-ui/Pagination/type';
import type { PopoverPlacement } from '@/base-ui/Popover/type';
import type { SpinProps } from '@/base-ui/Spin/type';
import type { TooltipProps } from '@/base-ui/Tooltip/type';

/** `null` (or `undefined`) means unsorted. */
export type SortOrder = 'ascend' | 'descend' | null;

/** The third argument is the order being applied; return the ascending comparison either way. */
export type TableCompareFn<T> = (a: T, b: T, sortOrder?: SortOrder) => number;

/**
 * `true` sorts on the server (row order is left alone), a function sorts locally, and
 * `{ compare, multiple }` joins a multi-column sort where a higher `multiple` takes priority.
 */
export type TableColumnSorter<T> =
  boolean | TableCompareFn<T> | { compare?: TableCompareFn<T>; multiple?: number };

/** Tooltip options for the sort trigger; `target` picks the whole header or just the icon. */
export type TableSorterTooltipProps = Partial<Omit<TooltipProps, 'children'>> & {
  /** @default 'full-header' */
  target?: 'full-header' | 'sorter-icon';
};

export type FilterValue = string | number | boolean;

/** A filter option; `children` nests options (a submenu, or tree nodes with `filterMode: 'tree'`). */
export interface TableColumnFilterItem {
  children?: TableColumnFilterItem[];
  text: ReactNode;
  value: FilterValue;
}

/** Argument of a function `filterDropdown`; mirrors antd `FilterDropdownProps`. */
export interface TableFilterDropdownProps {
  /** Drops the panel's draft selection and applies `selectedKeys`. */
  clearFilters?: (params?: { closeDropdown?: boolean; confirm?: boolean }) => void;
  close: () => void;
  /** Applies `selectedKeys`; closes the panel unless `closeDropdown` is `false`. */
  confirm: (params?: { closeDropdown?: boolean }) => void;
  filters?: TableColumnFilterItem[];
  /** Class prefix for custom panels (kept for antd parity). */
  prefixCls: string;
  /** Draft selection, applied by `confirm`. */
  selectedKeys: Key[];
  setSelectedKeys: (selectedKeys: Key[]) => void;
  visible: boolean;
}

/** Options of the filter popup (antd `filterDropdownProps`, a subset of `DropdownProps`). */
export interface TableFilterDropdownPopupProps {
  className?: string;
  /** @deprecated use `popupRender` */
  dropdownRender?: (menu: ReactNode) => ReactNode;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  onOpenChange?: (open: boolean) => void;
  /** Controlled open state. */
  open?: boolean;
  /** @default 'bottomRight' */
  placement?: PopoverPlacement;
  /** Wraps the panel content. */
  popupRender?: (menu: ReactNode) => ReactNode;
  rootClassName?: string;
  style?: CSSProperties;
  zIndex?: number;
}

/** antd / Grid breakpoints, from widest to narrowest. */
export type TableBreakpoint = 'xxxl' | 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';

/** `true` and `'left'` pin to the start edge, `'right'` to the end edge. */
export type TableColumnFixed = boolean | 'start' | 'end' | 'left' | 'right';

export type TableColumnEllipsis = boolean | { showTitle?: boolean };

/** Arguments of a function `title`; mirrors antd `ColumnTitleProps`. */
export interface TableColumnTitleProps<T> {
  filters?: TableFilters;
  /** @deprecated use `sortColumns` */
  sortColumn?: TableColumn<T>;
  sortColumns?: { column: TableColumn<T>; order?: SortOrder }[];
  /** @deprecated use `sortColumns` */
  sortOrder?: SortOrder;
}

export type TableColumnTitle<T> = ReactNode | ((props: TableColumnTitleProps<T>) => ReactNode);

/** `render` may return a cell with `props.colSpan` / `props.rowSpan` (0 skips the cell). */
export type TableRenderedCell<T> = RcRenderedCell<T>;

export type TableCellAttributes = TdHTMLAttributes<HTMLTableCellElement> &
  Record<`data-${string}`, unknown>;

export type TableHeaderCellAttributes = ThHTMLAttributes<HTMLTableCellElement> &
  Record<`data-${string}`, unknown>;

export interface TableColumnType<T> {
  /** `start` / `end` follow the writing direction. */
  align?: RcColumnType<T>['align'];
  className?: string;
  /** Header colSpan; `0` hides the header cell. */
  colSpan?: number;
  /** A key of the record, or a path into nested records such as `['address', 'city']`. */
  dataIndex?: NoInfer<RcColumnType<T>['dataIndex']>;
  /** Initial filter of an uncontrolled column. */
  defaultFilteredValue?: FilterValue[] | null;
  /** Initial sort; several columns may set it when their sorters use `multiple`. */
  defaultSortOrder?: SortOrder;
  /** Truncate overflowing cells (and the header). `showTitle: false` drops the native tooltip. */
  ellipsis?: TableColumnEllipsis;
  /** Replaces the filter panel; a function receives the panel state and actions. */
  filterDropdown?: ReactNode | ((props: TableFilterDropdownProps) => ReactNode);
  /** @deprecated use `filterDropdownProps.open` */
  filterDropdownOpen?: boolean;
  /** Options of the filter popup, such as a controlled `open` / `onOpenChange`. */
  filterDropdownProps?: TableFilterDropdownPopupProps;
  /** Forces the filter icon's active state. */
  filtered?: boolean;
  /** Controlled filter; setting it on any column controls every column's filter. */
  filteredValue?: FilterValue[] | null;
  filterIcon?: ReactNode | ((filtered: boolean) => ReactNode);
  /** `tree` renders `filters` (and their `children`) as a checkable tree. @default 'menu' */
  filterMode?: 'menu' | 'tree';
  /** `false` picks a single value (radio). @default true */
  filterMultiple?: boolean;
  /** Apply the draft selection when the panel closes without OK. @default true */
  filterOnClose?: boolean;
  /** Reset returns to `defaultFilteredValue` instead of clearing. */
  filterResetToDefaultFilteredValue?: boolean;
  filters?: TableColumnFilterItem[];
  /** Search box above the options; a function decides whether an option matches the input. */
  filterSearch?: boolean | ((input: string, item: TableColumnFilterItem) => boolean);
  fixed?: TableColumnFixed;
  /** Remove the column without unmounting the table's sort / filter state. */
  hidden?: boolean;
  key?: Key;
  /** Minimum width when `tableLayout` is `auto`. */
  minWidth?: number;
  /** `colSpan` / `rowSpan` of `0` skip the cell. */
  onCell?: (record: T, index: number) => TableCellAttributes;
  onFilter?: (value: FilterValue, record: T) => boolean;
  /** @deprecated use `filterDropdownProps.onOpenChange` */
  onFilterDropdownOpenChange?: (open: boolean) => void;
  onHeaderCell?: (column: TableColumn<T>) => TableHeaderCellAttributes;
  render?: (value: any, record: T, index: number) => ReactNode | TableRenderedCell<T>;
  /** Only show the column at these breakpoints. */
  responsive?: TableBreakpoint[];
  /** Render the cells as `<th scope>` row headers. */
  rowScope?: 'row' | 'rowgroup';
  /** Return `false` to skip re-rendering a cell when its record changes. */
  shouldCellUpdate?: (record: T, prevRecord: T) => boolean;
  /** Overrides the table-level `showSorterTooltip`. */
  showSorterTooltip?: boolean | TableSorterTooltipProps;
  /** Orders a header click cycles through before returning to unsorted. Overrides the table's. */
  sortDirections?: SortOrder[];
  sorter?: TableColumnSorter<T>;
  /** Replaces the default sort carets. */
  sortIcon?: (props: { sortOrder: SortOrder }) => ReactNode;
  /** Controlled sort order; `null` is unsorted. Setting it on any column controls the whole sort. */
  sortOrder?: SortOrder;
  title?: TableColumnTitle<T>;
  width?: number | string;
}

/** A header group: renders `title` above its `children` columns. */
export interface TableColumnGroupType<T> extends Omit<TableColumnType<T>, 'dataIndex'> {
  children: TableColumnsType<T>;
}

export type TableColumn<T> = TableColumnGroupType<T> | TableColumnType<T>;

export type TableColumnsType<T> = TableColumn<T>[];

/** `indent` is the tree depth of the row (`0` for top-level records). */
export type TableRowClassName<T> = (record: T, index: number, indent: number) => string;

export type TableExpandedRowRender<T> = (
  record: T,
  index: number,
  indent: number,
  expanded: boolean,
) => ReactNode;

/** Argument of `expandable.expandIcon`; mirrors antd / rc-table `RenderExpandIconProps`. */
export interface TableExpandIconProps<T> {
  /** `false` for rows that cannot expand (`rowExpandable`, or tree leaves); render a spacer. */
  expandable: boolean;
  expanded: boolean;
  onExpand: (record: T, event: MouseEvent<HTMLElement>) => void;
  prefixCls: string;
  record: T;
}

/** Expandable rows and tree data; mirrors antd `ExpandableConfig`. */
export interface TableExpandableConfig<T> {
  /** Field holding a record's tree children. @default 'children' */
  childrenColumnName?: string;
  /** Header of the expand column. */
  columnTitle?: ReactNode;
  /** Width of the expand column. @default 48 */
  columnWidth?: number | string;
  /** Expand every row (tree rows included) on mount. */
  defaultExpandAllRows?: boolean;
  /** Initially expanded row keys (uncontrolled). */
  defaultExpandedRowKeys?: readonly Key[];
  expandedRowClassName?: string | TableRowClassName<T>;
  /** Controlled expanded row keys. */
  expandedRowKeys?: readonly Key[];
  /** @deprecated use `Table.EXPAND_COLUMN` in `columns` */
  expandedRowOffset?: number;
  /** Content of the row expanded under a record. */
  expandedRowRender?: TableExpandedRowRender<T>;
  expandIcon?: (props: TableExpandIconProps<T>) => ReactNode;
  /** @deprecated use `Table.EXPAND_COLUMN` in `columns` */
  expandIconColumnIndex?: number;
  /** Toggle a row by clicking anywhere on it. */
  expandRowByClick?: boolean;
  /** Pin the expand column. */
  fixed?: TableColumnFixed;
  /** Render collapsed expanded rows too (hidden). */
  forceRender?: boolean;
  /** Indent in px per tree level. @default 15 */
  indentSize?: number;
  onExpand?: (expanded: boolean, record: T) => void;
  onExpandedRowsChange?: (expandedKeys: readonly Key[]) => void;
  /** Return `false` to hide a record's expand icon. */
  rowExpandable?: (record: T) => boolean;
  /** @default true */
  showExpandColumn?: boolean;
}

export type TableRowSelectionType = 'checkbox' | 'radio';

/** `info.type` of `rowSelection.onChange`: what changed the selection. */
export type TableRowSelectMethod = 'all' | 'none' | 'invert' | 'single' | 'multiple';

/** Props a row's (or the header's) selection box takes; `checked` follows `selectedRowKeys`. */
export type TableRowSelectionCheckboxProps = Partial<
  Omit<CheckboxProps, 'checked' | 'defaultChecked'>
> &
  AriaAttributes;

/** A custom entry of the `selections` dropdown. */
export interface TableSelectionItem {
  key: string;
  /** Receives the keys of every selectable row on the current page. */
  onSelect?: (changeableRowKeys: Key[]) => void;
  text: ReactNode;
}

/** `Table.SELECTION_ALL` / `SELECTION_INVERT` / `SELECTION_NONE`. */
export type TableSelectionPreset = 'SELECT_ALL' | 'SELECT_INVERT' | 'SELECT_NONE';

/** Row selection; mirrors antd `TableRowSelection`. */
export interface TableRowSelection<T> {
  /** Alignment of the selection column. */
  align?: 'left' | 'center' | 'right';
  /** `false` links tree parents and children (checking a parent checks its descendants). @default true */
  checkStrictly?: boolean;
  /** Replaces the header; a function receives the default select-all checkbox. */
  columnTitle?: ReactNode | ((checkboxNode: ReactNode) => ReactNode);
  /** @default 32 */
  columnWidth?: number | string;
  defaultSelectedRowKeys?: Key[];
  /** Pin the selection column; defaults to the `fixed` of its neighbour column. */
  fixed?: TableColumnFixed;
  /** Per-row checkbox props, such as `disabled` or `name`. */
  getCheckboxProps?: (record: T) => TableRowSelectionCheckboxProps;
  /** Props of the header select-all checkbox. */
  getTitleCheckboxProps?: () => TableRowSelectionCheckboxProps;
  /** Hide the select-all checkbox and the `selections` dropdown. */
  hideSelectAll?: boolean;
  onCell?: (record: T, index: number) => TableCellAttributes;
  onChange?: (
    selectedRowKeys: Key[],
    selectedRows: T[],
    info: { type: TableRowSelectMethod },
  ) => void;
  /** A single row was (de)selected. */
  onSelect?: (record: T, selected: boolean, selectedRows: T[], nativeEvent: Event) => void;
  /** @deprecated use `onChange` */
  onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
  /** @deprecated use `onChange` */
  onSelectInvert?: (selectedRowKeys: Key[]) => void;
  /** @deprecated use `onChange` (Shift-click range selection, `info.type === 'multiple'`) */
  onSelectMultiple?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
  /** @deprecated use `onChange` */
  onSelectNone?: () => void;
  /** Keep selected keys whose records left `dataSource` (server paging). */
  preserveSelectedRowKeys?: boolean;
  /** Wrap or replace a row's selection box; may return `{ children, props }` to span cells. */
  renderCell?: (
    value: boolean,
    record: T,
    index: number,
    originNode: ReactNode,
  ) => ReactNode | TableRenderedCell<T>;
  /** Controlled selected keys. */
  selectedRowKeys?: Key[];
  /** Dropdown beside the select-all checkbox; `true` gives all / invert / none. */
  selections?: (TableSelectionItem | TableSelectionPreset)[] | boolean;
  /** @default 'checkbox' */
  type?: TableRowSelectionType;
}

export type TablePaginationPlacement =
  'topStart' | 'topCenter' | 'topEnd' | 'bottomStart' | 'bottomCenter' | 'bottomEnd' | 'none';

/** @deprecated use `TablePaginationPlacement` */
export type TablePaginationPosition =
  'topLeft' | 'topCenter' | 'topRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'none';

/** antd `TablePaginationConfig`: `base-ui/Pagination` props plus where to place the pager. */
export interface TablePaginationConfig extends Omit<
  PaginationProps,
  'onChange' | 'onPageSizeChange' | 'ref' | 'total'
> {
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
  /** Pager positions; one top and/or one bottom entry. @default ['bottomEnd'] */
  placement?: TablePaginationPlacement[];
  /** @deprecated use `placement` */
  position?: TablePaginationPosition[];
  /** Server-side total; omitted means the (filtered) `dataSource` length. */
  total?: number;
}

/** The fourth `onChange` argument. */
export interface TableCurrentDataSource<T> {
  action: 'paginate' | 'sort' | 'filter';
  /** Every record after filtering and sorting (not just the current page). */
  currentDataSource: T[];
}

export interface TableSorterResult<T> {
  column?: TableColumn<T>;
  columnKey?: Key;
  /** The column's `dataIndex`. */
  field?: Key | readonly Key[];
  order?: SortOrder;
}

export type TableFilters = Record<string, FilterValue[] | null>;

/** Parts of the header / body sections: `wrapper` is the `thead` / `tbody`, then `row` (tr) and `cell` (th / td). */
export type TableComponentsSemanticName = 'cell' | 'row' | 'wrapper';

/** Top-level keys of the semantic `classNames` / `styles` (antd 6 Semantic DOM). */
export type TableSemanticName =
  'body' | 'content' | 'footer' | 'header' | 'pagination' | 'root' | 'section' | 'title';

/** Flat keys from before the antd 6 structure; still accepted. */
export type TableLegacySemanticName = 'body' | 'cell' | 'header' | 'row' | 'wrapper';

/**
 * antd 6 Semantic DOM class names. `root` is the outer div, `section` the table container,
 * `content` the scroll box, `title` / `footer` the title and footer bars.
 */
export interface TableClassNames {
  /** A string is the legacy flat key: the `tbody` (`body.wrapper`). */
  body?: string | Partial<Record<TableComponentsSemanticName, string>>;
  /** @deprecated use `body.cell` */
  cell?: string;
  content?: string;
  footer?: string;
  /** A string is the legacy flat key: every header cell (`header.cell`). */
  header?: string | Partial<Record<TableComponentsSemanticName, string>>;
  pagination?: Partial<Record<PaginationSemanticName, string>>;
  root?: string;
  /** @deprecated use `body.row` */
  row?: string;
  section?: string;
  title?: string;
  /** @deprecated use `section` */
  wrapper?: string;
}

/**
 * antd 6 Semantic DOM styles, keyed like `TableClassNames`. A `header` / `body` object without
 * `wrapper` / `row` / `cell` keys is the legacy flat style (`header.cell` / `body.wrapper`).
 */
export interface TableStyles {
  body?: CSSProperties | Partial<Record<TableComponentsSemanticName, CSSProperties>>;
  /** @deprecated use `body.cell` */
  cell?: CSSProperties;
  content?: CSSProperties;
  footer?: CSSProperties;
  header?: CSSProperties | Partial<Record<TableComponentsSemanticName, CSSProperties>>;
  pagination?: Partial<Record<PaginationSemanticName, CSSProperties>>;
  root?: CSSProperties;
  /** @deprecated use `body.row` */
  row?: CSSProperties;
  section?: CSSProperties;
  title?: CSSProperties;
  /** @deprecated use `section` */
  wrapper?: CSSProperties;
}

/** antd `classNames` / `styles` function form: computed from the table's props. */
export type TableSemanticInfo<T> = { props: TableProps<T> };

/** antd `TableLocale`. Unset fields fall back to the `table.*` texts of `@lobehub/ui/i18n`. */
export interface TableLocale {
  cancelSort?: string;
  collapse?: string;
  /** Rendered instead of the default empty state; a function is called on render. */
  emptyText?: ReactNode | (() => ReactNode);
  expand?: string;
  filterCheckAll?: ReactNode;
  /** @deprecated use `filterCheckAll` */
  filterCheckall?: ReactNode;
  filterConfirm?: ReactNode;
  filterEmptyText?: ReactNode;
  filterReset?: ReactNode;
  filterSearchPlaceholder?: string;
  filterTitle?: string;
  /** Accessible label of the header select-all checkbox. */
  selectAll?: ReactNode;
  /** Text of the `Table.SELECTION_INVERT` preset. */
  selectInvert?: ReactNode;
  /** Text of the `Table.SELECTION_ALL` preset. */
  selectionAll?: ReactNode;
  /** Text of the `Table.SELECTION_NONE` preset. */
  selectNone?: ReactNode;
  /** Native `title` of the sorter when `showSorterTooltip` is off. */
  sortTitle?: string;
  triggerAsc?: string;
  triggerDesc?: string;
}

/** `middle` is kept as an alias of `medium` (antd v5 naming). */
export type TableSize = 'large' | 'medium' | 'middle' | 'small';

/** Spin options for the loading overlay; `spinning` defaults to `true` when an object is passed. */
export type TableLoadingConfig = Omit<SpinProps, 'children' | 'ref'>;

/** Override the rendered table, header and body elements (antd `components`). */
export type TableComponents<T> = NonNullable<RcTableProps<T>['components']>;

/** `index` / `key` scroll a row into view (`align`, then `offset` px); `top` scrolls to a pixel offset. */
export type TableScrollToConfig = Parameters<RcReference['scrollTo']>[0];

/**
 * Page-level sticky header (and horizontal scrollbar).
 * `offsetHeader` / `offsetSummary` / `offsetScroll` are the distances from the container's top /
 * bottom edges; `getContainer` is the scroll container. @default window
 */
export interface TableSticky {
  getContainer?: () => Window | HTMLElement;
  offsetHeader?: number;
  offsetScroll?: number;
  offsetSummary?: number;
}

/** `fixed`: `true` / `'bottom'` pins the summary under a scrolling body, `'top'` above it. */
export type TableSummaryProps = ComponentProps<typeof Summary>;
export type TableSummaryRowProps = ComponentProps<typeof Summary.Row>;
/** `index` is the start column; `colSpan` / `rowSpan` / `align` as on a `td`. */
export type TableSummaryCellProps = ComponentProps<typeof Summary.Cell>;

/** antd `Table` ref: the root element, plus `nativeElement` and a body `scrollTo`. */
export type TableRef = HTMLDivElement & {
  nativeElement: HTMLDivElement;
  scrollTo: (config: TableScrollToConfig) => void;
};

export interface TableProps<T> {
  bordered?: boolean;
  /** `Table.Column` / `Table.ColumnGroup` elements, used when `columns` is not set. */
  children?: ReactNode;
  /** @deprecated use `expandable.childrenColumnName` */
  childrenColumnName?: string;
  className?: string;
  /** Semantic class names (antd 6 structure, or the legacy flat keys); a function gets `{ props }`. */
  classNames?: TableClassNames | ((info: TableSemanticInfo<T>) => TableClassNames);
  /** Defaults merged into every column (and group); a column's own fields win. */
  column?: Partial<TableColumnType<T>>;
  columns?: TableColumnsType<T>;
  components?: TableComponents<T>;
  dataSource?: T[];
  /** Alias of `locale.emptyText` (which wins when both are set). */
  emptyText?: ReactNode | (() => ReactNode);
  /** Expandable rows (`expandedRowRender`) and tree data (`childrenColumnName`). */
  expandable?: TableExpandableConfig<T>;
  /** @deprecated use `expandable.expandedRowRender` */
  expandedRowRender?: TableExpandedRowRender<T>;
  /** @deprecated use `expandable.expandIcon` */
  expandIcon?: TableExpandableConfig<T>['expandIcon'];
  /** @deprecated use `Table.EXPAND_COLUMN` in `columns` */
  expandIconColumnIndex?: number;
  footer?: (currentPageData: readonly T[]) => ReactNode;
  /** Container of the filter popups. */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  /** @deprecated use `expandable.indentSize` */
  indentSize?: number;
  loading?: boolean | TableLoadingConfig;
  /** Texts of the table; unset fields use the `table.*` i18n texts (English by default). */
  locale?: TableLocale;
  /** Wrap the hidden row rc-table uses to measure column widths (debug / custom layouts). */
  measureRowRender?: (measureRow: ReactNode) => ReactNode;
  onChange?: (
    pagination: TablePaginationConfig,
    filters: TableFilters,
    /** An array when more than one `multiple` sorter is active. */
    sorter: TableSorterResult<T> | TableSorterResult<T>[],
    extra: TableCurrentDataSource<T>,
  ) => void;
  onHeaderRow?: (
    columns: readonly RcColumnType<T>[],
    index?: number,
  ) => HTMLAttributes<HTMLTableRowElement>;
  onRow?: (record: T, index: number) => HTMLAttributes<HTMLTableRowElement>;
  onScroll?: UIEventHandler<HTMLDivElement>;
  pagination?: false | TablePaginationConfig;
  ref?: Ref<HTMLDivElement> | Ref<TableRef>;
  /** Extra class on the root element, like `className`. */
  rootClassName?: string;
  /** A function also receives the row's tree depth (`indent`). */
  rowClassName?: string | TableRowClassName<T>;
  /** Highlight the hovered row. @default true */
  rowHoverable?: boolean;
  /** @default 'key' */
  rowKey?: string | keyof T | ((record: T, index?: number) => Key);
  /** Checkbox / radio row selection; see `TableRowSelection`. */
  rowSelection?: TableRowSelection<T>;
  /**
   * `x: true` lets the table grow with its content; `y` splits the header from a scrolling body.
   * `scrollToFirstRowOnChange` (default on) scrolls the body back to the top on paginate / sort / filter.
   */
  scroll?: { scrollToFirstRowOnChange?: boolean; x?: number | string | true; y?: number | string };
  /** @default true */
  showHeader?: boolean;
  /** Tooltip on sortable headers telling what the next click does. @default { target: 'full-header' } */
  showSorterTooltip?: boolean | TableSorterTooltipProps;
  /** @default 'middle' */
  size?: TableSize;
  /** Default `sortDirections` of every column. @default ['ascend', 'descend'] */
  sortDirections?: SortOrder[];
  /** Stick the header (and the horizontal scrollbar) to the page while it scrolls. */
  sticky?: boolean | TableSticky;
  style?: CSSProperties;
  /** Semantic styles, keyed like `classNames`; a function gets `{ props }`. */
  styles?: TableStyles | ((info: TableSemanticInfo<T>) => TableStyles);
  /** Summary rows built from `Table.Summary`; receives the current page's rows. */
  summary?: (currentPageData: readonly T[]) => ReactNode;
  /** Defaults to `fixed` with fixed columns, a fixed header (`scroll.y`) or `ellipsis` columns. */
  tableLayout?: 'auto' | 'fixed';
  title?: (currentPageData: readonly T[]) => ReactNode;
  /** Virtual scrolling (rc-virtual-list); needs numeric `scroll.y`, and numeric `scroll.x` with fixed columns. */
  virtual?: boolean;
}
