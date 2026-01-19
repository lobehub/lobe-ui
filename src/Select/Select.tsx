'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import { cx, useThemeMode } from 'antd-style';
import { ChevronDown, Loader2, X } from 'lucide-react';
import type { MouseEvent } from 'react';
import { isValidElement, memo, useCallback, useMemo } from 'react';
import { Virtualizer } from 'virtua';

import Icon from '@/Icon';
import { styles as menuStyles } from '@/Menu/sharedStyle';
import { usePortalContainer } from '@/hooks/usePortalContainer';

import { SelectOptionsList } from './SelectOption';
import { SELECT_CONTAINER_ATTR } from './constants';
import { styles, triggerVariants } from './style';
import type { SelectProps } from './type';
import { useSelectState } from './useSelectState';
import { countVirtualItems, isValueEmpty } from './utils';

const CloseIconElement = <Icon icon={X} size="small" />;

const Select = memo<SelectProps<any>>(
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

    const {
      filteredOptions,
      getOption,
      handleOpenChange,
      handleSearchChange,
      handleSearchKeyDown,
      handleValueChange,
      isMultiple,
      mergedOpen,
      normalizedValue,
      searchValue,
      shouldShowSearch,
      valueArray,
    } = useSelectState({
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
    });

    // Render selected value
    const renderValue = useCallback(
      (currentValue: any) => {
        const normalizeValue = (val: any) => {
          if (isMultiple) {
            if (Array.isArray(val)) return val;
            if (val === null || val === undefined) return [];
            return [val];
          }
          if (Array.isArray(val)) return val[0] ?? null;
          return val === undefined ? null : val;
        };

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
      [getOption, isMultiple, labelRender, placeholder],
    );

    // Clear handler
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

    // Prefix node
    const prefixNode = useMemo(() => {
      if (prefix === undefined || prefix === null) return null;
      if (isValidElement(prefix) || typeof prefix === 'string' || typeof prefix === 'number') {
        return prefix;
      }
      return <Icon icon={prefix as any} size={'small'} />;
    }, [prefix]);

    // Suffix icon node
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

    // Popup style
    const popupStyle = useMemo(() => {
      const baseStyle: React.CSSProperties = {
        maxWidth: 'var(--available-width)',
        minWidth: 'var(--anchor-width)',
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
    }, [popupMatchSelectWidth]);

    // Class names
    const triggerClassName = cx(
      triggerVariants({ shadow, size, variant: resolvedVariant }),
      className,
      classNames?.root,
      classNames?.trigger,
    );

    const itemTextClassName = cx(
      optionRender ? menuStyles.itemContent : menuStyles.label,
      styles.itemText,
      classNames?.itemText,
    );

    // Portal and virtual list
    const portalContainer = usePortalContainer(SELECT_CONTAINER_ATTR);

    const virtualListStyle = useMemo(() => {
      if (!virtual) return undefined;
      const rowCount = countVirtualItems(filteredOptions);
      const maxVisibleRows = 6;
      const estimatedRowHeight =
        listItemHeight ?? (size === 'large' ? 40 : size === 'small' ? 28 : 32);
      const visibleRows = Math.min(Math.max(rowCount, 1), maxVisibleRows);
      const estimatedHeight = visibleRows * estimatedRowHeight + 8;

      return {
        height: `min(${estimatedHeight}px, var(--available-height))`,
      };
    }, [filteredOptions, listItemHeight, size, virtual]);

    // Options content
    const optionsContent =
      filteredOptions.length > 0 ? (
        <SelectOptionsList
          classNames={classNames}
          itemTextClassName={itemTextClassName}
          listItemHeight={listItemHeight}
          optionRender={optionRender}
          options={filteredOptions}
        />
      ) : (
        <div className={cx(menuStyles.item, menuStyles.empty, styles.empty, classNames?.empty)}>
          No data
        </div>
      );

    return (
      <BaseSelect.Root
        disabled={disabled}
        id={id}
        modal={false}
        multiple={isMultiple}
        name={name}
        onOpenChange={handleOpenChange}
        onValueChange={handleValueChange}
        open={mergedOpen}
        readOnly={readOnly}
        required={required}
        value={normalizedValue}
      >
        <BaseSelect.Trigger
          autoFocus={autoFocus}
          className={triggerClassName}
          disabled={disabled}
          style={style}
        >
          {prefixNode !== null && prefixNode !== undefined ? (
            <span className={cx(styles.prefix, classNames?.prefix)}>{prefixNode}</span>
          ) : null}
          <BaseSelect.Value className={cx(styles.value, classNames?.value)}>
            {renderValue}
          </BaseSelect.Value>
          <span className={cx(styles.suffix, classNames?.suffix)}>
            {showClear ? (
              <span
                className={cx(styles.clear, classNames?.clear)}
                data-role="select-clear"
                onClick={handleClear}
              >
                {CloseIconElement}
              </span>
            ) : null}
            {suffixIconNode !== null && suffixIconNode !== undefined ? (
              <BaseSelect.Icon className={cx(styles.icon, classNames?.icon)}>
                {suffixIconNode}
              </BaseSelect.Icon>
            ) : null}
          </span>
        </BaseSelect.Trigger>

        <BaseSelect.Portal container={portalContainer}>
          <BaseSelect.Positioner
            align="start"
            alignItemWithTrigger={false}
            className={styles.positioner}
            side="bottom"
            sideOffset={6}
          >
            <BaseSelect.Popup
              className={cx(
                menuStyles.popup,
                styles.popup,
                popupClassName,
                classNames?.popup,
                classNames?.dropdown,
              )}
              style={popupStyle}
            >
              {shouldShowSearch ? (
                <div className={cx(styles.search, classNames?.search)}>
                  <input
                    className={styles.searchInput}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    placeholder={typeof placeholder === 'string' ? placeholder : undefined}
                    value={searchValue}
                  />
                </div>
              ) : null}
              {!virtual || filteredOptions.length === 0 ? (
                <BaseSelect.List
                  className={cx(styles.list, classNames?.list)}
                  data-virtual={virtual || undefined}
                >
                  {optionsContent}
                </BaseSelect.List>
              ) : (
                <BaseSelect.List
                  className={cx(styles.list, classNames?.list)}
                  data-virtual={virtual || undefined}
                  style={virtualListStyle}
                >
                  <Virtualizer itemSize={listItemHeight}>{optionsContent}</Virtualizer>
                </BaseSelect.List>
              )}
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    );
  },
);

Select.displayName = 'Select';

export default Select;
