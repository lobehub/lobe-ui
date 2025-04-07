'use client';

import { Select } from 'antd';
import { ThemeMode } from 'antd-style';
import { Monitor, Moon, Sun } from 'lucide-react';
import { memo, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import ActionIcon, { type ActionIconProps } from '@/ActionIcon';
import Dropdown from '@/Dropdown';
import Icon from '@/Icon';
import { ItemType } from '@/Menu';
import { DivProps } from '@/types';

const icons = {
  auto: Monitor,
  dark: Moon,
  light: Sun,
};

export interface ThemeSwitchProps extends DivProps {
  labels?: {
    auto: string;
    dark: string;
    light: string;
  };
  onThemeSwitch: (themeMode: ThemeMode) => void;
  size?: ActionIconProps['size'];
  themeMode: ThemeMode;
  type?: 'icon' | 'select';
  variant?: ActionIconProps['variant'];
}

const ThemeSwitch = memo<ThemeSwitchProps>(
  ({
    size,
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
    const items: ItemType[] = useMemo(
      () => [
        { icon: icons.auto, key: 'auto', label: labels.auto },
        { icon: icons.light, key: 'light', label: labels.light },
        { icon: icons.dark, key: 'dark', label: labels.dark },
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
          icon={icons[themeMode]}
          size={size}
          style={style}
          variant={variant}
        />
      </Dropdown>
    );
  },
);

ThemeSwitch.displayName = 'ThemeSwitch';

export default ThemeSwitch;
