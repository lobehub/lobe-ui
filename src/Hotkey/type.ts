import type { FlexboxProps } from '@lobehub/ui/Flex';
import type { CSSProperties } from 'react';

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
