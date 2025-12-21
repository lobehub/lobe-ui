import { FlexboxProps } from '@lobehub/ui/Flex';
import { ReactNode } from 'react';

import { BlockProps } from '@/Block';
import { IconProps } from '@/Icon';
import { TextProps } from '@/Text';

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
