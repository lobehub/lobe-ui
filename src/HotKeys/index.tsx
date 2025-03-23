'use client';

import { isString } from 'lodash-es';
import { Command, Delete, Option } from 'lucide-react';
import { type CSSProperties, memo, useEffect, useState } from 'react';
import { Flexbox, type FlexboxProps } from 'react-layout-kit';

import Icon from '@/Icon';

import { ALT_KEY, BACKSPACE_KEY, META_KEY, useStyles } from './style';
import { splitKeysByPlus, startCase } from './utils';

export interface HotKeysProps extends Omit<FlexboxProps, 'children'> {
  classNames?: {
    descClassName?: string;
    kbdClassName?: string;
  };
  compact?: boolean;
  desc?: string;
  inverseTheme?: boolean;
  isApple?: boolean;
  keys: string;
  styles?: {
    descStyle?: CSSProperties;
    kbdStyle?: CSSProperties;
  };
}

const HotKeys = memo<HotKeysProps>(
  ({
    classNames,
    styles,
    keys,
    desc,
    inverseTheme,
    isApple,
    compact,
    className,
    style,
    ...rest
  }) => {
    const { cx, styles: s } = useStyles(inverseTheme);
    const [keysGroup, setKeysGroup] = useState(splitKeysByPlus(keys));
    const visibility = typeof window === 'undefined' ? 'hidden' : 'visible';

    useEffect(() => {
      const isAppleDevice =
        isApple === undefined
          ? /(mac|iphone|ipod|ipad)/i.test(
              typeof navigator === 'undefined' ? '' : navigator?.platform,
            )
          : isApple;
      const mapping: Record<string, any> = {
        [ALT_KEY]: isAppleDevice ? <Icon icon={Option} /> : 'alt',
        [BACKSPACE_KEY]: isAppleDevice ? <Icon icon={Delete} /> : 'backspace',
        [META_KEY]: isAppleDevice ? <Icon icon={Command} /> : 'ctrl',
      };
      const newValue = splitKeysByPlus(keys).map((k) => mapping[k] ?? k);
      setKeysGroup(newValue);
    }, [keys, isApple]);

    return (
      <Flexbox
        align={'center'}
        className={cx(s, className)}
        gap={2}
        horizontal
        style={{ visibility, ...style }}
        {...rest}
      >
        {desc && (
          <span
            className={classNames?.descClassName}
            style={{
              marginRight: 10,
              ...styles?.descStyle,
            }}
          >
            {desc}
          </span>
        )}
        {compact ? (
          <Flexbox
            align={'center'}
            as={'kbd'}
            className={classNames?.descClassName}
            gap={4}
            horizontal
            style={styles?.kbdStyle}
          >
            {keysGroup.map((key, index) => (
              <div key={index}>{isString(key) ? startCase(key) : key}</div>
            ))}
          </Flexbox>
        ) : (
          keysGroup.map((key, index) => (
            <kbd className={classNames?.descClassName} key={index} style={styles?.kbdStyle}>
              {isString(key) ? startCase(key) : key}
            </kbd>
          ))
        )}
      </Flexbox>
    );
  },
);

export default HotKeys;
