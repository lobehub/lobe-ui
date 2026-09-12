'use client';

import type React from 'react';
import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { usePointerScrollGuard } from './VirtualScrollArea';

const LIST_ITEM_SELECTOR = '[role^="menuitem"], [role="option"]';

interface VirtualChildProps {
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
}

export interface UseMenuVirtualListParams {
  children: React.ReactNode;
  enabled: boolean | undefined;
  keepMounted?: readonly number[];
}

export function useMenuVirtualList({ children, enabled, keepMounted }: UseMenuVirtualListParams) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const focusedItemRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { pointerScrollRef, scrollGuardProps } = usePointerScrollGuard();

  // Base UI numbers list items by DOM position among mounted nodes, so the highlighted index
  // goes stale every time the virtualizer shifts its window; re-firing focusin on the focused
  // item makes Base UI re-read its index and keeps highlight, focus, and arrow keys in step. If
  // the focused item got unmounted anyway, park focus on the viewport so the popup keydown
  // handlers stay reachable.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!enabled || !viewport) return;
    const observer = new MutationObserver(() => {
      const focusedItem = focusedItemRef.current;
      const active = document.activeElement;
      if (focusedItem && !focusedItem.isConnected && active === document.body) {
        focusedItemRef.current = null;
        viewport.focus({ preventScroll: true });
        return;
      }
      if (focusedItem && active === focusedItem) {
        focusedItem.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      }
    });
    observer.observe(viewport, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [enabled]);

  // Base UI scrolls the focused item into view right after focusing it; while the pointer is
  // scrolling that would yank the list back, so the item's scrollIntoView checks the guard.
  const guardScrollIntoView = useCallback(
    (item: HTMLElement) => {
      if (Object.hasOwn(item, 'scrollIntoView')) return;
      item.scrollIntoView = (...args) => {
        if (!pointerScrollRef.current) HTMLElement.prototype.scrollIntoView.call(item, ...args);
      };
    },
    [pointerScrollRef],
  );

  const virtualChildren = useMemo(() => {
    if (!enabled) return children;
    return Children.map(children, (child, index) => {
      if (!isValidElement<VirtualChildProps>(child)) return child;
      const { onFocus } = child.props;
      return cloneElement<VirtualChildProps>(child, {
        onFocus: (event: React.FocusEvent<HTMLElement>) => {
          onFocus?.(event);
          const item = (event.target as HTMLElement).closest<HTMLElement>(LIST_ITEM_SELECTOR);
          if (item && event.currentTarget.contains(item)) {
            focusedItemRef.current = item;
            guardScrollIntoView(item);
          }
          setActiveIndex(index);
        },
      });
    });
  }, [children, enabled, guardScrollIntoView]);

  const keepMountedIndices = useMemo(() => {
    if (!enabled) return undefined;
    const count = Children.count(children);
    const indices = new Set(keepMounted);
    if (activeIndex !== null) indices.add(activeIndex);
    const inRange = [...indices].filter((index) => index >= 0 && index < count);
    return inRange.length ? inRange : undefined;
  }, [activeIndex, children, enabled, keepMounted]);

  return { keepMountedIndices, scrollGuardProps, viewportRef, virtualChildren };
}
