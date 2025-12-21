import type { ReactNode, Ref } from 'react';

import type { CenterProps } from '@/Flex';
import type { IconProps, IconSizeConfig, IconSizeType, LucideIconProps } from '@/Icon';
import type { TooltipProps } from '@/Tooltip';

interface ActionIconSizeConfig extends IconSizeConfig {
  blockSize?: number | string;
  borderRadius?: number | string;
}

export type ActionIconSize = number | IconSizeType | ActionIconSizeConfig;

export interface ActionIconProps
  extends Partial<LucideIconProps>, Omit<CenterProps, 'title' | 'children'> {
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  glass?: boolean;
  icon?: IconProps['icon'] | ReactNode;
  loading?: boolean;
  ref?: Ref<HTMLDivElement>;
  shadow?: boolean;
  size?: ActionIconSize;
  spin?: boolean;
  title?: TooltipProps['title'];
  tooltipProps?: Omit<TooltipProps, 'children' | 'title'>;
  variant?: 'borderless' | 'filled' | 'outlined';
}
