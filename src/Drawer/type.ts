import type { DrawerProps as AntdDrawerProps } from 'antd';
import type { CSSProperties, ReactNode, Ref } from 'react';

import type { ActionIconProps } from '@/ActionIcon';

export interface DrawerProps extends Omit<AntdDrawerProps, 'styles' | 'classNames'> {
  classNames?: AntdDrawerProps['classNames'] & {
    bodyContent?: string;
    extra?: string;
    sidebar?: string;
    sidebarContent?: string;
    title?: string;
  };
  closeIconProps?: ActionIconProps;
  containerMaxWidth?: number;
  noHeader?: boolean;
  ref?: Ref<HTMLDivElement>;
  sidebar?: ReactNode;
  sidebarWidth?: number;
  styles?: AntdDrawerProps['styles'] & {
    bodyContent?: CSSProperties;
    extra?: CSSProperties;
    sidebar?: CSSProperties;
    sidebarContent?: CSSProperties;
    title?: CSSProperties;
  };
}
