import type { Key } from 'react';

import type { TableColumn } from './type';

/** Placeholder in `columns` marking where the selection column goes. */
export const SELECTION_COLUMN = {} as TableColumn<any>;
export const SELECTION_ALL = 'SELECT_ALL' as const;
export const SELECTION_INVERT = 'SELECT_INVERT' as const;
export const SELECTION_NONE = 'SELECT_NONE' as const;

/** A tree record with its position, for `checkStrictly: false` cascading. */
export interface SelectionEntity<T> {
  children: SelectionEntity<T>[];
  key: Key;
  level: number;
  parent?: SelectionEntity<T>;
  record: T;
}

export type SelectionEntities<T> = Map<Key, SelectionEntity<T>>;

export const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Every record of `data`, tree children included, in display order. */
export const flattenData = <T>(childrenColumnName: string, data: readonly T[] | undefined) => {
  const list: T[] = [];
  const dig = (records: readonly T[] | undefined) => {
    (records || []).forEach((record) => {
      list.push(record);
      if (isPlainObject(record) && childrenColumnName in record) {
        dig(record[childrenColumnName] as T[]);
      }
    });
  };
  dig(data);
  return list;
};

/** rc-tree `convertDataToEntities`, keyed by row key. */
export const convertDataToEntities = <T>(
  data: readonly T[],
  getRowKey: (record: T, index: number) => Key,
  childrenColumnName: string,
): SelectionEntities<T> => {
  const entities: SelectionEntities<T> = new Map();
  const dig = (records: readonly T[], level: number, parent?: SelectionEntity<T>) => {
    records.forEach((record, index) => {
      const entity: SelectionEntity<T> = {
        children: [],
        key: getRowKey(record, index),
        level,
        parent,
        record,
      };
      entities.set(entity.key, entity);
      parent?.children.push(entity);
      const children = isPlainObject(record) ? record[childrenColumnName] : undefined;
      if (Array.isArray(children)) dig(children as T[], level + 1, entity);
    });
  };
  dig(data, 0);
  return entities;
};

type IsDisabled<T> = (record: T) => boolean;

const groupByLevel = <T>(entities: SelectionEntities<T>) => {
  const levels = new Map<number, SelectionEntity<T>[]>();
  let maxLevel = 0;
  entities.forEach((entity) => {
    const list = levels.get(entity.level);
    if (list) list.push(entity);
    else levels.set(entity.level, [entity]);
    maxLevel = Math.max(maxLevel, entity.level);
  });
  return { levels, maxLevel };
};

/** Bottom-up pass shared by fill and clean: decides each parent from its enabled children. */
const conductUp = <T>(
  checkedKeys: Set<Key>,
  levels: Map<number, SelectionEntity<T>[]>,
  maxLevel: number,
  isDisabled: IsDisabled<T>,
  mode: 'fill' | 'clean',
) => {
  const halfCheckedKeys = new Set<Key>();
  const visited = new Set<Key>();
  for (let level = maxLevel; level >= 0; level -= 1) {
    for (const { parent, record } of levels.get(level) ?? []) {
      if (isDisabled(record) || !parent || visited.has(parent.key)) continue;
      visited.add(parent.key);
      if (isDisabled(parent.record)) continue;

      let allChecked = true;
      let partialChecked = false;
      for (const child of parent.children) {
        if (isDisabled(child.record)) continue;
        const checked = checkedKeys.has(child.key);
        if (!checked) allChecked = false;
        if (checked || halfCheckedKeys.has(child.key)) partialChecked = true;
      }
      if (mode === 'fill' && allChecked) checkedKeys.add(parent.key);
      if (mode === 'clean' && !allChecked) checkedKeys.delete(parent.key);
      if (partialChecked) halfCheckedKeys.add(parent.key);
    }
  }
  return {
    checkedKeys: [...checkedKeys],
    halfCheckedKeys: [...halfCheckedKeys].filter((key) => !checkedKeys.has(key)),
  };
};

/**
 * rc-tree `conductCheck`: `true` fills in descendants and fully-checked ancestors of `keyList`;
 * `{ checked: false, halfCheckedKeys }` cleans up after a key was removed. Disabled rows neither
 * pass the check on nor count toward their parent. Keys missing from `entities` are dropped.
 */
export const conductCheck = <T>(
  keyList: readonly Key[],
  checked: true | { checked: false; halfCheckedKeys: Key[] },
  entities: SelectionEntities<T>,
  isDisabled: IsDisabled<T>,
) => {
  const checkedKeys = new Set(keyList.filter((key) => entities.has(key)));
  const { levels, maxLevel } = groupByLevel(entities);

  if (checked === true) {
    for (let level = 0; level <= maxLevel; level += 1) {
      for (const { children, key, record } of levels.get(level) ?? []) {
        if (!checkedKeys.has(key) || isDisabled(record)) continue;
        for (const child of children) {
          if (!isDisabled(child.record)) checkedKeys.add(child.key);
        }
      }
    }
    return conductUp(checkedKeys, levels, maxLevel, isDisabled, 'fill');
  }

  const halfKeys = new Set(checked.halfCheckedKeys);
  for (let level = 0; level <= maxLevel; level += 1) {
    for (const { children, key, record } of levels.get(level) ?? []) {
      if (checkedKeys.has(key) || halfKeys.has(key) || isDisabled(record)) continue;
      for (const child of children) {
        if (!isDisabled(child.record)) checkedKeys.delete(child.key);
      }
    }
  }
  return conductUp(checkedKeys, levels, maxLevel, isDisabled, 'clean');
};

/**
 * antd `useMultipleSelect`: Shift-click toggles the range between the previous click and
 * `currentIndex` in `keys`, mutating `selectedKeys`. Returns the changed keys and the next anchor.
 */
export const selectRange = (
  prevIndex: number | null,
  currentIndex: number,
  keys: readonly Key[],
  selectedKeys: Set<Key>,
) => {
  const anchor = prevIndex ?? currentIndex;
  const start = Math.min(anchor || 0, currentIndex);
  const end = Math.max(anchor || 0, currentIndex);
  const rangeKeys = keys.slice(start, end + 1);
  const shouldSelect = rangeKeys.some((key) => !selectedKeys.has(key));
  const changedKeys: Key[] = [];
  for (const key of rangeKeys) {
    if (shouldSelect) {
      if (!selectedKeys.has(key)) changedKeys.push(key);
      selectedKeys.add(key);
    } else {
      selectedKeys.delete(key);
      changedKeys.push(key);
    }
  }
  return { changedKeys, nextAnchor: shouldSelect ? end : null };
};
