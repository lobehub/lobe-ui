import { type Key, useCallback, useRef } from 'react';

export const useRowCache = <T extends Record<string, any>>(
  rows: readonly T[],
  rowKey: string | ((record: T, index?: number) => Key),
) => {
  const cacheRef = useRef(new Map<Key, T>());
  rows.forEach((record, index) =>
    cacheRef.current.set(
      typeof rowKey === 'function' ? rowKey(record, index) : record[rowKey],
      record,
    ),
  );
  return useCallback((key: Key) => cacheRef.current.get(key), []);
};
