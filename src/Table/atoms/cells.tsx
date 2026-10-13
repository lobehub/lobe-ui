'use client';

import clsx from 'clsx';
import {
  createElement,
  type CSSProperties,
  isValidElement,
  type ReactNode,
  type Ref,
  type TdHTMLAttributes,
} from 'react';

import { PREFIX_CLS } from '../constants';
import type { TableColumnAlign, TableCustomizeComponent } from '../type';

const CELL = `${PREFIX_CLS}-cell`;

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  align?: TableColumnAlign;
  appendNode?: ReactNode;
  component?: TableCustomizeComponent;
  ellipsis?: boolean | { showTitle?: boolean };
  fixEnd?: number;
  fixStart?: number;
  hovered?: boolean;
  ref?: Ref<HTMLTableCellElement>;
  rowType?: 'body' | 'header';
  shadowEnd?: boolean;
  shadowStart?: boolean;
  sticky?: boolean;
  zIndex?: number;
  zIndexReverse?: number;
}

const getEllipsisTitle = (
  ellipsis: TableCellProps['ellipsis'],
  rowType: TableCellProps['rowType'],
  children: ReactNode,
) => {
  const config = ellipsis === true ? { showTitle: true } : ellipsis;
  if (!config || !(config.showTitle || rowType === 'header')) return undefined;
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (isValidElement<{ children?: unknown }>(children)) {
    const inner = children.props.children;
    if (typeof inner === 'string') return inner;
  }
  return undefined;
};

export const TableCell = ({
  align,
  appendNode,
  children,
  className,
  colSpan,
  component = 'td',
  ellipsis,
  fixEnd,
  fixStart,
  hovered,
  rowSpan,
  rowType = 'body',
  shadowEnd,
  shadowStart,
  sticky,
  style,
  title,
  zIndex,
  zIndexReverse,
  ...rest
}: TableCellProps) => {
  const isFixStart = typeof fixStart === 'number';
  const isFixEnd = typeof fixEnd === 'number';
  const fixedStyle: CSSProperties & Record<string, unknown> = {};
  if (isFixStart) fixedStyle.insetInlineStart = fixStart;
  if (isFixEnd) fixedStyle.insetInlineEnd = fixEnd;
  if (isFixStart || isFixEnd) {
    fixedStyle['--z-offset'] = zIndex;
    fixedStyle['--z-offset-reverse'] = zIndexReverse;
  }
  const withShadow = Boolean((isFixStart && shadowStart) || (isFixEnd && shadowEnd));
  const content =
    ellipsis && withShadow ? <span className={`${CELL}-content`}>{children}</span> : children;

  return createElement(
    component,
    {
      ...rest,
      className: clsx(
        CELL,
        className,
        (isFixStart || isFixEnd) && `${CELL}-fix`,
        isFixStart && `${CELL}-fix-start`,
        isFixEnd && `${CELL}-fix-end`,
        isFixStart && shadowStart && `${CELL}-fix-start-shadow`,
        isFixEnd && shadowEnd && `${CELL}-fix-end-shadow`,
        ellipsis && `${CELL}-ellipsis`,
        appendNode && `${CELL}-with-append`,
        (isFixStart || isFixEnd) && sticky && `${CELL}-fix-sticky`,
        hovered && `${CELL}-row-hover`,
      ),
      colSpan: colSpan !== undefined && colSpan !== 1 ? colSpan : undefined,
      rowSpan: rowSpan !== undefined && rowSpan !== 1 ? rowSpan : undefined,
      style: { ...fixedStyle, ...(align && { textAlign: align }), ...style },
      title: title ?? getEllipsisTitle(ellipsis, rowType, children),
    },
    appendNode,
    content,
  );
};

export const TableHeaderCell = ({ component, ...props }: TableCellProps) => (
  <TableCell rowType="header" {...props} component={component ?? 'th'} />
);

export interface TableRowProps extends TdHTMLAttributes<HTMLTableRowElement> {
  component?: TableCustomizeComponent;
  level?: number;
  ref?: Ref<HTMLTableRowElement>;
  selected?: boolean;
}

export const TableRow = ({
  className,
  component = 'tr',
  level,
  selected,
  ...rest
}: TableRowProps) =>
  createElement(component, {
    ...rest,
    className:
      clsx(
        level !== undefined && `${PREFIX_CLS}-row`,
        level !== undefined && `${PREFIX_CLS}-row-level-${level}`,
        selected && `${PREFIX_CLS}-row-selected`,
        className,
      ) || undefined,
  });

export interface TableExpandedRowProps {
  cellComponent?: TableCustomizeComponent;
  children?: ReactNode;
  className?: string;
  colSpan: number;
  component?: TableCustomizeComponent;
  expanded?: boolean;
  fixed?: boolean;
}

export const TableExpandedRow = ({
  cellComponent,
  children,
  className,
  colSpan,
  component = 'tr',
  expanded = true,
  fixed,
}: TableExpandedRowProps) =>
  createElement(
    component,
    { className, style: { display: expanded ? undefined : 'none' } },
    <TableCell colSpan={colSpan} component={cellComponent}>
      {fixed ? (
        <div
          className={`${PREFIX_CLS}-expanded-row-fixed`}
          style={{ insetInlineStart: 0, overflow: 'hidden', position: 'sticky' }}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </TableCell>,
  );
