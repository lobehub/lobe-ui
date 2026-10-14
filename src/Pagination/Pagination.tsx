'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import {
  type KeyboardEvent,
  memo,
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

import { useControlledState } from '@/hooks/useControlledState';
import { useEventCallback } from '@/hooks/useEventCallback';
import { Input } from '@/Input';
import Select from '@/Select';
import { styleProps } from '@/styles/stylex/props';

import { clampPage, getPageCount, getPaginationItems } from './helpers';
import { paginationJumpMarker } from './marker.stylex';
import { styles } from './style';
import type { PaginationItemType, PaginationProps } from './type';

const XS_QUERY = '(max-width: 575px)';

/** One-line dots that swap to a double chevron on hover / focus of the jump item. */
const JumpIcon = ({ direction }: { direction: 'next' | 'prev' }) => {
  const Icon = direction === 'prev' ? ChevronsLeft : ChevronsRight;
  return (
    <>
      <span aria-hidden {...stylex.props(styles.ellipsisDots)}>
        •••
      </span>
      <Icon aria-hidden size={14} {...stylex.props(styles.ellipsisIcon)} />
    </>
  );
};

const canMatchMedia = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function';

const subscribeXs = (onChange: () => void) => {
  if (!canMatchMedia()) return () => {};
  const query = window.matchMedia(XS_QUERY);
  query.addEventListener?.('change', onChange);
  return () => query.removeEventListener?.('change', onChange);
};
const getXs = () => canMatchMedia() && window.matchMedia(XS_QUERY).matches;
const getServerXs = () => false;

/** Whether the viewport is antd's `xs` breakpoint; only tracked when `enabled`. */
const useIsXs = (enabled: boolean) => {
  const isXs = useSyncExternalStore(subscribeXs, getXs, getServerXs);
  return enabled && isXs;
};

