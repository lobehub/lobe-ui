'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const getList = () =>
  typeof window === 'undefined' ? undefined : (window.matchMedia?.(QUERY) ?? undefined);

const subscribe = (listener: () => void) => {
  const list = getList();
  if (!list) return () => {};
  list.addEventListener('change', listener);
  return () => list.removeEventListener('change', listener);
};

/** `true` when the user asks for reduced motion; `false` on the server. */
export const useReducedMotion = () =>
  useSyncExternalStore(
    subscribe,
    () => getList()?.matches ?? false,
    () => false,
  );
