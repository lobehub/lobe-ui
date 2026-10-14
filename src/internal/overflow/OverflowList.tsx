'use client';

import clsx from 'clsx';
import { type Key, type ReactNode, useLayoutEffect, useRef, useState } from 'react';

export const fitCount = (widths: number[], restWidth: number, containerWidth: number) => {
  if (containerWidth <= 0) return 0;
  const total = widths.reduce((sum, width) => sum + width, 0);
  if (total <= containerWidth) return widths.length;
  let used = restWidth;
  let count = 0;
  for (const width of widths) {
    if (used + width > containerWidth) break;
    used += width;
    count += 1;
  }
  return count;
};

export interface OverflowListProps<T> {
  classNames?: { item?: string; rest?: string; root?: string };
  data: T[];
  itemKey: (item: T, index: number) => Key;
  maxCount?: number | 'responsive';
  renderItem: (item: T, index: number) => ReactNode;
  renderRest: (omitted: T[]) => ReactNode;
}

const hiddenStyle = {
  insetBlockStart: 0,
  insetInlineStart: 0,
  pointerEvents: 'none',
  position: 'absolute',
  visibility: 'hidden',
} as const;

export const OverflowList = <T,>({
  classNames,
  data,
  itemKey,
  maxCount,
  renderItem,
  renderRest,
}: OverflowListProps<T>) => {
  const responsive = maxCount === 'responsive';
  const rootRef = useRef<HTMLDivElement>(null);
  const [fitted, setFitted] = useState(data.length);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!responsive || !root) return;
    const measure = () => {
      const items = [...root.querySelectorAll<HTMLElement>(':scope > [data-overflow-item]')];
      const rest = root.querySelector<HTMLElement>(':scope > [data-overflow-rest]');
      setFitted(
        fitCount(
          items.map((item) => item.getBoundingClientRect().width),
          rest?.getBoundingClientRect().width ?? 0,
          root.clientWidth,
        ),
      );
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [responsive, data]);

  const count = responsive
    ? Math.min(fitted, data.length)
    : typeof maxCount === 'number'
      ? Math.min(Math.max(maxCount, 0), data.length)
      : data.length;
  const rendered = responsive ? data : data.slice(0, count);
  const omitted = data.slice(count);

  return (
    <div className={classNames?.root} ref={rootRef} style={{ position: 'relative' }}>
      {rendered.map((item, index) => {
        const hidden = index >= count;
        return (
          <div
            aria-hidden={hidden || undefined}
            className={classNames?.item}
            data-overflow-item=""
            key={itemKey(item, index)}
            style={hidden ? hiddenStyle : undefined}
          >
            {renderItem(item, index)}
          </div>
        );
      })}
      {(omitted.length > 0 || responsive) && (
        <div
          aria-hidden={omitted.length === 0 || undefined}
          className={clsx(classNames?.item, classNames?.rest)}
          data-overflow-rest=""
          style={omitted.length === 0 ? hiddenStyle : undefined}
        >
          {renderRest(omitted.length > 0 ? omitted : data)}
        </div>
      )}
    </div>
  );
};
