'use client';

import * as stylex from '@stylexjs/stylex';
import {
  Children,
  cloneElement,
  type ReactElement,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useMergeRefs } from 'react-merge-refs';
import { Virtualizer, type VirtualizerHandle } from 'virtua';

import {
  ScrollAreaRoot,
  type ScrollAreaRootProps,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewportImpl,
  type ScrollAreaViewportProps,
} from '@/ScrollArea/atoms';
import { styleProps } from '@/styles/stylex/props';

// `--lobe-virtual-scroll-inset` is the inline padding of the box the scroll area sits in: the
// root bleeds out by it so the scrollbar hugs that box's edge, and the viewport pads the rows back.
const styles = stylex.create({
  root: {
    marginInline: 'calc(-1 * var(--lobe-virtual-scroll-inset, 0px))',
    display: 'flex',
    flexBasis: '0%',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    minHeight: 0,
  },
  viewport: {
    paddingInline: 'var(--lobe-virtual-scroll-inset, 0)',
    flexBasis: '0%',
    flexGrow: 1,
    flexShrink: 1,
    height: 'auto',
    minHeight: 0,
  },
});

// Rows mounted on the very first render, before the viewport is measured, so Base UI's
// list navigation sees the leading rows (not a pinned footer item) when it focuses on open.
const INITIAL_ROW_COUNT = 20;

export interface VirtualScrollAreaProps extends Omit<ScrollAreaRootProps, 'children'> {
  children: ReactNode;
  itemSize?: number;
  keepMounted?: readonly number[];
  /**
   * Element that owns the scrolling box (e.g. a Base UI `Select.List`); it is rendered
   * through the ScrollArea viewport so its own props and role win.
   */
  viewport?: ReactElement<{ children?: ReactNode; render?: ReactElement }>;
  viewportProps?: ScrollAreaViewportProps;
  virtualizerRef?: Ref<VirtualizerHandle>;
}

export const VirtualScrollArea = ({
  children,
  className,
  itemSize,
  keepMounted,
  viewport,
  viewportProps,
  virtualizerRef,
  ...rest
}: VirtualScrollAreaProps) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const mergedViewportRef = useMergeRefs([viewportRef, viewportProps?.ref]);

  const list = (
    <Virtualizer
      itemSize={itemSize}
      keepMounted={keepMounted}
      ref={virtualizerRef}
      scrollRef={viewportRef}
      ssrCount={Math.min(INITIAL_ROW_COUNT, Children.count(children))}
    >
      {children}
    </Virtualizer>
  );
  const viewportElement = (
    <ScrollAreaViewportImpl
      tabIndex={-1}
      {...viewportProps}
      ref={mergedViewportRef}
      xstyle={styles.viewport}
    />
  );

  return (
    <ScrollAreaRoot
      data-virtual=""
      {...rest}
      className={styleProps(styles.root, className as string).className}
    >
      {cloneElement(viewport ?? viewportElement, {
        children: list,
        ...(viewport && { render: viewportElement }),
      })}
      <ScrollAreaScrollbar>
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    </ScrollAreaRoot>
  );
};

VirtualScrollArea.displayName = 'VirtualScrollArea';

// Base UI scrolls the highlighted item into view after focusing it; while the pointer drives
// the scroll that would yank the list back, so callers consult `pointerScrollRef` first.
export function usePointerScrollGuard() {
  const pointerScrollRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const markPointerScroll = useCallback(() => {
    pointerScrollRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      pointerScrollRef.current = false;
    }, 120);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    markPointerScroll,
    pointerScrollRef,
    scrollGuardProps: {
      onPointerDown: markPointerScroll,
      onTouchMove: markPointerScroll,
      onWheel: markPointerScroll,
    },
  };
}
