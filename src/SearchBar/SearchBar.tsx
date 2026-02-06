'use client';

import { cx } from 'antd-style';
import { LucideLoader2, Search } from 'lucide-react';
import { memo, useMemo, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import useControlledState from 'use-merge-value';

import Spotlight from '@/awesome/Spotlight';
import Hotkey from '@/Hotkey';
import Icon from '@/Icon';
import Input from '@/Input';

import { styles } from './style';
import { type SearchBarProps } from './type';

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
    const inputReference: any = useRef<HTMLInputElement>(null);
    const hotkey = useMemo(
      () => (shortKey.includes('+') ? shortKey : `mod+${shortKey}`),
      [shortKey],
    );

    useHotkeys(
      hotkey,
      () => {
        if (!enableShortKey) return;
        inputReference.current?.focus();
      },
      {
        enableOnFormTags: true,
        enabled: !!enableShortKey && !!shortKey,
        preventDefault: true,
      },
    );

    return (
      <div className={cx(styles.search, className)} style={style}>
        {spotlight && <Spotlight />}
        <Input
          allowClear
          className={inputClassName}
          placeholder={placeholder ?? 'Type keywords...'}
          ref={inputReference}
          style={inputStyle}
          value={inputValue}
          prefix={
            <Icon
              className={styles.icon}
              icon={loading ? LucideLoader2 : Search}
              size="small"
              spin={loading}
              style={{ marginRight: 4 }}
            />
          }
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
          {...rest}
        />
        {enableShortKey && showTag && !inputValue && (
          <Hotkey
            compact
            className={cx(styles.tag, shortKeyClassName)}
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
