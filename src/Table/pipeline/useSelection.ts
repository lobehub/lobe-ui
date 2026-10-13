import { type Key, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useEventCallback } from '@/hooks/useEventCallback';

import type {
  TableLocale,
  TableRowSelection,
  TableRowSelectionCheckboxProps,
  TableRowSelectMethod,
  TableSelectionItem,
} from '../type';
import {
  conductCheck,
  convertDataToEntities,
  flattenData,
  SELECTION_ALL,
  SELECTION_INVERT,
  SELECTION_NONE,
  type SelectionEntities,
  selectRange,
} from './selectionUtils';

const EMPTY_KEYS: Key[] = [];

export interface SelectionConfig<T> {
  childrenColumnName: string;
  data: readonly T[];
  expandType: 'nest' | 'row' | null;
  getRecordByKey: (key: Key) => T | undefined;
  getRowKey: (record: T, index?: number) => Key;
  locale: TableLocale;
  pageData: readonly T[];
}

export interface SelectionSummaryState {
  checked: boolean;
  disabled: boolean;
  indeterminate: boolean;
}

export interface MergedSelectionItem {
  key: Key;
  onSelect: () => void;
  text: TableSelectionItem['text'];
}

export interface SelectionActions {
  clear: () => void;
  selectAll: () => void;
  selectRadio: (key: Key, event: Event) => void;
  toggleCheckbox: (key: Key, checked: boolean, event: Event | undefined) => void;
}

const shallowEqual = (a: object | undefined, b: object | undefined) => {
  if (a === b) return true;
  if (!a || !b) return false;
  const keysA = Object.keys(a);
  if (keysA.length !== Object.keys(b).length) return false;
  return keysA.every((key) => Object.is((a as any)[key], (b as any)[key]));
};

const useStableCheckboxProps = <T>(
  flattedData: readonly T[],
  getRowKey: (record: T, index?: number) => Key,
  getCheckboxProps: TableRowSelection<T>['getCheckboxProps'],
) => {
  const previous = useRef<Map<Key, TableRowSelectionCheckboxProps>>(new Map());
  return useMemo(() => {
    const next = new Map<Key, TableRowSelectionCheckboxProps>();
    flattedData.forEach((record, index) => {
      next.set(getRowKey(record, index), getCheckboxProps?.(record) || {});
    });
    const prev = previous.current;
    const same =
      prev.size === next.size &&
      [...next].every(([key, props]) => prev.has(key) && shallowEqual(prev.get(key), props));
    if (same) return prev;
    previous.current = next;
    return next;
  }, [flattedData, getRowKey, getCheckboxProps]);
};

