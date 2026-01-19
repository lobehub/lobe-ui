import type { ChangeEvent, KeyboardEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { SelectOption, SelectOptions, SelectProps } from './type';
import { getOptionSearchText, isGroupOption, isValueEmpty, splitBySeparators } from './utils';

export type UseSelectStateOptions<Value = any> = Pick<
  SelectProps<Value>,
  | 'defaultOpen'
  | 'defaultValue'
  | 'mode'
  | 'onChange'
  | 'onOpenChange'
  | 'onSelect'
  | 'open'
  | 'options'
  | 'showSearch'
  | 'tokenSeparators'
  | 'value'
>;

export interface UseSelectStateReturn<Value = any> {
  appendTagValues: (rawValues: string[]) => void;
  filteredOptions: SelectOptions<Value>;
  getOption: (optionValue: Value) => SelectOption<Value>;
  handleOpenChange: (nextOpen: boolean) => void;
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSearchKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  handleValueChange: (nextValue: Value | Value[] | null) => void;
  isMultiple: boolean;
  mergedOpen: boolean;
  normalizedValue: Value | Value[] | null;
  optionMap: Map<Value, SelectOption<Value>>;
  resolvedOptions: SelectOptions<Value>;
  searchValue: string;
  setSearchValue: (value: string) => void;
  shouldShowSearch: boolean;
  valueArray: Value[];
}

export const useSelectState = <Value = any>({
  defaultOpen,
  defaultValue,
  mode,
  onChange,
  onOpenChange,
  onSelect,
  open,
  options,
  showSearch,
  tokenSeparators,
  value,
}: UseSelectStateOptions<Value>): UseSelectStateReturn<Value> => {
  const isMultiple = mode === 'multiple' || mode === 'tags';

  // Value state
  const [uncontrolledValue, setUncontrolledValue] = useState<Value | Value[] | null>(() => {
    if (defaultValue !== undefined) return defaultValue;
    return isMultiple ? [] : null;
  });

  const normalizeValue = useCallback(
    (nextValue: any): Value | Value[] | null => {
      if (isMultiple) {
        if (Array.isArray(nextValue)) return nextValue;
        if (nextValue === null || nextValue === undefined) return [];
        return [nextValue];
      }
      if (Array.isArray(nextValue)) return nextValue[0] ?? null;
      return nextValue === undefined ? null : nextValue;
    },
    [isMultiple],
  );

  const mergedValue = value !== undefined ? value : uncontrolledValue;
  const normalizedValue = useMemo(() => normalizeValue(mergedValue), [mergedValue, normalizeValue]);
  const valueArray = useMemo(
    () =>
      isMultiple
        ? (normalizedValue as Value[])
        : isValueEmpty(normalizedValue)
          ? []
          : [normalizedValue as Value],
    [isMultiple, normalizedValue],
  );

  // Extra options for tags mode
  const [extraOptions, setExtraOptions] = useState<SelectOption<Value>[]>([]);

  useEffect(() => {
    if (mode !== 'tags') {
      setExtraOptions([]);
    }
  }, [mode]);

  // Resolved options with option map
  const { resolvedOptions, optionMap } = useMemo(() => {
    const baseOptions = options ?? [];
    const optionValueMap = new Map<Value, SelectOption<Value>>();

    const addOption = (item: SelectOption<Value>) => {
      if (!optionValueMap.has(item.value)) {
        optionValueMap.set(item.value, item);
      }
    };

    const walkOptions = (items: SelectOptions<Value>) => {
      items.forEach((item) => {
        if (isGroupOption(item)) {
          item.options.forEach(addOption);
        } else {
          addOption(item);
        }
      });
    };

    walkOptions(baseOptions);

    const filteredExtraOptions = extraOptions.filter(
      (item) => !optionValueMap.has(item.value),
    ) as SelectOption<Value>[];
    filteredExtraOptions.forEach(addOption);

    const mergedOptions: SelectOptions<Value> = [...baseOptions, ...filteredExtraOptions];

    const missingValueOptions: SelectOption<Value>[] = valueArray
      .filter((val) => !optionValueMap.has(val))
      .map((val) => ({
        label: String(val),
        value: val,
      }));
    missingValueOptions.forEach(addOption);

    return {
      optionMap: optionValueMap,
      resolvedOptions: missingValueOptions.length
        ? [...mergedOptions, ...missingValueOptions]
        : mergedOptions,
    };
  }, [extraOptions, options, valueArray]);

  // Open state
  const [uncontrolledOpen, setUncontrolledOpen] = useState(Boolean(defaultOpen));

  useEffect(() => {
    if (open !== undefined) {
      setUncontrolledOpen(open);
    }
  }, [open]);

  const mergedOpen = open ?? uncontrolledOpen;

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      onOpenChange?.(nextOpen);
      if (open === undefined) {
        setUncontrolledOpen(nextOpen);
      }
    },
    [onOpenChange, open],
  );

  // Search state
  const [searchValue, setSearchValue] = useState('');
  const shouldShowSearch = Boolean(showSearch || mode === 'tags');

  useEffect(() => {
    if (!mergedOpen) setSearchValue('');
  }, [mergedOpen]);

  // Get option helper
  const getOption = useCallback(
    (optionValue: Value): SelectOption<Value> => {
      const matched = optionMap.get(optionValue);
      if (matched) return matched;
      if (optionValue && typeof optionValue === 'object' && 'label' in optionValue) {
        return {
          label: (optionValue as any).label,
          value: optionValue,
        };
      }
      return {
        label: String(optionValue),
        value: optionValue,
      };
    },
    [optionMap],
  );

  // Value change handling
  const previousValueRef = useRef<Value | Value[] | null>(normalizedValue);

  useEffect(() => {
    previousValueRef.current = normalizedValue;
  }, [normalizedValue]);

  const handleValueChange = useCallback(
    (nextValue: Value | Value[] | null) => {
      const normalizedNextValue = normalizeValue(nextValue);
      const previousValue = previousValueRef.current;

      if (isMultiple) {
        const prevValues = Array.isArray(previousValue) ? previousValue : [];
        const nextValues = Array.isArray(normalizedNextValue) ? normalizedNextValue : [];
        const addedValues = nextValues.filter(
          (val) => !prevValues.some((prev) => Object.is(prev, val)),
        );

        addedValues.forEach((val) => {
          onSelect?.(val, getOption(val));
        });

        if (value === undefined) {
          setUncontrolledValue(nextValues);
        }
        onChange?.(nextValues as any, nextValues.map((val) => getOption(val)) as any);
      } else {
        if (!isValueEmpty(normalizedNextValue) && !Object.is(previousValue, normalizedNextValue)) {
          onSelect?.(normalizedNextValue as Value, getOption(normalizedNextValue as Value));
        }
        if (value === undefined) {
          setUncontrolledValue(normalizedNextValue);
        }
        onChange?.(
          normalizedNextValue as any,
          isValueEmpty(normalizedNextValue)
            ? undefined
            : (getOption(normalizedNextValue as Value) as any),
        );
      }

      previousValueRef.current = normalizedNextValue;
    },
    [getOption, isMultiple, normalizeValue, onChange, onSelect, value],
  );

  // Tags mode helpers
  const appendTagValues = useCallback(
    (rawValues: string[]) => {
      const valuesToAdd = rawValues.map((val) => val.trim()).filter(Boolean);
      if (!valuesToAdd.length) return;

      const nextValues = [...valueArray];
      const newOptionValues = valuesToAdd.filter((val) => !optionMap.has(val as Value));

      if (newOptionValues.length > 0) {
        setExtraOptions((prev) => {
          const existingValues = new Set(prev.map((item) => item.value));
          const merged = [...prev];
          newOptionValues.forEach((val) => {
            if (!existingValues.has(val as Value)) {
              merged.push({ label: val, value: val as Value });
            }
          });
          return merged;
        });
      }

      valuesToAdd.forEach((val) => {
        if (!nextValues.some((item) => Object.is(item, val))) {
          nextValues.push(val as Value);
        }
      });

      if (nextValues.length !== valueArray.length) {
        handleValueChange(nextValues);
      }
    },
    [handleValueChange, optionMap, valueArray],
  );

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;
      if (mode === 'tags') {
        const parts = splitBySeparators(nextValue, tokenSeparators);
        if (parts.length > 1) {
          const pending = parts.pop() ?? '';
          appendTagValues(parts.filter(Boolean));
          setSearchValue(pending);
          return;
        }
      }
      setSearchValue(nextValue);
    },
    [appendTagValues, mode, tokenSeparators],
  );

  const handleSearchKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      event.stopPropagation();

      if (event.key === 'Escape') {
        handleOpenChange(false);
        return;
      }

      if (mode !== 'tags') return;

      if (event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        appendTagValues([searchValue]);
        setSearchValue('');
        return;
      }

      if (tokenSeparators?.includes(event.key)) {
        event.preventDefault();
        event.stopPropagation();
        appendTagValues([searchValue]);
        setSearchValue('');
      }
    },
    [appendTagValues, handleOpenChange, mode, searchValue, tokenSeparators],
  );

  // Filtered options
  const filteredOptions = useMemo(() => {
    if (!shouldShowSearch || !searchValue.trim()) return resolvedOptions;
    const query = searchValue.trim().toLowerCase();

    const filterItems = (items: SelectOptions<Value>): SelectOptions<Value> => {
      const filtered = items
        .map((item) => {
          if (isGroupOption(item)) {
            const groupItems = item.options.filter((option) =>
              getOptionSearchText(option).toLowerCase().includes(query),
            );
            if (!groupItems.length) return null;
            return { ...item, options: groupItems };
          }
          return getOptionSearchText(item).toLowerCase().includes(query) ? item : null;
        })
        .filter(Boolean) as SelectOptions<Value>;

      return filtered;
    };

    return filterItems(resolvedOptions);
  }, [resolvedOptions, searchValue, shouldShowSearch]);

  return {
    appendTagValues,
    filteredOptions,
    getOption,
    handleOpenChange,
    handleSearchChange,
    handleSearchKeyDown,
    handleValueChange,
    isMultiple,
    mergedOpen,
    normalizedValue,
    optionMap,
    resolvedOptions,
    searchValue,
    setSearchValue,
    shouldShowSearch,
    valueArray,
  };
};
