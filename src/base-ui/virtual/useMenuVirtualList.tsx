'use client';

import type React from 'react';
import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { VirtualizerHandle } from 'virtua';

import { usePointerScrollGuard } from './VirtualScrollArea';

const LIST_ITEM_SELECTOR = '[role^="menuitem"], [role="option"]';
const INDEX_ATTRIBUTE = 'data-virtual-index';
const MAX_JUMP_FRAMES = 60;

interface VirtualChildProps {
  'aria-disabled'?: boolean | 'true' | 'false';
  'aria-label'?: string;
  'children'?: React.ReactNode;
  'disabled'?: boolean;
  'label'?: string;
  'onFocus'?: (event: React.FocusEvent<HTMLElement>) => void;
}

export interface ListEntry {
  disabled: boolean;
  label: string;
}

export interface UseMenuVirtualListParams {
  children: React.ReactNode;
  enabled: boolean | undefined;
  /**
   * Typeahead label for a child. Defaults to its `label` prop, then `aria-label`, then the
   * flattened text of its children.
   */
  getItemLabel?: (child: ReactElement, index: number) => string | undefined;
  keepMounted?: readonly number[];
  /**
   * Idle time after which the typeahead query resets; matches Base UI's per-component value.
   * @default 500
   */
  typeaheadResetMs?: number;
}

export const flattenText = (node: React.ReactNode): string => {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join('');
  if (isValidElement<{ children?: React.ReactNode }>(node)) return flattenText(node.props.children);
  return '';
};

const readEntry = (
  child: React.ReactNode,
  index: number,
  getItemLabel: UseMenuVirtualListParams['getItemLabel'],
): ListEntry => {
  if (!isValidElement<VirtualChildProps>(child)) return { disabled: true, label: '' };
  const props = child.props;
  const label =
    getItemLabel?.(child, index) ??
    props.label ??
    props['aria-label'] ??
    flattenText(props.children);
  const disabled =
    Boolean(props.disabled) || props['aria-disabled'] === true || props['aria-disabled'] === 'true';
  return { disabled, label: label.trim() };
};

export const findMatch = (entries: ListEntry[], query: string, startIndex: number) => {
  if (entries.length === 0) return -1;
  const lowerQuery = query.toLowerCase();
  const start = ((startIndex % entries.length) + entries.length) % entries.length;
  for (let offset = 0; offset < entries.length; offset += 1) {
    const index = (start + offset) % entries.length;
    const entry = entries[index];
    if (!entry.disabled && entry.label.toLowerCase().startsWith(lowerQuery)) return index;
  }
  return -1;
};

export const findEdge = (entries: ListEntry[], fromEnd: boolean) => {
  if (fromEnd) {
    for (let index = entries.length - 1; index >= 0; index -= 1) {
      if (!entries[index].disabled) return index;
    }
    return -1;
  }
  return entries.findIndex((entry) => !entry.disabled);
};

