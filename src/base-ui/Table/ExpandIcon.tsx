'use client';

import { cx } from 'antd-style';
import type { ReactNode } from 'react';

import type { TableExpandIconProps, TableLocale } from './type';

/**
 * Default expand toggle: a bordered +/- square drawn in CSS (see `style.ts`). Rows that cannot
 * expand keep an invisible spacer so tree rows line up. Mirrors antd `ExpandIcon`.
 */
const renderExpandIcon = <T,>(
  { expandable, expanded, onExpand, prefixCls, record }: TableExpandIconProps<T>,
  locale: Pick<TableLocale, 'collapse' | 'expand'>,
): ReactNode => {
  const iconCls = `${prefixCls}-row-expand-icon`;
  return (
    <button
      aria-expanded={expanded}
      aria-label={expanded ? locale.collapse : locale.expand}
      type="button"
      className={cx(
        iconCls,
        !expandable && `${iconCls}-spaced`,
        expandable && (expanded ? `${iconCls}-expanded` : `${iconCls}-collapsed`),
      )}
      onClick={(event) => {
        onExpand(record, event);
        event.stopPropagation();
      }}
    />
  );
};

export default renderExpandIcon;
