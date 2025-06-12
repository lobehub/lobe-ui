'use client';

import { LucideLoader2, Search } from 'lucide-react';
import { memo, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import useControlledState from 'use-merge-value';

import Hotkey from '@/Hotkey';
import Icon from '@/Icon';
import Input from '@/Input';
import Spotlight from '@/awesome/Spotlight';

import { useStyles } from './style';
import type { SearchBarProps } from './type';

const SearchBar = memo<SearchBarProps>(
  ({
    defaultValue = '',
    spotlight,
    className,
    value,
    onInputChange,
    placeholder,
    enableShortKey,
    shortKey = 'mod+k',
    onSearch,
    loading,
    style,
    onChange,
    onBlur,
    onPressEnter,
    onFocus,
    styles: { input: inputStyle, shortKey: shortKeyStyle } = {},
    classNames: { input: inputClassName, shortKey: shortKeyClassName } = {},
    ...rest
  }) => {
    const [inputValue, setInputValue] = useControlledState(defaultValue, {
      defaultValue,
      onChange: onInputChange,
      value,
    });

    const [showTag, setShowTag] = useState<boolean>(true);
    const { styles, cx } = useStyles();
    const inputReference: any = useRef<HTMLInputElement>(null);
    const hotkey = shortKey.includes('+') ? shortKey : `mod+${shortKey}`;

    useHotkeys(
      hotkey,
      () => {
        if (!enableShortKey) return;
        inputReference.current?.focus();
      },
      {
        enableOnFormTags: true,
        preventDefault: true,
      },
    );

    return (
      <div className={cx(styles.search, className)} style={style}>
        {spotlight && <Spotlight />}
        <Input
          allowClear
          className={inputClassName}
          onBlur={(e) => {
            onBlur?.(e);
            setInputValue(e.target.value);
            setShowTag(true);
          }}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange?.(e);
          }}
          onFocus={(e) => {
            onFocus?.(e);
            setShowTag(false);
          }}
          onPressEnter={(e) => {
            onPressEnter?.(e);
            onSearch?.(inputValue);
          }}
          placeholder={placeholder ?? 'Type keywords...'}
          prefix={
            <Icon
              className={styles.icon}
              icon={loading ? LucideLoader2 : Search}
              size="small"
              spin={loading}
              style={{ marginRight: 4 }}
            />
          }
          ref={inputReference}
          style={inputStyle}
          value={inputValue}
          {...rest}
        />
        {enableShortKey && showTag && !inputValue && (
          <Hotkey
            className={cx(styles.tag, shortKeyClassName)}
            compact
            keys={hotkey}
            style={shortKeyStyle}
          />
        )}
      </div>
    );
  },
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
