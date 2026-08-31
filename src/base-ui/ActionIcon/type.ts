import type { CSSProperties, ReactNode, Ref } from 'react';

import type { TooltipProps } from '@/base-ui/Tooltip';
import type { CenterProps } from '@/Flex';
import type { IconProps, IconSizeConfig, IconSizeType, LucideIconProps } from '@/Icon';

interface ActionIconSizeConfig extends IconSizeConfig {
  blockSize?: number | string;
  borderRadius?: number | string;
}

export type ActionIconSize = number | IconSizeType | ActionIconSizeConfig;
export type ActionIconVariant = 'borderless' | 'filled' | 'outlined';
export type ActionIconOutdent = boolean | 'start' | 'end';

export interface ActionIconClassNames {
  icon?: string;
  root?: string;
}

export interface ActionIconStyles {
  icon?: CSSProperties;
  root?: CSSProperties;
}

interface BaseActionIconOwnProps
  extends Partial<LucideIconProps>, Omit<CenterProps, 'title' | 'children'> {
  active?: boolean;
  classNames?: ActionIconClassNames;
  danger?: boolean;
  disabled?: boolean;
  glass?: boolean;
  icon?: IconProps['icon'] | ReactNode;
  loading?: boolean;
  ref?: Ref<HTMLButtonElement>;
  shadow?: boolean;
  size?: ActionIconSize;
  spin?: boolean;
  styles?: ActionIconStyles;
  title?: TooltipProps['title'];
  tooltipProps?: Omit<TooltipProps, 'children' | 'title'>;
}

type BorderlessOutdentProps<V extends ActionIconVariant> = [V] extends ['borderless']
  ? {
      /**
       * Cancels this size's icon inset (half of block − glyph) with a negative
       * margin so a borderless ActionIcon lines up with adjacent copy. `true` /
       * `'start'` outdent the start edge; `'end'` outdents the end edge.
       */
      outdent?: ActionIconOutdent;
      variant?: V;
    }
  : { outdent?: never; variant?: V };

export type ActionIconProps<V extends ActionIconVariant = ActionIconVariant> =
  BaseActionIconOwnProps & BorderlessOutdentProps<V>;
