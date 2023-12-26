import { LucideIcon, LucideProps } from 'lucide-react';
import { forwardRef, useMemo } from 'react';

import { calcSize } from '@/Icon/calcSize';
import { DivProps } from '@/types';

import { useStyles } from './style';

export interface IconSizeConfig extends Pick<LucideProps, 'strokeWidth' | 'absoluteStrokeWidth'> {
  fontSize?: number | string;
}
export type IconSizeType = 'large' | 'normal' | 'small';
export type IconSize = IconSizeType | IconSizeConfig;

export type LucideIconProps = Pick<
  LucideProps,
  'fill' | 'fillRule' | 'fillOpacity' | 'color' | 'focusable'
>;
export interface IconProps extends DivProps, LucideIconProps {
  /**
   * @description The icon element to be rendered
   * @type LucideIcon
   */
  icon: LucideIcon;
  /**
   * @description Size of the icon
   * @default 'normal'
   */
  size?: IconSize;
  /**
   * @description Rotate icon with animation
   * @default false
   */
  spin?: boolean;
}

const Icon = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      icon,
      size,
      color,
      fill = 'transparent',
      className,
      focusable,
      spin,
      fillRule,
      fillOpacity,
      ...rest
    },
    ref,
  ) => {
    const { styles, cx } = useStyles();
    const SvgIcon = icon;

    const { fontSize, ...restSize } = useMemo(() => calcSize(size), [size]);

    return (
      <span className={cx('anticon', spin && styles.spin, className)} role="img" {...rest}>
        <SvgIcon
          color={color}
          fill={fill}
          fillOpacity={fillOpacity}
          fillRule={fillRule}
          focusable={focusable}
          height={fontSize}
          ref={ref}
          size={fontSize}
          width={fontSize}
          {...restSize}
        />
      </span>
    );
  },
);

export default Icon;
