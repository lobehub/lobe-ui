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
import { KeyMap } from './type';
import { checkIsAppleDevice, splitKeysByPlus, startCase } from './utils';

const mappingKey = (isAppleDevice: boolean) => ({
  [KeyMap.Alt]: isAppleDevice ? <Icon icon={Option} /> : 'Alt',
  [KeyMap.Backspace]: isAppleDevice ? <Icon icon={Delete} /> : 'Backspace',
  [KeyMap.Ctrl]: isAppleDevice ? <Icon icon={ChevronUpIcon} /> : 'Ctrl',
  [KeyMap.Down]: <Icon icon={ArrowDownIcon} />,
  [KeyMap.Enter]: isAppleDevice ? <Icon icon={CornerDownLeftIcon} /> : 'Enter',
  [KeyMap.LeftClick]: (
    <Icon icon={LeftClickIcon} size={{ fontSize: '1.15em', strokeWidth: 1.75 }} />
  ),
  [KeyMap.Left]: <Icon icon={ArrowLeftIcon} />,
  [KeyMap.Meta]: isAppleDevice ? <Icon icon={Command} /> : <Icon icon={Grid2X2Icon} />,
  [KeyMap.MiddleClick]: <Icon icon={MouseIcon} size={{ fontSize: '1.15em', strokeWidth: 1.75 }} />,
  [KeyMap.Mod]: isAppleDevice ? <Icon icon={Command} /> : 'Ctrl',
  [KeyMap.RightClick]: (
    <Icon icon={RightClickIcon} size={{ fontSize: '1.15em', strokeWidth: 1.75 }} />
  ),
  [KeyMap.Right]: <Icon icon={ArrowRightIcon} />,
  [KeyMap.Shift]: isAppleDevice ? (
    <Icon icon={ArrowBigUpIcon} size={{ fontSize: '1.15em', strokeWidth: 1.75 }} />
  ) : (
    'Shift'
  ),
  [KeyMap.Space]: <Icon icon={SpaceIcon} />,
  [KeyMap.Tab]: isAppleDevice ? <Icon icon={ArrowRightToLineIcon} /> : 'Tab',
  [KeyMap.Up]: <Icon icon={ArrowUpIcon} />,
});

export interface HotkeyProps extends Omit<FlexboxProps, 'children'> {
  classNames?: {
    descClassName?: string;
    kbdClassName?: string;
  };
  compact?: boolean;
  inverseTheme?: boolean;
  isApple?: boolean;
  keys: string;
  styles?: {
    descStyle?: CSSProperties;
    kbdStyle?: CSSProperties;
  };
}

const Hotkey = memo<HotkeyProps>(
  ({ classNames, styles, keys, inverseTheme, isApple, compact, className, style, ...rest }) => {
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
