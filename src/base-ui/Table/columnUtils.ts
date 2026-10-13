import { EXPAND_COLUMN } from '@rc-component/table';

import { SELECTION_COLUMN } from './selectionUtils';
import type {
  TableBreakpoint,
  TableColumn,
  TableColumnGroupType,
  TableColumnTitle,
  TableColumnTitleProps,
  TableColumnType,
} from './type';

type DataIndexOf<T> = TableColumnType<T>['dataIndex'];

export const isColumnGroup = <T>(column: TableColumn<T>): column is TableColumnGroupType<T> =>
  'children' in column && Array.isArray(column.children);

const dataIndexOf = <T>(column: TableColumn<T>): DataIndexOf<T> =>
  'dataIndex' in column ? column.dataIndex : undefined;

/** Position path of a column in the tree: `2` at the top level, `2-0` for its first child. */
export const getColumnPos = (index: number, parentPos?: string) =>
  parentPos === undefined ? String(index) : `${parentPos}-${index}`;

/** `key`, then `dataIndex` (paths joined with `.`), then a positional id. */
export const getColumnId = (column: TableColumn<any>, pos: number | string): string => {
  if (column.key != null) return String(column.key);
  const dataIndex = dataIndexOf(column);
  if (Array.isArray(dataIndex)) {
    if (dataIndex.length > 0) return dataIndex.join('.');
  } else if (dataIndex != null && dataIndex !== '') {
    return String(dataIndex);
  }
  return `__column_${pos}`;
};

export const getPathValue = (record: unknown, path: DataIndexOf<any>): unknown => {
  if (path == null || path === '') return undefined;
  const keys = Array.isArray(path) ? path : [path];
  let value: any = record;
  for (const key of keys) {
    if (value == null) return undefined;
    value = value[key as PropertyKey];
  }
  return value;
};

export const getCellValue = <T>(record: T, column: TableColumn<T>): unknown =>
  getPathValue(record, dataIndexOf(column));

export interface FlatColumn<T> {
  column: TableColumn<T>;
  id: string;
}

/** Every column and group in pre-order, with the id that keys its sort / filter state. */
export const flattenColumns = <T>(columns: readonly TableColumn<T>[], parentPos?: string) => {
  const list: FlatColumn<T>[] = [];
  columns.forEach((column, index) => {
    if (column === EXPAND_COLUMN || column === SELECTION_COLUMN) return;
    const pos = getColumnPos(index, parentPos);
    list.push({ column, id: getColumnId(column, pos) });
    if (isColumnGroup(column)) list.push(...flattenColumns(column.children, pos));
  });
  return list;
};

/** Sort and filter state is keyed by column id, so those columns need a stable one. */
export const assertColumnKeys = (columns: readonly TableColumn<any>[]) => {
  for (const { column } of flattenColumns(columns)) {
    const needsStableId =
      Boolean(column.sorter) || Boolean(column.filters) || column.filterDropdown !== undefined;
    if (needsStableId && column.key == null && dataIndexOf(column) == null) {
      throw new Error('[Table] sortable or filterable columns need a `key` or `dataIndex`');
    }
  }
};

/** Merges the table-level `column` defaults under every column; groups keep their `children`. */
export const fillColumns = <T>(
  columns: readonly TableColumn<T>[],
  defaults: Partial<TableColumnType<T>> | undefined,
): TableColumn<T>[] => {
  if (!defaults) return columns as TableColumn<T>[];
  const { children: _children, ...base } = defaults as Partial<TableColumnGroupType<T>>;
  return columns.map((column) => {
    if (column === EXPAND_COLUMN || column === SELECTION_COLUMN) return column;
    const merged = { ...base } as Record<string, unknown>;
    for (const [key, value] of Object.entries(column)) {
      if (value !== undefined) merged[key] = value;
    }
    if (isColumnGroup(column)) merged.children = fillColumns(column.children, defaults);
    return merged as unknown as TableColumn<T>;
  });
};

/**
 * Drops columns whose `responsive` breakpoints are all inactive. `screens === null` means the
 * breakpoints are unknown (SSR / no `matchMedia`), so every column stays.
 */
export const isColumnVisibleAt = (
  column: TableColumn<any>,
  screens: ReadonlySet<TableBreakpoint> | null,
) => !column.responsive || !screens || column.responsive.some((point) => screens.has(point));

export const renderColumnTitle = <T>(
  title: TableColumnTitle<T>,
  props: TableColumnTitleProps<T>,
) => (typeof title === 'function' ? title(props) : title);
