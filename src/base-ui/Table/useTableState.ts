import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/react-table';
import { useState } from 'react';

import { getColumnId } from './toColumnDefs';
import type {
  TableColumn,
  TableFilters,
  TablePaginationConfig,
  TableProps,
  TableSorterResult,
} from './type';

const resolve = <S>(updater: Updater<S>, previous: S): S =>
  typeof updater === 'function' ? (updater as (old: S) => S)(previous) : updater;

const initialSorting = (columns: TableColumn<any>[]): SortingState => {
  const index = columns.findIndex((column) => column.defaultSortOrder);
  if (index === -1) return [];
  return [
    { desc: columns[index].defaultSortOrder === 'descend', id: getColumnId(columns[index], index) },
  ];
};

export const useTableState = <T>({
  columns,
  onChange,
  pagination,
}: Pick<TableProps<T>, 'columns' | 'onChange' | 'pagination'>) => {
  const config: TablePaginationConfig | undefined =
    pagination === false ? undefined : (pagination ?? {});
  const columnIds = columns.map((column, index) => getColumnId(column, index));

  const [sorting, setSorting] = useState<SortingState>(() => initialSorting(columns));
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [innerPage, setInnerPage] = useState<PaginationState>({
    pageIndex: (config?.defaultCurrent ?? 1) - 1,
    pageSize: config?.defaultPageSize ?? 10,
  });

  const page: PaginationState = {
    pageIndex: config?.current === undefined ? innerPage.pageIndex : config.current - 1,
    pageSize: config?.pageSize ?? innerPage.pageSize,
  };

  const toFilters = (state: ColumnFiltersState): TableFilters =>
    Object.fromEntries(
      columns
        .map((column, index) => [column, columnIds[index]] as const)
        .filter(([column]) => column.filters?.length)
        .map(([, id]) => [
          id,
          (state.find((filter) => filter.id === id)?.value as TableFilters[string]) ?? null,
        ]),
    );

  const toSorter = (state: SortingState): TableSorterResult<T> => {
    const [active] = state;
    if (!active) return {};
    const index = columnIds.indexOf(active.id);
    return {
      column: columns[index],
      columnKey: active.id,
      order: active.desc ? 'descend' : 'ascend',
    };
  };

  const toPaginationArg = (next: PaginationState): TablePaginationConfig =>
    config ? { ...config, current: next.pageIndex + 1, pageSize: next.pageSize } : {};

  const report = (
    nextPage: PaginationState,
    nextFilters: ColumnFiltersState,
    nextSorting: SortingState,
  ) => onChange?.(toPaginationArg(nextPage), toFilters(nextFilters), toSorter(nextSorting));

  const changePage = (next: PaginationState) => {
    setInnerPage(next);
    if (next.pageIndex !== page.pageIndex) config?.onChange?.(next.pageIndex + 1, next.pageSize);
    if (next.pageSize !== page.pageSize) {
      config?.onShowSizeChange?.(next.pageIndex + 1, next.pageSize);
      config?.onChange?.(next.pageIndex + 1, next.pageSize);
    }
  };

  const onSortingChange = (updater: Updater<SortingState>) => {
    const next = resolve(updater, sorting);
    const firstPage = { ...page, pageIndex: 0 };
    setSorting(next);
    changePage(firstPage);
    report(firstPage, columnFilters, next);
  };

  const onColumnFiltersChange = (updater: Updater<ColumnFiltersState>) => {
    const next = resolve(updater, columnFilters);
    const firstPage = { ...page, pageIndex: 0 };
    setColumnFilters(next);
    changePage(firstPage);
    report(firstPage, next, sorting);
  };

  const onPaginationChange = (updater: Updater<PaginationState>) => {
    const next = resolve(updater, page);
    changePage(next);
    report(next, columnFilters, sorting);
  };

  return {
    columnFilters,
    columnIds,
    config,
    manualPagination: pagination === false || config?.total !== undefined,
    manualSorting: columns.some((column) => column.sorter === true),
    onColumnFiltersChange,
    onPaginationChange,
    onSortingChange,
    page,
    setInnerPage,
    sorting,
  };
};
