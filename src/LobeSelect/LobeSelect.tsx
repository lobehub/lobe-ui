'use client';

import { Select } from '@base-ui/react/select';
import { cx, useThemeMode } from 'antd-style';
import { Check, ChevronDown, Loader2, X } from 'lucide-react';
import type { ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import { isValidElement, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Virtualizer } from 'virtua';

import Icon from '@/Icon';
import { styles as menuStyles } from '@/Menu/sharedStyle';
import { usePortalContainer } from '@/hooks/usePortalContainer';

import { LOBE_SELECT_CONTAINER_ATTR } from './constants';
import { styles, triggerVariants } from './style';
import type {
  LobeSelectOption,
  LobeSelectOptionGroup,
  LobeSelectOptions,
  LobeSelectProps,
} from './type';

const isGroupOption = <Value,>(
  option: LobeSelectOption<Value> | LobeSelectOptionGroup<Value>,
): option is LobeSelectOptionGroup<Value> =>
  Boolean((option as LobeSelectOptionGroup<Value>).options);

const getOptionSearchText = <Value,>(option: LobeSelectOption<Value>) => {
  if (typeof option.label === 'string' || typeof option.label === 'number') {
    return String(option.label);
  }
  if (typeof option.value === 'string' || typeof option.value === 'number') {
    return String(option.value);
  }
  if (option.title) return option.title;
  return '';
};

const escapeRegExp = (value: string) => value.replaceAll(/[$()*+.?[\\\]^{|}]/g, '\\$&');

const splitBySeparators = (value: string, separators?: string[]) => {
  if (!separators || separators.length === 0) return [value];
  const pattern = separators.map(escapeRegExp).join('|');
  return value.split(new RegExp(pattern, 'g'));
};

const countVirtualItems = (items: LobeSelectOptions) =>
  items.reduce((count, item) => {
    if (isGroupOption(item)) {
      return count + item.options.length + 1;
    }
    return count + 1;
  }, 0);

const isValueEmpty = (value: unknown) => value === null || value === undefined || value === '';

const LobeSelect = memo<LobeSelectProps<any>>(
  ({
    allowClear,
    autoFocus,
    className,
    classNames,
    defaultOpen,
    defaultValue,
    disabled,
    id,
    listItemHeight,
    labelRender,
    loading,
    mode,
    name,
    onChange,
    onOpenChange,
    onSelect,
    open,
    optionRender,
    options,
    placeholder,
    popupClassName,
    popupMatchSelectWidth,
    prefix,
    readOnly,
    required,
    behaviorVariant = 'default',
    selectedIndicatorVariant = 'check',
    shadow,
    showSearch,
    size = 'middle',
    style,
    suffixIcon,
    suffixIconProps,
    tokenSeparators,
    value,
    variant,
    virtual,
  }) => {
    const { isDarkMode } = useThemeMode();
    const resolvedVariant = variant ?? (isDarkMode ? 'filled' : 'outlined');
    const isMultiple = mode === 'multiple' || mode === 'tags';
    const isItemAligned = behaviorVariant === 'item-aligned';

    const [uncontrolledValue, setUncontrolledValue] = useState<any>(() => {
      if (defaultValue !== undefined) return defaultValue;
      return isMultiple ? [] : null;
    });

    const normalizeValue = useCallback(
      (nextValue: any) => {
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
    const normalizedValue = useMemo(
      () => normalizeValue(mergedValue),
      [mergedValue, normalizeValue],
    );
    const valueArray = useMemo(
      () =>
        isMultiple
          ? (normalizedValue as any[])
          : isValueEmpty(normalizedValue)
            ? []
            : [normalizedValue],
      [isMultiple, normalizedValue],
    );

    const [extraOptions, setExtraOptions] = useState<LobeSelectOption<any>[]>([]);

    useEffect(() => {
      if (mode !== 'tags' && extraOptions.length > 0) {
        setExtraOptions([]);
      }
    }, [mode, extraOptions.length]);

    const { resolvedOptions, optionMap } = useMemo(() => {
      const baseOptions = options ?? [];
      const optionValueMap = new Map<any, LobeSelectOption<any>>();

      const addOption = (item: LobeSelectOption<any>) => {
        if (!optionValueMap.has(item.value)) {
          optionValueMap.set(item.value, item);
        }
      };

      const walkOptions = (items: LobeSelectOptions) => {
        items.forEach((item) => {
          if (isGroupOption(item)) {
            item.options.forEach(addOption);
          } else {
            addOption(item);
          }
        });
      };

      walkOptions(baseOptions);

      const filteredExtraOptions = extraOptions.filter((item) => !optionValueMap.has(item.value));
      filteredExtraOptions.forEach(addOption);

      const mergedOptions: LobeSelectOptions = [...baseOptions, ...filteredExtraOptions];

      const missingValueOptions: LobeSelectOption<any>[] = valueArray
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

    const [searchValue, setSearchValue] = useState('');
    const shouldShowSearch = Boolean(showSearch || mode === 'tags');

    useEffect(() => {
      if (!mergedOpen) setSearchValue('');
    }, [mergedOpen]);

    const getOption = useCallback(
      (optionValue: any): LobeSelectOption<any> => {
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

          addedValues.forEach((val) => {
            onSelect?.(val, getOption(val));
          });

          if (value === undefined) {
            setUncontrolledValue(nextValues);
          }
          onChange?.(
            nextValues,
            nextValues.map((val) => getOption(val)),
          );
        } else {
          if (
            !isValueEmpty(normalizedNextValue) &&
            !Object.is(previousValue, normalizedNextValue)
          ) {
            onSelect?.(normalizedNextValue, getOption(normalizedNextValue));
          }
          if (value === undefined) {
            setUncontrolledValue(normalizedNextValue);
          }
          onChange?.(
            normalizedNextValue,
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

        const nextValues = [...valueArray];
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

    const filteredOptions = useMemo(() => {
      if (!shouldShowSearch || !searchValue.trim()) return resolvedOptions;
      const query = searchValue.trim().toLowerCase();

      const filterItems = (items: LobeSelectOptions): LobeSelectOptions => {
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
          .filter(Boolean) as LobeSelectOptions;

        return filtered;
      };

      return filterItems(resolvedOptions);
    }, [resolvedOptions, searchValue, shouldShowSearch]);

    const renderValue = useCallback(
      (currentValue: any) => {
        const resolved = normalizeValue(currentValue);
        const placeholderNode =
          placeholder === undefined ? null : (
            <span className={styles.valueText}>{placeholder}</span>
          );

        if (isMultiple) {
          const values = Array.isArray(resolved) ? resolved : [];
          if (values.length === 0) return placeholderNode;
          return (
            <span className={styles.tags}>
              {values.map((val, index) => {
                const option = getOption(val);
                const content = labelRender ? labelRender(option) : (option.label ?? String(val));
                return (
                  <span className={styles.tag} key={`${String(val)}-${index}`}>
                    {content}
                  </span>
                );
              })}
            </span>
          );
        }

        if (isValueEmpty(resolved)) return placeholderNode;
        const option = getOption(resolved);
        const content = labelRender ? labelRender(option) : (option.label ?? String(resolved));
        return <span className={styles.valueText}>{content}</span>;
      },
      [getOption, isMultiple, labelRender, normalizeValue, placeholder],
    );

    const hasValue = isMultiple ? valueArray.length > 0 : !isValueEmpty(normalizedValue);
    const showClear = Boolean(allowClear && hasValue && !disabled && !readOnly);

    const handleClear = useCallback(
      (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        handleValueChange(isMultiple ? [] : null);
      },
      [handleValueChange, isMultiple],
    );

    const prefixNode = useMemo(() => {
      if (prefix === undefined || prefix === null) return null;
      if (isValidElement(prefix) || typeof prefix === 'string' || typeof prefix === 'number') {
        return prefix;
      }
      return <Icon icon={prefix as any} size={'small'} />;
    }, [prefix]);

    const suffixIconNode = useMemo(() => {
      if (loading) {
        return <Icon icon={Loader2} size={'small'} spin />;
      }
      if (suffixIcon === null) return null;
      if (
        isValidElement(suffixIcon) ||
        typeof suffixIcon === 'string' ||
        typeof suffixIcon === 'number'
      ) {
        return suffixIcon;
      }
      return (
        <Icon
          icon={(suffixIcon as any) || ChevronDown}
          size={'small'}
          {...suffixIconProps}
          style={{
            pointerEvents: 'none',
            ...suffixIconProps?.style,
          }}
        />
      );
    }, [loading, suffixIcon, suffixIconProps]);

    const popupStyle = useMemo(() => {
      const maxHeight = isItemAligned ? '80vh' : '450px';
      const baseStyle: React.CSSProperties = {
        maxHeight,
        maxWidth: 'var(--available-width)',
        minWidth: 'var(--anchor-width)',
        ['--lobe-select-popup-max-height' as any]: maxHeight,
      };

      if (popupMatchSelectWidth === undefined || popupMatchSelectWidth === true) {
        return baseStyle;
      }
      if (typeof popupMatchSelectWidth === 'number') {
        return {
          ...baseStyle,
          minWidth: popupMatchSelectWidth,
          width: popupMatchSelectWidth,
        };
      }
      return {
        ...baseStyle,
        minWidth: 'max-content',
      };
    }, [isItemAligned, popupMatchSelectWidth]);

    const triggerClassName = cx(
      triggerVariants({ shadow, size, variant: resolvedVariant }),
      className,
      classNames?.root,
      classNames?.trigger,
    );

    const portalContainer = usePortalContainer(LOBE_SELECT_CONTAINER_ATTR);
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

    const itemTextClassName = cx(
      optionRender ? menuStyles.itemContent : menuStyles.label,
      styles.itemText,
      classNames?.itemText,
    );

    const isBoldIndicator = selectedIndicatorVariant === 'bold';
    let optionIndex = 0;
    const renderOptions = (items: LobeSelectOptions) =>
      items.map((item, index) => {
        if (isGroupOption(item)) {
          return (
            <Select.Group className={cx(styles.group, classNames?.group)} key={`group-${index}`}>
              <Select.GroupLabel
                className={cx(menuStyles.groupLabel, styles.groupLabel, classNames?.groupLabel)}
              >
                {item.label}
              </Select.GroupLabel>
              {item.options.map((option) => {
                const currentIndex = optionIndex++;
                return (
                  <Select.Item
                    className={cx(
                      menuStyles.item,
                      styles.item,
                      isBoldIndicator && styles.itemBoldSelected,
                      classNames?.item,
                      classNames?.option,
                      option.className,
                    )}
                    disabled={option.disabled}
                    key={`${String(option.value)}-${currentIndex}`}
                    label={getOptionSearchText(option)}
                    style={{
                      minHeight: listItemHeight,
                      ...option.style,
                    }}
                    value={option.value}
                  >
                    <Select.ItemText className={itemTextClassName}>
                      {optionRender ? optionRender(option, { index: currentIndex }) : option.label}
                    </Select.ItemText>
                    {!isBoldIndicator && (
                      <Select.ItemIndicator
                        className={cx(styles.itemIndicator, classNames?.itemIndicator)}
                      >
                        <Icon icon={Check} size={'small'} />
                      </Select.ItemIndicator>
                    )}
                  </Select.Item>
                );
              })}
            </Select.Group>
          );
        }

        const currentIndex = optionIndex++;
        return (
          <Select.Item
            className={cx(
              menuStyles.item,
              styles.item,
              isBoldIndicator && styles.itemBoldSelected,
              classNames?.item,
              classNames?.option,
              item.className,
            )}
            disabled={item.disabled}
            key={`${String(item.value)}-${currentIndex}`}
            label={getOptionSearchText(item)}
            style={{
              minHeight: listItemHeight,
              ...item.style,
            }}
            value={item.value}
          >
            <Select.ItemText className={itemTextClassName}>
              {optionRender ? optionRender(item, { index: currentIndex }) : item.label}
            </Select.ItemText>
            {!isBoldIndicator && (
              <Select.ItemIndicator className={cx(styles.itemIndicator, classNames?.itemIndicator)}>
                <Icon icon={Check} size={'small'} />
              </Select.ItemIndicator>
            )}
          </Select.Item>
        );
      });

    return (
      <Select.Root
        disabled={disabled}
        id={id}
        modal={isItemAligned}
        multiple={isMultiple}
        name={name}
        onOpenChange={handleOpenChange}
        onValueChange={handleValueChange}
        open={mergedOpen}
        readOnly={readOnly}
        required={required}
        value={normalizedValue}
      >
        <Select.Trigger
          autoFocus={autoFocus}
          className={triggerClassName}
          disabled={disabled}
          style={style}
        >
          {prefixNode !== null && prefixNode !== undefined && (
            <span className={cx(styles.prefix, classNames?.prefix)}>{prefixNode}</span>
          )}
          <Select.Value className={cx(styles.value, classNames?.value)}>{renderValue}</Select.Value>
          <span className={cx(styles.suffix, classNames?.suffix)}>
            {showClear && (
              <span
                className={cx(styles.clear, classNames?.clear)}
                data-role="lobe-select-clear"
                onClick={handleClear}
              >
                <Icon icon={X} size={'small'} />
              </span>
            )}
            {suffixIconNode !== null && suffixIconNode !== undefined && (
              <Select.Icon className={cx(styles.icon, classNames?.icon)}>
                {suffixIconNode}
              </Select.Icon>
            )}
          </span>
        </Select.Trigger>

        <Select.Portal container={portalContainer}>
          <Select.Positioner
            align="start"
            alignItemWithTrigger={isItemAligned}
            className={styles.positioner}
            side="bottom"
            sideOffset={6}
          >
            <Select.Popup
              className={cx(
                menuStyles.popup,
                styles.popup,
                popupClassName,
                classNames?.popup,
                classNames?.dropdown,
              )}
              style={popupStyle}
            >
              {shouldShowSearch && (
                <div className={cx(styles.search, classNames?.search)}>
                  <input
                    className={styles.searchInput}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    placeholder={typeof placeholder === 'string' ? placeholder : undefined}
                    value={searchValue}
                  />
                </div>
              )}
              {(() => {
                const content =
                  filteredOptions.length > 0 ? (
                    renderOptions(filteredOptions)
                  ) : (
                    <div
                      className={cx(
                        menuStyles.item,
                        menuStyles.empty,
                        styles.empty,
                        classNames?.empty,
                      )}
                    >
                      No data
                    </div>
                  );

                if (!virtual || filteredOptions.length === 0) {
                  return (
                    <Select.List
                      className={cx(styles.list, classNames?.list)}
                      data-virtual={virtual || undefined}
                    >
                      {content}
                    </Select.List>
                  );
                }

                return (
                  <Select.List
                    className={cx(styles.list, classNames?.list)}
                    data-virtual={virtual || undefined}
                    style={virtualListStyle}
                  >
                    <Virtualizer itemSize={listItemHeight}>{content}</Virtualizer>
                  </Select.List>
                );
              })()}
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    );
  },
);

LobeSelect.displayName = 'LobeSelect';

export default LobeSelect;
