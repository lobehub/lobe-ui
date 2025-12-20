import type { AvatarProps as AntAvatarProps } from 'antd';
import type { CSSProperties, ReactNode, Ref } from 'react';
import type { FlexboxProps } from 'react-layout-kit';

import type { TooltipProps } from '@/Tooltip';

export interface AvatarProps extends AntAvatarProps {
  animation?: boolean;
  avatar?: string | ReactNode;
  background?: string;
  bordered?: boolean;
  borderedColor?: string;
  emojiScaleWithBackground?: boolean;
  loading?: boolean;
  ref?: Ref<HTMLDivElement>;
  shadow?: boolean;
  shape?: 'circle' | 'square';
  size?: number;
  sliceText?: boolean;
  title?: string;
  tooltipProps?: Omit<TooltipProps, 'children' | 'title'>;
  unoptimized?: boolean;
  variant?: 'borderless' | 'filled' | 'outlined';
}

export interface AvatarGroupItemType extends Pick<
  AvatarProps,
  'avatar' | 'title' | 'alt' | 'onClick' | 'style' | 'className' | 'loading'
> {
  key: string;
}

export interface AvatarGroupProps
  extends
    Pick<
      AvatarProps,
      | 'variant'
      | 'bordered'
      | 'shadow'
      | 'size'
      | 'background'
      | 'animation'
      | 'draggable'
      | 'shape'
    >,
    Omit<FlexboxProps, 'children' | 'onClick'> {
  classNames?: {
    avatar?: string;
    count?: string;
  };
  items: AvatarGroupItemType[];
  max?: number;
  onClick?: (props: { item: AvatarGroupItemType; key: string }) => void;
  ref?: Ref<HTMLDivElement>;
  styles?: {
    avatar?: CSSProperties;
    count?: CSSProperties;
  };
  zIndexReverse?: boolean;
}
