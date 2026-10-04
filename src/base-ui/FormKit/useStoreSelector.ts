import { useCallback, useRef, useSyncExternalStore } from 'react';

import type { FormEngine } from './engine/types';

export const shallowEqual = (a: unknown, b: unknown) => {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  const keysA = Object.keys(a);
  if (keysA.length !== Object.keys(b).length) return false;
  return keysA.every((key) => Object.is((a as any)[key], (b as any)[key]));
};

export const useStoreSelector = <S>(engine: FormEngine, select: (engine: FormEngine) => S): S => {
  const selectRef = useRef(select);
  selectRef.current = select;
  const cache = useRef<{ value: S } | null>(null);

  const getSnapshot = useCallback(() => {
    const next = selectRef.current(engine);
    if (cache.current && shallowEqual(cache.current.value, next)) return cache.current.value;
    cache.current = { value: next };
    return next;
  }, [engine]);

  return useSyncExternalStore(engine.subscribe, getSnapshot, getSnapshot);
};
