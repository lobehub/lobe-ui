'use client';

import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { type ColumnsType as RcColumnsType, INTERNAL_COL_DEFINE } from '@rc-component/table';
import { cx } from 'antd-style';
import { ChevronDown } from 'lucide-react';
import {
  type Key,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Checkbox } from '@/base-ui/Checkbox';
import DropdownMenu from '@/base-ui/DropdownMenu';
import { Radio } from '@/base-ui/Radio';
import Icon from '@/Icon';

import {
  conductCheck,
  convertDataToEntities,
  flattenData,
  SELECTION_ALL,
  SELECTION_COLUMN,
  SELECTION_INVERT,
  SELECTION_NONE,
  type SelectionEntities,
  selectRange,
} from './selectionUtils';
import { PREFIX_CLS, styles } from './style';
import type {
  TableLocale,
  TableRowSelection,
  TableRowSelectionCheckboxProps,
  TableRowSelectMethod,
  TableSelectionItem,
} from './type';

const EMPTY_KEYS: Key[] = [];

type RcColumns = RcColumnsType<any>;

interface SelectionConfig<T> {
  childrenColumnName: string;
  /** Filtered and sorted records of every page. */
  data: readonly T[];
  /** `nest` for tree data: `getCheckboxProps().indeterminate` is then ignored. */
  expandType: 'nest' | 'row' | null;
  getRecordByKey: (key: Key) => T | undefined;
  getRowKey: (record: T, index?: number) => Key;
  /** Texts of the selection presets and the select-all checkbox. */
  locale: Pick<TableLocale, 'selectAll' | 'selectInvert' | 'selectNone' | 'selectionAll'>;
  /** Records of the current page. */
  pageData: readonly T[];
}

const isExpandColumn = (column: any) =>
  column?.[INTERNAL_COL_DEFINE]?.columnType === 'EXPAND_COLUMN';

/**
 * Row selection, after antd `useSelection`. Returns a `transformColumns` that inserts the
 * selection column (after rc-table placed the expand column) and the selected key set.
 */