export const useSelection = <T>(
  config: SelectionConfig<T>,
  rowSelection: TableRowSelection<T> | undefined,
) => {
  const {
    checkStrictly = true,
    defaultSelectedRowKeys,
    getCheckboxProps,
    hideSelectAll,
    onChange: onSelectionChange,
    onSelect,
    onSelectAll,
    onSelectInvert,
    onSelectMultiple,
    onSelectNone,
    preserveSelectedRowKeys,
    selectedRowKeys,
    selections,
    type: selectionType = 'checkbox',
  } = rowSelection || {};
  const { childrenColumnName, data, getRecordByKey, getRowKey, locale, pageData } = config;

  const [innerKeys, setInnerKeys] = useState<Key[]>(defaultSelectedRowKeys || EMPTY_KEYS);
  const mergedKeys = selectedRowKeys ?? innerKeys;

  const prevIndexRef = useRef<number | null>(null);

  const preserveRecordsRef = useRef(new Map<Key, T | undefined>());
  const updatePreserveRecordsCache = useCallback(
    (keys: readonly Key[]) => {
      if (!preserveSelectedRowKeys) return;
      const next = new Map<Key, T | undefined>();
      keys.forEach((key) => {
        let record = getRecordByKey(key);
        if (record === undefined && preserveRecordsRef.current.has(key)) {
          record = preserveRecordsRef.current.get(key);
        }
        next.set(key, record);
      });
      preserveRecordsRef.current = next;
    },
    [getRecordByKey, preserveSelectedRowKeys],
  );

  useEffect(() => {
    updatePreserveRecordsCache(mergedKeys);
  }, [mergedKeys, updatePreserveRecordsCache]);

  const flattedData = useMemo(
    () => flattenData(childrenColumnName, pageData),
    [childrenColumnName, pageData],
  );

  const keyEntities = useMemo((): SelectionEntities<T> | null => {
    if (checkStrictly) return null;
    let convertData = data;
    if (preserveSelectedRowKeys) {
      // Records kept from other pages join the tree, unless they are on this page already.
      const keySet = new Set(flattedData.map((record) => getRowKey(record)));
      const preserved = [...preserveRecordsRef.current]
        .filter(([key, record]) => !keySet.has(key) && record !== undefined)
        .map(([, record]) => record as T);
      convertData = [...convertData, ...preserved];
    }
    return convertDataToEntities(convertData, getRowKey, childrenColumnName);
  }, [data, getRowKey, checkStrictly, childrenColumnName, preserveSelectedRowKeys, flattedData]);

  const checkboxPropsMap = useStableCheckboxProps(flattedData, getRowKey, getCheckboxProps);

  const isCheckboxDisabled = useCallback(
    (record: T) => {
      const key = getRowKey(record);
      const props = checkboxPropsMap.has(key)
        ? checkboxPropsMap.get(key)
        : getCheckboxProps?.(record);
      return Boolean(props?.disabled);
    },
    [checkboxPropsMap, getRowKey, getCheckboxProps],
  );

  const [derivedSelectedKeys, derivedHalfSelectedKeys] = useMemo((): [Key[], Key[]] => {
    if (checkStrictly || !keyEntities) return [mergedKeys, []];
    const { checkedKeys, halfCheckedKeys } = conductCheck(
      mergedKeys,
      true,
      keyEntities,
      isCheckboxDisabled,
    );
    return [checkedKeys, halfCheckedKeys];
  }, [mergedKeys, checkStrictly, keyEntities, isCheckboxDisabled]);

  const selectedKeySet = useMemo(
    () =>
      new Set(selectionType === 'radio' ? derivedSelectedKeys.slice(0, 1) : derivedSelectedKeys),
    [derivedSelectedKeys, selectionType],
  );
  const halfSelectedKeySet = useMemo(
    () => new Set(selectionType === 'radio' ? [] : derivedHalfSelectedKeys),
    [derivedHalfSelectedKeys, selectionType],
  );

  const enabled = Boolean(rowSelection);
  const [prevEnabled, setPrevEnabled] = useState(enabled);
  if (prevEnabled !== enabled) {
    setPrevEnabled(enabled);
    if (!enabled) setInnerKeys(EMPTY_KEYS);
  }

  const setSelectedKeys = (keys: Key[], method: TableRowSelectMethod) => {
    let availableKeys: Key[];
    let records: T[];
    updatePreserveRecordsCache(keys);
    if (preserveSelectedRowKeys) {
      availableKeys = keys;
      records = keys.map((key) => preserveRecordsRef.current.get(key) as T);
    } else {
      availableKeys = [];
      records = [];
      keys.forEach((key) => {
        const record = getRecordByKey(key);
        if (record !== undefined) {
          availableKeys.push(key);
          records.push(record);
        }
      });
    }
    setInnerKeys(availableKeys);
    onSelectionChange?.(availableKeys, records, { type: method });
  };

  const triggerSingleSelection = (key: Key, selected: boolean, keys: Key[], event: Event) => {
    if (onSelect) {
      const rows = keys.map((item) => getRecordByKey(item) as T);
      onSelect(getRecordByKey(key) as T, selected, rows, event);
    }
    setSelectedKeys(keys, 'single');
  };

  const recordKeys = useMemo(() => {
    const keys: Key[] = [];
    flattedData.forEach((record, index) => {
      const key = getRowKey(record, index);
      if (!checkboxPropsMap.get(key)?.disabled) keys.push(key);
    });
    return keys;
  }, [flattedData, getRowKey, checkboxPropsMap]);

  const summary = useMemo((): SelectionSummaryState => {
    const checkedCurrentAll = recordKeys.every((key) => selectedKeySet.has(key));
    const checkedCurrentSome = recordKeys.some((key) => selectedKeySet.has(key));
    const disabledItems: boolean[] = [];
    flattedData.forEach((record, index) => {
      const key = getRowKey(record, index);
      if (checkboxPropsMap.get(key)?.disabled) disabledItems.push(selectedKeySet.has(key));
    });
    const allDisabled = disabledItems.length > 0 && disabledItems.length === flattedData.length;
    const allDisabledAndChecked = allDisabled && disabledItems.every(Boolean);
    const allDisabledSomeChecked = allDisabled && disabledItems.some(Boolean);
    return {
      checked: allDisabled ? allDisabledAndChecked : flattedData.length > 0 && checkedCurrentAll,
      disabled: flattedData.length === 0 || allDisabled,
      indeterminate: allDisabled
        ? !allDisabledAndChecked && allDisabledSomeChecked
        : !checkedCurrentAll && checkedCurrentSome,
    };
  }, [recordKeys, selectedKeySet, flattedData, getRowKey, checkboxPropsMap]);

  const selectAll = useEventCallback(() => {
    const keySet = new Set(selectedKeySet);
    const checkedCurrentAll = recordKeys.every((key) => keySet.has(key));
    const changeKeys: Key[] = [];
    if (checkedCurrentAll) {
      recordKeys.forEach((key) => {
        keySet.delete(key);
        changeKeys.push(key);
      });
    } else {
      recordKeys.forEach((key) => {
        if (!keySet.has(key)) {
          keySet.add(key);
          changeKeys.push(key);
        }
      });
    }
    const keys = [...keySet];
    onSelectAll?.(
      !checkedCurrentAll,
      keys.map((key) => getRecordByKey(key) as T),
      changeKeys.map((key) => getRecordByKey(key) as T),
    );
    setSelectedKeys(keys, 'all');
    prevIndexRef.current = null;
  });

  const selectRadio = useEventCallback((key: Key, event: Event) => {
    if (!selectedKeySet.has(key)) triggerSingleSelection(key, true, [key], event);
  });

  const toggleCheckbox = useEventCallback(
    (key: Key, checked: boolean, nativeEvent: Event | undefined) => {
      const keySet = new Set(selectedKeySet);
      const shiftKey = Boolean((nativeEvent as MouseEvent | undefined)?.shiftKey);
      const currentIndex = recordKeys.indexOf(key);
      const isMultiple =
        selectedKeySet.size > 0 && recordKeys.some((item) => selectedKeySet.has(item));

      if (shiftKey && checkStrictly && isMultiple) {
        const { changedKeys, nextAnchor } = selectRange(
          prevIndexRef.current,
          currentIndex,
          recordKeys,
          keySet,
        );
        const keys = [...keySet];
        onSelectMultiple?.(
          !checked,
          keys.map((item) => getRecordByKey(item) as T),
          changedKeys.map((item) => getRecordByKey(item) as T),
        );
        setSelectedKeys(keys, 'multiple');
        prevIndexRef.current = nextAnchor;
        return;
      }

      if (checkStrictly || !keyEntities) {
        const keys = checked
          ? derivedSelectedKeys.filter((item) => item !== key)
          : [...derivedSelectedKeys.filter((item) => item !== key), key];
        triggerSingleSelection(key, !checked, keys, nativeEvent as Event);
      } else {
        const { checkedKeys, halfCheckedKeys } = conductCheck(
          [...derivedSelectedKeys, key],
          true,
          keyEntities,
          isCheckboxDisabled,
        );
        let nextKeys = checkedKeys;
        if (checked) {
          const tempKeySet = new Set(checkedKeys);
          tempKeySet.delete(key);
          nextKeys = conductCheck(
            [...tempKeySet],
            { checked: false, halfCheckedKeys },
            keyEntities,
            isCheckboxDisabled,
          ).checkedKeys;
        }
        triggerSingleSelection(key, !checked, nextKeys, nativeEvent as Event);
      }
      prevIndexRef.current = checked ? null : currentIndex;
    },
  );

  const runPreset = useEventCallback((preset: string) => {
    if (preset === SELECTION_ALL) {
      const keys: Key[] = [];
      data.forEach((record, index) => {
        const key = getRowKey(record, index);
        if (!isCheckboxDisabled(record) || selectedKeySet.has(key)) keys.push(key);
      });
      setSelectedKeys(keys, 'all');
    } else if (preset === SELECTION_INVERT) {
      const keySet = new Set(selectedKeySet);
      pageData.forEach((record, index) => {
        const key = getRowKey(record, index);
        if (checkboxPropsMap.get(key)?.disabled) return;
        if (keySet.has(key)) keySet.delete(key);
        else keySet.add(key);
      });
      const keys = [...keySet];
      onSelectInvert?.(keys);
      setSelectedKeys(keys, 'invert');
    } else if (preset === SELECTION_NONE) {
      onSelectNone?.();
      setSelectedKeys(
        [...selectedKeySet].filter((key) => checkboxPropsMap.get(key)?.disabled),
        'none',
      );
    }
    prevIndexRef.current = null;
  });

  const runCustom = useEventCallback((item: TableSelectionItem) => {
    item.onSelect?.(recordKeys);
    prevIndexRef.current = null;
  });

  const mergedSelections = useMemo((): MergedSelectionItem[] | null => {
    if (!selections || hideSelectAll || selectionType === 'radio') return null;
    const list =
      selections === true ? [SELECTION_ALL, SELECTION_INVERT, SELECTION_NONE] : selections;
    return list.map((selection, index) => {
      if (selection === SELECTION_ALL) {
        return { key: 'all', onSelect: () => runPreset(SELECTION_ALL), text: locale.selectionAll };
      }
      if (selection === SELECTION_INVERT) {
        return {
          key: 'invert',
          onSelect: () => runPreset(SELECTION_INVERT),
          text: locale.selectInvert,
        };
      }
      if (selection === SELECTION_NONE) {
        return { key: 'none', onSelect: () => runPreset(SELECTION_NONE), text: locale.selectNone };
      }
      return {
        key: selection.key ?? index,
        onSelect: () => runCustom(selection),
        text: selection.text,
      };
    });
  }, [
    selections,
    hideSelectAll,
    selectionType,
    runPreset,
    runCustom,
    locale.selectionAll,
    locale.selectInvert,
    locale.selectNone,
  ]);

  const clear = useEventCallback(() => setSelectedKeys(EMPTY_KEYS, 'none'));

  const actions = useMemo(
    (): SelectionActions => ({ clear, selectAll, selectRadio, toggleCheckbox }),
    [clear, selectAll, selectRadio, toggleCheckbox],
  );

  return {
    actions,
    checkboxPropsMap,
    halfSelectedKeySet,
    mergedSelections,
    selectedKeySet,
    summary,
  };
};
