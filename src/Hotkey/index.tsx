'use client';

import { isString } from 'lodash-es';
import { ChevronUpIcon, Command, Delete, Option } from 'lucide-react';
import { type CSSProperties, memo, useEffect, useMemo, useState } from 'react';
import { Flexbox, type FlexboxProps } from 'react-layout-kit';

import Icon from '@/Icon';

import { useStyles } from './style';
import {
  ALT_KEY,
  BACKSPACE_KEY,
  CONTROL_KEY,
  META_KEY,
  MOD_KEY,
  checkIsAppleDevice,
  splitKeysByPlus,
  startCase,
} from './utils';

export interface HotkeyProps extends Omit<FlexboxProps, 'children'> {
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

const Hotkey = memo<HotkeyProps>(
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
    const isAppleDevice = useMemo(() => checkIsAppleDevice(isApple), [isApple]);

    useEffect(() => {
      const mapping: Record<string, any> = {
        [ALT_KEY]: isAppleDevice ? <Icon icon={Option} /> : 'alt',
        [BACKSPACE_KEY]: isAppleDevice ? <Icon icon={Delete} /> : 'backspace',
        [CONTROL_KEY]: isAppleDevice ? <Icon icon={ChevronUpIcon} /> : 'ctrl',
        [META_KEY]: isAppleDevice ? <Icon icon={Command} /> : 'win',
        [MOD_KEY]: isAppleDevice ? <Icon icon={Command} /> : 'ctrl',
      };
      const newValue = splitKeysByPlus(keys).map((k) => mapping[k] ?? k);
      setKeysGroup(newValue);
    }, [keys, isAppleDevice]);

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

export default Hotkey;
