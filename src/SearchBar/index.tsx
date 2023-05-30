import { Tag } from 'antd';
import { Search } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';

import { Icon, Input, InputProps } from '@/index';

import { useStyles } from './style';

export interface SearchBarProps extends InputProps {
  /**
   * @description Whether to enable the shortcut key to focus on the input
   * @default false
   */
  enableShortKey?: boolean;
  /**
   * @description The shortcut key to focus on the input. Only works if `enableShortKey` is true
   * @default 'f'
   */
  shortKey?: string;
}

const isAppleDevice = /(mac|iphone|ipod|ipad)/i.test(
  typeof navigator !== 'undefined' ? navigator?.platform : '',
);

const symbol = isAppleDevice ? '⌘' : 'Ctrl';

const SearchBar = memo<SearchBarProps>(
  ({ className, value, onChange, placeholder, enableShortKey, shortKey = 'f', ...props }) => {
    const [showTag, setShowTag] = useState<boolean>(true);
    const [inputValue, setInputValue] = useState<SearchBarProps['value']>(value);
    const { styles, cx } = useStyles();
    const inputRef: any = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (!enableShortKey) return;
      const handler = (ev: KeyboardEvent) => {
        if ((isAppleDevice ? ev.metaKey : ev.ctrlKey) && ev.key === shortKey) {
          ev.preventDefault();
          inputRef.current?.focus();
        }
      };

      document.addEventListener('keydown', handler);

      return () => document.removeEventListener('keydown', handler);
    }, []);

    return (
      <div className={styles.search}>
        <Input
          allowClear
          className={cx(styles.input, className)}
          onBlur={() => setShowTag(true)}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowTag(e.target.value ? false : true);
            if (onChange) onChange(e);
          }}
          onFocus={() => setShowTag(false)}
          placeholder={placeholder ?? 'Type keywords...'}
          prefix={
            <Icon className={styles.icon} icon={Search} size="small" style={{ marginRight: 4 }} />
          }
          ref={inputRef}
          value={value}
          {...props}
        />
        {enableShortKey && showTag && !inputValue && (
          <Tag className={styles.tag}>
            {symbol} {shortKey.toUpperCase()}
          </Tag>
        )}
      </div>
    );
  },
);

export default SearchBar;
