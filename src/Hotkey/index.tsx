'use client';

import {
  ArrowBigUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowRightToLineIcon,
  ArrowUpIcon,
  ChevronUpIcon,
  Command,
  CornerDownLeftIcon,
  Delete,
  Grid2X2Icon,
  MouseIcon,
  Option,
  SpaceIcon,
} from 'lucide-react';
import { type CSSProperties, memo, useEffect, useMemo, useState } from 'react';
import { Flexbox, type FlexboxProps } from 'react-layout-kit';

import Icon from '@/Icon';

import LeftClickIcon from './components/LeftClickIcon';
import RightClickIcon from './components/RightClickIcon';
import { useStyles } from './style';
import {
  ALT_KEY,
  BACKSPACE_KEY,
  CONTROL_KEY,
  DOWN_KEY,
  ENTER_KEY,
  LEFT_CLICK_KEY,
  LEFT_KEY,
  META_KEY,
  MID_CLICK_KEY,
  MOD_KEY,
  RIGHT_CLICK_KEY,
  RIGHT_KEY,
  SHIFT_KEY,
  SPACE_KEY,
  TAB_KEY,
  UP_KEY,
  checkIsAppleDevice,
  splitKeysByPlus,
  startCase,
} from './utils';

const mappingKey = (isAppleDevice: boolean) => ({
  [ALT_KEY]: isAppleDevice ? <Icon icon={Option} /> : 'Alt',
  [BACKSPACE_KEY]: isAppleDevice ? <Icon icon={Delete} /> : 'Backspace',
  [CONTROL_KEY]: isAppleDevice ? <Icon icon={ChevronUpIcon} /> : 'Ctrl',
  [DOWN_KEY]: <Icon icon={ArrowDownIcon} />,
  [ENTER_KEY]: isAppleDevice ? <Icon icon={CornerDownLeftIcon} /> : 'Enter',
  [LEFT_CLICK_KEY]: <Icon icon={LeftClickIcon} size={{ fontSize: '1.15em', strokeWidth: 1.75 }} />,
  [LEFT_KEY]: <Icon icon={ArrowLeftIcon} />,
  [META_KEY]: isAppleDevice ? <Icon icon={Command} /> : <Icon icon={Grid2X2Icon} />,
  [MID_CLICK_KEY]: <Icon icon={MouseIcon} size={{ fontSize: '1.15em', strokeWidth: 1.75 }} />,
  [MOD_KEY]: isAppleDevice ? <Icon icon={Command} /> : 'Ctrl',
  [RIGHT_CLICK_KEY]: (
    <Icon icon={RightClickIcon} size={{ fontSize: '1.15em', strokeWidth: 1.75 }} />
  ),
  [RIGHT_KEY]: <Icon icon={ArrowRightIcon} />,
  [SHIFT_KEY]: isAppleDevice ? (
    <Icon icon={ArrowBigUpIcon} size={{ fontSize: '1.15em', strokeWidth: 1.75 }} />
  ) : (
    'Shift'
  ),
  [SPACE_KEY]: <Icon icon={SpaceIcon} />,
  [TAB_KEY]: isAppleDevice ? <Icon icon={ArrowRightToLineIcon} /> : 'Tab',
  [UP_KEY]: <Icon icon={ArrowUpIcon} />,
});

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
      const newValue = splitKeysByPlus(keys);
      setKeysGroup(newValue);
    }, [keys]);

    const mapping: Record<string, any> = useMemo(() => mappingKey(isAppleDevice), [isAppleDevice]);

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
              <div key={index}>{mapping[key] ?? startCase(key)}</div>
            ))}
          </Flexbox>
        ) : (
          keysGroup.map((key, index) => (
            <kbd className={classNames?.descClassName} key={index} style={styles?.kbdStyle}>
              {mapping[key] ?? startCase(key)}
            </kbd>
          ))
        )}
      </Flexbox>
    );
  },
);

export default Hotkey;
