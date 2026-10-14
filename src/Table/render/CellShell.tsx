'use client';

import clsx from 'clsx';
import {
  type CSSProperties,
  isValidElement,
  type Key,
  type MouseEvent,
  type ReactNode,
  use,
} from 'react';

import { TableCell } from '../atoms';
import type { LeafColumnModel } from '../engine/types';
import type { ColumnSource } from '../pipeline/normalizeColumns';
import { useCellHovered, useColumnSorted, useTableStoreInstance } from '../store/hooks';
import type { TableCellAttributes, TableColumnType, TableRenderedCell } from '../type';
import { useTableView, VirtualCellContext } from './context';

export interface BodyCellProps<T> {
  colIndex: number;
  depth: number;
  hasChildren: boolean;
  index: number;
  leaf: LeafColumnModel<ColumnSource<T>>;
  record: T;
  renderIndex: number;
  rowKey: Key;
  withNestIcon: boolean;
}

const NO_HOVER = [-1, -1] as const;

export const isRenderedCell = (value: unknown): value is TableRenderedCell =>
  typeof value === 'object' && value !== null && !Array.isArray(value) && !isValidElement(value);

export interface CellShellProps<T> {
  appendNode?: ReactNode;
  children: ReactNode;
  className?: string;
  index: number;
  leaf: LeafColumnModel<ColumnSource<T>>;
  legacyCellProps?: TableCellAttributes;
  record: T;
}

export const CellShell = <T,>({
  appendNode,
  children,
  className,
  index,
  leaf,
  legacyCellProps,
  record,
}: CellShellProps<T>) => {
  const view = useTableView<T>();
  const store = useTableStoreInstance();
  const column = leaf.column.source.column as TableColumnType<T>;
  const sorted = useColumnSorted(leaf.column.source.id);
  const additional: TableCellAttributes = { ...column.onCell?.(record, index) };

  const colSpan = legacyCellProps?.colSpan ?? additional.colSpan ?? 1;
  const rowSpan = legacyCellProps?.rowSpan ?? additional.rowSpan ?? 1;
  const hoverSpan = legacyCellProps?.rowSpan ?? rowSpan;
  const hovered = useCellHovered(index, hoverSpan);
  const { getHeight, inverse } = use(VirtualCellContext);
  const { components, prefixCls, rowHoverable, semanticClassNames, semanticStyles, virtualWidths } =
    view;

  const hidden = virtualWidths
    ? inverse
      ? rowSpan <= 1
      : colSpan === 0 || rowSpan === 0 || rowSpan > 1
    : false;
  if (!virtualWidths && (colSpan === 0 || rowSpan === 0)) return null;

  const { className: additionalClassName, style: additionalStyle, ...additionalRest } = additional;
  const onMouseEnter = (event: MouseEvent<HTMLTableCellElement>) => {
    store.setState({ hover: [index, index + hoverSpan - 1] });
    additional.onMouseEnter?.(event);
  };
  const onMouseLeave = (event: MouseEvent<HTMLTableCellElement>) => {
    store.setState({ hover: NO_HOVER });
    additional.onMouseLeave?.(event);
  };

  let content = hidden ? null : children;
  if (
    typeof content === 'object' &&
    content !== null &&
    !Array.isArray(content) &&
    !isValidElement(content)
  ) {
    content = null;
  }

  const { fixedInfo } = leaf;
  let virtualStyle: CSSProperties | undefined;
  if (virtualWidths) {
    let width = 0;
    for (let offset = 0; offset < (colSpan || 1); offset += 1) {
      width += virtualWidths[leaf.index + offset] ?? 0;
    }
    const ownWidth = virtualWidths[leaf.index] ?? 0;
    virtualStyle = {
      flex: `0 0 ${width}px`,
      marginInlineEnd: colSpan > 1 ? ownWidth - width : undefined,
      pointerEvents: 'auto',
      width: `${width}px`,
    };
    if (hidden) virtualStyle.visibility = 'hidden';
    else if (inverse) virtualStyle.height = getHeight?.(rowSpan);
  }
  const style: CSSProperties = {
    ...legacyCellProps?.style,
    ...additionalStyle,
    ...semanticStyles.body.cell,
    ...virtualStyle,
  };

  return (
    <TableCell
      {...legacyCellProps}
      {...(additionalRest as object)}
      align={column.align}
      appendNode={appendNode}
      colSpan={virtualWidths ? 1 : colSpan}
      component={column.rowScope ? (components.bodyCell ?? 'th') : components.bodyCell}
      ellipsis={column.ellipsis}
      fixEnd={fixedInfo.fixEnd}
      fixStart={fixedInfo.fixStart}
      hovered={!legacyCellProps && rowHoverable && hovered}
      rowSpan={virtualWidths && !inverse ? 1 : rowSpan}
      scope={column.rowScope}
      shadowEnd={fixedInfo.shadowEnd}
      shadowStart={fixedInfo.shadowStart}
      style={style}
      zIndex={fixedInfo.zIndex}
      zIndexReverse={fixedInfo.zIndexReverse}
      className={clsx(
        column.className,
        semanticClassNames.body.cell,
        sorted && `${prefixCls}-column-sort`,
        className,
        additionalClassName,
        legacyCellProps?.className,
      )}
      onMouseEnter={rowHoverable ? onMouseEnter : additional.onMouseEnter}
      onMouseLeave={rowHoverable ? onMouseLeave : additional.onMouseLeave}
    >
      {content}
    </TableCell>
  );
};
