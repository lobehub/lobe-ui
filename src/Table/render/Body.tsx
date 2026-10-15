'use client';

import clsx from 'clsx';
import { type Key, memo, type MouseEvent, type ReactNode, useLayoutEffect, useRef } from 'react';

import { TableBody, TableExpandedRow, TableRow } from '../atoms';
import type { RowModel } from '../engine/types';
import { useRowExpanded, useRowSelected } from '../store/hooks';
import type { TableRowClassName } from '../type';
import { BodyCell } from './BodyCell';
import { MeasureRowContext, useTableView, VirtualCellContext } from './context';
import { HeaderTitle } from './Header';

export const computeExpandedClassName = <T,>(
  className: string | TableRowClassName<T> | undefined,
  record: T,
  index: number,
  indent: number,
) => (typeof className === 'function' ? className(record, index, indent) : (className ?? ''));

export interface BodyRowExtra {
  getHeight: (rowSpan: number) => number;
  top: number;
}

export interface BodyRowProps<T> {
  depth: number;
  extra?: BodyRowExtra;
  hasChildren: boolean;
  index: number;
  record: T;
  renderIndex: number;
  rowKey: Key;
}

const BodyRowInner = <T,>({
  depth,
  extra,
  hasChildren,
  index,
  record,
  renderIndex,
  rowKey,
}: BodyRowProps<T>) => {
  const view = useTableView<T>();
  const selected = useRowSelected(rowKey);
  const expanded = useRowExpanded(rowKey);
  const expandedOnce = useRef(false);
  expandedOnce.current ||= expanded;

  const {
    components,
    expand,
    fixColumn,
    leafColumns,
    onRow,
    prefixCls,
    rowClassName,
    semanticClassNames,
    semanticStyles,
  } = view;
  const rowSupportExpand =
    expand.type === 'row' && (!expand.rowExpandable || expand.rowExpandable(record));
  const mergedExpandable = rowSupportExpand || expand.type === 'nest';
  const rowProps = onRow?.(record, index) ?? {};
  const onClick = (event: MouseEvent<HTMLTableRowElement>) => {
    if (expand.expandRowByClick && mergedExpandable) expand.toggle(record, event);
    rowProps.onClick?.(event);
  };
  const computedClassName =
    typeof rowClassName === 'function' ? rowClassName(record, index, depth) : rowClassName;
  const expandedClassName = computeExpandedClassName(
    expand.expandedRowClassName,
    record,
    index,
    depth,
  );

  let expandedRow: ReactNode = null;
  if (!extra && rowSupportExpand && (expand.forceRender || expandedOnce.current || expanded)) {
    expandedRow = (
      <TableExpandedRow
        cellComponent={components.bodyCell}
        colSpan={leafColumns.length}
        component={components.bodyRow}
        expanded={expanded}
        fixed={fixColumn}
        className={clsx(
          `${prefixCls}-expanded-row`,
          `${prefixCls}-expanded-row-level-${depth + 1}`,
          expandedClassName,
        )}
      >
        {expand.expandedRowRender?.(record, index, depth + 1, expanded)}
      </TableExpandedRow>
    );
  }

  const cells = leafColumns.map((leaf, colIndex) => (
    <BodyCell
      colIndex={colIndex}
      depth={depth}
      hasChildren={hasChildren}
      index={index}
      key={leaf.key}
      leaf={leaf}
      record={record}
      renderIndex={renderIndex}
      rowKey={rowKey}
      withNestIcon={expand.type === 'nest' && colIndex === expand.nestIconColumnIndex}
    />
  ));

  return (
    <>
      <TableRow
        {...rowProps}
        component={components.bodyRow}
        data-row-key={extra ? undefined : rowKey}
        level={depth}
        selected={selected}
        className={clsx(
          computedClassName,
          rowProps.className,
          rowProps.onClick && `${prefixCls}-row-clickable`,
          semanticClassNames.body.row,
          depth >= 1 && expandedClassName,
          extra && `${prefixCls}-row-extra`,
        )}
        style={{
          ...rowProps.style,
          ...semanticStyles.body.row,
          ...(extra && { pointerEvents: 'none', position: 'absolute', top: extra.top }),
        }}
        onClick={onClick}
      >
        {extra ? (
          <VirtualCellContext value={{ getHeight: extra.getHeight, inverse: true }}>
            {cells}
          </VirtualCellContext>
        ) : (
          cells
        )}
      </TableRow>
      {expandedRow}
    </>
  );
};

export const BodyRow = memo(BodyRowInner) as typeof BodyRowInner;

const MeasureCell = ({
  children,
  columnKey,
  onResize,
}: {
  children: ReactNode;
  columnKey: string;
  onResize: (key: string, width: number) => void;
}) => {
  const ref = useRef<HTMLTableCellElement>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    onResize(columnKey, element.offsetWidth);
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      if (element.offsetParent !== null) onResize(columnKey, element.offsetWidth);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [columnKey, onResize]);
  return (
    <td
      ref={ref}
      style={{ borderBottom: 0, borderTop: 0, height: 0, paddingBottom: 0, paddingTop: 0 }}
    >
      <div style={{ fontWeight: 'bold', height: 0, overflow: 'hidden' }}>{children}</div>
    </td>
  );
};

export const MeasureRow = ({ onResize }: { onResize: (key: string, width: number) => void }) => {
  const { leafColumns, prefixCls } = useTableView();
  return (
    <MeasureRowContext value={true}>
      <tr aria-hidden="true" className={`${prefixCls}-measure-row`} style={{ height: 0 }}>
        {leafColumns.map((leaf) => (
          <MeasureCell columnKey={leaf.key} key={leaf.key} onResize={onResize}>
            <HeaderTitle source={leaf.column.source} />
          </MeasureCell>
        ))}
      </tr>
    </MeasureRowContext>
  );
};

export interface BodyProps<T> {
  emptyNode: ReactNode;
  measure: boolean;
  onColumnResize: (key: string, width: number) => void;
  rows: readonly RowModel<T>[];
}

export const Body = <T,>({ emptyNode, measure, onColumnResize, rows }: BodyProps<T>) => {
  const { components, horizonScroll, leafColumns, prefixCls, semanticClassNames, semanticStyles } =
    useTableView<T>();
  return (
    <TableBody
      className={semanticClassNames.body.wrapper}
      component={components.bodyWrapper}
      style={semanticStyles.body.wrapper}
    >
      {measure && <MeasureRow onResize={onColumnResize} />}
      {rows.length > 0 ? (
        rows.map((row) => (
          <BodyRow
            depth={row.depth}
            hasChildren={row.hasChildren}
            index={row.index}
            key={row.key}
            record={row.record}
            renderIndex={row.renderIndex}
            rowKey={row.key}
          />
        ))
      ) : (
        <TableExpandedRow
          className={`${prefixCls}-placeholder`}
          colSpan={leafColumns.length}
          component={components.bodyRow}
          fixed={horizonScroll}
        >
          {emptyNode}
        </TableExpandedRow>
      )}
    </TableBody>
  );
};
