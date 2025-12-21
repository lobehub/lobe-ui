import type { CSSProperties } from 'react';

import type { FlexboxProps } from '@/Flex';

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
