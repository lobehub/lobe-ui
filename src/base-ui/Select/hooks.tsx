'use client';

import {
  type ChangeEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MutableRefObject,
  type Ref,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useAppElement } from '@/ThemeProvider';

import {
  countVirtualItems,
  getOptionSearchText,
  isGroupOption,
  isValueEmpty,
  normalizeValueFor,
  splitBySeparators,
} from './helpers';
import {
  type SelectOption,
  type SelectOptions,
  type SelectProps,
  type SelectRootChangeEventDetails,
  type SelectSize,
} from './type';

interface UseSelectValueParams {
  defaultValue: SelectProps['defaultValue'];
  extraOptions: SelectOption<any>[];
  isMultiple: boolean;
  onChange: SelectProps['onChange'];
  onSelect: SelectProps['onSelect'];
  options: SelectOptions<any> | undefined;
  setExtraOptions: React.Dispatch<React.SetStateAction<SelectOption<any>[]>>;
  value: SelectProps['value'];
}

export function useSelectValue({
  defaultValue,
  extraOptions,
  isMultiple,
  onChange,
  onSelect,
  options,
  setExtraOptions,
  value,
}: UseSelectValueParams) {
  const [uncontrolledValue, setUncontrolledValue] = useState<any>(() => {
    if (defaultValue !== undefined) return defaultValue;
    return isMultiple ? [] : null;
  });

  const normalizeValue = useMemo(() => normalizeValueFor(isMultiple), [isMultiple]);

  const mergedValue = value !== undefined ? value : uncontrolledValue;
  const normalizedValue = useMemo(() => normalizeValue(mergedValue), [mergedValue, normalizeValue]);

  const valueArray = useMemo(() => {
    if (isMultiple) return normalizedValue as any[];
    return isValueEmpty(normalizedValue) ? [] : [normalizedValue];
  }, [isMultiple, normalizedValue]);

  const { optionMap, resolvedOptions } = useMemo(() => {
    const baseOptions = options ?? [];
    const optionValueMap = new Map<any, SelectOption<any>>();

    const addOption = (item: SelectOption<any>) => {
      if (!optionValueMap.has(item.value)) {
        optionValueMap.set(item.value, item);
      }
    };

    baseOptions.forEach((item) => {
      if (isGroupOption(item)) {
        item.options.forEach(addOption);
      } else {
        addOption(item);
      }
    });

    const filteredExtraOptions = extraOptions.filter((item) => !optionValueMap.has(item.value));
    filteredExtraOptions.forEach(addOption);
    const mergedOptions: SelectOptions<any> = [...baseOptions, ...filteredExtraOptions];

    const missingValueOptions: SelectOption<any>[] = valueArray
      .filter((val) => !optionValueMap.has(val))
      .map((val) => ({ label: String(val), value: val }));
    missingValueOptions.forEach(addOption);

    return {
      optionMap: optionValueMap,
      resolvedOptions: missingValueOptions.length
        ? [...mergedOptions, ...missingValueOptions]
        : mergedOptions,
    };
  }, [extraOptions, options, valueArray]);

  const getOption = useCallback(
    (optionValue: any): SelectOption<any> => {
      const matched = optionMap.get(optionValue);
      if (matched) return matched;
      if (optionValue && typeof optionValue === 'object' && 'label' in optionValue) {
        return { label: (optionValue as any).label, value: optionValue };
      }
      return { label: String(optionValue), value: optionValue };
    },
    [optionMap],
  );

  const previousValueRef = useRef<any>(normalizedValue);
  useEffect(() => {
    previousValueRef.current = normalizedValue;
  }, [normalizedValue]);

  const handleValueChange = useCallback(
    (nextValue: any) => {
      const normalizedNextValue = normalizeValue(nextValue);
      const previousValue = previousValueRef.current;

      if (isMultiple) {
        const prevValues = Array.isArray(previousValue) ? previousValue : [];
        const nextValues = Array.isArray(normalizedNextValue) ? normalizedNextValue : [];
        const addedValues = nextValues.filter(
          (val) => !prevValues.some((prev) => Object.is(prev, val)),
        );
        addedValues.forEach((val) => onSelect?.(val, getOption(val)));

        if (value === undefined) setUncontrolledValue(nextValues);
        onChange?.(
          nextValues,
          nextValues.map((val) => getOption(val)),
        );
      } else {
        if (!isValueEmpty(normalizedNextValue) && !Object.is(previousValue, normalizedNextValue)) {
          onSelect?.(normalizedNextValue, getOption(normalizedNextValue));
        }
        if (value === undefined) setUncontrolledValue(normalizedNextValue);
        onChange?.(
          isValueEmpty(normalizedNextValue) ? undefined : normalizedNextValue,
          isValueEmpty(normalizedNextValue) ? undefined : getOption(normalizedNextValue),
        );
      }

      previousValueRef.current = normalizedNextValue;
    },
    [getOption, isMultiple, normalizeValue, onChange, onSelect, value],
  );

  const appendTagValues = useCallback(
    (rawValues: string[]) => {
      const valuesToAdd = rawValues.map((val) => val.trim()).filter(Boolean);
      if (!valuesToAdd.length) return;

      const currentValues = Array.isArray(previousValueRef.current)
        ? previousValueRef.current
        : valueArray;
      const nextValues = [...currentValues];
      const newOptionValues = valuesToAdd.filter((val) => !optionMap.has(val));

      if (newOptionValues.length > 0) {
        setExtraOptions((prev) => {
          const existingValues = new Set(prev.map((item) => item.value));
          const merged = [...prev];
          newOptionValues.forEach((val) => {
            if (!existingValues.has(val)) {
              merged.push({ label: val, value: val });
            }
          });
          return merged;
        });
      }

      valuesToAdd.forEach((val) => {
        if (!nextValues.some((item) => Object.is(item, val))) {
          nextValues.push(val);
        }
      });

      if (nextValues.length !== valueArray.length) {
        handleValueChange(nextValues);
      }
    },
    [handleValueChange, optionMap, setExtraOptions, valueArray],
  );

  const removeLastTagValue = useCallback(() => {
    const currentValues = Array.isArray(previousValueRef.current)
      ? previousValueRef.current
      : valueArray;
    if (currentValues.length > 0) handleValueChange(currentValues.slice(0, -1));
  }, [handleValueChange, valueArray]);

  return {
    appendTagValues,
    getOption,
    handleValueChange,
    normalizedValue,
    normalizeValue,
    optionMap,
    resolvedOptions,
    removeLastTagValue,
    valueArray,
  };
}

