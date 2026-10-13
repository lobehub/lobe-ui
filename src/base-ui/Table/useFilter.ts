import { type Key, useMemo } from 'react';

import { flattenColumns } from './columnUtils';
import type {
  FilterValue,
  TableColumn,
  TableColumnFilterItem,
  TableColumnType,
  TableFilters,
} from './type';

/** Applied keys of one column; `null` / `undefined` mean unfiltered. */
export type FilterKeys = (Key | boolean)[] | null;

/** Filter state of one filterable column (antd `FilterState`). */
export interface FilterState<T> {
  column: TableColumnType<T>;
  /**
   * Option values as strings for `filters` columns, raw keys for `filterDropdown` columns.
   * `undefined` means the column is uncontrolled and untouched.
   */
  filteredKeys?: FilterKeys;
  forceFiltered?: boolean;
  key: string;
}

/** Inner (uncontrolled) applied keys by column id. */
export type FiltersState = Record<string, FilterKeys | undefined>;

export const flattenFilterKeys = (filters?: readonly TableColumnFilterItem[]): FilterValue[] =>
  (filters ?? []).flatMap(({ children, value }) => [value, ...flattenFilterKeys(children)]);

const isFilterable = (column: TableColumnType<any>) =>
  Boolean(column.filters) || column.filterDropdown !== undefined || 'onFilter' in column;

const toKeys = (column: TableColumnType<any>, keys: FilterKeys | undefined) =>
  // Menu / tree options are matched by their string value; custom dropdowns keep raw keys.
  column.filterDropdown === undefined && keys ? keys.map(String) : keys;

/**
 * Filter states of every filterable column (antd `collectFilterStates`). A column with
 * `filteredValue` reports it; others start from `defaultFilteredValue` when `init`.
 */
export const collectFilterStates = <T>(
  columns: readonly TableColumn<T>[],
  init: boolean,
): FilterState<T>[] =>
  flattenColumns(columns).flatMap(({ column, id }) => {
    const col = column as TableColumnType<T>;
    if (!isFilterable(col)) return [];
    const filteredKeys =
      'filteredValue' in col
        ? toKeys(col, col.filteredValue)
        : init && col.defaultFilteredValue
          ? toKeys(col, col.defaultFilteredValue)
          : undefined;
    return [{ column: col, filteredKeys, forceFiltered: col.filtered, key: id }];
  });

/**
 * Controlled when any column passes a defined `filteredValue`; otherwise the inner keys apply.
 */
export const mergeFilterStates = <T>(
  columns: readonly TableColumn<T>[],
  inner: FiltersState,
): FilterState<T>[] => {
  const collected = collectFilterStates(columns, false);
  const controlled = collected.some(({ filteredKeys }) => filteredKeys !== undefined);
  return controlled
    ? collected
    : collected.map((state) => ({ ...state, filteredKeys: inner[state.key] }));
};

/** The `filters` argument of `onChange`, with option values restored to their original type. */
export const getFilterInfo = (states: readonly FilterState<any>[]): TableFilters =>
  Object.fromEntries(
    states.map(({ column, filteredKeys, key }) => {
      if (column.filterDropdown) return [key, (filteredKeys as FilterValue[]) || null];
      if (!Array.isArray(filteredKeys)) return [key, null];
      const selected = new Set(filteredKeys.map(String));
      return [
        key,
        flattenFilterKeys(column.filters).filter((value) => selected.has(String(value))),
      ];
    }),
  );

/**
 * Keeps records that match any applied key of every active column filter (antd `getFilterData`).
 * Tree children (`childrenColumnName`) are filtered recursively before their parent is tested.
 */
export const filterData = <T>(
  data: readonly T[],
  states: readonly FilterState<T>[],
  childrenColumnName = 'children',
): T[] =>
  states.reduce<T[]>(
    (current, { column: { filters, onFilter }, filteredKeys }) => {
      if (!onFilter || !filteredKeys?.length) return current;

      const valueOf = new Map<string, FilterValue>();
      for (const value of flattenFilterKeys(filters)) {
        if (!valueOf.has(String(value))) valueOf.set(String(value), value);
      }
      const values = filteredKeys.map((key) => valueOf.get(String(key)) ?? (key as FilterValue));

      return current.flatMap((record) => {
        const children = (record as Record<string, unknown>)[childrenColumnName];
        const next = Array.isArray(children)
          ? {
              ...record,
              [childrenColumnName]: filterData(children as T[], states, childrenColumnName),
            }
          : record;
        return values.some((value) => onFilter(value, next)) ? [next] : [];
      });
    },
    [...data],
  );

export const useFilter = <T>({
  childrenColumnName,
  data,
  states,
}: {
  childrenColumnName?: string;
  data: readonly T[];
  states: readonly FilterState<T>[];
}) =>
  useMemo(() => filterData(data, states, childrenColumnName), [data, states, childrenColumnName]);
