import { useEffect, useRef } from 'react';

import { hasModifier, isItemVisible, isTextInputTarget, scopeSelector } from './domUtils';
import { getActiveScopeId, setLastFocusedItem } from './store';

export interface UseScopeArrowNavOptions {
  enabled?: boolean;
  extra?: Record<string, (event: KeyboardEvent) => void>;
  itemSelector?: string;
  onItemFocus?: (el: HTMLElement) => void;
  scopeId: string;
  vimKeys?: boolean;
}

// Sibling instances for one scope id (mobile + desktop mounts) all see the same
// KeyboardEvent; the first one claims it so focus only moves once.
let lastHandledEvent: KeyboardEvent | null = null;

const focusListeners = new Map<string, Set<(el: HTMLElement) => void>>();

const registerItemFocus = (scopeId: string, listener: (el: HTMLElement) => void) => {
  const set = focusListeners.get(scopeId) ?? new Set();
  set.add(listener);
  focusListeners.set(scopeId, set);
  return () => {
    set.delete(listener);
    if (set.size === 0) focusListeners.delete(scopeId);
  };
};

export const notifyScopeItemFocus = (scopeId: string, el: HTMLElement) => {
  const id = el.dataset.id;
  if (id) setLastFocusedItem(scopeId, id);
  focusListeners.get(scopeId)?.forEach((listener) => listener(el));
};

export const getScopeRoot = (scopeId: string): HTMLElement | null => {
  const selector = scopeSelector(scopeId);
  const active = document.activeElement;
  if (active instanceof HTMLElement) {
    const owned = active.closest<HTMLElement>(selector);
    if (owned) return owned;
  }
  const candidates = [...document.querySelectorAll<HTMLElement>(selector)];
  return candidates.find(isItemVisible) ?? candidates[0] ?? null;
};

export const focusScopeItem = (scopeId: string, el: HTMLElement) => {
  el.focus({ preventScroll: true });
  el.scrollIntoView?.({ block: 'nearest' });
  notifyScopeItemFocus(scopeId, el);
};

export const useScopeArrowNav = ({
  scopeId,
  itemSelector = '[data-scope-item]',
  enabled = true,
  vimKeys = false,
  onItemFocus,
  extra,
}: UseScopeArrowNavOptions) => {
  const optionsRef = useRef({ extra, itemSelector, onItemFocus, scopeId });
  optionsRef.current = { extra, itemSelector, onItemFocus, scopeId };

  useEffect(() => {
    if (!onItemFocus) return;
    return registerItemFocus(scopeId, (el) => optionsRef.current.onItemFocus?.(el));
  }, [scopeId, !!onItemFocus]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const getItems = () => {
      const root = getScopeRoot(optionsRef.current.scopeId);
      if (!root) return [];
      return [...root.querySelectorAll<HTMLElement>(optionsRef.current.itemSelector)].filter(
        isItemVisible,
      );
    };

    const currentIndex = (items: HTMLElement[]) => {
      const active = document.activeElement;
      if (!(active instanceof HTMLElement)) return -1;
      const item = active.closest<HTMLElement>(optionsRef.current.itemSelector);
      return item ? items.indexOf(item) : -1;
    };

    const move = (direction: 1 | -1) => {
      const items = getItems();
      if (items.length === 0) return;
      const index = currentIndex(items);
      const next =
        index === -1
          ? direction === 1
            ? 0
            : items.length - 1
          : (index + direction + items.length) % items.length;
      focusScopeItem(optionsRef.current.scopeId, items[next]);
    };

    const edge = (which: 'first' | 'last') => {
      const items = getItems();
      if (items.length === 0) return;
      focusScopeItem(optionsRef.current.scopeId, items[which === 'first' ? 0 : items.length - 1]);
    };

    const isReachable = () => {
      const id = optionsRef.current.scopeId;
      if (getActiveScopeId() === id) return true;
      const active = document.activeElement;
      return active instanceof HTMLElement && !!active.closest(scopeSelector(id));
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || lastHandledEvent === event) return;
      if (hasModifier(event) || isTextInputTarget(event.target) || !isReachable()) return;

      const builtin: Record<string, () => void> = {
        ArrowDown: () => move(1),
        ArrowUp: () => move(-1),
        End: () => edge('last'),
        Home: () => edge('first'),
        ...(vimKeys && { j: () => move(1), k: () => move(-1) }),
      };
      const extraHandler = optionsRef.current.extra?.[event.key];
      const handler = builtin[event.key] ?? (extraHandler && (() => extraHandler(event)));
      if (!handler) return;

      lastHandledEvent = event;
      event.preventDefault();
      handler();
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [enabled, vimKeys]);
};
