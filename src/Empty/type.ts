import type { ComponentProps, CSSProperties, ReactNode, Ref } from 'react';

import type { IconProps } from '@/Icon';
import type { A2uiActionConfig } from '@/internal/a2ui/A2uiButton';
import type { TextProps } from '@/Text';
import type { DistributiveOmit } from '@/types';

/** An action drawn as the variant's own button: the playground primary button in `a2ui`. */
export type EmptyActionConfig = A2uiActionConfig;

export interface EmptyProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Action under the text. Pass `{ label, onClick }` to get a primary button matching the variant. */
  action?: ReactNode | EmptyActionConfig;
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
  /**
   * `dashed` draws a dashed frame; `a2ui` is the A2UI playground empty state: a dashed 14px frame,
   * the icon in a round well (an inbox by default), a 14px / 600 title and a primary action.
   * @default 'default'
   */
  variant?: 'default' | 'dashed' | 'a2ui';
}
