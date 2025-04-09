import type { CollapseProps as AntdCollapseProps } from 'antd';
import type { Ref } from 'react';

export interface CollapseProps extends Omit<AntdCollapseProps, 'collapsible' | 'ghost'> {
  collapsible?: boolean;
  gap?: number;
  padding?:
    | number
    | string
    | {
        body?: number | string;
        header?: number | string;
      };
  ref?: Ref<HTMLDivElement>;
  variant?: 'filled' | 'outlined' | 'borderless';
}
