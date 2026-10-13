import { useMemo, useState } from 'react';

import type {
  TableColumn,
  TableColumnTitleProps,
  TableCurrentDataSource,
  TablePaginationConfig,
  TableProps,
} from './type';
import {
  collectFilterStates,
  filterData,
  type FilterKeys,
  type FiltersState,
  type FilterState,
  getFilterInfo,
  mergeFilterStates,
  useFilter,
} from './useFilter';
import {
  collectSortStates,
  getSorterInfo,
  getSortTitleProps,
  getTriggeredSortStates,
  mergeSortStates,
  sortData,
  type SortState,
  useSorter,
} from './useSorter';

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export const DEFAULT_PAGE_SIZE = 10;

type ChangeAction = TableCurrentDataSource<unknown>['action'];

export const useTableState = <T>({
  childrenColumnName,
  columns,
  dataSource,
  onChange,
  onTableChange,
  pagination,
}: Pick<TableProps<T>, 'onChange' | 'pagination'> & {
  childrenColumnName?: string;
  columns: readonly TableColumn<T>[];
  dataSource: readonly T[];
  /** Runs before `onChange` on every paginate / sort / filter (scroll back to the first row). */
  onTableChange?: () => void;
}) => {
  const config: TablePaginationConfig | undefined =
    pagination === false ? undefined : (pagination ?? {});

  const [innerSortStates, setInnerSortStates] = useState<SortState<T>[]>(() =>
    collectSortStates(columns, true),
  );
  const sortStates = useMemo(
    () => mergeSortStates(columns, innerSortStates),
    [columns, innerSortStates],
  );
  const [innerFilterKeys, setInnerFilterKeys] = useState<FiltersState>(() =>
    Object.fromEntries(
      collectFilterStates(columns, true).map(({ filteredKeys, key }) => [key, filteredKeys]),
    ),
  );
  const filterStates = useMemo(
    () => mergeFilterStates(columns, innerFilterKeys),
    [columns, innerFilterKeys],
  );
  const filters = useMemo(() => getFilterInfo(filterStates), [filterStates]);

  // ============================== Data ==============================
  const filtered = useFilter({ childrenColumnName, data: dataSource, states: filterStates });
  /** Filtered and sorted records of every page (antd `mergedData`). */
  const data = useSorter({ childrenColumnName, data: filtered, sortStates });
  const getCurrentDataSource = (
    nextFilterStates: readonly FilterState<T>[],
    nextSortStates: readonly SortState<T>[],
  ) =>
    sortData(
      filterData(dataSource, nextFilterStates, childrenColumnName),
      nextSortStates,
      childrenColumnName,
    );

  // =========================== Pagination ===========================
  const [innerPage, setInnerPage] = useState<PaginationState>({
    pageIndex: (config?.defaultCurrent ?? 1) - 1,
    pageSize: config?.defaultPageSize ?? DEFAULT_PAGE_SIZE,
  });

  const pageSize = config?.pageSize ?? innerPage.pageSize;
  // Like antd: a positive `pagination.total` wins over the local data length.
  const total = config?.total && config.total > 0 ? config.total : data.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const rawPageIndex = config?.current === undefined ? innerPage.pageIndex : config.current - 1;
  const page: PaginationState = { pageIndex: Math.min(rawPageIndex, pageCount - 1), pageSize };

  /** The `pagination` argument of `onChange` (antd `getPaginationParam`): no callbacks. */
  const toPaginationArg = (next: PaginationState): TablePaginationConfig => {
    if (!config) return {};
    const merged: Record<string, unknown> = {
      ...config,
      current: next.pageIndex + 1,
      pageSize: next.pageSize,
      total,
    };
    const arg: Record<string, unknown> = { current: merged.current, pageSize: merged.pageSize };
    for (const key of Object.keys(config)) {
      if (typeof merged[key] !== 'function') arg[key] = merged[key];
    }
    return arg as TablePaginationConfig;
  };

  const report = (
    action: ChangeAction,
    nextPage: PaginationState,
    nextFilterStates: readonly FilterState<T>[],
    nextSortStates: readonly SortState<T>[],
  ) => {
    onTableChange?.();
    onChange?.(
      toPaginationArg(nextPage),
      getFilterInfo(nextFilterStates),
      getSorterInfo(nextSortStates),
      { action, currentDataSource: getCurrentDataSource(nextFilterStates, nextSortStates) },
    );
  };

  const changePage = (next: PaginationState) => {
    setInnerPage(next);
    const sizeChanged = next.pageSize !== page.pageSize;
    if (sizeChanged) config?.onShowSizeChange?.(next.pageIndex + 1, next.pageSize);
    if (sizeChanged || next.pageIndex !== page.pageIndex) {
      config?.onChange?.(next.pageIndex + 1, next.pageSize);
    }
  };

  const clampPage = (pageIndex: number) => {
    if (config?.current === undefined) {
      setInnerPage((previous) => ({ ...previous, pageIndex }));
      return;
    }
    config.onChange?.(pageIndex + 1, page.pageSize);
  };

  /** Applies a header click (antd `triggerSorter`); like antd, the current page is kept. */
  const triggerSort = (next: SortState<T>) => {
    const nextStates = getTriggeredSortStates(sortStates, next);
    setInnerSortStates(nextStates);
    report('sort', page, filterStates, nextStates);
  };

  /**
   * Applies a column's filter (antd `triggerFilter`); like antd, it returns to the first page and
   * always tells `pagination.onChange`.
   */
  const triggerFilter = (columnKey: string, filteredKeys: FilterKeys) => {
    const nextStates = filterStates.map((item) =>
      item.key === columnKey ? { ...item, filteredKeys } : item,
    );
    const firstPage = { ...page, pageIndex: 0 };
    setInnerFilterKeys(
      Object.fromEntries(nextStates.map(({ filteredKeys, key }) => [key, filteredKeys])),
    );
    setInnerPage(firstPage);
    if (pagination) pagination.onChange?.(1, firstPage.pageSize);
    report('filter', firstPage, nextStates, sortStates);
  };

  /** Argument of function column titles (antd `ColumnTitleProps`). */
  const titleProps = useMemo(
    (): TableColumnTitleProps<T> => ({
      filters,
      ...getSortTitleProps(sortStates),
    }),
    [filters, sortStates],
  );

  const onPaginationChange = (next: PaginationState) => {
    changePage(next);
    report('paginate', next, filterStates, sortStates);
  };

  return {
    clampPage,
    config,
    data,
    filterStates,
    filters,
    onPaginationChange,
    page,
    rawPageIndex,
    sortStates,
    titleProps,
    total,
    triggerFilter,
    triggerSort,
  };
};
