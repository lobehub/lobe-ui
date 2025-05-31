import type { SliderSingleProps } from 'antd';
import type { CSSProperties } from 'react';
import type { FlexboxProps } from 'react-layout-kit';

import type { InputNumberProps } from '@/Input';

export interface SliderWithInputProps extends Omit<SliderSingleProps, 'classNames' | 'styles'> {
  changeOnWheel?: boolean;
  classNames?: {
    input?: string;
    slider?: string;
  } & SliderSingleProps['classNames'];
  controls?: InputNumberProps['controls'];
  gap?: FlexboxProps['gap'];
  size?: InputNumberProps['size'];
  styles?: {
    input?: CSSProperties;
    slider?: CSSProperties;
  } & SliderSingleProps['styles'];
  unlimitedInput?: boolean; // 不限制输入框最大值
  variant?: InputNumberProps['variant'];
}
