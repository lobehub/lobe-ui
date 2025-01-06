'use client';

import { LucideLoader2, Search } from 'lucide-react';
import { CSSProperties, memo, useEffect, useRef, useState } from 'react';
import useControlledState from 'use-merge-value';

import Icon from '@/Icon';
import { Input, type InputProps } from '@/Input';
import Tag from '@/Tag';
import Spotlight from '@/awesome/Spotlight';

import { useStyles } from './style';

export interface SearchBarProps extends Omit<InputProps, 'styles' | 'classNames'> {
  classNames?: {
    input?: string;
    shortKey?: string;
  };
  defaultValue?: string;
  /**
   * @description Whether to enable the shortcut key to focus on the input
   * @default false
   */
  enableShortKey?: boolean;
  loading?: boolean;

  onInputChange?: (value: string) => void;
  /**
   * @description Whether add spotlight background
   * @default false
   */
  onSearch?: (value: string) => void;
  /**
   * @description The shortcut key to focus on the input. Only works if `enableShortKey` is true
   * @default 'f'
   */
  shortKey?: string;
  spotlight?: boolean;

  styles?: {
    input?: CSSProperties;
    shortKey?: CSSProperties;
  };
  value?: string;
}

const SearchBar = memo<SearchBarProps>(
  ({
    defaultValue,
    spotlight,
    className,
    value,
    onInputChange,
    placeholder,
    enableShortKey,
    shortKey = 'f',
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
    const [inputValue, setInputValue] = useControlledState<string>(defaultValue as any, {
      defaultValue,
      onChange: onInputChange,
      value,
    });
    const [symbol, setSymbol] = useState('Ctrl');
    const [showTag, setShowTag] = useState<boolean>(true);
    const { styles, cx } = useStyles();
    const inputReference: any = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (!enableShortKey) return;

      const isAppleDevice = /(mac|iphone|ipod|ipad)/i.test(
        typeof navigator === 'undefined' ? '' : navigator?.platform,
      );

      if (isAppleDevice) {
        setSymbol('⌘');
      }

      const handler = (event_: KeyboardEvent) => {
        if ((isAppleDevice ? event_.metaKey : event_.ctrlKey) && event_.key === shortKey) {
          event_.preventDefault();
          inputReference.current?.focus();
        }
      };

      document.addEventListener('keydown', handler);

      return () => document.removeEventListener('keydown', handler);
    }, []);

    return (
      <div className={cx(styles.search, className)} style={style}>
        {spotlight && <Spotlight />}
        <Input
          allowClear
          className={cx(styles.input, inputClassName)}
          onBlur={(e) => {
            onBlur?.(e);
            setInputValue(e.target.value);

            if (!e.target.value) {
              setShowTag(true);
            }
          }}
          onChange={(e) => {
            onChange?.(e);
            setInputValue(e.target.value);
            if (e.target.value) {
              setShowTag(false);
            } else {
              setShowTag(true);
              onSearch?.(e.target.value);
            }
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
          value={value}
          {...rest}
        />
        {enableShortKey && showTag && !inputValue && (
          <Tag className={cx(styles.tag, shortKeyClassName)} style={shortKeyStyle}>
            {symbol} {shortKey.toUpperCase()}
          </Tag>
        )}
      </div>
    );
  },
);

export default SearchBar;
