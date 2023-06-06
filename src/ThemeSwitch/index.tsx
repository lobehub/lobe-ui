import { ActionIcon, type ActionIconSize, Icon } from '@lobehub/ui';
import { Dropdown, type MenuProps } from 'antd';
import { ThemeMode } from 'antd-style';
import { Monitor, Moon, Sun } from 'lucide-react';
import { memo } from 'react';

import { DivProps } from '@/types';

const icons = {
  auto: Monitor,
  light: Sun,
  dark: Moon,
};

const items: MenuProps['items'] = [
  { label: 'System', icon: <Icon icon={icons.auto} size="small" />, key: 'auto' },
  { label: 'Light', icon: <Icon icon={icons.light} size="small" />, key: 'light' },
  { label: 'Dark', icon: <Icon icon={icons.dark} size="small" />, key: 'dark' },
];

export interface ThemeSwitchProps extends DivProps {
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
}

const ThemeSwitch = memo<ThemeSwitchProps>(
  ({ size = 'site', themeMode, onThemeSwitch, ...props }) => {
    const menuProps: MenuProps = {
      items,
      onClick: (e: any) => onThemeSwitch(e.key),
    };

    return (
      <Dropdown menu={menuProps} trigger={['click']} {...props}>
        <ActionIcon icon={icons[themeMode]} size={size} />
      </Dropdown>
    );
  },
);

export default ThemeSwitch;
