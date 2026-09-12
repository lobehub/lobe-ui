'use client';

import type React from 'react';
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { mergeRefs } from 'react-merge-refs';

import { usePointerScrollGuard } from '@/base-ui/ScrollArea/VirtualScrollArea';

interface VirtualChildProps {
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
  ref?: React.Ref<HTMLElement>;
}

interface UseDropdownMenuVirtualParams {
  children: React.ReactNode;
  keepMounted: readonly number[] | undefined;
  virtual: boolean | undefined;
}

export function useDropdownMenuVirtual({
  children,
  keepMounted,
  virtual,
}: UseDropdownMenuVirtualParams) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const focusedItemRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { pointerScrollRef, scrollGuardProps } = usePointerScrollGuard();

  // Base UI numbers items by DOM position among mounted nodes, so the highlighted index goes
  // stale every time the virtualizer shifts its window; re-firing focusin on the focused item
  // makes Base UI re-read its index and keeps highlight, focus, and arrow keys in step. If the
  // focused item got unmounted anyway, park focus on the viewport so the popup keydown
  // handlers stay reachable.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!virtual || !viewport) return;
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
  }, [virtual]);

  const virtualChildren = useMemo(() => {
    if (!virtual) return children;
    return Children.map(children, (child, index) => {
      if (!isValidElement<VirtualChildProps>(child)) return child;
      const { onFocus, ref } = child.props;
      return cloneElement<VirtualChildProps>(child, {
        onFocus: (event: React.FocusEvent<HTMLElement>) => {
          onFocus?.(event);
          focusedItemRef.current = event.currentTarget;
          setActiveIndex(index);
        },
        ref: mergeRefs([
          ref,
          (node: HTMLElement | null) => {
            if (!node) return;
            node.scrollIntoView = (...args) => {
              if (!pointerScrollRef.current)
                HTMLElement.prototype.scrollIntoView.call(node, ...args);
            };
          },
        ]),
      });
    });
  }, [children, pointerScrollRef, virtual]);

  const keepMountedIndices = useMemo(() => {
    if (!virtual) return undefined;
    const count = Children.count(children);
    const indices = new Set(keepMounted);
    if (activeIndex !== null) indices.add(activeIndex);
    const inRange = [...indices].filter((index) => index >= 0 && index < count);
    return inRange.length ? inRange : undefined;
  }, [activeIndex, children, keepMounted, virtual]);

  return { keepMountedIndices, scrollGuardProps, viewportRef, virtualChildren };
}
