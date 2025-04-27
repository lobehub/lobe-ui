import type { SelectProps as AntdSelectProps, RefSelectProps } from 'antd';
import type { Ref } from 'react';

import type { IconProps } from '@/Icon';

export interface SelectProps extends Omit<AntdSelectProps, 'suffixIcon'> {
  ref?: Ref<RefSelectProps>;
  shadow?: boolean;
  suffixIcon?: IconProps['icon'];
  suffixIconProps?: Omit<IconProps, 'icon'>;
}
