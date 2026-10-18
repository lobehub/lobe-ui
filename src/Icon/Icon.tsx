'use client';

import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';
import { isValidElement, memo, useMemo } from 'react';

import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { useIconContext } from './components/IconProvider';
import { calcSize } from './components/utils';
import { iconClasses } from './stable';
import { styles } from './style';
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
      () => calcSize(iconSize || sizeConfig),
      [iconSize, sizeConfig],
    );

    const SvgIcon = icon as LucideIcon;

    return (
      <span
        role="img"
        {...toDataAttributes({ spin })}
        className={
          styleProps(
            [styles.root, spin && styles.spin],
            clsx(iconClasses(), 'anticon', classNameConfig, className),
          ).className
        }
        {...restConfig}
        {...rest}
      >
        {icon &&
          (isValidElement(icon) ? (
            icon
          ) : (
            <SvgIcon
              color={color || colorConfig}
              fill={fill || fillConfig}
              fillOpacity={fillOpacity || fillOpacityConfig}
              fillRule={fillRule || fillRuleConfig}
              focusable={focusable || focusableConfig}
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
