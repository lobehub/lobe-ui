'use client';

import { cx } from 'antd-style';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import useControlledState from 'use-merge-value';

import Select from '@/base-ui/Select';
import { useEventCallback } from '@/hooks/useEventCallback';

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
    const [mergedCurrent, setMergedCurrent] = useControlledState(defaultCurrent, {
      value: current,
    });
    const onChangeStable = useEventCallback((nextCurrent: number, nextPageSize: number) => {
      onChange?.(nextCurrent, nextPageSize);
    });

    const pendingNotifyRef = useRef<{ current: number; pageSize: number } | null>(null);
    const [prevPageCount, setPrevPageCount] = useState(pageCount);

    if (pageCount !== prevPageCount) {
      setPrevPageCount(pageCount);

      if (mergedCurrent > pageCount && pageCount >= 1) {
        setMergedCurrent(pageCount);
        pendingNotifyRef.current = { current: pageCount, pageSize: mergedPageSize };
      }
    }

    useEffect(() => {
      if (!pendingNotifyRef.current) return;

      const { current: nextCurrent, pageSize: nextPageSize } = pendingNotifyRef.current;
      pendingNotifyRef.current = null;
      onChangeStable(nextCurrent, nextPageSize);
    });

    const displayCurrent = clampPage(mergedCurrent, pageCount);

    if (hideOnSinglePage && pageCount <= 1) return null;

    const commitCurrent = (nextCurrent: number, nextPageSize: number) => {
      setMergedCurrent(nextCurrent);
      onChange?.(nextCurrent, nextPageSize);
    };

    const goTo = (page: number) => {
      commitCurrent(clampPage(page, pageCount), mergedPageSize);
    };

    const handlePageSizeChange = (value: string) => {
      const nextSize = Number(value);
      const nextPageCount = getPageCount(total, nextSize);
      const nextCurrent = clampPage(displayCurrent, nextPageCount);

      setMergedPageSize(nextSize);
      commitCurrent(nextCurrent, nextSize);
      onPageSizeChange?.(nextCurrent, nextSize);
    };

    const items = getPaginationItems(displayCurrent, pageCount);
    const rangeStart = total === 0 ? 0 : (displayCurrent - 1) * mergedPageSize + 1;
    const rangeEnd = Math.min(displayCurrent * mergedPageSize, total);

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
          disabled={disabled || displayCurrent <= 1}
          type="button"
          onClick={() => goTo(displayCurrent - 1)}
        >
          <ChevronLeft size={size === 'small' ? 14 : 16} />
        </button>
        {items.map((item) =>
          typeof item === 'number' ? (
            <button
              aria-current={item === displayCurrent ? 'page' : undefined}
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
          disabled={disabled || displayCurrent >= pageCount}
          type="button"
          onClick={() => goTo(displayCurrent + 1)}
        >
          <ChevronRight size={size === 'small' ? 14 : 16} />
        </button>
        {showSizeChanger && (
          <Select
            disabled={disabled}
            size={size === 'small' ? 'small' : 'middle'}
            style={{ flex: 'none', marginInlineStart: 8, width: 'auto' }}
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