const Pagination = memo<PaginationProps>(
  ({
    align,
    className,
    classNames,
    components,
    current,
    defaultCurrent = 1,
    defaultPageSize = 10,
    disabled,
    hideOnSinglePage,
    itemRender,
    onChange,
    onPageSizeChange,
    pageSize,
    pageSizeOptions = [10, 20, 50, 100],
    ref,
    responsive,
    showLessItems,
    showQuickJumper,
    showSizeChanger,
    showTitle = true,
    showTotal,
    simple,
    size: sizeProp,
    style,
    styles: customStyles,
    total,
    totalBoundaryShowSizeChanger = 50,
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

    const isXs = useIsXs(!!responsive && !sizeProp);
    const size = sizeProp ?? (isXs ? 'small' : 'middle');

    const [jumperValue, setJumperValue] = useState('');
    const [simpleValue, setSimpleValue] = useState<string | null>(null);
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

    // Like rc-pagination: invalid input is ignored, a valid page is clamped, the input is cleared.
    const jump = () => {
      const page = Number(jumperValue);
      setJumperValue('');
      if (jumperValue.trim() === '' || !Number.isInteger(page)) return;
      const nextCurrent = clampPage(page, pageCount);
      if (nextCurrent !== displayCurrent) goTo(nextCurrent);
    };
    const goButton = typeof showQuickJumper === 'object' ? showQuickJumper.goButton : undefined;
    const mergedShowSizeChanger = showSizeChanger ?? total > totalBoundaryShowSizeChanger;
    const sizeChangerProps = typeof showSizeChanger === 'object' ? showSizeChanger : undefined;
    const SizeChanger = components?.sizeChanger ?? Select;

    const jumpStep = showLessItems ? 3 : 5;
    const items = getPaginationItems(displayCurrent, pageCount, showLessItems ? 1 : 2);
    const render = (page: number, type: PaginationItemType, element: ReactNode) =>
      itemRender ? itemRender(page, type, element) : element;
    const title = (text: string) => (showTitle ? text : undefined);
    const iconSize = size === 'small' ? 14 : 16;
    const buttonProps = stylex.props(styles.button, size === 'small' && styles.small);
    const jumperInputClassName = stylex.props(styles.jumperInput).className;

    const prevButton = (
      <button
        aria-label="Previous page"
        {...buttonProps}
        disabled={disabled || displayCurrent <= 1}
        title={title('Previous Page')}
        type="button"
        onClick={() => goTo(displayCurrent - 1)}
      >
        {render(Math.max(1, displayCurrent - 1), 'prev', <ChevronLeft size={iconSize} />)}
      </button>
    );
    const nextButton = (
      <button
        aria-label="Next page"
        {...buttonProps}
        disabled={disabled || displayCurrent >= pageCount}
        title={title('Next Page')}
        type="button"
        onClick={() => goTo(displayCurrent + 1)}
      >
        {render(Math.min(pageCount, displayCurrent + 1), 'next', <ChevronRight size={iconSize} />)}
      </button>
    );

    const simpleConfig = simple ? (typeof simple === 'object' ? simple : {}) : null;
    const commitSimple = () => {
      if (simpleValue === null) return;
      const page = Number(simpleValue);
      setSimpleValue(null);
      if (simpleValue.trim() === '' || !Number.isInteger(page)) return;
      const nextCurrent = clampPage(page, pageCount);
      if (nextCurrent !== displayCurrent) goTo(nextCurrent);
    };
    const rangeStart = total === 0 ? 0 : (displayCurrent - 1) * mergedPageSize + 1;
    const rangeEnd = Math.min(displayCurrent * mergedPageSize, total);

    return (
      <nav
        aria-label="Pagination"
        ref={ref}
        role="navigation"
        {...styleProps(
          [styles.root, align && styles.aligned, align && styles[align]],
          clsx(classNames?.root, className),
          { ...customStyles?.root, ...style },
        )}
        {...rest}
      >
        {showTotal && (
          <span {...stylex.props(styles.total)}>{showTotal(total, [rangeStart, rangeEnd])}</span>
        )}
        {simpleConfig ? (
          <>
            {prevButton}
            <span
              {...stylex.props(styles.simplePager)}
              title={title(`${displayCurrent}/${pageCount}`)}
            >
              {simpleConfig.readOnly ? (
                displayCurrent
              ) : (
                <Input
                  aria-label="Current page"
                  className={jumperInputClassName}
                  disabled={disabled}
                  size={size === 'small' ? 'small' : 'middle'}
                  value={simpleValue ?? String(displayCurrent)}
                  onBlur={commitSimple}
                  onChange={(event) => setSimpleValue(event.currentTarget.value)}
                  onKeyUp={(event: KeyboardEvent<HTMLInputElement>) => {
                    if (event.key === 'Enter') commitSimple();
                  }}
                />
              )}
              <span {...stylex.props(styles.simpleSlash)}>/</span>
              {pageCount}
            </span>
            {nextButton}
          </>
        ) : (
          <>
            {prevButton}
            {items.map((item) =>
              typeof item === 'number' ? (
                <button
                  aria-current={item === displayCurrent ? 'page' : undefined}
                  disabled={disabled}
                  key={item}
                  {...styleProps(
                    [styles.button, size === 'small' && styles.small],
                    classNames?.item,
                    customStyles?.item,
                  )}
                  title={title(String(item))}
                  type="button"
                  onClick={() => goTo(item)}
                >
                  {render(item, 'page', item)}
                </button>
              ) : (
                <button
                  {...stylex.props(
                    paginationJumpMarker,
                    styles.ellipsis,
                    size === 'small' && styles.smallEllipsis,
                  )}
                  data-pagination-jump={item === 'ellipsis-prev' ? 'prev' : 'next'}
                  disabled={disabled}
                  key={item}
                  type="button"
                  title={title(
                    item === 'ellipsis-prev'
                      ? `Previous ${jumpStep} Pages`
                      : `Next ${jumpStep} Pages`,
                  )}
                  onClick={() =>
                    goTo(
                      item === 'ellipsis-prev'
                        ? Math.max(1, displayCurrent - jumpStep)
                        : Math.min(pageCount, displayCurrent + jumpStep),
                    )
                  }
                >
                  {item === 'ellipsis-prev'
                    ? render(
                        Math.max(1, displayCurrent - jumpStep),
                        'jump-prev',
                        <JumpIcon direction="prev" />,
                      )
                    : render(
                        Math.min(pageCount, displayCurrent + jumpStep),
                        'jump-next',
                        <JumpIcon direction="next" />,
                      )}
                </button>
              ),
            )}
            {nextButton}
          </>
        )}
        {!simpleConfig && mergedShowSizeChanger && (
          <SizeChanger
            disabled={disabled}
            size={size === 'small' ? 'small' : 'middle'}
            {...sizeChangerProps}
            value={String(mergedPageSize)}
            options={pageSizeOptions.map((option) => ({
              label: `${option} / page`,
              value: String(option),
            }))}
            style={{
              flex: 'none',
              marginInlineStart: 8,
              width: 'auto',
              ...sizeChangerProps?.style,
            }}
            onChange={(value: string) => {
              handlePageSizeChange(value);
              sizeChangerProps?.onChange?.(value);
            }}
          />
        )}
        {!simpleConfig && showQuickJumper && (
          <span {...stylex.props(styles.jumper)}>
            Go to
            <Input
              aria-label="Go to page"
              className={jumperInputClassName}
              disabled={disabled}
              size={size === 'small' ? 'small' : 'middle'}
              value={jumperValue}
              onChange={(event) => setJumperValue(event.currentTarget.value)}
              onBlur={() => {
                if (!goButton) jump();
              }}
              onKeyUp={(event: KeyboardEvent<HTMLInputElement>) => {
                if (event.key === 'Enter') jump();
              }}
            />
            {goButton === true || typeof goButton === 'string' ? (
              <button {...buttonProps} disabled={disabled} type="button" onClick={jump}>
                {goButton === true ? 'Go' : goButton}
              </button>
            ) : goButton ? (
              <span onClick={jump}>{goButton}</span>
            ) : (
              'Page'
            )}
          </span>
        )}
      </nav>
    );
  },
);

Pagination.displayName = 'Pagination';

export default Pagination;