export function useMenuVirtualList({
  children,
  enabled,
  getItemLabel,
  keepMounted,
  typeaheadResetMs = 500,
}: UseMenuVirtualListParams) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const virtualizerRef = useRef<VirtualizerHandle | null>(null);
  const focusedItemRef = useRef<HTMLElement | null>(null);
  const activeIndexRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // A Home/End/typeahead target stays mounted until focus actually lands on it, so the
  // focusin resync (which re-sets the active index to the still-focused old row) can't unmount
  // it mid-scroll on a large jump.
  const jumpTargetRef = useRef<number | null>(null);
  const [jumpTarget, setJumpTarget] = useState<number | null>(null);
  const { pointerScrollRef, scrollGuardProps } = usePointerScrollGuard();

  const entries = useMemo(
    () =>
      enabled
        ? (Children.map(children, (child, index) => readEntry(child, index, getItemLabel)) ?? [])
        : [],
    [children, enabled, getItemLabel],
  );

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

  // Keeps focus inside the popup on the viewport, so a row unmounting under the old focus never
  // drops focus to the body mid-jump — Base UI Menu closes on focus-out.
  const parkFocus = useCallback(() => {
    const viewport = viewportRef.current;
    if (viewport && !viewport.contains(document.activeElement)) {
      viewport.focus({ preventScroll: true });
    }
  }, []);

  const settleScrollRef = useRef(-1);
  // Focus the jump target only once the scroll has settled on it (its row is mounted and the
  // offset stopped changing), so we never focus a row that's about to unmount and orphan focus.
  const focusJumpTarget = useCallback(() => {
    const index = jumpTargetRef.current;
    const viewport = viewportRef.current;
    if (index === null || !viewport) return false;
    parkFocus();
    const scrollTop = viewport.scrollTop;
    const settled = scrollTop === settleScrollRef.current;
    settleScrollRef.current = scrollTop;
    if (!settled) return false;
    const child = viewport.querySelector<HTMLElement>(`[${INDEX_ATTRIBUTE}="${index}"]`);
    const target =
      child &&
      (child.matches(LIST_ITEM_SELECTOR)
        ? child
        : child.querySelector<HTMLElement>(LIST_ITEM_SELECTOR));
    if (!target) return false;
    guardScrollIntoView(target);
    focusedItemRef.current = target;
    target.focus({ preventScroll: true });
    return true;
  }, [guardScrollIntoView, parkFocus]);

  // The virtualizer shifts its window in response to keyboard nav and jumps, so react to every
  // DOM change: finish a pending jump the moment its target mounts, otherwise keep Base UI's
  // highlight index in step by re-firing focusin on the still-focused row (or, if it was
  // unmounted, park focus on the viewport so the popup keydown handlers stay reachable).
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!enabled || !viewport) return;
    const observer = new MutationObserver(() => {
      if (jumpTargetRef.current !== null) {
        focusJumpTarget();
        return;
      }
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
  }, [enabled, focusJumpTarget]);

  const jumpFrameRef = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (jumpFrameRef.current !== null) cancelAnimationFrame(jumpFrameRef.current);
    };
  }, []);

  const jumpTo = useCallback(
    (index: number) => {
      activeIndexRef.current = index;
      jumpTargetRef.current = index;
      setActiveIndex(index);
      setJumpTarget(index);
      // Park focus on the viewport (inside the popup) before scrolling, so the row being
      // unmounted underneath the old focus never drops focus to the body — which would trip
      // Base UI Menu's focus-out close mid-jump.
      viewportRef.current?.focus({ preventScroll: true });
      settleScrollRef.current = -1;
      virtualizerRef.current?.scrollToIndex(index, { align: 'nearest' });
      // The MutationObserver finishes the jump on mount; kick it in case the target is already
      // mounted (a short jump) and produces no mutation.
      if (jumpFrameRef.current !== null) cancelAnimationFrame(jumpFrameRef.current);
      let frames = 0;
      const kick = () => {
        jumpFrameRef.current = null;
        focusJumpTarget();
        frames += 1;
        // Loop until the real focus event lands (which clears `jumpTargetRef` in onFocus), so a
        // mid-scroll remount that orphans focus is recovered on the next frame; cap so a target
        // that never mounts can't spin forever.
        if (jumpTargetRef.current !== null && frames < MAX_JUMP_FRAMES) {
          jumpFrameRef.current = requestAnimationFrame(kick);
        } else if (jumpTargetRef.current !== null) {
          jumpTargetRef.current = null;
          setJumpTarget(null);
        }
      };
      jumpFrameRef.current = requestAnimationFrame(kick);
    },
    [focusJumpTarget],
  );

  const queryRef = useRef('');
  const lastMatchRef = useRef<number | null>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetQuery = useCallback(() => {
    queryRef.current = '';
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    resetTimeoutRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, []);

  // Runs in the capture phase so Base UI's own Home/End and typeahead, which only see the
  // mounted rows, never get the event. Mirrors `useTypeahead`: printable keys accumulate for
  // `typeaheadResetMs`, a lone space activates while a space mid-query keeps typing, rapid
  // repeats of one letter cycle through matches, and the search starts after the focused row
  // and wraps.
  const handleKeyDownCapture = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (!enabled || entries.length === 0) return;
      if (event.target instanceof HTMLElement && event.target.matches('input, textarea')) return;

      if (event.key === 'Home' || event.key === 'End') {
        const fromEnd = event.key === 'End';
        const index = findEdge(entries, fromEnd);
        if (index === -1) return;
        event.preventDefault();
        event.stopPropagation();
        resetQuery();
        jumpTo(index);
        return;
      }

      if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key === ' ' && queryRef.current === '') return;
      event.preventDefault();
      event.stopPropagation();

      const isNewSession = queryRef.current === '';
      const allowRapidRepeat = entries.every(
        (entry) =>
          entry.disabled || entry.label[0]?.toLowerCase() !== entry.label[1]?.toLowerCase(),
      );
      if (allowRapidRepeat && queryRef.current === event.key) {
        queryRef.current = '';
      }
      queryRef.current += event.key;
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = setTimeout(resetQuery, typeaheadResetMs);

      const previous =
        isNewSession || queryRef.current.length === 1
          ? (activeIndexRef.current ?? lastMatchRef.current ?? -1)
          : (lastMatchRef.current ?? activeIndexRef.current ?? -1);
      const startIndex = queryRef.current.length === 1 ? previous + 1 : previous;
      const index = findMatch(entries, queryRef.current, startIndex);
      if (index !== -1) {
        lastMatchRef.current = index;
        jumpTo(index);
      } else if (event.key !== ' ') {
        resetQuery();
      }
    },
    [enabled, entries, jumpTo, resetQuery, typeaheadResetMs],
  );

  const virtualChildren = useMemo(() => {
    if (!enabled) return children;
    return Children.map(children, (child, index) => {
      if (!isValidElement<VirtualChildProps>(child)) return child;
      const { onFocus } = child.props;
      const extraProps: Record<string, unknown> = {
        [INDEX_ATTRIBUTE]: index,
        onFocus: (event: React.FocusEvent<HTMLElement>) => {
          onFocus?.(event);
          const item = (event.target as HTMLElement).closest<HTMLElement>(LIST_ITEM_SELECTOR);
          if (item && event.currentTarget.contains(item)) {
            focusedItemRef.current = item;
            guardScrollIntoView(item);
          }
          activeIndexRef.current = index;
          setActiveIndex(index);
          if (jumpTargetRef.current === index) {
            jumpTargetRef.current = null;
            setJumpTarget(null);
          }
        },
      };
      return cloneElement(child, extraProps);
    });
  }, [children, enabled, guardScrollIntoView]);

  const keepMountedIndices = useMemo(() => {
    if (!enabled) return undefined;
    const count = Children.count(children);
    const indices = new Set(keepMounted);
    if (activeIndex !== null) indices.add(activeIndex);
    if (jumpTarget !== null) indices.add(jumpTarget);
    const inRange = [...indices].filter((index) => index >= 0 && index < count);
    return inRange.length ? inRange : undefined;
  }, [activeIndex, children, enabled, jumpTarget, keepMounted]);

  // While a jump is in flight, a row unmounting under focus fires blur → focus to the body,
  // which trips Base UI Menu's focus-out close. Catch it and pull focus back to the viewport
  // (still inside the popup) synchronously before the close can run.
  const handleBlur = useCallback((event: React.FocusEvent<HTMLElement>) => {
    if (jumpTargetRef.current === null) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    if (event.relatedTarget && viewport.contains(event.relatedTarget)) return;
    viewport.focus({ preventScroll: true });
  }, []);

  const viewportProps = useMemo(
    () => ({ ...scrollGuardProps, onBlur: handleBlur, onKeyDownCapture: handleKeyDownCapture }),
    [handleBlur, handleKeyDownCapture, scrollGuardProps],
  );

  return { keepMountedIndices, viewportProps, viewportRef, virtualChildren, virtualizerRef };
}