export const useSelection = <T,>(
  config: SelectionConfig<T>,
  rowSelection: TableRowSelection<T> | undefined,
) => {
  const {
    checkStrictly = true,
    columnWidth,
    defaultSelectedRowKeys,
    fixed,
    getCheckboxProps,
    getTitleCheckboxProps,
    hideSelectAll,
    onChange: onSelectionChange,
    onSelect,
    onSelectAll,
    onSelectInvert,
    onSelectMultiple,
    onSelectNone,
    preserveSelectedRowKeys,
    renderCell: customizeRenderCell,
    selectedRowKeys,
    selections,
    type: selectionType = 'checkbox',
  } = rowSelection || {};
  const { childrenColumnName, data, expandType, getRecordByKey, getRowKey, locale, pageData } =
    config;

  // ========================= Keys =========================
  const [innerKeys, setInnerKeys] = useState<Key[]>(defaultSelectedRowKeys || EMPTY_KEYS);
  const mergedKeys = selectedRowKeys ?? innerKeys;

  // Shift-click anchor (antd `useMultipleSelect`).
  const prevIndexRef = useRef<number | null>(null);

  // ======================== Caches ========================
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

  // Per-row checkbox props of the current page.
  const checkboxPropsMap = useMemo(() => {
    const map = new Map<Key, TableRowSelectionCheckboxProps>();
    flattedData.forEach((record, index) => {
      map.set(getRowKey(record, index), getCheckboxProps?.(record) || {});
    });
    return map;
  }, [flattedData, getRowKey, getCheckboxProps]);

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

  const derivedSelectedKeySet = useMemo(
    () =>
      new Set(selectionType === 'radio' ? derivedSelectedKeys.slice(0, 1) : derivedSelectedKeys),
    [derivedSelectedKeys, selectionType],
  );
  const derivedHalfSelectedKeySet = useMemo(
    () => new Set(selectionType === 'radio' ? [] : derivedHalfSelectedKeys),
    [derivedHalfSelectedKeys, selectionType],
  );

  // Removing `rowSelection` clears the uncontrolled selection.
  const enabled = Boolean(rowSelection);
  const [prevEnabled, setPrevEnabled] = useState(enabled);
  if (prevEnabled !== enabled) {
    setPrevEnabled(enabled);
    if (!enabled) setInnerKeys(EMPTY_KEYS);
  }

  const setSelectedKeys = useCallback(
    (keys: Key[], method: TableRowSelectMethod) => {
      let availableKeys: Key[];
      let records: T[];
      updatePreserveRecordsCache(keys);
      if (preserveSelectedRowKeys) {
        availableKeys = keys;
        records = keys.map((key) => preserveRecordsRef.current.get(key) as T);
      } else {
        // Drop keys whose records left `dataSource`.
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
    },
    [getRecordByKey, onSelectionChange, preserveSelectedRowKeys, updatePreserveRecordsCache],
  );

  const triggerSingleSelection = useCallback(
    (key: Key, selected: boolean, keys: Key[], event: Event) => {
      if (onSelect) {
        const rows = keys.map((item) => getRecordByKey(item) as T);
        onSelect(getRecordByKey(key) as T, selected, rows, event);
      }
      setSelectedKeys(keys, 'single');
    },
    [onSelect, getRecordByKey, setSelectedKeys],
  );

  // ====================== Selections ======================
  const mergedSelections = useMemo((): TableSelectionItem[] | null => {
    if (!selections || hideSelectAll) return null;
    const list =
      selections === true ? [SELECTION_ALL, SELECTION_INVERT, SELECTION_NONE] : selections;
    return list.map((selection) => {
      let merged: TableSelectionItem;
      if (selection === SELECTION_ALL) {
        merged = {
          key: 'all',
          onSelect: () => {
            const keys: Key[] = [];
            data.forEach((record, index) => {
              const key = getRowKey(record, index);
              if (!isCheckboxDisabled(record) || derivedSelectedKeySet.has(key)) keys.push(key);
            });
            setSelectedKeys(keys, 'all');
          },
          text: locale.selectionAll,
        };
      } else if (selection === SELECTION_INVERT) {
        merged = {
          key: 'invert',
          onSelect: () => {
            const keySet = new Set(derivedSelectedKeySet);
            pageData.forEach((record, index) => {
              const key = getRowKey(record, index);
              if (checkboxPropsMap.get(key)?.disabled) return;
              if (keySet.has(key)) keySet.delete(key);
              else keySet.add(key);
            });
            const keys = [...keySet];
            onSelectInvert?.(keys);
            setSelectedKeys(keys, 'invert');
          },
          text: locale.selectInvert,
        };
      } else if (selection === SELECTION_NONE) {
        merged = {
          key: 'none',
          onSelect: () => {
            onSelectNone?.();
            setSelectedKeys(
              [...derivedSelectedKeySet].filter((key) => checkboxPropsMap.get(key)?.disabled),
              'none',
            );
          },
          text: locale.selectNone,
        };
      } else {
        merged = selection;
      }
      return {
        ...merged,
        onSelect: (changeableRowKeys: Key[]) => {
          merged.onSelect?.(changeableRowKeys);
          prevIndexRef.current = null;
        },
      };
    });
  }, [
    selections,
    hideSelectAll,
    checkboxPropsMap,
    isCheckboxDisabled,
    derivedSelectedKeySet,
    data,
    pageData,
    getRowKey,
    onSelectInvert,
    onSelectNone,
    setSelectedKeys,
    locale,
  ]);

  // ======================= Columns ========================
  const transformColumns = useCallback(
    (columns: RcColumns): RcColumns => {
      if (!rowSelection) return columns.filter((column) => column !== SELECTION_COLUMN);

      let cloneColumns = [...columns];
      const keySet = new Set(derivedSelectedKeySet);

      // Only enabled rows of the current page take part in select-all and Shift ranges.
      const recordKeys: Key[] = [];
      flattedData.forEach((record, index) => {
        const key = getRowKey(record, index);
        if (!checkboxPropsMap.get(key)?.disabled) recordKeys.push(key);
      });
      const checkedCurrentAll = recordKeys.every((key) => keySet.has(key));
      const checkedCurrentSome = recordKeys.some((key) => keySet.has(key));

      const onSelectAllChange = () => {
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
      };

      // ===================== Title =====================
      let title: ReactNode = null;
      let columnTitleCheckbox: ReactNode = null;
      if (selectionType !== 'radio') {
        let customizeSelections: ReactNode = null;
        if (mergedSelections) {
          customizeSelections = (
            <div className={cx(styles.selectionExtra, `${PREFIX_CLS}-selection-extra`)}>
              <DropdownMenu
                items={mergedSelections.map(({ key, onSelect: onSelectionClick, text }, index) => ({
                  key: key ?? index,
                  label: text,
                  onClick: () => onSelectionClick?.(recordKeys),
                }))}
              >
                <button
                  aria-label="Selection options"
                  className={styles.selectionTrigger}
                  type="button"
                >
                  <Icon icon={ChevronDown} size={12} />
                </button>
              </DropdownMenu>
            </div>
          );
        }

        const disabledItems: { checked: boolean; disabled?: boolean }[] = [];
        flattedData.forEach((record, index) => {
          const key = getRowKey(record, index);
          const props = checkboxPropsMap.get(key) || {};
          if (props.disabled) disabledItems.push({ checked: keySet.has(key), ...props });
        });
        const allDisabled = disabledItems.length > 0 && disabledItems.length === flattedData.length;
        const allDisabledAndChecked = allDisabled && disabledItems.every(({ checked }) => checked);
        const allDisabledSomeChecked = allDisabled && disabledItems.some(({ checked }) => checked);

        const {
          disabled: titleDisabled,
          onChange: onTitleChange,
          ...titleCheckboxProps
        } = getTitleCheckboxProps?.() || {};
        columnTitleCheckbox = (
          <Checkbox
            aria-label={
              customizeSelections
                ? 'Custom selection'
                : typeof locale.selectAll === 'string'
                  ? locale.selectAll
                  : undefined
            }
            {...titleCheckboxProps}
            disabled={titleDisabled ?? (flattedData.length === 0 || allDisabled)}
            checked={
              allDisabled ? allDisabledAndChecked : flattedData.length > 0 && checkedCurrentAll
            }
            indeterminate={
              allDisabled
                ? !allDisabledAndChecked && allDisabledSomeChecked
                : !checkedCurrentAll && checkedCurrentSome
            }
            onChange={(checked) => {
              onSelectAllChange();
              onTitleChange?.(checked);
            }}
          />
        );
        title = !hideSelectAll && (
          <div className={cx(styles.selection, `${PREFIX_CLS}-selection`)}>
            {columnTitleCheckbox}
            {customizeSelections}
          </div>
        );
      }

      // ===================== Cells =====================
      const renderBox = (record: T, index: number): { checked: boolean; node: ReactNode } => {
        const key = getRowKey(record, index);
        const checked = keySet.has(key);
        const checkboxProps = checkboxPropsMap.get(key) || {};
        const { onChange: onBoxChange, onClick: onBoxClick, ...boxProps } = checkboxProps;
        const handleClick = (event: MouseEvent<HTMLElement>) => {
          event.stopPropagation();
          (onBoxClick as ((e: MouseEvent<HTMLElement>) => void) | undefined)?.(event);
        };

        if (selectionType === 'radio') {
          const {
            indeterminate: _indeterminate,
            shape: _shape,
            classNames: _classNames,
            styles: _styles,
            ...radioProps
          } = boxProps;
          return {
            checked,
            node: (
              <BaseRadioGroup
                className={styles.selectionRadioGroup}
                value={checked ? 'selected' : null}
                onValueChange={(_value, details) => {
                  if (!keySet.has(key)) {
                    triggerSingleSelection(key, true, [key], details.event as Event);
                  }
                  onBoxChange?.(true);
                }}
              >
                <Radio
                  aria-label={`Select row ${index + 1}`}
                  {...(radioProps as object)}
                  value="selected"
                  onClick={handleClick}
                />
              </BaseRadioGroup>
            ),
          };
        }

        const mergedIndeterminate =
          expandType === 'nest'
            ? derivedHalfSelectedKeySet.has(key)
            : (checkboxProps.indeterminate ?? derivedHalfSelectedKeySet.has(key));

        return {
          checked,
          node: (
            <Checkbox
              aria-label={checked ? `Row ${index + 1} selected` : `Select row ${index + 1}`}
              {...boxProps}
              checked={checked}
              indeterminate={mergedIndeterminate}
              onClick={handleClick}
              // base-ui passes the change details (with the click event) as a second argument.
              onChange={(_next: boolean, details?: { event?: Event }) => {
                const nativeEvent = details?.event as Event;
                const shiftKey = Boolean((nativeEvent as globalThis.MouseEvent)?.shiftKey);
                const currentIndex = recordKeys.indexOf(key);
                const isMultiple =
                  derivedSelectedKeySet.size > 0 &&
                  recordKeys.some((item) => derivedSelectedKeySet.has(item));

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
                } else {
                  if (checkStrictly || !keyEntities) {
                    const keys = checked
                      ? derivedSelectedKeys.filter((item) => item !== key)
                      : [...derivedSelectedKeys.filter((item) => item !== key), key];
                    triggerSingleSelection(key, !checked, keys, nativeEvent);
                  } else {
                    // Always fill first, then clean up when unchecking.
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
                    triggerSingleSelection(key, !checked, nextKeys, nativeEvent);
                  }
                  prevIndexRef.current = checked ? null : currentIndex;
                }
                onBoxChange?.(!checked);
              }}
            />
          ),
        };
      };

      const renderSelectionCell = (_value: unknown, record: T, index: number) => {
        const { checked, node } = renderBox(record, index);
        return customizeRenderCell ? customizeRenderCell(checked, record, index, node) : node;
      };

      // ===================== Placement =====================
      if (!cloneColumns.includes(SELECTION_COLUMN as any)) {
        // Right after the expand column when that one leads, else first.
        if (cloneColumns.findIndex(isExpandColumn) === 0) {
          const [expandColumn, ...rest] = cloneColumns;
          cloneColumns = [expandColumn, SELECTION_COLUMN as any, ...rest];
        } else {
          cloneColumns = [SELECTION_COLUMN as any, ...cloneColumns];
        }
      }
      const selectionColumnIndex = cloneColumns.indexOf(SELECTION_COLUMN as any);
      cloneColumns = cloneColumns.filter(
        (column, index) => column !== SELECTION_COLUMN || index === selectionColumnIndex,
      );

      // Without its own `fixed`, the column follows a pinned neighbour.
      const prevColumn = cloneColumns[selectionColumnIndex - 1] as any;
      const nextColumn = cloneColumns[selectionColumnIndex + 1] as any;
      let mergedFixed = fixed;
      if (mergedFixed === undefined) {
        if (nextColumn?.fixed !== undefined) mergedFixed = nextColumn.fixed;
        else if (prevColumn?.fixed !== undefined) mergedFixed = prevColumn.fixed;
      }
      if (mergedFixed && prevColumn && isExpandColumn(prevColumn) && prevColumn.fixed == null) {
        cloneColumns[selectionColumnIndex - 1] = { ...prevColumn, fixed: mergedFixed };
      }

      const selectionColumn = {
        [INTERNAL_COL_DEFINE]: {
          className: cx(
            `${PREFIX_CLS}-selection-col`,
            selections &&
              selectionType === 'checkbox' &&
              `${PREFIX_CLS}-selection-col-with-dropdown`,
          ),
        },
        align: rowSelection.align,
        className: cx(`${PREFIX_CLS}-selection-column`, styles.selectionColumn),
        fixed: mergedFixed,
        key: '__selection_column',
        onCell: rowSelection.onCell,
        render: renderSelectionCell,
        title: !rowSelection.columnTitle
          ? title
          : typeof rowSelection.columnTitle === 'function'
            ? rowSelection.columnTitle(columnTitleCheckbox)
            : rowSelection.columnTitle,
        width: columnWidth,
      };

      return cloneColumns.map((column) =>
        column === SELECTION_COLUMN ? selectionColumn : column,
      ) as RcColumns;
    },
    [
      getRowKey,
      getRecordByKey,
      flattedData,
      rowSelection,
      derivedSelectedKeys,
      derivedSelectedKeySet,
      derivedHalfSelectedKeySet,
      columnWidth,
      fixed,
      mergedSelections,
      expandType,
      checkboxPropsMap,
      checkStrictly,
      keyEntities,
      onSelectAll,
      onSelectMultiple,
      triggerSingleSelection,
      isCheckboxDisabled,
      setSelectedKeys,
      getTitleCheckboxProps,
      hideSelectAll,
      selectionType,
      selections,
      customizeRenderCell,
      locale.selectAll,
    ],
  );

  return [transformColumns, derivedSelectedKeySet] as const;
};
