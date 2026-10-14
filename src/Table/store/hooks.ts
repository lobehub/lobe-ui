'use client';

import { createContext, type Key, use, useCallback, useSyncExternalStore } from 'react';

import { createTableStore, type TableStore, type TableStoreState } from './createTableStore';

const fallbackStore = createTableStore();

const TableStoreContext = createContext<TableStore>(fallbackStore);

export const TableStoreProvider = TableStoreContext.Provider;

export const useTableStoreInstance = () => use(TableStoreContext);

export const useTableStore = <S>(selector: (state: TableStoreState) => S): S => {
  const store = use(TableStoreContext);
  const getSnapshot = useCallback(() => selector(store.getState()), [store, selector]);
  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
};

export const useRowSelected = (key: Key) =>
  useTableStore(useCallback((state: TableStoreState) => state.selectedKeys.has(key), [key]));

export const useRowHalfSelected = (key: Key) =>
  useTableStore(useCallback((state: TableStoreState) => state.halfSelectedKeys.has(key), [key]));

export const useRowExpanded = (key: Key) =>
  useTableStore(useCallback((state: TableStoreState) => state.expandedKeys.has(key), [key]));

export const useCellHovered = (index: number, rowSpan: number) =>
  useTableStore(
    useCallback(
      ({ hover: [start, end] }: TableStoreState) => start <= index + rowSpan - 1 && end >= index,
      [index, rowSpan],
    ),
  );

export const useColumnSorted = (columnId: string) =>
  useTableStore(
    useCallback((state: TableStoreState) => state.sortedColumns.has(columnId), [columnId]),
  );

const selectSummary = (state: TableStoreState) => state.selectionSummary;

export const useSelectionSummary = () => useTableStore(selectSummary);
