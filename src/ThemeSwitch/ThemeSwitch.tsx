'use client';

import { Select } from 'antd';
import { Monitor, Moon, Sun } from 'lucide-react';
import { type FC, useMemo } from 'react';

import ActionIcon from '@/ActionIcon';
import DropdownMenu from '@/DropdownMenu';
import type { DropdownItem } from '@/DropdownMenu';
import { Flexbox } from '@/Flex';
import Icon from '@/Icon';

import type { ThemeSwitchProps } from './type';

const DEFAULT_ICON_SET = {
  auto: Monitor,
  dark: Moon,
  light: Sun,
};

const ThemeSwitch: FC<ThemeSwitchProps> = ({
  size = 'middle',
  themeMode,
  onThemeSwitch,
  type = 'icon',
  labels = {
    auto: 'System',
    dark: 'Dark',
    light: 'Light',
  },
  className,
  variant,
  style,
}) => {
  const items: DropdownItem[] = useMemo(
    () => [
      {
        icon: DEFAULT_ICON_SET.auto,
        key: 'auto',
        label: labels.auto,
        onClick: () => onThemeSwitch('auto'),
      },
      {
        icon: DEFAULT_ICON_SET.light,
        key: 'light',
        label: labels.light,
        onClick: () => onThemeSwitch('light'),
      },
      {
        icon: DEFAULT_ICON_SET.dark,
        key: 'dark',
        label: labels.dark,
        onClick: () => onThemeSwitch('dark'),
      },
    ],
    [labels, onThemeSwitch],
  );

  return type === 'select' ? (
    <Select
      className={className}
      defaultValue={themeMode}
      onChange={onThemeSwitch}
      options={items.map((item: any) => ({
        label: (
          <Flexbox align={'center'} gap={8} horizontal>
            <Icon icon={item.icon} />
            {item.label}
          </Flexbox>
        ),
        value: item.key,
      }))}
      style={style}
      variant={variant}
    />
  ) : (
    <DropdownMenu items={items}>
      <ActionIcon
        className={className}
        icon={DEFAULT_ICON_SET[themeMode]}
        size={size}
        style={style}
        variant={variant}
      />
    </DropdownMenu>
  );
};

ThemeSwitch.displayName = 'ThemeSwitch';

export default ThemeSwitch;
