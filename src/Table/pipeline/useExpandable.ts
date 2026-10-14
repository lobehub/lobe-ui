import { type Key, useMemo, useState } from 'react';

import { useEventCallback } from '@/hooks/useEventCallback';

import type { TableExpandableConfig } from '../type';
import { isPlainObject } from './selectionUtils';

export type ExpandType = 'nest' | 'row' | null;

const findAllChildrenKeys = <T>(
  data: readonly T[],
  getRowKey: (record: T, index: number) => Key,
  childrenColumnName: string,
) => {
  const keys: Key[] = [];
  const dig = (list: readonly T[] | undefined) => {
    (list || []).forEach((item, index) => {
      keys.push(getRowKey(item, index));
      dig((item as Record<string, unknown>)?.[childrenColumnName] as T[] | undefined);
    });
  };
  dig(data);
  return keys;
};

export const getExpandType = <T>(
  data: readonly T[],
  childrenColumnName: string,
  expandable: TableExpandableConfig<T> | undefined,
): ExpandType => {
  if (expandable?.expandedRowRender) return 'row';
  if (data.some((record) => isPlainObject(record) && record[childrenColumnName])) return 'nest';
  return null;
};

export const useExpandable = <T>({
  childrenColumnName,
  expandable,
  getRowKey,
  pageData,
}: {
  childrenColumnName: string;
  expandable: TableExpandableConfig<T> | undefined;
  getRowKey: (record: T, index: number) => Key;
  pageData: readonly T[];
}) => {
  const { defaultExpandAllRows, defaultExpandedRowKeys, expandedRowKeys, onExpand } =
    expandable ?? {};
  const onExpandedRowsChange = expandable?.onExpandedRowsChange;

  const [innerKeys, setInnerKeys] = useState<readonly Key[]>(() => {
    if (defaultExpandedRowKeys) return defaultExpandedRowKeys;
    if (defaultExpandAllRows) return findAllChildrenKeys(pageData, getRowKey, childrenColumnName);
    return [];
  });

  const expandedKeys = useMemo(
    (): ReadonlySet<Key> => new Set(expandedRowKeys ?? innerKeys),
    [expandedRowKeys, innerKeys],
  );

  const toggle = useEventCallback((record: T) => {
    const key = getRowKey(record, pageData.indexOf(record));
    const hasKey = expandedKeys.has(key);
    const next = hasKey ? [...expandedKeys].filter((item) => item !== key) : [...expandedKeys, key];
    setInnerKeys(next);
    onExpand?.(!hasKey, record);
    onExpandedRowsChange?.(next);
  });

  return { expandedKeys, toggle };
};