interface UseSelectOpenParams {
  defaultOpen: boolean | undefined;
  onOpenChange: SelectProps['onOpenChange'];
  open: boolean | undefined;
}

export function useSelectOpen({ defaultOpen, onOpenChange, open }: UseSelectOpenParams) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(Boolean(defaultOpen));

  useEffect(() => {
    if (open !== undefined) setUncontrolledOpen(open);
  }, [open]);

  const mergedOpen = open ?? uncontrolledOpen;

  const handleOpenChange = useCallback(
    (nextOpen: boolean, eventDetails?: SelectRootChangeEventDetails) => {
      onOpenChange?.(nextOpen, eventDetails);
      if (open === undefined) setUncontrolledOpen(nextOpen);
    },
    [onOpenChange, open],
  );

  return { handleOpenChange, mergedOpen };
}

interface UseSelectSearchParams {
  appendTagValues: (values: string[]) => void;
  handleOpenChange: (nextOpen: boolean) => void;
  mergedOpen: boolean;
  mode: SelectProps['mode'];
  removeLastTagValue: () => void;
  resolvedOptions: SelectOptions;
  showSearch: boolean | undefined;
  tokenSeparators: string[] | undefined;
}

export function useSelectSearch({
  appendTagValues,
  handleOpenChange,
  mergedOpen,
  mode,
  removeLastTagValue,
  resolvedOptions,
  showSearch,
  tokenSeparators,
}: UseSelectSearchParams) {
  const [searchValue, setSearchValue] = useState('');
  const shouldShowSearch = Boolean(showSearch || mode === 'tags');

  useEffect(() => {
    if (!mergedOpen) setSearchValue('');
  }, [mergedOpen]);

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

      if (event.key === 'Backspace' && !searchValue) {
        event.preventDefault();
        removeLastTagValue();
        return;
      }

      const isSeparator = tokenSeparators?.includes(event.key);
      if (event.key === 'Enter' || isSeparator) {
        event.preventDefault();
        event.stopPropagation();
        appendTagValues([searchValue]);
        setSearchValue('');
      }
    },
    [appendTagValues, handleOpenChange, mode, removeLastTagValue, searchValue, tokenSeparators],
  );

  // Stop propagation in capture phase + on keyup to block base-ui Popup-level
  // `useTypeahead` (and any ancestor typeahead) from hijacking the search
  // input's first-letter focus behavior. Do not remove.
  const stopSearchPropagation = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
  }, []);

  const filteredOptions = useMemo(() => {
    if (!shouldShowSearch || !searchValue.trim()) return resolvedOptions;
    const query = searchValue.trim().toLowerCase();

    return resolvedOptions
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
      .filter(Boolean) as SelectOptions;
  }, [resolvedOptions, searchValue, shouldShowSearch]);

  return {
    filteredOptions,
    handleSearchChange,
    handleSearchKeyDown,
    searchValue,
    shouldShowSearch,
    stopSearchPropagation,
  };
}

