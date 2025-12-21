'use client';

import { Select } from 'antd';
import { ThemeMode } from 'antd-style';
import { Monitor, Moon, Sun } from 'lucide-react';
import { type FC, useMemo } from 'react';

import ActionIcon from '@/ActionIcon';
import Dropdown from '@/Dropdown';
import { Flexbox } from '@/Flex';
import Icon from '@/Icon';
import type { MenuItemType } from '@/Menu';

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
  const items: MenuItemType[] = useMemo(
    () => [
      { icon: DEFAULT_ICON_SET.auto, key: 'auto', label: labels.auto },
      { icon: DEFAULT_ICON_SET.light, key: 'light', label: labels.light },
      { icon: DEFAULT_ICON_SET.dark, key: 'dark', label: labels.dark },
    ],
    [labels],
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
    <Dropdown
      menu={{
        items,
        onClick: (e) => onThemeSwitch(e.key as ThemeMode),
      }}
      trigger={['click']}
    >
      <ActionIcon
        className={className}
        icon={DEFAULT_ICON_SET[themeMode]}
        size={size}
        style={style}
        variant={variant}
      />
    </Dropdown>
  );
};

ThemeSwitch.displayName = 'ThemeSwitch';

export default ThemeSwitch;
