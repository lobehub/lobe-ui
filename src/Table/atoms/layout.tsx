'use client';

import '../style.css';

import clsx from 'clsx';
import {
  createElement,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  type TableHTMLAttributes,
} from 'react';

import { toDataAttributes } from '@/utils/bem';

import { PREFIX_CLS, SIZE_CLASS } from '../constants';
import type { TableCustomizeComponent, TableSize, TableVariant } from '../type';

export interface TableRootProps extends HTMLAttributes<HTMLDivElement> {
  grouped?: boolean;
  hoverable?: boolean;
  ref?: Ref<HTMLDivElement>;
  size?: TableSize;
  variant?: TableVariant;
}

export const TableRoot = ({
  className,
  grouped,
  hoverable = true,
  size = 'middle',
  variant = 'borderless',
  ...rest
}: TableRootProps) => (
  <div
    {...toDataAttributes({ size, variant })}
    {...rest}
    className={clsx(
      PREFIX_CLS,
      SIZE_CLASS[size],
      `${PREFIX_CLS}-${variant}`,
      grouped && `${PREFIX_CLS}-grouped`,
      hoverable && `${PREFIX_CLS}-hoverable`,
      className,
    )}
  />
);

export interface TablePartProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export const TableContainer = ({ className, ...rest }: TablePartProps) => (
  <div {...rest} className={clsx(`${PREFIX_CLS}-container`, className)} />
);

export interface TableScrollProps extends TablePartProps {
  part?: 'body' | 'content' | 'header' | 'summary';
}

export const TableScroll = ({ className, part = 'content', ...rest }: TableScrollProps) => (
  <div {...rest} className={clsx(`${PREFIX_CLS}-${part}`, className)} />
);

export const TableTitle = ({ className, ...rest }: TablePartProps) => (
  <div {...rest} className={clsx(`${PREFIX_CLS}-title`, className)} />
);

export const TableFooter = ({ className, ...rest }: TablePartProps) => (
  <div {...rest} className={clsx(`${PREFIX_CLS}-footer`, className)} />
);

export interface TableElementProps extends TableHTMLAttributes<HTMLTableElement> {
  component?: TableCustomizeComponent;
  ref?: Ref<HTMLTableElement>;
}

export const TableElement = ({ component = 'table', ...rest }: TableElementProps) =>
  createElement(component, rest);

export interface TableColGroupColumn {
  className?: string;
  minWidth?: number | string;
  width?: number | string;
}

export interface TableColGroupProps {
  columns: readonly TableColGroupColumn[];
}

export const TableColGroup = ({ columns }: TableColGroupProps) => {
  const cols: ReactNode[] = [];
  let mustInsert = false;
  for (let index = columns.length - 1; index >= 0; index -= 1) {
    const { className, minWidth, width } = columns[index];
    if (width || minWidth || className || mustInsert) {
      const style: CSSProperties = { minWidth, width };
      cols.unshift(<col className={className} key={index} style={style} />);
      mustInsert = true;
    }
  }
  return cols.length > 0 ? <colgroup>{cols}</colgroup> : null;
};

export interface TableSectionProps extends HTMLAttributes<HTMLTableSectionElement> {
  component?: TableCustomizeComponent;
  ref?: Ref<HTMLTableSectionElement>;
}

export const TableHeader = ({ className, component = 'thead', ...rest }: TableSectionProps) =>
  createElement(component, { ...rest, className: clsx(`${PREFIX_CLS}-thead`, className) });

export const TableBody = ({ className, component = 'tbody', ...rest }: TableSectionProps) =>
  createElement(component, { ...rest, className: clsx(`${PREFIX_CLS}-tbody`, className) });

export const TableSummaryFoot = ({ className, ...rest }: TableSectionProps) => (
  <tfoot {...rest} className={clsx(`${PREFIX_CLS}-summary`, className)} />
);