interface UseSelectVirtualParams {
  filteredOptions: SelectOptions;
  listItemHeight: number | undefined;
  size: SelectSize;
  valueArray: any[];
  virtual: boolean | undefined;
}

export function useSelectVirtual({
  filteredOptions,
  listItemHeight,
  size,
  valueArray,
  virtual,
}: UseSelectVirtualParams) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const pointerScrollRef = useRef(false);
  const pointerScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const renderVirtualItem = useCallback((props: HTMLAttributes<HTMLDivElement>) => {
    const { ref, ...rest } = props as HTMLAttributes<HTMLDivElement> & {
      ref?: Ref<HTMLDivElement>;
    };

    return (
      <div
        {...rest}
        ref={(node) => {
          if (node) {
            node.scrollIntoView = (...args) => {
              if (!pointerScrollRef.current) {
                HTMLElement.prototype.scrollIntoView.call(node, ...args);
              }
            };
          }
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref && 'current' in ref) {
            (ref as MutableRefObject<HTMLDivElement | null>).current = node;
          }
        }}
      />
    );
  }, []);

  const markPointerScroll = useCallback(() => {
    pointerScrollRef.current = true;
    if (pointerScrollTimeoutRef.current) {
      clearTimeout(pointerScrollTimeoutRef.current);
    }
    pointerScrollTimeoutRef.current = setTimeout(() => {
      pointerScrollRef.current = false;
    }, 120);
  }, []);

  const handleListScroll = useCallback(() => {
    if (!virtual || !pointerScrollRef.current) return;
    const listElement = listRef.current;
    const activeElement = document.activeElement;
    if (listElement && activeElement && listElement.contains(activeElement)) {
      listElement.focus({ preventScroll: true });
    }
  }, [virtual]);

  useEffect(() => {
    return () => {
      if (pointerScrollTimeoutRef.current) {
        clearTimeout(pointerScrollTimeoutRef.current);
      }
    };
  }, []);

  const virtualListStyle = useMemo(() => {
    if (!virtual) return undefined;
    const rowCount = countVirtualItems(filteredOptions);
    const maxVisibleRows = 6;
    const estimatedRowHeight =
      listItemHeight ?? (size === 'large' ? 40 : size === 'small' ? 28 : 32);
    const visibleRows = Math.min(Math.max(rowCount, 1), maxVisibleRows);
    const estimatedHeight = visibleRows * estimatedRowHeight + 8;

    return {
      height: `min(${estimatedHeight}px, var(--lobe-select-available-height, var(--available-height)))`,
    };
  }, [filteredOptions, listItemHeight, size, virtual]);

  const keepMountedIndices = useMemo(() => {
    if (!virtual || valueArray.length === 0) return undefined;
    const selectedSet = new Set(valueArray);
    const indices: number[] = [];
    let index = 0;

    filteredOptions.forEach((item) => {
      if (isGroupOption(item)) {
        if (item.options.some((option) => selectedSet.has(option.value))) {
          indices.push(index);
        }
        index += 1;
        return;
      }
      if (selectedSet.has(item.value)) indices.push(index);
      index += 1;
    });

    return indices.length ? indices : undefined;
  }, [filteredOptions, valueArray, virtual]);

  return {
    handleListScroll,
    keepMountedIndices,
    listRef,
    markPointerScroll,
    renderVirtualItem,
    virtualListStyle,
  };
}

export function usePortalContainer() {
  const appElement = useAppElement();
  // `appElement` is the ThemeProvider wrapper div, which uses `display: contents`
  // so it has no layout box. `@base-ui/react/select` fails to mount its Popup
  // into a `display: contents` container in certain hosts (editor/chat inputs
  // with focus traps). Fall back to `document.body` in that case; keep the
  // original behavior when the wrapper has a real layout (older themes, SSR
  // snapshot, etc.).
  return useMemo(() => {
    if (typeof window === 'undefined') return appElement;
    if (!(appElement instanceof HTMLElement)) return undefined;
    const display = window.getComputedStyle(appElement).display;
    return display === 'contents' ? document.body : appElement;
  }, [appElement]);
}
