import type { SegmentedProps as AntdSegmentedProps } from 'antd';
import type { Ref } from 'react';

import type { IconProps } from '@/Icon';

export interface SegmentedProps extends AntdSegmentedProps {
  glass?: boolean;
  iconProps?: Omit<IconProps, 'icon'>;
  padding?: string | number;
  ref?: Ref<HTMLDivElement>;
  shadow?: boolean;
  variant?: 'filled' | 'outlined' | 'borderless';
}
