import type { Key } from 'react';

export interface SelectionSummary {
  checked: boolean;
  disabled: boolean;
  indeterminate: boolean;
}

export interface TableStoreState {
  expandedKeys: ReadonlySet<Key>;
  halfSelectedKeys: ReadonlySet<Key>;
  hover: readonly [number, number];
  selectedKeys: ReadonlySet<Key>;
  selectionSummary: SelectionSummary;
  sortedColumns: ReadonlySet<string>;
}

export interface TableStore {
  getState: () => TableStoreState;
  setState: (patch: Partial<TableStoreState>) => void;
  subscribe: (listener: () => void) => () => void;
}

const EMPTY_KEYS: ReadonlySet<Key> = new Set();
const EMPTY_COLUMNS: ReadonlySet<string> = new Set();
const NO_HOVER = [-1, -1] as const;
const EMPTY_SUMMARY: SelectionSummary = { checked: false, disabled: false, indeterminate: false };

export const createTableStore = (initial?: Partial<TableStoreState>): TableStore => {
  let state: TableStoreState = {
    expandedKeys: EMPTY_KEYS,
    halfSelectedKeys: EMPTY_KEYS,
    hover: NO_HOVER,
    selectedKeys: EMPTY_KEYS,
    selectionSummary: EMPTY_SUMMARY,
    sortedColumns: EMPTY_COLUMNS,
    ...initial,
  };
  const listeners = new Set<() => void>();

  return {
    getState: () => state,
    setState: (patch) => {
      const changed = (Object.keys(patch) as (keyof TableStoreState)[]).some(
        (key) => !Object.is(patch[key], state[key]),
      );
      if (!changed) return;
      state = { ...state, ...patch };
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};
