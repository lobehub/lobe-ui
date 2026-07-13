'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import { cx } from 'antd-style';
import { ChevronDown, Loader2, X } from 'lucide-react';
import {
  type ChangeEvent,
  isValidElement,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { Virtualizer } from 'virtua';

import { styles as menuStyles } from '@/base-ui/DropdownMenu/sharedStyle';
import Icon, { type IconProps } from '@/Icon';

import { isValueEmpty } from './helpers';
import { type useSelectVirtual } from './hooks';
import { styles } from './style';
import { type SelectClassNames, type SelectOption, type SelectProps } from './type';

export function resolveIconNode(node: ReactNode | IconProps['icon'] | undefined | null) {
  if (node === undefined || node === null) return null;
  if (isValidElement(node) || typeof node === 'string' || typeof node === 'number') {
    return node;
  }
  return <Icon icon={node as any} size={'small'} />;
}

export function resolveSuffixIcon(
  suffixIcon: SelectProps['suffixIcon'],
  suffixIconProps: SelectProps['suffixIconProps'],
  loading: boolean | undefined,
) {
  if (loading) return <Icon spin icon={Loader2} size={'small'} />;
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
}

interface TriggerValueRendererParams {
  getOption: (value: any) => SelectOption<any>;
  isMultiple: boolean;
  isTags: boolean;
  labelRender: SelectProps['labelRender'];
  normalizeValue: (value: any) => any;
  onRemoveValue: (index: number) => void;
  placeholder: ReactNode;
}

export function createTriggerValueRenderer({
  getOption,
  isMultiple,
  isTags,
  labelRender,
  normalizeValue,
  onRemoveValue,
  placeholder,
}: TriggerValueRendererParams) {
  return function renderValue(currentValue: any): ReactNode {
    const resolved = normalizeValue(currentValue);
    const placeholderNode =
      placeholder === undefined ? null : <span className={styles.valueText}>{placeholder}</span>;

    if (isMultiple) {
      const values = Array.isArray(resolved) ? resolved : [];
      if (values.length === 0) return placeholderNode;
      return (
        <span className={styles.tags}>
          {values.map((val, index) => {
            const option = getOption(val);
            const content = labelRender ? labelRender(option) : (option.label ?? String(val));
            return (
              <span
                className={styles.tag}
                data-role="lobe-select-tag"
                key={`${String(val)}-${index}`}
              >
                {content}
                {isTags && (
                  <span
                    aria-label={`Remove ${String(val)}`}
                    className={styles.tagClose}
                    data-role="lobe-select-tag-remove"
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onRemoveValue(index);
                    }}
                    onPointerDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                  >
                    <X size={12} />
                  </span>
                )}
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
  };
}

type SelectVirtualReturn = ReturnType<typeof useSelectVirtual>;

interface SelectListSectionProps {
  classNames: SelectClassNames | undefined;
  hasSearch: boolean;
  isEmpty: boolean;
  listContent: ReactNode;
  listItemHeight: number | undefined;
  virtual: boolean | undefined;
  virtualState: SelectVirtualReturn;
}

export function SelectListSection({
  classNames,
  hasSearch,
  isEmpty,
  listContent,
  listItemHeight,
  virtual,
  virtualState,
}: SelectListSectionProps) {
  const listClassName = cx(styles.list, hasSearch && styles.listWithSearch, classNames?.list);

  if (!virtual || isEmpty) {
    return (
      <BaseSelect.List className={listClassName} data-virtual={virtual || undefined}>
        {listContent}
      </BaseSelect.List>
    );
  }

  const { handleListScroll, keepMountedIndices, listRef, markPointerScroll, virtualListStyle } =
    virtualState;

  return (
    <BaseSelect.List
      data-virtual
      className={listClassName}
      ref={listRef}
      style={virtualListStyle}
      tabIndex={-1}
      onPointerDown={markPointerScroll}
      onScroll={handleListScroll}
      onTouchMove={markPointerScroll}
      onWheel={markPointerScroll}
    >
      <Virtualizer itemSize={listItemHeight} keepMounted={keepMountedIndices}>
        {listContent}
      </Virtualizer>
    </BaseSelect.List>
  );
}

interface EmptyContentProps {
  classNames: SelectClassNames | undefined;
}

export function EmptyContent({ classNames }: EmptyContentProps) {
  return (
    <div className={cx(menuStyles.item, menuStyles.empty, styles.empty, classNames?.empty)}>
      No data
    </div>
  );
}

interface SelectSearchInputProps {
  autoFocus?: boolean;
  classNames: SelectClassNames | undefined;
  disabled?: boolean;
  inline?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  placeholder: ReactNode;
  readOnly?: boolean;
  stopPropagation: (event: KeyboardEvent<HTMLInputElement>) => void;
  value: string;
}

export function SelectSearchInput({
  autoFocus,
  classNames,
  disabled,
  inline,
  onChange,
  onKeyDown,
  placeholder,
  readOnly,
  stopPropagation,
  value,
}: SelectSearchInputProps) {
  return (
    <div className={cx(inline ? styles.tagsSearch : styles.search, classNames?.search)}>
      <input
        autoFocus={autoFocus}
        className={styles.searchInput}
        disabled={disabled}
        placeholder={typeof placeholder === 'string' ? placeholder : undefined}
        readOnly={readOnly}
        value={value}
        onChange={onChange}
        onKeyDownCapture={onKeyDown}
        onKeyUp={stopPropagation}
        onKeyUpCapture={stopPropagation}
      />
    </div>
  );
}

interface SelectTriggerSuffixProps {
  classNames: SelectClassNames | undefined;
  onClear: (event: MouseEvent) => void;
  showClear: boolean;
  suffixIconNode: ReactNode;
}

export function SelectTriggerSuffix({
  classNames,
  onClear,
  showClear,
  suffixIconNode,
}: SelectTriggerSuffixProps) {
  return (
    <span className={cx(styles.suffix, classNames?.suffix)}>
      {showClear && (
        <span
          className={cx(styles.clear, classNames?.clear)}
          data-role="lobe-select-clear"
          onClick={onClear}
        >
          <Icon icon={X} size={'small'} />
        </span>
      )}
      {suffixIconNode !== null && suffixIconNode !== undefined && (
        <BaseSelect.Icon className={cx(styles.icon, classNames?.icon)}>
          {suffixIconNode}
        </BaseSelect.Icon>
      )}
    </span>
  );
}
