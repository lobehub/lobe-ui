import type { SelectProps } from 'antd';
import type { CSSProperties, ReactNode, Ref } from 'react';
import type { FlexboxProps } from 'react-layout-kit';

import type { IconProps } from '@/Icon';

export interface ImageSelectItem {
  alt?: string;
  icon?: IconProps['icon'];
  img: string;
  label: ReactNode;
  value: string;
}

export interface ImageSelectProps extends FlexboxProps {
  className?: string;
  classNames?: {
    img?: string;
  };
  defaultValue?: SelectProps['defaultValue'];
  height?: number;
  onChange?: (value: this['value']) => void;
  options?: ImageSelectItem[];
  ref?: Ref<HTMLDivElement>;
  style?: CSSProperties;
  styles?: {
    img?: CSSProperties;
  };
  unoptimized?: boolean;
  value?: SelectProps['value'];
  width?: number;
}
