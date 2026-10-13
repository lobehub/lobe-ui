import { useMemo } from 'react';

import { getColumnId, getColumnPos, isColumnGroup } from './columnUtils';
import type {
  SortOrder,
  TableColumn,
  TableColumnTitleProps,
  TableColumnType,
  TableCompareFn,
  TableSorterResult,
} from './type';

/** One sorted (or explicitly unsorted) column; mirrors antd `SortState`. */
export interface SortState<T = any> {
  column: TableColumn<T>;
  /** Column id (`key`, then `dataIndex`, then position). */
  key: string;
  /** `sorter.multiple`, or `false` for a single-column sorter. */
  multiplePriority: number | false;
  sortOrder: SortOrder | undefined;
}

export const DEFAULT_SORT_DIRECTIONS: SortOrder[] = ['ascend', 'descend'];

/** Tooltip copy of the sort trigger (antd `TableLocale` sort fields). */
const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const getMultiplePriority = (column: TableColumn<any>): number | false => {
  const { sorter } = column;
  return isPlainObject(sorter) && typeof sorter.multiple === 'number' ? sorter.multiple : false;
};

export const getSortFunction = <T>(sorter: TableColumn<T>['sorter']): TableCompareFn<T> | false => {
  if (typeof sorter === 'function') return sorter;
  if (isPlainObject(sorter) && typeof sorter.compare === 'function') return sorter.compare;
  return false;
};

/** Walks `sortDirections` and drops back to unsorted after the last one, like antd. */
export const getNextSortOrder = (
  sortDirections: readonly SortOrder[],
  current: SortOrder | undefined,
): SortOrder | undefined => {
  if (!current) return sortDirections[0];
  return sortDirections[sortDirections.indexOf(current) + 1];
};

/**
 * Controlled `sortOrder` states (any column, groups included) or, with `init`, the
 * `defaultSortOrder` states of sortable columns.
 */
export const collectSortStates = <T>(
  columns: readonly TableColumn<T>[],
  init: boolean,
  parentPos?: string,
): SortState<T>[] => {
  const states: SortState<T>[] = [];
  const push = (column: TableColumn<T>, pos: string, sortOrder: SortOrder | undefined) =>
    states.push({
      column,
      key: getColumnId(column, pos),
      multiplePriority: getMultiplePriority(column),
      sortOrder,
    });

  columns.forEach((column, index) => {
    const pos = getColumnPos(index, parentPos);
    if (isColumnGroup(column)) {
      if ('sortOrder' in column) push(column, pos, column.sortOrder);
      states.push(...collectSortStates(column.children, init, pos));
    } else if (column.sorter) {
      if ('sortOrder' in column) push(column, pos, column.sortOrder);
      else if (init && column.defaultSortOrder) push(column, pos, column.defaultSortOrder);
    }
  });
  return states;
};

const collectColumnMap = <T>(
  columns: readonly TableColumn<T>[],
  map = new Map<string, TableColumn<T>>(),
  parentPos?: string,
) => {
  columns.forEach((column, index) => {
    const pos = getColumnPos(index, parentPos);
    map.set(getColumnId(column, pos), column);
    if (isColumnGroup(column)) collectColumnMap(column.children, map, pos);
  });
  return map;
};

/**
 * The effective sort states. Controlled `sortOrder` wins over the inner state; once a
 * single-column sorter is active (or a non-`multiple` sorter follows a `multiple` one) every later
 * state is forced to `null`, exactly like antd.
 */
