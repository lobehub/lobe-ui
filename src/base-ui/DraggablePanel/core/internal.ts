'use client';

import { useEffect, useLayoutEffect, useSyncExternalStore } from 'react';

export const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

export const useStore = <T>(subscribe: (listener: () => void) => () => void, get: () => T) =>
  useSyncExternalStore(subscribe, get, get);
