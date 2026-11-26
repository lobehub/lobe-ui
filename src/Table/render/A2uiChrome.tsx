'use client';

// Header and pager of the `a2ui` variant, adapted from CopilotKit a2ui-playground (MIT), `DataTableView`.
import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import type { ReactNode } from 'react';

import { PREFIX_CLS } from '../constants';
import { a2uiChrome as styles } from '../style';

const sx = (...s: stylex.StyleXArray<any>[]) => stylex.props(...s);

interface A2uiHeaderProps {
  count: number;
  onSearch?: (query: string) => void;
  query: string;
  rowsLabel: string;
  searchable?: boolean;
  searchLabel: string;
  title?: ReactNode;
}

export const A2uiHeader = ({
  count,
  onSearch,
  query,
  rowsLabel,
  searchLabel,
  searchable,
  title,
}: A2uiHeaderProps) => (
  <div className={clsx(sx(styles.header).className, `${PREFIX_CLS}-a2ui-header`)}>
    <div {...sx(styles.headerTitle)}>
      {title !== undefined && title !== null && <div {...sx(styles.title)}>{title}</div>}
      <span {...sx(styles.count)}>
        {count} {rowsLabel}
      </span>
    </div>
    {searchable && (
      <div {...sx(styles.search)}>
        <Search {...sx(styles.searchIcon)} size={14} />
        <input
          {...sx(styles.searchInput)}
          aria-label={searchLabel}
          placeholder={searchLabel}
          type="search"
          value={query}
          onChange={(event) => onSearch?.(event.target.value)}
        />
      </div>
    )}
  </div>
);

interface A2uiPagerProps {
  nextLabel: string;
  ofLabel: string;
  onChange: (pageIndex: number) => void;
  pageIndex: number;
  pageSize: number;
  prevLabel: string;
  total: number;
}

export const A2uiPager = ({
  nextLabel,
  ofLabel,
  onChange,
  pageIndex,
  pageSize,
  prevLabel,
  total,
}: A2uiPagerProps) => {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min(total, (pageIndex + 1) * pageSize);
  return (
    <div className={clsx(sx(styles.footer).className, `${PREFIX_CLS}-a2ui-pager`)}>
      <span {...sx(styles.footerText)}>
        {from}-{to} {ofLabel} {total}
      </span>
      <div {...sx(styles.pager)}>
        <button
          {...sx(styles.pageButton)}
          aria-label={prevLabel}
          disabled={pageIndex <= 0}
          type="button"
          onClick={() => onChange(pageIndex - 1)}
        >
          <ChevronLeft size={12} />
        </button>
        <span {...sx(styles.pageIndex)}>
          {pageIndex + 1} / {pageCount}
        </span>
        <button
          {...sx(styles.pageButton)}
          aria-label={nextLabel}
          disabled={pageIndex >= pageCount - 1}
          type="button"
          onClick={() => onChange(pageIndex + 1)}
        >
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
};
