import type { ButtonProps as AntdButtonProps } from 'antd';
import type { Ref } from 'react';

import type { IconProps } from '@/Icon';

export interface ButtonProps extends Omit<AntdButtonProps, 'icon'> {
  glass?: boolean;
  icon?: IconProps['icon'];
  iconProps?: Partial<Omit<IconProps, 'icon'>>;
  ref?: Ref<HTMLButtonElement | HTMLAnchorElement>;
  shadow?: boolean;
}
