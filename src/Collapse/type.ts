import type { CollapseProps as AntdCollapseProps } from 'antd';
import type { ItemType } from 'rc-collapse/es/interface';
import type { CSSProperties, ReactNode, Ref } from 'react';

import type { IconProps } from '@/Icon';

export interface CollapseItemType extends ItemType {
  desc?: ReactNode;
  icon?: IconProps['icon'];
}

export interface CollapseProps extends Omit<AntdCollapseProps, 'collapsible' | 'ghost' | 'items'> {
  classNames?: {
    desc?: string;
    header?: string;
    title?: string;
  };
  collapsible?: boolean;
  gap?: number;
  items: CollapseItemType[];
  padding?:
    | number
    | string
    | {
        body?: number | string;
        header?: number | string;
      };
  ref?: Ref<HTMLDivElement>;
  styles?: {
    desc?: CSSProperties;
    header?: CSSProperties;
    title?: CSSProperties;
  };
  variant?: 'filled' | 'outlined' | 'borderless';
}
