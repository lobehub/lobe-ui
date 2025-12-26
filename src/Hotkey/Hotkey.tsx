'use client';

import { cx, useTheme } from 'antd-style';
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
import { memo, useEffect, useMemo, useState } from 'react';

import { Center, Flexbox } from '@/Flex';
import Icon from '@/Icon';
import LeftClickIcon from '@/icons/lucideExtra/LeftClickIcon';
import LeftDoubleClickIcon from '@/icons/lucideExtra/LeftDoubleClickIcon';
import RightClickIcon from '@/icons/lucideExtra/RightClickIcon';
import RightDoubleClickIcon from '@/icons/lucideExtra/RightDoubleClickIcon';

import { KeyMapEnum } from './const';
import { createVariants } from './style';
import type { HotkeyProps } from './type';
import { checkIsAppleDevice, splitKeysByPlus, startCase } from './utils';

const mappingKey = (isAppleDevice: boolean) => ({
  [KeyMapEnum.Alt]: isAppleDevice ? <Icon icon={Option} size={{ size: '0.95em' }} /> : 'Alt',
  [KeyMapEnum.Backspace]: isAppleDevice ? <Icon icon={Delete} /> : 'Backspace',
  [KeyMapEnum.Ctrl]: isAppleDevice ? <Icon icon={ChevronUpIcon} /> : 'Ctrl',
  [KeyMapEnum.Down]: <Icon icon={ArrowDownIcon} />,
  [KeyMapEnum.Enter]: isAppleDevice ? <Icon icon={CornerDownLeftIcon} /> : 'Enter',
  [KeyMapEnum.LeftClick]: <Icon icon={LeftClickIcon} size={{ size: '1.2em', strokeWidth: 1.75 }} />,
  [KeyMapEnum.Left]: <Icon icon={ArrowLeftIcon} />,
  [KeyMapEnum.Meta]: isAppleDevice ? (
    <Icon icon={Command} size={{ size: '0.95em' }} />
  ) : (
    <Icon icon={Grid2X2Icon} />
  ),
  [KeyMapEnum.MiddleClick]: <Icon icon={MouseIcon} size={{ size: '1.2em', strokeWidth: 1.75 }} />,
  [KeyMapEnum.Mod]: isAppleDevice ? <Icon icon={Command} size={{ size: '0.95em' }} /> : 'Ctrl',
  [KeyMapEnum.RightClick]: (
    <Icon icon={RightClickIcon} size={{ size: '1.2em', strokeWidth: 1.75 }} />
  ),
  [KeyMapEnum.RightDoubleClick]: (
    <Icon icon={RightDoubleClickIcon} size={{ size: '1.2em', strokeWidth: 1.75 }} />
  ),
  [KeyMapEnum.LeftDoubleClick]: (
    <Icon icon={LeftDoubleClickIcon} size={{ size: '1.2em', strokeWidth: 1.75 }} />
  ),
  [KeyMapEnum.Right]: <Icon icon={ArrowRightIcon} />,
  [KeyMapEnum.Shift]: isAppleDevice ? (
    <Icon icon={ArrowBigUpIcon} size={{ size: '1.15em', strokeWidth: 1.75 }} />
  ) : (
    'Shift'
  ),
  [KeyMapEnum.Space]: <Icon icon={SpaceIcon} />,
  [KeyMapEnum.Tab]: isAppleDevice ? <Icon icon={ArrowRightToLineIcon} /> : 'Tab',
  [KeyMapEnum.Up]: <Icon icon={ArrowUpIcon} />,
  [KeyMapEnum.Comma]: ',',
  [KeyMapEnum.Period]: '.',
  [KeyMapEnum.Slash]: '?',
  [KeyMapEnum.Semicolon]: ';',
  [KeyMapEnum.Quote]: "'",
  [KeyMapEnum.Backquote]: '`',
  [KeyMapEnum.Backslash]: '\\',
  [KeyMapEnum.BracketLeft]: '[',
  [KeyMapEnum.BracketRight]: ']',
  [KeyMapEnum.Minus]: '-',
  [KeyMapEnum.Equal]: '+',
});

const Hotkey = memo<HotkeyProps>(
  ({
    variant = 'filled',
    classNames,
    styles: customStyles,
    keys,
    inverseTheme,
    isApple,
    compact,
    className,
    style,
    ...rest
  }) => {
    const theme = useTheme();
    const isBorderless = variant === 'borderless';
    const [keysGroup, setKeysGroup] = useState(splitKeysByPlus(keys));
    const isAppleDevice = useMemo(() => checkIsAppleDevice(isApple), [isApple]);

    const variants = useMemo(() => createVariants(theme.isDarkMode), [theme.isDarkMode]);

    useEffect(() => {
      const newValue = splitKeysByPlus(keys);
      setKeysGroup(newValue);
    }, [keys]);

    const mapping: Record<string, any> = useMemo(() => mappingKey(isAppleDevice), [isAppleDevice]);

    return (
      <Flexbox
        align={'center'}
        className={className}
        gap={isBorderless ? 6 : 2}
        horizontal
        style={style}
        {...rest}
      >
        {compact || isBorderless ? (
          <Center
            as={'kbd'}
            className={cx(variants({ inverseTheme, variant }), classNames?.kbdClassName)}
            gap={6}
            horizontal
            style={customStyles?.kbdStyle}
          >
            {keysGroup.map((key, index) => (
              <div key={index}>{mapping[key] ?? startCase(key)}</div>
            ))}
          </Center>
        ) : (
          keysGroup.map((key, index) => (
            <Center
              as={'kbd'}
              className={cx(variants({ inverseTheme, variant }), classNames?.kbdClassName)}
              key={index}
              style={customStyles?.kbdStyle}
            >
              {mapping[key] ?? startCase(key)}
            </Center>
          ))
        )}
      </Flexbox>
    );
  },
);

Hotkey.displayName = 'Hotkey';

export default Hotkey;
