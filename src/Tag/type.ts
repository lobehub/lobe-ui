import type { TagProps as AntTagProps } from 'antd';
import type { Ref } from 'react';

export interface TagProps extends Omit<AntTagProps, 'color' | 'variant'> {
  color?: AntTagProps['color'] | 'info';
  ref?: Ref<HTMLDivElement>;
  shape?: 'normal' | 'round';
  size?: 'small' | 'middle' | 'large';
  variant?: 'filled' | 'outlined' | 'borderless' | 'solid';
}
