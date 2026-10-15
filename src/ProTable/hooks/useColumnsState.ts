import { useState } from 'react';

import { useEventCallback } from '@/hooks/useEventCallback';

import type { ProColumns, ProTableColumnsState, ProTableColumnsStateMap } from '../type';
import { getProColumnKey, readPersistedState, writePersistedState } from '../utils';

export const useColumnsState = (
  columns: ProColumns<any>[],
  columnsState: ProTableColumnsState | undefined,
) => {
  const persistKey = columnsState?.persistenceKey;
  const persistType = columnsState?.persistenceType;
  const [defaultState] = useState(() => {
    const map: ProTableColumnsStateMap = {};
    columns.forEach((column, index) => {
      if (column.fixed) map[getProColumnKey(column, index)] = { fixed: column.fixed };
    });
    return { ...map, ...columnsState?.defaultValue };
  });
  const [innerState, setInnerState] = useState<ProTableColumnsStateMap>(
    () => readPersistedState(persistKey, persistType) ?? defaultState,
  );

  const setState = useEventCallback((next: ProTableColumnsStateMap) => {
    setInnerState(next);
    writePersistedState(persistKey, persistType, next);
    columnsState?.onChange?.(next);
  });
  const resetState = useEventCallback(() => {
    writePersistedState(persistKey, persistType, undefined);
    setInnerState(defaultState);
    columnsState?.onChange?.(defaultState);
  });

  return { resetState, setState, state: columnsState?.value ?? innerState };
};
