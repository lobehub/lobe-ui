import type { AlertProps as AntAlertProps } from 'antd';
import type { AlertRef } from 'antd/lib/alert/Alert';
import type { CSSProperties, ReactNode, Ref } from 'react';

import type { IconProps } from '@/Icon';

export interface AlertProps extends Omit<AntAlertProps, 'classNames' | 'icon' | 'styles' | 'type'> {
  classNames?: {
    alert?: string;
    container?: string;
    extraContent?: string;
  };
  colorfulText?: boolean;
  extra?: ReactNode;
  extraDefaultExpand?: boolean;
  extraIsolate?: boolean;
  glass?: boolean;
  icon?: IconProps['icon'];
  iconProps?: Omit<IconProps, 'icon'>;
  ref?: Ref<AlertRef>;
  styles?: {
    alert?: CSSProperties;
    container?: CSSProperties;
    extraContent?: CSSProperties;
  };
  text?: {
    detail?: string;
  };
  type?: 'success' | 'info' | 'warning' | 'error' | 'secondary';
  variant?: 'filled' | 'outlined' | 'borderless';
}
