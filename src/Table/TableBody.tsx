'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import type { CSSProperties, Key, ReactNode } from 'react';

import Empty from '@/Empty';
import Spin from '@/Spin';
import { styleProps } from '@/styles/stylex/props';

import { tableRowMarker } from './marker.stylex';
import { cellSizeStyles, styles } from './style';
import { getCellValue } from './toColumnDefs';
import type { TableColumn, TableProps } from './type';

interface TableBodyProps<T> {
  bordered: boolean;
  classNames?: TableProps<T>['classNames'];
  columnIds: string[];
  columns: TableColumn<T>[];
  emptyText?: ReactNode;
  fixedOffsets: (CSSProperties | undefined)[];
  loading: boolean;
  onRow?: TableProps<T>['onRow'];
  rowClassName?: TableProps<T>['rowClassName'];
  rows: { id: Key; original: T }[];
  size: NonNullable<TableProps<T>['size']>;
  styles?: TableProps<T>['styles'];
}

const TableBody = <T,>({
  bordered,
  classNames,
  columnIds,
  columns,
  emptyText,
  fixedOffsets,
  loading,
  onRow,
  rowClassName,
  rows,
  size,
  styles: customStyles,
}: TableBodyProps<T>) => {
  if (rows.length === 0) {
    return (
      <tbody className={classNames?.body} style={customStyles?.body}>
        <tr>
          <td colSpan={columns.length} {...stylex.props(styles.empty, cellSizeStyles[size])}>
            {loading ? <Spin /> : (emptyText ?? <Empty description="No data" />)}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className={classNames?.body} style={customStyles?.body}>
      {rows.map((row, rowIndex) => {
        const record = row.original;
        const rowProps = onRow?.(record, rowIndex) ?? {};
        const extraClassName =
          typeof rowClassName === 'function' ? rowClassName(record, rowIndex) : rowClassName;

        return (
          <tr
            {...rowProps}
            key={row.id}
            {...styleProps(
              [tableRowMarker, rowProps.onClick && styles.clickable],
              clsx(extraClassName, classNames?.row, rowProps.className),
              { ...customStyles?.row, ...rowProps.style },
            )}
          >
            {columns.map((column, columnIndex) => {
              const value = getCellValue(record, column);
              const cellProps = column.onCell?.(record, rowIndex) ?? {};
              const content = column.render
                ? column.render(value, record, rowIndex)
                : (value as ReactNode);

              return (
                <td
                  {...cellProps}
                  key={columnIds[columnIndex]}
                  title={column.ellipsis && typeof content === 'string' ? content : cellProps.title}
                  {...styleProps(
                    [
                      styles.cell,
                      column.ellipsis && styles.ellipsis,
                      column.fixed && styles.fixed,
                      cellSizeStyles[size],
                      bordered && columnIndex < columns.length - 1 && styles.borderedCell,
                      rowIndex === rows.length - 1 && styles.cellLastRow,
                    ],
                    clsx(column.className, classNames?.cell, cellProps.className),
                    {
                      textAlign: column.align,
                      width: column.width,
                      ...fixedOffsets[columnIndex],
                      ...customStyles?.cell,
                      ...cellProps.style,
                    },
                  )}
                >
                  {content}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
};

export default TableBody;
