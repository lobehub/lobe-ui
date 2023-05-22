import { Dropdown, type MenuProps } from 'antd';
import { ThemeMode } from 'antd-style';
import { Monitor, Moon, Sun } from 'lucide-react';
import { memo } from 'react';

import { ActionIcon, Icon, type ActionIconSize } from '@lobehub/ui';

const icons = {
  auto: Monitor,
  light: Sun,
  dark: Moon,
};

const items: MenuProps['items'] = [
  { label: 'System', icon: <Icon size="small" icon={icons.auto} />, key: 'auto' },
  { label: 'Light', icon: <Icon size="small" icon={icons.light} />, key: 'light' },
  { label: 'Dark', icon: <Icon size="small" icon={icons.dark} />, key: 'dark' },
];

export interface ThemeSwitchProps extends DivProps {
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
  /**
   * @description Callback function when the theme mode is switched
   * @type {(themeMode: ThemeMode) => void}
   */
  onThemeSwitch: (themeMode: ThemeMode) => void;
}

const ThemeSwitch = memo<ThemeSwitchProps>(
  ({ size = 'site', themeMode, onThemeSwitch, ...props }) => {
    const menuProps: MenuProps = {
      items,
      onClick: (e: any) => onThemeSwitch(e.key),
    };
    return (
      <Dropdown menu={menuProps} trigger={['click']} {...props}>
        <ActionIcon size={size} icon={icons[themeMode]} />
      </Dropdown>
    );
  },
);

export default ThemeSwitch;
