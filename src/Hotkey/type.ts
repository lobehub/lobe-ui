import type { CSSProperties } from 'react';
import type { FlexboxProps } from 'react-layout-kit';

export interface HotkeyProps extends Omit<FlexboxProps, 'children'> {
  classNames?: {
    kbdClassName?: string;
  };
  compact?: boolean;
  inverseTheme?: boolean;
  isApple?: boolean;
  keys: string;
  styles?: {
    kbdStyle?: CSSProperties;
  };
  variant?: 'filled' | 'outlined' | 'borderless';
}
