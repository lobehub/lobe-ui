import type { LucideIcon, LucideProps } from 'lucide-react';
import type { FC, ReactNode, Ref } from 'react';

import type { SpanProps } from '@/types';

export interface IconSizeConfig extends Pick<LucideProps, 'strokeWidth' | 'absoluteStrokeWidth'> {
  size?: number | string;
}
export type IconSizeType = 'large' | 'middle' | 'small';
export type IconSize = number | IconSizeType | IconSizeConfig;

export type LucideIconProps = Pick<
  LucideProps,
  'fill' | 'fillRule' | 'fillOpacity' | 'color' | 'focusable'
>;

export interface IconProps extends Omit<SpanProps, 'children'>, LucideIconProps {
  icon: LucideIcon | FC<any> | ReactNode;
  ref?: Ref<SVGSVGElement>;
  size?: IconSize;
  spin?: boolean;
}
