'use client';

import { LucideIcon, LucideProps } from 'lucide-react';
import { FC, ReactNode, forwardRef, useMemo } from 'react';

import { DivProps } from '@/types';

import { useStyles } from './style';
import { calcSize } from './utils';

export interface IconSizeConfig extends Pick<LucideProps, 'strokeWidth' | 'absoluteStrokeWidth'> {
  size?: number | string;
}
export type IconSizeType = 'large' | 'middle' | 'small';
export type IconSize = number | IconSizeType | IconSizeConfig;

export type LucideIconProps = Pick<
  LucideProps,
  'fill' | 'fillRule' | 'fillOpacity' | 'color' | 'focusable'
>;

export interface IconProps extends DivProps, LucideIconProps {
  children?: ReactNode;
  icon?: LucideIcon | FC<any>;
  size?: IconSize;
  spin?: boolean;
}

const Icon = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      icon,
      size: iconSize,
      color,
      fill = 'transparent',
      className,
      focusable,
      spin,
      fillRule,
      fillOpacity,
      children,
      ...rest
    },
    ref,
  ) => {
    const { styles, cx } = useStyles();
    const SvgIcon = icon;

    const { size, ...restSize } = useMemo(() => calcSize(iconSize), [iconSize]);

    return (
      <span className={cx('anticon', spin && styles.spin, className)} role="img" {...rest}>
        {SvgIcon && (
          <SvgIcon
            color={color}
            fill={fill}
            fillOpacity={fillOpacity}
            fillRule={fillRule}
            focusable={focusable}
            height={size}
            ref={ref}
            size={size}
            width={size}
            {...restSize}
          />
        )}
        {children}
      </span>
    );
  },
);

Icon.displayName = 'Icon';

export default Icon;
