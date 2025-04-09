import type { TagProps as AntTagProps } from 'antd';
import type { Ref } from 'react';

export interface TagProps extends AntTagProps {
  ref?: Ref<HTMLDivElement>;
  size?: 'small' | 'middle' | 'large';
  variant?: 'filled' | 'outlined' | 'borderless';
}
