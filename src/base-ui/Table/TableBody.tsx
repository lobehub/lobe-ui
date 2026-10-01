'use client';

import { cx } from 'antd-style';
import type { CSSProperties, Key, ReactNode } from 'react';

import Spin from '@/base-ui/Spin';
import Empty from '@/Empty';

import { styles } from './style';
import { getCellValue } from './toColumnDefs';
import type { TableColumn, TableProps } from './type';

interface TableBodyProps<T> {
  classNames?: TableProps<T>['classNames'];
  columnIds: string[];
  columns: TableColumn<T>[];
  emptyText?: ReactNode;
  fixedOffsets: (CSSProperties | undefined)[];
  loading: boolean;
  onRow?: TableProps<T>['onRow'];
  rowClassName?: TableProps<T>['rowClassName'];
  rows: { id: Key; original: T }[];
  styles?: TableProps<T>['styles'];
}

const TableBody = <T,>({
  classNames,
  columnIds,
  columns,
  emptyText,
  fixedOffsets,
  loading,
  onRow,
  rowClassName,
  rows,
  styles: customStyles,
}: TableBodyProps<T>) => {
  if (rows.length === 0) {
    return (
      <tbody className={classNames?.body} style={customStyles?.body}>
        <tr>
          <td className={styles.empty} colSpan={columns.length}>
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
            style={{ ...customStyles?.row, ...rowProps.style }}
            className={cx(
              styles.row,
              rowProps.onClick && styles.clickable,
              extraClassName,
              classNames?.row,
              rowProps.className,
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
                  className={cx(
                    styles.cell,
                    column.ellipsis && styles.ellipsis,
                    column.fixed && styles.fixed,
                    column.className,
                    classNames?.cell,
                    cellProps.className,
                  )}
                  style={{
                    textAlign: column.align,
                    width: column.width,
                    ...fixedOffsets[columnIndex],
                    ...customStyles?.cell,
                    ...cellProps.style,
                  }}
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
