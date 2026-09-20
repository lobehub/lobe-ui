import type { ComponentProps, CSSProperties, ReactNode, Ref } from 'react';

import type { IconProps } from '@/Icon';
import type { TextProps } from '@/Text';

export interface EmptyProps extends Omit<ComponentProps<'div'>, 'title'> {
  action?: ReactNode;
  actionProps?: Omit<ComponentProps<'div'>, 'children'>;
  align?: CSSProperties['alignItems'];
  description?: ReactNode;
  descriptionProps?: Omit<TextProps, 'children'>;
  emoji?: string;
  icon?: IconProps['icon'];
  iconColor?: IconProps['color'];
  image?: ReactNode;
  imageProps?: Omit<ComponentProps<'div'>, 'children'>;
  imageSize?: number;
  ref?: Ref<HTMLDivElement>;
  title?: ReactNode;
  titleProps?: Omit<TextProps, 'children'>;
  type?: 'default' | 'page';
  variant?: 'default' | 'dashed';
}
