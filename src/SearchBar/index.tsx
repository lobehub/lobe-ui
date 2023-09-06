import { Search } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';

import Icon from '@/Icon';
import { Input, type InputProps } from '@/Input';
import Spotlight from '@/Spotlight';
import Tag from '@/Tag';

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
  /**
   * @description Whether add spotlight background
   * @default false
   */
  spotlight?: boolean;
}

const SearchBar = memo<SearchBarProps>(
  ({
    spotlight,
    className,
    value,
    onChange,
    placeholder,
    enableShortKey,
    shortKey = 'f',
    ...properties
  }) => {
    const [symbol, setSymbol] = useState('Ctrl');
    const [showTag, setShowTag] = useState<boolean>(true);
    const [inputValue, setInputValue] = useState<SearchBarProps['value']>(value);
    const { styles, cx } = useStyles();
    const inputReference: any = useRef<HTMLInputElement>();

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
      <div className={cx(styles.search, className)}>
        {spotlight && <Spotlight />}
        <Input
          allowClear
          className={styles.input}
          onBlur={() => setShowTag(true)}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowTag(!e.target.value);

            if (onChange) onChange(e);
          }}
          onFocus={() => setShowTag(false)}
          placeholder={placeholder ?? 'Type keywords...'}
          prefix={
            <Icon className={styles.icon} icon={Search} size="small" style={{ marginRight: 4 }} />
          }
          ref={inputReference}
          value={value}
          {...properties}
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
