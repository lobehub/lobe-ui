import type { AlertProps as AntAlertProps } from 'antd';
import type { AlertRef } from 'antd/lib/alert/Alert';
import type { ReactNode, Ref } from 'react';

import type { IconProps } from '@/Icon';

export interface AlertProps extends Omit<AntAlertProps, 'icon'> {
  classNames?: {
    alert?: string;
    container?: string;
  };
  colorfulText?: boolean;
  extra?: ReactNode;
  extraDefaultExpand?: boolean;
  extraIsolate?: boolean;
  glass?: boolean;
  icon?: IconProps['icon'];
  iconProps?: Omit<IconProps, 'icon'>;
  ref?: Ref<AlertRef>;
  text?: {
    detail?: string;
  };
  variant?: 'filled' | 'outlined' | 'borderless';
}
