import type { FlexboxProps } from '@lobehub/ui/Flex';
import type { ImageProps } from 'antd';
import type { CSSProperties, ReactNode, Ref } from 'react';

import type { ActionIconProps } from '@/ActionIcon';
import type { ImgProps } from '@/types';

export interface GuideCardProps extends Omit<FlexboxProps, 'title'> {
  afterClose?: () => void;
  alt?: string;
  classNames?: {
    content?: string;
    cover?: string;
  };
  closable?: boolean;
  closeIconProps?: Omit<ActionIconProps, 'icon' | 'onClick'>;
  cover?: string;
  coverProps?: ImgProps & ImageProps & { priority?: boolean };
  desc?: ReactNode;
  height?: number;
  onClose?: ActionIconProps['onClick'];
  ref?: Ref<HTMLDivElement>;
  shadow?: boolean;
  styles?: {
    content?: CSSProperties;
    cover?: CSSProperties;
  };
  title?: ReactNode;
  variant?: 'filled' | 'outlined' | 'borderless';
  width?: number;
}
