'use client';

import {
  type CSSProperties,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { useEventCallback } from '@/hooks/useEventCallback';

import { TableElement } from '../atoms';
import { useTableView } from './context';

export const FixedHolder = ({
  children,
  className,
  colGroup,
  holderRef,
  onWheelX,
  stickyStyle,
  tableLayout,
  scrollX,
}: {
  children: ReactNode;
  className: string;
  colGroup: ReactNode;
  holderRef: Ref<HTMLDivElement>;
  onWheelX: (target: HTMLDivElement, scrollLeft: number) => void;
  scrollX?: number | string | true;
  stickyStyle?: CSSProperties;
  tableLayout: 'auto' | 'fixed';
}) => {
  const { components } = useTableView();
  const ref = useRef<HTMLDivElement | null>(null);
  const onWheel = useEventCallback(onWheelX);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const handler = (event: WheelEvent) => {
      if (!event.deltaX) return;
      const max = element.scrollWidth - element.clientWidth;
      const next = Math.min(Math.max(element.scrollLeft + event.deltaX, 0), max);
      onWheel(element, next);
      event.preventDefault();
    };
    element.addEventListener('wheel', handler, { passive: false });
    return () => element.removeEventListener('wheel', handler);
  }, [onWheel]);

  const setRef = useCallback(
    (element: HTMLDivElement | null) => {
      ref.current = element;
      if (typeof holderRef === 'function') holderRef(element);
      else if (holderRef) holderRef.current = element;
    },
    [holderRef],
  );

  return (
    <div className={className} ref={setRef} style={{ overflow: 'hidden', ...stickyStyle }}>
      <TableElement
        component={components.headerTable}
        style={{ minWidth: '100%', tableLayout, width: scrollX === true ? 'auto' : scrollX }}
      >
        {colGroup}
        {children}
      </TableElement>
    </div>
  );
};
