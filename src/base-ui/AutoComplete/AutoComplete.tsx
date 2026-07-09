'use client';

import { Autocomplete } from '@base-ui/react/autocomplete';
import { cx, useThemeMode } from 'antd-style';
import { XIcon } from 'lucide-react';
import { memo, useMemo, useRef } from 'react';

import { inputStyles, inputVariants } from '@/base-ui/Input';
import Icon from '@/Icon';
import { useAppElement } from '@/ThemeProvider';

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
    const mergedVariant = variant || (isDarkMode ? 'filled' : 'outlined');

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
          className={cx(inputVariants({ shadow, size, variant: mergedVariant }), className)}
          data-disabled={disabled ? '' : undefined}
          ref={anchorRef}
          style={style}
        >
          {prefix && <span className={inputStyles.slot}>{prefix}</span>}
          <Autocomplete.Input
            className={cx(inputStyles.input, classNames?.input)}
            placeholder={placeholder}
            style={customStyles?.input}
          />
          {allowClear && (
            <Autocomplete.Clear aria-label={'Clear'} className={styles.clear}>
              <Icon icon={XIcon} size={14} />
            </Autocomplete.Clear>
          )}
          {suffix && <span className={inputStyles.slot}>{suffix}</span>}
        </div>
        <Autocomplete.Portal container={appElement ?? undefined}>
          <Autocomplete.Positioner anchor={anchorRef} className={styles.positioner} sideOffset={4}>
            <Autocomplete.Popup
              className={cx(styles.popup, classNames?.popup)}
              style={customStyles?.popup}
            >
              {emptyText && (
                <Autocomplete.Empty className={styles.empty}>{emptyText}</Autocomplete.Empty>
              )}
              <Autocomplete.List className={styles.list}>
                {(item: AutoCompleteOption) => (
                  <Autocomplete.Item
                    className={cx(styles.item, classNames?.item)}
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
