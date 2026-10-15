import { type RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { useEventCallback } from '@/hooks/useEventCallback';

import type { StickyScrollBarApi } from './StickyScrollBar';

const forceScroll = (scrollLeft: number, target: HTMLElement | null | undefined) => {
  if (target && target.scrollLeft !== scrollLeft) target.scrollLeft = scrollLeft;
};

interface ScrollSyncOptions {
  bodyRef: RefObject<HTMLDivElement | null>;
  columnCount: number;
  fixHeader: boolean;
  horizonScroll: boolean;
  prefixCls: string;
  rows: unknown;
  sticky: boolean;
}

export const useScrollSync = ({
  bodyRef,
  columnCount,
  fixHeader,
  horizonScroll,
  prefixCls,
  rows,
  sticky,
}: ScrollSyncOptions) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<StickyScrollBarApi>(null);
  const shadowRef = useRef({ end: false, start: false });
  const lockRef = useRef<{ target: EventTarget | null; timer?: ReturnType<typeof setTimeout> }>({
    target: null,
  });
  const [scrollbarSize, setScrollbarSize] = useState(0);
  const [, forceRender] = useState(0);

  const applyShadow = () => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.toggle(
      `${prefixCls}-fix-start-shadow-show`,
      horizonScroll && shadowRef.current.start,
    );
    root.classList.toggle(
      `${prefixCls}-fix-end-shadow-show`,
      horizonScroll && shadowRef.current.end,
    );
  };

  const onInternalScroll = useEventCallback(
    ({
      currentTarget,
      scrollLeft,
    }: {
      currentTarget?: HTMLElement | null;
      scrollLeft?: number;
    }) => {
      const target = currentTarget ?? bodyRef.current;
      const left = typeof scrollLeft === 'number' ? scrollLeft : (target?.scrollLeft ?? 0);
      const lock = lockRef.current;
      if (!lock.target || lock.target === target) {
        lock.target = target ?? null;
        clearTimeout(lock.timer);
        lock.timer = setTimeout(() => {
          lock.target = null;
        }, 100);
        forceScroll(left, headerRef.current);
        forceScroll(left, bodyRef.current);
        forceScroll(left, summaryRef.current);
        stickyRef.current?.setScrollLeft(left);
      }
      const measure = target ?? headerRef.current;
      if (measure) {
        const { clientWidth, scrollWidth } = measure;
        const abs = Math.abs(left);
        shadowRef.current =
          scrollWidth === clientWidth
            ? { end: false, start: false }
            : { end: abs < scrollWidth - clientWidth - 1, start: abs > 0 };
        applyShadow();
      }
    },
  );

  useLayoutEffect(() => {
    applyShadow();
  });

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === 'undefined') return;
    const update = () => {
      root.style.setProperty('--lobe-table-component-width', `${root.offsetWidth}px`);
      stickyRef.current?.checkVisible();
      if (horizonScroll) onInternalScroll({ currentTarget: bodyRef.current });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(root);
    return () => observer.disconnect();
  }, [horizonScroll, bodyRef, onInternalScroll]);

  useEffect(() => {
    if (horizonScroll) onInternalScroll({ currentTarget: bodyRef.current });
  }, [horizonScroll, rows, columnCount, bodyRef, onInternalScroll]);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!fixHeader || !body) return;
    const size = body.offsetWidth - body.clientWidth;
    setScrollbarSize((previous) => (previous === size ? previous : Math.max(0, size)));
  });

  useEffect(() => {
    if (sticky) forceRender((count) => count + 1);
  }, [sticky]);

  return { headerRef, onInternalScroll, rootRef, scrollbarSize, stickyRef, summaryRef };
};
