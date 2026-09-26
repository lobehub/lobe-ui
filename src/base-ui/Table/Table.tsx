'use client';

import { type RowData, useTable } from '@tanstack/react-table';
import { cx } from 'antd-style';
import { type Key, memo, type ReactNode, useEffect, useMemo } from 'react';

import Pagination from '@/base-ui/Pagination';
import Spin from '@/base-ui/Spin';

import { tableFeatureSet } from './features';
import FilterMenu from './FilterMenu';
import { getFixedOffsets } from './fixedOffsets';
import { styles } from './style';
import TableBody from './TableBody';
import TableHead from './TableHead';
import { toColumnDefs } from './toColumnDefs';
import type { FilterValue, TableColumn, TableProps } from './type';
import { useTableState } from './useTableState';

const EMPTY_DATA: any[] = [];

export interface TableInternalProps<T> extends TableProps<T> {
  renderFilter?: (column: TableColumn<T>, id: string, table: any) => ReactNode;
}

const TableInner = <T extends RowData>(props: TableInternalProps<T>) => {
  const {
    bordered = false,
    className,
    classNames,
    columns,
    dataSource = EMPTY_DATA as T[],
    emptyText,
    loading = false,
    onChange,
    onRow,
    pagination,
    ref,
    renderFilter,
    rowClassName,
    rowKey,
    scroll,
    size = 'middle',
    style,
    styles: customStyles,
    tableLayout,
  } = props;

  const state = useTableState({ columns, onChange, pagination });
  const columnDefs = useMemo(() => toColumnDefs(columns), [columns]);
  const fixedOffsets = useMemo(() => getFixedOffsets(columns), [columns]);

  const table = useTable({
    autoResetPageIndex: false,
    columns: columnDefs,
    data: dataSource,
    enableSortingRemoval: true,
    features: tableFeatureSet,
    getRowId: (record: T) =>
      String(typeof rowKey === 'function' ? rowKey(record) : (record[rowKey] as Key)),
    manualPagination: state.manualPagination,
    manualSorting: state.manualSorting,
    onColumnFiltersChange: state.onColumnFiltersChange,
    onPaginationChange: state.onPaginationChange,
    onSortingChange: state.onSortingChange,
    rowCount: state.config?.total,
    state: {
      columnFilters: state.columnFilters,
      pagination: state.page,
      sorting: state.sorting,
    },
  } as any);

  const total = state.config?.total ?? table.getPrePaginatedRowModel().rows.length;
  const pageCount = Math.max(1, Math.ceil(total / state.page.pageSize));
  const { page, setInnerPage } = state;
  const clientPaginated = pagination !== false && state.config?.total === undefined;

  useEffect(() => {
    if (!clientPaginated) return;
    if (page.pageIndex >= pageCount) setInnerPage({ ...page, pageIndex: pageCount - 1 });
  }, [clientPaginated, pageCount, page, setInnerPage]);

  const rows = table.getRowModel().rows as unknown as { id: Key; original: T }[];
  const minWidth = scroll?.x === 'max-content' ? undefined : scroll?.x;

  return (
    <div className={cx(styles.root, className)} ref={ref} style={style}>
      <div
        className={cx(styles.wrapper, bordered && styles.bordered, classNames?.wrapper)}
        data-table-wrapper=""
        style={{ maxHeight: scroll?.y, ...customStyles?.wrapper }}
      >
        <table
          className={cx(styles.table, size === 'small' ? styles.small : styles.middle)}
          style={{
            minWidth,
            tableLayout,
            width: scroll?.x === 'max-content' ? 'max-content' : '100%',
          }}
        >
          <TableHead
            classNames={classNames}
            columnIds={state.columnIds}
            columns={columns}
            fixedOffsets={fixedOffsets}
            getColumn={(id) => table.getColumn(id) as any}
            styles={customStyles}
            renderFilter={(column, id) => {
              if (renderFilter) return renderFilter(column, id, table);
              const tableColumn = table.getColumn(id) as any;
              const value = (tableColumn?.getFilterValue() as FilterValue[] | undefined) ?? [];
              return (
                <FilterMenu
                  filters={column.filters ?? []}
                  label={typeof column.title === 'string' ? column.title : id}
                  value={value}
                  onChange={(next) =>
                    tableColumn?.setFilterValue(next.length > 0 ? next : undefined)
                  }
                />
              );
            }}
          />
          <TableBody
            classNames={classNames}
            columnIds={state.columnIds}
            columns={columns}
            emptyText={emptyText}
            fixedOffsets={fixedOffsets}
            loading={loading}
            rowClassName={rowClassName}
            rows={rows}
            styles={customStyles}
            onRow={onRow}
          />
        </table>
        {loading && rows.length > 0 && (
          <div className={styles.loading} data-table-loading="">
            <Spin />
          </div>
        )}
      </div>
      {pagination !== false && total > 0 && (
        <div className={styles.pagination}>
          <Pagination
            current={Math.min(page.pageIndex, pageCount - 1) + 1}
            pageSize={page.pageSize}
            pageSizeOptions={state.config?.pageSizeOptions}
            showSizeChanger={state.config?.showSizeChanger}
            total={total}
            onChange={(next, pageSize) =>
              state.onPaginationChange({ pageIndex: next - 1, pageSize })
            }
            onPageSizeChange={(current, pageSize) =>
              state.onPaginationChange({ pageIndex: current - 1, pageSize })
            }
          />
        </div>
      )}
    </div>
  );
};

const Table = memo(TableInner) as unknown as (<T extends RowData>(
  props: TableProps<T>,
) => ReactNode) & {
  displayName?: string;
};

Table.displayName = 'Table';

export { TableInner };

export default Table;
