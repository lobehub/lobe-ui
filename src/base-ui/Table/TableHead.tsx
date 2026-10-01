'use client';

import { cx } from 'antd-style';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

import Icon from '@/Icon';

import { styles } from './style';
import type { TableColumn, TableProps } from './type';

type SortState = false | 'asc' | 'desc';

interface HeadColumn {
  getIsSorted: () => SortState;
  getToggleSortingHandler: () => undefined | ((event: unknown) => void);
}

interface TableHeadProps<T> {
  classNames?: TableProps<T>['classNames'];
  columnIds: string[];
  columns: TableColumn<T>[];
  fixedOffsets: (CSSProperties | undefined)[];
  getColumn: (id: string) => HeadColumn | undefined;
  renderFilter?: (column: TableColumn<T>, id: string) => ReactNode;
  styles?: TableProps<T>['styles'];
}

const ariaSortOf = (sorted: SortState) =>
  sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none';

const TableHead = <T,>({
  classNames,
  columnIds,
  columns,
  fixedOffsets,
  getColumn,
  renderFilter,
  styles: customStyles,
}: TableHeadProps<T>) => (
  <thead>
    <tr>
      {columns.map((column, index) => {
        const id = columnIds[index];
        const tableColumn = getColumn(id);
        const sorted: SortState = column.sorter ? (tableColumn?.getIsSorted() ?? false) : false;

        return (
          <th
            aria-sort={column.sorter ? ariaSortOf(sorted) : undefined}
            key={id}
            scope="col"
            className={cx(
              styles.header,
              column.fixed && styles.fixed,
              column.className,
              classNames?.header,
            )}
            style={{
              textAlign: column.align,
              width: column.width,
              ...fixedOffsets[index],
              ...customStyles?.header,
              ...(column.fixed ? { zIndex: 3 } : undefined),
            }}
          >
            <span className={styles.headerInner}>
              {column.sorter ? (
                <button
                  className={styles.sortButton}
                  type="button"
                  onClick={tableColumn?.getToggleSortingHandler()}
                >
                  {column.title}
                  <span aria-hidden="true" className={styles.sortCaret}>
                    <Icon data-active={sorted === 'asc'} icon={ChevronUp} size={10} />
                    <Icon data-active={sorted === 'desc'} icon={ChevronDown} size={10} />
                  </span>
                </button>
              ) : (
                column.title
              )}
              {column.filters?.length ? renderFilter?.(column, id) : null}
            </span>
          </th>
        );
      })}
    </tr>
  </thead>
);

export default TableHead;
