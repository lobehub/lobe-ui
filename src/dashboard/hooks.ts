'use client';

import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';

export function useMediaQuery(query: string) {
  const list = useMemo(
    () => (typeof window === 'undefined' ? null : window.matchMedia(query)),
    [query],
  );

  const subscribe = useCallback(
    (listener: () => void) => {
      if (!list) return () => {};
      list.addEventListener('change', listener);
      return () => list.removeEventListener('change', listener);
    },
    [list],
  );

  return useSyncExternalStore(
    subscribe,
    () => list?.matches ?? false,
    () => false,
  );
}

/** Phone-width layouts. Matches `responsive.mobile` (max-width 575px). */
export function useIsMobile() {
  return useMediaQuery('(max-width: 575px)');
}

/**
 * Tablet and below. Matches `responsive.laptop` (max-width 991px), which is
 * the width where a fixed console sidebar becomes a drawer.
 */
export function useIsCompact() {
  return useMediaQuery('(max-width: 991px)');
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

function readLocalStorageValue<T>(key: string | undefined, defaultValue: T): T {
  if (!key || typeof window === 'undefined') return defaultValue;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw !== null) return JSON.parse(raw) as T;
  } catch {
    // Ignore unreadable storage and keep the default.
  }
  return defaultValue;
}

/**
 * Lazily reads storage on the client so the first paint matches persisted state.
 * On the server (no `window`) the default is used; a mount effect re-syncs when
 * `key` changes or after hydration. Omit `key` to keep the value in memory only.
 */
export function useLocalStorage<T>(key: string | undefined, defaultValue: T) {
  const [value, setValue] = useState<T>(() => readLocalStorageValue(key, defaultValue));

  useEffect(() => {
    if (!key) return;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // Ignore unreadable storage and keep the current value.
    }
  }, [key]);

  const setStoredValue = useCallback<Dispatch<SetStateAction<T>>>(
    (next) => {
      setValue((current) => {
        const resolved = typeof next === 'function' ? (next as (value: T) => T)(current) : next;
        if (key) {
          try {
            window.localStorage.setItem(key, JSON.stringify(resolved));
          } catch {
            // Ignore quota and private-mode failures.
          }
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, setStoredValue] as const;
}
