import type { ThemeMode } from 'antd-style';

import type { ActionIconProps } from '@/ActionIcon';
import type { DivProps } from '@/types';

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
