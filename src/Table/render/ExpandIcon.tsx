'use client';

import clsx from 'clsx';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { MouseEvent, ReactNode } from 'react';

import ActionIcon from '@/ActionIcon';

import type { TableExpandIconProps, TableLocale } from '../type';

const renderExpandIcon = <T,>(
  { expandable, expanded, onExpand, prefixCls, record }: TableExpandIconProps<T>,
  locale: Pick<TableLocale, 'collapse' | 'expand'>,
): ReactNode => {
  const iconCls = `${prefixCls}-row-expand-icon`;
  if (!expandable) {
    return <span aria-hidden="true" className={clsx(iconCls, `${iconCls}-spaced`)} />;
  }
  return (
    <ActionIcon
      aria-expanded={expanded}
      aria-label={expanded ? locale.collapse : locale.expand}
      className={clsx(iconCls, expanded ? `${iconCls}-expanded` : `${iconCls}-collapsed`)}
      icon={expanded ? ChevronDown : ChevronRight}
      size="small"
      onClick={(event) => {
        onExpand(record, event as unknown as MouseEvent<HTMLElement>);
        event.stopPropagation();
      }}
    />
  );
};

export default renderExpandIcon;
