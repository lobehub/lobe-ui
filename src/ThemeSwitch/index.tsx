import { ActionIcon, type ActionIconSize, Icon } from '@lobehub/ui';
import { Dropdown, type MenuProps, Select } from 'antd';
import { ThemeMode } from 'antd-style';
import { Monitor, Moon, Sun } from 'lucide-react';
import { memo, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

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
  /**
   * @description Callback function when the theme mode is switched
   * @type {(themeMode: ThemeMode) => void}
   */
  onThemeSwitch: (themeMode: ThemeMode) => void;
  /**
   * @description Size of the action icon
   * @default {
   *   blockSize: 34,
   *   fontSize: 20,
   *   strokeWidth: 1.5,
   * }
   */
  size?: ActionIconSize;
  /**
   * @description The theme mode of the component
   * @type ThemeMode
   */
  themeMode: ThemeMode;
  type?: 'icon' | 'select';
}

const ThemeSwitch = memo<ThemeSwitchProps>(
  ({
    size = 'site',
    themeMode,
    onThemeSwitch,
    type = 'icon',
    labels = {
      auto: 'System',
      dark: 'Dark',
      light: 'Light',
    },
    className,
    style,
  }) => {
    const items: MenuProps['items'] = useMemo(
      () => [
        { icon: <Icon icon={icons.auto} size="small" />, key: 'auto', label: labels.auto },
        { icon: <Icon icon={icons.light} size="small" />, key: 'light', label: labels.light },
        { icon: <Icon icon={icons.dark} size="small" />, key: 'dark', label: labels.dark },
      ],
      [labels],
    );

    if (type === 'select') {
      return (
        <Select
          className={className}
          defaultValue={themeMode}
          onChange={onThemeSwitch}
          options={items.map((item: any) => ({
            label: (
              <Flexbox direction={'horizontal'} gap={8}>
                {item.icon}
                {item.label}
              </Flexbox>
            ),
            value: item.key,
          }))}
          style={style}
        />
      );
    } else {
      const menuProps: MenuProps = {
        items,
        onClick: (e: any) => onThemeSwitch(e.key),
      };
      return (
        <Dropdown menu={menuProps} trigger={['click']}>
          <ActionIcon className={className} icon={icons[themeMode]} size={size} style={style} />
        </Dropdown>
      );
    }
  },
);

export default ThemeSwitch;
