import type { ColumnDef, RowData } from '@tanstack/react-table';

import type { TableFeatureSet } from './features';
import type { FilterValue, TableColumn } from './type';

export const getColumnId = (column: TableColumn<any>, index: number): string =>
  String(column.key ?? column.dataIndex ?? `__column_${index}`);

export const getCellValue = <T>(record: T, column: TableColumn<T>): unknown =>
  column.dataIndex ? record[column.dataIndex] : undefined;

const isEmptyFilter = (value: unknown) => !Array.isArray(value) || value.length === 0;

export const toColumnDefs = <T extends RowData>(
  columns: TableColumn<T>[],
): ColumnDef<TableFeatureSet, T, unknown>[] =>
  columns.map((column, index) => {
    const needsStableId = Boolean(column.sorter) || Boolean(column.filters?.length);
    if (needsStableId && column.key == null && column.dataIndex == null) {
      throw new Error('[Table] sortable or filterable columns need a `key` or `dataIndex`');
    }

    const comparator = typeof column.sorter === 'function' ? column.sorter : undefined;
    const { onFilter } = column;

    const filterFn = onFilter
      ? Object.assign(
          (row: { original: T }, _columnId: string, filterValue: FilterValue[]) =>
            filterValue.some((value) => onFilter(value, row.original)),
          { autoRemove: isEmptyFilter },
        )
      : undefined;

    return {
      accessorFn: (record: T) => getCellValue(record, column),
      enableColumnFilter: Boolean(column.filters?.length),
      enableSorting: Boolean(column.sorter),
      filterFn,
      id: getColumnId(column, index),
      sortDescFirst: column.sortDirections?.[0] === 'descend',
      ...(comparator && {
        sortFn: (rowA: { original: T }, rowB: { original: T }) =>
          comparator(rowA.original, rowB.original),
        sortUndefined: false,
      }),
    } as unknown as ColumnDef<TableFeatureSet, T, unknown>;
  });
