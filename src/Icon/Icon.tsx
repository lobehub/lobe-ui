'use client';

import { cva } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';
import { isValidElement, memo, useMemo } from 'react';

import { useIconContext } from './components/IconProvider';
import { calcSize } from './components/utils';
import { useStyles } from './style';
import type { IconProps } from './type';

const Icon = memo<IconProps>(
  ({
    icon,
    size: iconSize,
    color,
    fill = 'transparent',
    className,
    focusable,
    spin,
    fillRule,
    fillOpacity,
    ref,
    ...rest
  }) => {
    const { styles, cx } = useStyles();

    const variants = useMemo(
      () =>
        cva('anticon', {
          defaultVariants: {
            spin: false,
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            spin: {
              false: null,
              true: styles.spin,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    const {
      color: colorConfig,
      fill: fillConfig,
      fillOpacity: fillOpacityConfig,
      fillRule: fillRuleConfig,
      focusable: focusableConfig,
      className: classNameConfig,
      size: sizeConfig,
      ...restConfig
    } = useIconContext();

    const { size, strokeWidth } = useMemo(
      () => calcSize(sizeConfig || iconSize),
      [sizeConfig, iconSize],
    );

    const SvgIcon = icon as LucideIcon;

    return (
      <span
        className={cx(variants({ spin }), classNameConfig, className)}
        role="img"
        {...restConfig}
        {...rest}
      >
        {icon &&
          (isValidElement(icon) ? (
            icon
          ) : (
            <SvgIcon
              color={colorConfig || color}
              fill={fillConfig || fill}
              fillOpacity={fillOpacityConfig || fillOpacity}
              fillRule={fillRuleConfig || fillRule}
              focusable={focusableConfig || focusable}
              height={size}
              ref={ref}
              size={size}
              strokeWidth={strokeWidth}
              width={size}
            />
          ))}
      </span>
    );
  },
);

Icon.displayName = 'Icon';

export default Icon;
