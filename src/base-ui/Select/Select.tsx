'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import { cx, useThemeMode } from 'antd-style';
import { type MouseEvent } from 'react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { styles as menuStyles } from '@/base-ui/DropdownMenu/sharedStyle';

import { SelectPositioner } from './atoms';
import { isValueEmpty } from './helpers';
import {
  usePortalContainer,
  useSelectOpen,
  useSelectSearch,
  useSelectValue,
  useSelectVirtual,
} from './hooks';
import {
  createTriggerValueRenderer,
  EmptyContent,
  resolveIconNode,
  resolveSuffixIcon,
  SelectListSection,
  SelectSearchInput,
  SelectTriggerSuffix,
} from './parts';
import { renderOptions } from './renderOptions';
import { styles, triggerVariants } from './style';
import { type SelectOption, type SelectProps } from './type';

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
    labelRender,
    listHeight = 512,
    listItemHeight,
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
    const isTags = mode === 'tags';
    const isMultiple = mode === 'multiple' || mode === 'tags';
    const isItemAligned = behaviorVariant === 'item-aligned';

    const [extraOptions, setExtraOptions] = useState<SelectOption<any>[]>([]);

    useEffect(() => {
      if (mode !== 'tags' && extraOptions.length > 0) {
        setExtraOptions([]);
      }
    }, [mode, extraOptions.length]);

    const {
      appendTagValues,
      getOption,
      handleValueChange,
      normalizedValue,
      normalizeValue,
      removeLastTagValue,
      resolvedOptions,
      valueArray,
    } = useSelectValue({
      defaultValue,
      extraOptions,
      isMultiple,
      onChange,
      onSelect,
      options,
      setExtraOptions,
      value,
    });

    const { handleOpenChange, mergedOpen } = useSelectOpen({ defaultOpen, onOpenChange, open });

    const handleRootValueChange = useCallback(
      (nextValue: any) => {
        if (!(isTags && !mergedOpen)) handleValueChange(nextValue);
      },
      [handleValueChange, isTags, mergedOpen],
    );

    const handleRemoveTag = useCallback(
      (index: number) =>
        handleValueChange(valueArray.filter((_, itemIndex) => itemIndex !== index)),
      [handleValueChange, valueArray],
    );

    const {
      filteredOptions,
      handleSearchChange,
      handleSearchKeyDown,
      searchValue,
      shouldShowSearch,
      stopSearchPropagation,
    } = useSelectSearch({
      appendTagValues,
      handleOpenChange,
      mergedOpen,
      mode,
      removeLastTagValue,
      resolvedOptions,
      showSearch,
      tokenSeparators,
    });

    const virtualState = useSelectVirtual({
      filteredOptions,
      listItemHeight,
      size,
      valueArray,
      virtual,
    });

    const portalContainer = usePortalContainer();

    const renderValue = useMemo(
      () =>
        createTriggerValueRenderer({
          getOption,
          isMultiple,
          isTags,
          labelRender,
          normalizeValue,
          onRemoveValue: handleRemoveTag,
          placeholder: isTags ? undefined : placeholder,
        }),
      [getOption, handleRemoveTag, isMultiple, isTags, labelRender, normalizeValue, placeholder],
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

    const prefixNode = useMemo(() => resolveIconNode(prefix), [prefix]);
    const suffixIconNode = useMemo(
      () => resolveSuffixIcon(suffixIcon, suffixIconProps, loading),
      [loading, suffixIcon, suffixIconProps],
    );

    const popupStyle = useMemo(() => {
      const maxHeight = isItemAligned ? '80vh' : `${listHeight}px`;
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
      return { ...baseStyle, minWidth: 'max-content' };
    }, [isItemAligned, listHeight, popupMatchSelectWidth]);

    const triggerClassName = cx(
      triggerVariants({ shadow, size, variant: resolvedVariant }),
      className,
      classNames?.root,
      classNames?.trigger,
    );

    const isBoldIndicator = selectedIndicatorVariant === 'bold';
    const itemTextClassName = cx(
      optionRender ? menuStyles.itemContent : menuStyles.label,
      styles.itemText,
      classNames?.itemText,
    );

    const isEmpty = filteredOptions.length === 0;
    const listContent = isEmpty ? (
      <EmptyContent classNames={classNames} />
    ) : (
      renderOptions({
        classNames,
        isBoldIndicator,
        items: filteredOptions,
        itemTextClassName,
        listItemHeight,
        optionRender,
        renderVirtualItem: virtualState.renderVirtualItem,
        virtual,
      })
    );

    return (
      <BaseSelect.Root
        disabled={disabled}
        id={id}
        modal={isItemAligned}
        multiple={isMultiple}
        name={name}
        open={mergedOpen}
        readOnly={readOnly}
        required={required}
        value={normalizedValue}
        onOpenChange={handleOpenChange}
        onValueChange={handleRootValueChange}
      >
        <BaseSelect.Trigger
          autoFocus={!isTags && autoFocus}
          className={triggerClassName}
          disabled={disabled}
          nativeButton={!isTags}
          render={isTags ? <div /> : undefined}
          style={style}
        >
          {prefixNode !== null && prefixNode !== undefined && (
            <span className={cx(styles.prefix, classNames?.prefix)}>{prefixNode}</span>
          )}
          <BaseSelect.Value
            className={cx(styles.value, isTags && styles.tagsValue, classNames?.value)}
          >
            {renderValue}
          </BaseSelect.Value>
          {isTags && (
            <SelectSearchInput
              inline
              autoFocus={autoFocus}
              classNames={classNames}
              disabled={disabled}
              placeholder={valueArray.length === 0 ? placeholder : undefined}
              readOnly={readOnly}
              stopPropagation={stopSearchPropagation}
              value={searchValue}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
            />
          )}
          <SelectTriggerSuffix
            classNames={classNames}
            showClear={showClear}
            suffixIconNode={suffixIconNode}
            onClear={handleClear}
          />
        </BaseSelect.Trigger>

        <BaseSelect.Portal container={portalContainer}>
          <SelectPositioner
            align="start"
            alignItemWithTrigger={isItemAligned}
            className={styles.positioner}
            side="bottom"
            sideOffset={6}
          >
            <BaseSelect.Popup
              style={popupStyle}
              className={cx(
                menuStyles.popup,
                styles.popup,
                popupClassName,
                classNames?.popup,
                classNames?.dropdown,
              )}
            >
              {shouldShowSearch && !isTags && (
                <SelectSearchInput
                  classNames={classNames}
                  placeholder={placeholder}
                  stopPropagation={stopSearchPropagation}
                  value={searchValue}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                />
              )}
              <SelectListSection
                classNames={classNames}
                hasSearch={shouldShowSearch && !isTags}
                isEmpty={isEmpty}
                listContent={listContent}
                listItemHeight={listItemHeight}
                virtual={virtual}
                virtualState={virtualState}
              />
            </BaseSelect.Popup>
          </SelectPositioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    );
  },
);

Select.displayName = 'Select';

export default Select;
