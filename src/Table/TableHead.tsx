'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

import Icon from '@/Icon';
import { styleProps } from '@/styles/stylex/props';

import { cellSizeStyles, sortButtonStyles, styles } from './style';
import type { TableColumn, TableProps } from './type';

type SortState = false | 'asc' | 'desc';

interface HeadColumn {
  getIsSorted: () => SortState;
  getToggleSortingHandler: () => undefined | ((event: unknown) => void);
}

interface TableHeadProps<T> {
  bordered: boolean;
  classNames?: TableProps<T>['classNames'];
  columnIds: string[];
  columns: TableColumn<T>[];
  fixedOffsets: (CSSProperties | undefined)[];
  getColumn: (id: string) => HeadColumn | undefined;
  renderFilter?: (column: TableColumn<T>, id: string) => ReactNode;
  size: NonNullable<TableProps<T>['size']>;
  styles?: TableProps<T>['styles'];
}

const ariaSortOf = (sorted: SortState) =>
  sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none';

const TableHead = <T,>({
  bordered,
  classNames,
  columnIds,
  columns,
  fixedOffsets,
  getColumn,
  renderFilter,
  size,
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
            {...styleProps(
              [
                styles.header,
                column.fixed && styles.fixed,
                cellSizeStyles[size],
                bordered && index < columns.length - 1 && styles.borderedCell,
              ],
              clsx(column.className, classNames?.header),
              {
                textAlign: column.align,
                width: column.width,
                ...fixedOffsets[index],
                ...customStyles?.header,
                ...(column.fixed ? { zIndex: 3 } : undefined),
              },
            )}
          >
            <span {...stylex.props(styles.headerInner)}>
              {column.sorter ? (
                <button
                  type="button"
                  {...stylex.props(sortButtonStyles)}
                  onClick={tableColumn?.getToggleSortingHandler()}
                >
                  {column.title}
                  <span aria-hidden="true" {...stylex.props(styles.sortCaret)}>
                    <Icon
                      className={stylex.props(sorted === 'asc' && styles.caretActive).className}
                      data-active={sorted === 'asc'}
                      icon={ChevronUp}
                      size={10}
                    />
                    <Icon
                      className={stylex.props(sorted === 'desc' && styles.caretActive).className}
                      data-active={sorted === 'desc'}
                      icon={ChevronDown}
                      size={10}
                    />
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
