'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import type { CSSProperties, ReactNode } from 'react';

import Pagination, { type PaginationAlign } from '@/Pagination';
import type { PaginationSemanticName } from '@/Pagination/type';

import { PREFIX_CLS } from '../constants';
import type { PaginationState } from '../pipeline/useTableState';
import { styles } from '../style';
import type { TablePaginationConfig, TableSize } from '../type';

const alignStyles = {
  center: styles.paginationCenter,
  end: styles.paginationEnd,
  start: styles.paginationStart,
};

const normalizePlacement = (placement: string): PaginationAlign => {
  const lower = placement.toLowerCase();
  if (lower.includes('center')) return 'center';
  return lower.includes('left') || lower.includes('start') ? 'start' : 'end';
};

interface PaginationBarsProps {
  classNames: Partial<Record<PaginationSemanticName, string>>;
  config: TablePaginationConfig;
  onChange: (next: PaginationState) => void;
  page: PaginationState;
  size?: TableSize;
  styles: Partial<Record<PaginationSemanticName, CSSProperties>>;
  total: number;
}

export const renderPaginationBars = ({
  classNames: semanticClassNames,
  config,
  onChange,
  page,
  size,
  styles: semanticStyles,
  total,
}: PaginationBarsProps): { bottom: ReactNode; top: ReactNode } => {
  const {
    className,
    classNames,
    current: _current,
    defaultCurrent: _defaultCurrent,
    defaultPageSize: _defaultPageSize,
    onChange: _onChange,
    onShowSizeChange: _onShowSizeChange,
    pageSize: _pageSize,
    placement,
    size: paginationSize,
    styles: paginationStyles,
    total: _total,
    ...rest
  } = config;
  const pageCount = Math.ceil(total / page.pageSize);
  if (total <= 0 || (rest.hideOnSinglePage && pageCount <= 1)) return { bottom: null, top: null };

  const render = (align: PaginationAlign, side: 'top' | 'bottom') => (
    <div
      className={clsx(
        stylex.props(styles.pagination, side === 'top' && styles.paginationTop, alignStyles[align])
          .className,
        `${PREFIX_CLS}-pagination-wrapper`,
      )}
    >
      <Pagination
        {...rest}
        className={clsx(`${PREFIX_CLS}-pagination`, `${PREFIX_CLS}-pagination-${align}`, className)}
        current={page.pageIndex + 1}
        pageSize={page.pageSize}
        size={paginationSize ?? (size && size !== 'large' ? 'small' : undefined)}
        total={total}
        classNames={{
          item: clsx(semanticClassNames.item, classNames?.item),
          root: clsx(semanticClassNames.root, classNames?.root),
        }}
        styles={{
          item: { ...paginationStyles?.item, ...semanticStyles.item },
          root: { ...paginationStyles?.root, ...semanticStyles.root },
        }}
        onChange={(next, nextPageSize) => onChange({ pageIndex: next - 1, pageSize: nextPageSize })}
      />
    </div>
  );

  if (!placement) return { bottom: render('end', 'bottom'), top: null };
  const find = (side: string) => placement.find((item) => item.includes(side));
  const top = find('top');
  const bottom = find('bottom');
  const none = placement.every((item) => item === 'none');
  return {
    bottom: bottom
      ? render(normalizePlacement(bottom), 'bottom')
      : !top && !none
        ? render('end', 'bottom')
        : null,
    top: top ? render(normalizePlacement(top), 'top') : null,
  };
};