export const mergeSortStates = <T>(
  columns: readonly TableColumn<T>[],
  innerStates: readonly SortState<T>[],
): SortState<T>[] => {
  const controlled = collectSortStates(columns, false);

  if (controlled.length === 0) {
    // Drop states of removed columns and pick up the latest column objects (fresh comparators).
    const columnMap = collectColumnMap(columns);
    return innerStates
      .filter(({ key }) => columnMap.has(key))
      .map((state) => ({ ...state, column: columnMap.get(state.key)! }));
  }

  const result: SortState<T>[] = [];
  let valid = true;
  let multipleMode: boolean | null = null;
  const patch = (state: SortState<T>) => result.push(valid ? state : { ...state, sortOrder: null });

  for (const state of controlled) {
    if (multipleMode === null) {
      patch(state);
      if (state.sortOrder) {
        if (state.multiplePriority === false) valid = false;
        else multipleMode = true;
      }
    } else if (multipleMode && state.multiplePriority !== false) {
      patch(state);
    } else {
      valid = false;
      patch(state);
    }
  }
  return result;
};

/** A click replaces the sort, unless both it and the current sort are `multiple` sorters. */
export const getTriggeredSortStates = <T>(
  current: readonly SortState<T>[],
  next: SortState<T>,
): SortState<T>[] => {
  if (next.multiplePriority === false || !current.length || current[0].multiplePriority === false) {
    return [next];
  }
  return [...current.filter(({ key }) => key !== next.key), next];
};

const stateToInfo = <T>({ column, key, sortOrder }: SortState<T>): TableSorterResult<T> => ({
  column,
  // antd reports `column.key`; the id fallback keeps dataIndex-only columns identifiable.
  columnKey: column.key ?? key,
  field: (column as TableColumnType<T>).dataIndex as TableSorterResult<T>['field'],
  order: sortOrder,
});

/** The `sorter` argument of `onChange`: one result, or an array for several active sorters. */
export const getSorterInfo = <T>(
  states: readonly SortState<T>[],
): TableSorterResult<T> | TableSorterResult<T>[] => {
  const active = states.filter(({ sortOrder }) => sortOrder).map((state) => stateToInfo(state));

  // antd keeps the last cleared column's other fields when nothing is sorted.
  if (active.length === 0 && states.length) {
    return {
      ...stateToInfo(states.at(-1)!),
      column: undefined,
      columnKey: undefined,
      field: undefined,
      order: undefined,
    };
  }
  if (active.length <= 1) return active[0] ?? {};
  return active;
};

/** `sortColumns` and the legacy `sortColumn` / `sortOrder` passed to function titles. */
export const getSortTitleProps = <T>(
  states: readonly SortState<T>[],
): Pick<TableColumnTitleProps<T>, 'sortColumn' | 'sortColumns' | 'sortOrder'> => {
  const sortColumns = states.map(({ column, sortOrder }) => ({ column, order: sortOrder }));
  return {
    sortColumn: sortColumns[0]?.column,
    sortColumns,
    sortOrder: sortColumns[0]?.order,
  };
};

/**
 * Returns a sorted copy. Comparators run by descending `multiple` priority; `sorter: true` leaves
 * the order to the server. Tree children (`childrenColumnName`) are sorted recursively.
 */
export const sortData = <T>(
  data: readonly T[],
  states: readonly SortState<T>[],
  childrenColumnName = 'children',
): T[] => {
  const running = states
    .filter(({ column, sortOrder }) => getSortFunction(column.sorter) && sortOrder)
    .sort((a, b) => (b.multiplePriority as number) - (a.multiplePriority as number));
  if (running.length === 0) return [...data];

  return [...data]
    .sort((a, b) => {
      for (const { column, sortOrder } of running) {
        const result = (getSortFunction(column.sorter) as TableCompareFn<T>)(a, b, sortOrder);
        if (result !== 0) return sortOrder === 'ascend' ? result : -result;
      }
      return 0;
    })
    .map((record) => {
      const children = (record as Record<string, unknown>)[childrenColumnName];
      return Array.isArray(children)
        ? { ...record, [childrenColumnName]: sortData(children as T[], states, childrenColumnName) }
        : record;
    });
};

export const useSorter = <T>({
  childrenColumnName,
  data,
  sortStates,
}: {
  childrenColumnName?: string;
  data: readonly T[];
  sortStates: readonly SortState<T>[];
}) =>
  useMemo(
    () => sortData(data, sortStates, childrenColumnName),
    [data, sortStates, childrenColumnName],
  );
