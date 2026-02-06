import type { ReactNode } from 'react';

import type { BlockProps } from '@/Block';
import type { FlexboxProps } from '@/Flex';
import type { IconProps } from '@/Icon';
import type { TextProps } from '@/Text';

export interface EmptyProps extends Omit<FlexboxProps, 'title'> {
  action?: ReactNode;
  actionProps?: Omit<FlexboxProps, 'children'>;
  description?: ReactNode;
  descriptionProps?: Omit<TextProps, 'children'>;
  emoji?: string;
  icon?: IconProps['icon'];
  iconColor?: IconProps['color'];
  image?: ReactNode;
  imageProps?: Omit<BlockProps, 'children'>;
  imageSize?: number;
  title?: ReactNode;
  titleProps?: Omit<TextProps, 'children'>;
  type?: 'default' | 'page';
}
