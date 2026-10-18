'use client';

import { Autocomplete } from '@base-ui/react/autocomplete';
import clsx from 'clsx';
import { XIcon } from 'lucide-react';
import { memo, useMemo, useRef } from 'react';

import { useAppElement } from '@/ConfigProvider/AppElementContext';
import Icon from '@/Icon';
import { inputStyles, inputVariants } from '@/Input';
import { getFloatingCollisionPadding } from '@/internal/floating';
import { useLayerZIndex } from '@/internal/zIndex';
import { useThemeMode } from '@/styles/theme/scope';
import { toDataAttributes } from '@/utils/bem';

import { autoCompleteClasses } from './stable';
import { styles } from './style';
import type { AutoCompleteOption, AutoCompleteProps } from './type';

const AutoComplete = memo<AutoCompleteProps>(
  ({
    className,
    classNames,
    styles: customStyles,
    style,
    variant,
    shadow,
    size = 'middle',
    options = [],
    onChange,
    onSearch,
    allowClear,
    disabled,
    placeholder,
    prefix,
    suffix,
    emptyText,
    ...rest
  }) => {
    const { isDarkMode } = useThemeMode();
    const appElement = useAppElement();
    const anchorRef = useRef<HTMLDivElement>(null);
    const { ref: positionerRef, zIndex } = useLayerZIndex<HTMLDivElement>('floating');
    const mergedVariant = variant || (isDarkMode ? 'filled' : 'outlined');

    const dataAttributes = toDataAttributes({ shadow, size, variant: mergedVariant });
    const items = useMemo<AutoCompleteOption[]>(
      () => options.map((option) => (typeof option === 'string' ? { value: option } : option)),
      [options],
    );

    return (
      <Autocomplete.Root
        openOnInputClick
        disabled={disabled}
        itemToStringValue={(item) => (item as AutoCompleteOption).value}
        items={items}
        onValueChange={(value) => {
          onChange?.(value);
          onSearch?.(value);
        }}
        {...rest}
      >
        <div
          {...dataAttributes}
          data-disabled={disabled ? '' : undefined}
          ref={anchorRef}
          style={style}
          className={clsx(
            inputVariants({ shadow, size, variant: mergedVariant }),
            autoCompleteClasses(),
            className,
          )}
        >
          {prefix && (
            <span className={clsx(inputStyles.slot, autoCompleteClasses('prefix'))}>{prefix}</span>
          )}
          <Autocomplete.Input
            className={clsx(inputStyles.input, autoCompleteClasses('input'), classNames?.input)}
            placeholder={placeholder}
            style={customStyles?.input}
          />
          {allowClear && (
            <Autocomplete.Clear
              aria-label={'Clear'}
              className={clsx(styles.clear, autoCompleteClasses('clear'))}
            >
              <Icon icon={XIcon} size={14} />
            </Autocomplete.Clear>
          )}
          {suffix && (
            <span className={clsx(inputStyles.slot, autoCompleteClasses('suffix'))}>{suffix}</span>
          )}
        </div>
        <Autocomplete.Portal container={appElement ?? undefined}>
          <Autocomplete.Positioner
            anchor={anchorRef}
            {...dataAttributes}
            className={clsx(styles.positioner, autoCompleteClasses('positioner'))}
            collisionPadding={getFloatingCollisionPadding()}
            ref={positionerRef}
            sideOffset={4}
            style={zIndex === undefined ? undefined : { zIndex }}
          >
            <Autocomplete.Popup
              {...dataAttributes}
              className={clsx(styles.popup, autoCompleteClasses('popup'), classNames?.popup)}
              style={customStyles?.popup}
            >
              {emptyText && (
                <Autocomplete.Empty className={clsx(styles.empty, autoCompleteClasses('empty'))}>
                  {emptyText}
                </Autocomplete.Empty>
              )}
              <Autocomplete.List className={clsx(styles.list, autoCompleteClasses('list'))}>
                {(item: AutoCompleteOption) => (
                  <Autocomplete.Item
                    className={clsx(styles.item, autoCompleteClasses('item'), classNames?.item)}
                    disabled={item.disabled}
                    key={item.value}
                    style={customStyles?.item}
                    value={item}
                  >
                    {item.label ?? item.value}
                  </Autocomplete.Item>
                )}
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
    );
  },
);

AutoComplete.displayName = 'AutoComplete';

export default AutoComplete;
