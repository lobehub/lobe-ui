import type { CSSProperties, ReactNode, Ref } from 'react';

import type { TooltipProps } from '@/base-ui/Tooltip';
import type { CenterProps } from '@/Flex';
import type { IconProps, IconSizeConfig, IconSizeType, LucideIconProps } from '@/Icon';

interface ActionIconSizeConfig extends IconSizeConfig {
  blockSize?: number | string;
  borderRadius?: number | string;
}

export type ActionIconSize = number | IconSizeType | ActionIconSizeConfig;

export interface ActionIconClassNames {
  icon?: string;
  root?: string;
}

export interface ActionIconStyles {
  icon?: CSSProperties;
  root?: CSSProperties;
}

export interface ActionIconProps
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
  variant?: 'borderless' | 'filled' | 'outlined';
}
