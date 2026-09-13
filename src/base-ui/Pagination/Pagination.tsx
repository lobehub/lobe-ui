'use client';

import { cx } from 'antd-style';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { memo } from 'react';
import useControlledState from 'use-merge-value';

import Select from '@/base-ui/Select';

import { clampPage, getPageCount, getPaginationItems } from './helpers';
import { buttonVariants, ellipsisVariants, styles } from './style';
import type { PaginationProps } from './type';

const Pagination = memo<PaginationProps>(
  ({
    className,
    current,
    defaultCurrent = 1,
    defaultPageSize = 10,
    disabled,
    hideOnSinglePage,
    onChange,
    onPageSizeChange,
    pageSize,
    pageSizeOptions = [10, 20, 50, 100],
    ref,
    showSizeChanger = false,
    showTotal,
    size = 'middle',
    style,
    total,
    ...rest
  }) => {
    const [mergedPageSize, setMergedPageSize] = useControlledState(defaultPageSize, {
      value: pageSize,
    });
    const pageCount = getPageCount(total, mergedPageSize);
    const [mergedCurrent, setMergedCurrent] = useControlledState(
      clampPage(defaultCurrent, pageCount),
      {
        value: current != null ? clampPage(current, pageCount) : undefined,
      },
    );

    if (hideOnSinglePage && pageCount <= 1) return null;

    const goTo = (page: number) => {
      const nextPage = clampPage(page, pageCount);
      setMergedCurrent(nextPage);
      onChange?.(nextPage, mergedPageSize);
    };

    const handlePageSizeChange = (value: unknown) => {
      const nextSize = Number(value);
      const nextPageCount = getPageCount(total, nextSize);
      const nextCurrent = clampPage(mergedCurrent, nextPageCount);

      setMergedPageSize(nextSize);
      setMergedCurrent(nextCurrent);
      onPageSizeChange?.(nextCurrent, nextSize);
      onChange?.(nextCurrent, nextSize);
    };

    const items = getPaginationItems(mergedCurrent, pageCount);
    const rangeStart = total === 0 ? 0 : (mergedCurrent - 1) * mergedPageSize + 1;
    const rangeEnd = Math.min(mergedCurrent * mergedPageSize, total);

    return (
      <nav
        aria-label="Pagination"
        className={cx(styles.root, className)}
        ref={ref}
        role="navigation"
        style={style}
        {...rest}
      >
        {showTotal && (
          <span className={styles.total}>{showTotal(total, [rangeStart, rangeEnd])}</span>
        )}
        <button
          aria-label="Previous page"
          className={buttonVariants({ size })}
          disabled={disabled || mergedCurrent <= 1}
          type="button"
          onClick={() => goTo(mergedCurrent - 1)}
        >
          <ChevronLeft size={size === 'small' ? 14 : 16} />
        </button>
        {items.map((item) =>
          typeof item === 'number' ? (
            <button
              aria-current={item === mergedCurrent ? 'page' : undefined}
              className={buttonVariants({ size })}
              disabled={disabled}
              key={item}
              type="button"
              onClick={() => goTo(item)}
            >
              {item}
            </button>
          ) : (
            <span className={ellipsisVariants({ size })} key={item}>
              ···
            </span>
          ),
        )}
        <button
          aria-label="Next page"
          className={buttonVariants({ size })}
          disabled={disabled || mergedCurrent >= pageCount}
          type="button"
          onClick={() => goTo(mergedCurrent + 1)}
        >
          <ChevronRight size={size === 'small' ? 14 : 16} />
        </button>
        {showSizeChanger && (
          <Select
            disabled={disabled}
            size={size === 'small' ? 'small' : 'middle'}
            style={{ marginInlineStart: 8 }}
            value={String(mergedPageSize)}
            options={pageSizeOptions.map((option) => ({
              label: `${option} / page`,
              value: String(option),
            }))}
            onChange={handlePageSizeChange}
          />
        )}
      </nav>
    );
  },
);

Pagination.displayName = 'Pagination';

export default Pagination;
