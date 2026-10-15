'use client';

import * as stylex from '@stylexjs/stylex';
import { LucideLoader2, Search } from 'lucide-react';
import { memo, useMemo, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import Spotlight from '@/awesome/Spotlight';
import { useControlledState } from '@/hooks/useControlledState';
import { useEventCallback } from '@/hooks/useEventCallback';
import Hotkey from '@/Hotkey';
import Icon from '@/Icon';
import { Input } from '@/Input';
import { styleProps } from '@/styles/stylex/props';

import { styles } from './style';
import { type SearchBarProps } from './type';

type HandlerEvent<K extends 'onBlur' | 'onChange' | 'onFocus' | 'onPressEnter'> = Parameters<
  NonNullable<SearchBarProps[K]>
>[0];

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

    const prefix = useMemo(
      () => (
        <Icon
          {...stylex.props(styles.icon)}
          icon={loading ? LucideLoader2 : Search}
          size="small"
          spin={loading}
          style={{ marginRight: 4 }}
        />
      ),
      [loading],
    );

    const handleBlur = useEventCallback((e: HandlerEvent<'onBlur'>) => {
      onBlur?.(e);
      setInputValue(e.target.value);
      setShowTag(true);
    });

    const handleChange = useEventCallback((e: HandlerEvent<'onChange'>) => {
      setInputValue(e.target.value);
      onChange?.(e);
    });

    const handleFocus = useEventCallback((e: HandlerEvent<'onFocus'>) => {
      onFocus?.(e);
      setShowTag(false);
    });

    const handlePressEnter = useEventCallback((e: HandlerEvent<'onPressEnter'>) => {
      onPressEnter?.(e);
      onSearch?.(inputValue);
    });

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
      <div {...styleProps(styles.search, className, style)}>
        {spotlight && <Spotlight />}
        <Input
          allowClear
          className={inputClassName}
          placeholder={placeholder ?? 'Type keywords...'}
          prefix={prefix}
          ref={inputReference}
          style={inputStyle}
          value={inputValue}
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={handleFocus}
          onPressEnter={handlePressEnter}
          {...rest}
        />
        {enableShortKey && showTag && !inputValue && (
          <Hotkey
            compact
            keys={hotkey}
            styles={{ kbdStyle: { color: 'inherit' } }}
            {...styleProps(styles.tag, shortKeyClassName, shortKeyStyle)}
          />
        )}
      </div>
    );
  },
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
