import { Icon } from '@/index';
import { Input, InputProps, Tag } from 'antd';
import { Search } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import { useStyles } from './style';

export interface SearchBarProps extends InputProps {
  shortKey?: string;
  enableShortKey?: boolean;
  type?: 'ghost' | 'block';
}

const isAppleDevice = /(mac|iphone|ipod|ipad)/i.test(
  typeof navigator !== 'undefined' ? navigator?.platform : '',
);

const symbol = isAppleDevice ? '⌘' : 'Ctrl';

const SearchBar = memo<SearchBarProps>(
  ({
    className,
    value,
    onChange,
    style,
    placeholder,
    type = 'ghost',
    enableShortKey,
    shortKey = 'f',
    ...props
  }) => {
    const [showTag, setShowTag] = useState<boolean>(true);
    const [inputValue, setInputValue] = useState<SearchBarProps['value']>(value);
    const { styles, cx } = useStyles({ type });
    const inputRef: any = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (!enableShortKey) return;
      const handler = (ev: KeyboardEvent) => {
        if ((isAppleDevice ? ev.metaKey : ev.ctrlKey) && ev.key === shortKey) {
          ev.preventDefault();
          inputRef.current.focus();
        }
      };

      document.addEventListener('keydown', handler);

      return () => document.removeEventListener('keydown', handler);
    }, []);

    return (
      <div className={cx(styles.search, className)}>
        <Input
          ref={inputRef}
          className={styles.input}
          prefix={
            <Icon
              className={styles.icon}
              icon={Search}
              size={{ fontSize: 14 }}
              style={{ marginRight: 4 }}
            />
          }
          allowClear
          value={value}
          placeholder={placeholder ?? 'Type keywords...'}
          style={{ ...style, borderColor: 'transparent' }}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowTag(e.target.value ? false : true);
            if (onChange) onChange(e);
          }}
          onFocus={() => setShowTag(false)}
          onBlur={() => setShowTag(true)}
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
