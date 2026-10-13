'use client';

import { cx } from 'antd-style';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { MouseEvent, ReactNode } from 'react';

import ActionIcon from '@/base-ui/ActionIcon';

import type { TableExpandIconProps, TableLocale } from './type';

/**
 * Default expand toggle: a small borderless `ActionIcon` (chevron right / down, swapped without a
 * transition). Rows that cannot expand keep an invisible spacer of the same size so tree rows line
 * up. Mirrors antd `ExpandIcon`.
 */
const renderExpandIcon = <T,>(
  { expandable, expanded, onExpand, prefixCls, record }: TableExpandIconProps<T>,
  locale: Pick<TableLocale, 'collapse' | 'expand'>,
): ReactNode => {
  const iconCls = `${prefixCls}-row-expand-icon`;
  if (!expandable) {
    return <span aria-hidden="true" className={cx(iconCls, `${iconCls}-spaced`)} />;
  }
  return (
    <ActionIcon
      aria-expanded={expanded}
      aria-label={expanded ? locale.collapse : locale.expand}
      className={cx(iconCls, expanded ? `${iconCls}-expanded` : `${iconCls}-collapsed`)}
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
