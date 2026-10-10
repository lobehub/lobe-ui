import type { ComponentProps, CSSProperties, ReactNode, Ref } from 'react';

import type { TextProps } from '@/base-ui/Text';
import type { IconProps } from '@/Icon';
import type { DistributiveOmit } from '@/types';

export interface EmptyProps extends Omit<ComponentProps<'div'>, 'title'> {
  action?: ReactNode;
  actionProps?: Omit<ComponentProps<'div'>, 'children'>;
  align?: CSSProperties['alignItems'];
  description?: ReactNode;
  descriptionProps?: DistributiveOmit<TextProps, 'children'>;
  emoji?: string;
  icon?: IconProps['icon'];
  iconColor?: IconProps['color'];
  image?: ReactNode;
  imageProps?: Omit<ComponentProps<'div'>, 'children'>;
  imageSize?: number;
  ref?: Ref<HTMLDivElement>;
  title?: ReactNode;
  titleProps?: DistributiveOmit<TextProps, 'children'>;
  type?: 'default' | 'page';
  variant?: 'default' | 'dashed';
}
