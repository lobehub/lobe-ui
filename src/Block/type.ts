import type { Ref } from 'react';
import type { FlexboxProps } from 'react-layout-kit';

export interface BlockProps extends FlexboxProps {
  clickable?: boolean;
  glass?: boolean;
  ref?: Ref<HTMLDivElement>;
  shadow?: boolean;
  variant?: 'filled' | 'outlined' | 'borderless';
}
