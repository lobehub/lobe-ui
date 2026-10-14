import { type Key, type RefObject, useCallback, useMemo, useSyncExternalStore } from 'react';

import type { TableInternalHandle } from '@/Table/internal';

const EMPTY: ReadonlySet<Key> = new Set();
const noop = () => {};

export const useSelectedRowKeys = (handleRef: RefObject<TableInternalHandle | null>) => {
  const subscribe = useCallback(
    (notify: () => void) => handleRef.current?.store.subscribe(notify) ?? noop,
    [handleRef],
  );
  const getSnapshot = () => handleRef.current?.store.getState().selectedKeys ?? EMPTY;
  const keySet = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  return useMemo(() => [...keySet], [keySet]);
};
