'use client';

import clsx from 'clsx';
import {
  type MouseEvent as ReactMouseEvent,
  type Ref,
  type RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

export interface StickyScrollBarApi {
  checkVisible: () => void;
  setScrollLeft: (left: number) => void;
}

interface StickyScrollBarProps {
  bodyRef: RefObject<HTMLElement | null>;
  container: HTMLElement | Window;
  offsetScroll: number;
  onScroll: (info: { currentTarget: HTMLElement; scrollLeft: number }) => void;
  prefixCls: string;
  ref?: Ref<StickyScrollBarApi>;
}

const getContainerBottom = (container: HTMLElement | Window) =>
  container === window
    ? window.innerHeight
    : (container as HTMLElement).getBoundingClientRect().bottom;

const StickyScrollBar = ({
  bodyRef,
  container,
  offsetScroll,
  onScroll,
  prefixCls,
  ref,
}: StickyScrollBarProps) => {
  const [state, setState] = useState({ hidden: true, scrollLeft: 0 });
  const dragRef = useRef<{ left: number; x: number } | null>(null);

  const body = bodyRef.current;
  const scrollWidth = body?.scrollWidth ?? 0;
  const clientWidth = body?.clientWidth ?? 0;
  const barWidth = scrollWidth ? clientWidth * (clientWidth / scrollWidth) : 0;
  const barLeft = scrollWidth ? (state.scrollLeft / scrollWidth) * clientWidth : 0;

  const checkVisible = () => {
    const element = bodyRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const bottom = getContainerBottom(container);
    const hidden =
      element.scrollWidth <= element.clientWidth ||
      rect.bottom - offsetScroll <= bottom ||
      rect.top >= bottom - offsetScroll;
    setState((previous) =>
      previous.hidden === hidden && previous.scrollLeft === element.scrollLeft
        ? previous
        : { hidden, scrollLeft: element.scrollLeft },
    );
  };

  useImperativeHandle(ref, () => ({
    checkVisible,
    setScrollLeft: (left: number) =>
      setState((previous) =>
        previous.scrollLeft === left ? previous : { ...previous, scrollLeft: left },
      ),
  }));

  useEffect(() => {
    const onChange = () => checkVisible();
    container.addEventListener('scroll', onChange, false);
    window.addEventListener('resize', onChange, false);
    onChange();
    return () => {
      container.removeEventListener('scroll', onChange, false);
      window.removeEventListener('resize', onChange, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container, offsetScroll]);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      const drag = dragRef.current;
      const element = bodyRef.current;
      if (!drag || !element || !clientWidth) return;
      const left = drag.left + (event.pageX - drag.x);
      const max = element.scrollWidth - element.clientWidth;
      const scrollLeft = Math.min(Math.max((left / clientWidth) * element.scrollWidth, 0), max);
      onScroll({ currentTarget: element, scrollLeft });
    };
    const onUp = () => {
      dragRef.current = null;
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [bodyRef, clientWidth, onScroll]);

  if (state.hidden || scrollWidth <= clientWidth || !barWidth) return null;

  const onMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    dragRef.current = { left: barLeft, x: event.pageX };
    event.preventDefault();
  };

  return (
    <div
      className={`${prefixCls}-sticky-scroll`}
      style={{ bottom: offsetScroll, width: clientWidth }}
    >
      <div
        style={{ transform: `translate3d(${barLeft}px, 0, 0)`, width: `${barWidth}px` }}
        className={clsx(
          `${prefixCls}-sticky-scroll-bar`,
          dragRef.current && `${prefixCls}-sticky-scroll-bar-active`,
        )}
        onMouseDown={onMouseDown}
      />
    </div>
  );
};

export default StickyScrollBar;
