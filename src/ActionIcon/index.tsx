'use client';

import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { MouseEventHandler, forwardRef, useCallback, useMemo } from 'react';
import { Center, CenterProps } from 'react-layout-kit';

import Icon, {
  type IconProps,
  type IconSizeConfig,
  type IconSizeType,
  LucideIconProps,
} from '@/Icon';
import Tooltip, { type TooltipProps } from '@/Tooltip';

import { useStyles } from './style';
import { calcSize } from './utils';

interface ActionIconSizeConfig extends IconSizeConfig {
  blockSize?: number | string;
  borderRadius?: number | string;
}

export type ActionIconSize = number | IconSizeType | ActionIconSizeConfig;

export interface ActionIconProps
  extends Partial<LucideIconProps>,
    Omit<CenterProps, 'title' | 'children'> {
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  glass?: boolean;
  icon?: IconProps['icon'];
  loading?: boolean;
  shadow?: boolean;
  size?: ActionIconSize;
  spin?: boolean;
  title?: TooltipProps['title'];
  tooltipProps?: Omit<TooltipProps, 'title'>;
  variant?: 'borderless' | 'filled' | 'outlined';
}

const ActionIcon = forwardRef<HTMLDivElement, ActionIconProps>(
  (
    {
      color,
      fill,
      className,
      active,
      icon,
      size = 'middle',
      variant = 'borderless',
      style,
      glass,
      title,
      onClick,
      loading,
      fillOpacity,
      fillRule,
      focusable,
      shadow,
      disabled,
      spin: iconSpinning,
      tooltipProps,
      danger,
      ...rest
    },
    ref,
  ) => {
    const { styles, cx } = useStyles();
    const { blockSize, borderRadius } = useMemo(() => calcSize(size), [size]);
    const variants = useMemo(
      () =>
        cva(styles.root, {
          compoundVariants: [
            {
              className: styles.dangerFilled,
              danger: true,
              variant: 'filled',
            },
            {
              className: styles.dangerBorderless,
              danger: true,
              variant: 'borderless',
            },
            {
              className: styles.dangerOutlined,
              danger: true,
              variant: 'outlined',
            },
          ],
          defaultVariants: {
            active: false,
            danger: false,
            disabled: false,
            glass: false,
            shadow: false,
            variant: 'borderless',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: styles.filled,
              outlined: styles.outlined,
              borderless: styles.borderless,
            },
            glass: {
              false: null,
              true: styles.glass,
            },
            shadow: {
              false: null,
              true: styles.shadow,
            },
            active: {
              false: null,
              true: styles.active,
            },
            danger: {
              false: null,
              true: styles.dangerRoot,
            },
            disabled: {
              false: null,
              true: styles.disabled,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    const handleClick = useCallback<MouseEventHandler<HTMLDivElement>>(
      (event) => {
        if (loading || disabled) return;
        onClick?.(event);
      },
      [loading, disabled, onClick],
    );

    const node = (
      <Center
        className={cx(variants({ active, danger, disabled, glass, shadow, variant }), className)}
        flex={'none'}
        horizontal
        onClick={handleClick}
        ref={ref}
        role="button"
        style={{ borderRadius, height: blockSize, width: blockSize, ...style }}
        tabIndex={disabled ? -1 : 0}
        {...rest}
      >
        {icon && (
          <Icon
            color={color}
            fill={fill}
            fillOpacity={fillOpacity}
            fillRule={fillRule}
            focusable={focusable}
            icon={loading ? Loader2 : icon}
            size={size}
            spin={loading ? true : iconSpinning}
          />
        )}
      </Center>
    );

    if (!title) return node;

    return (
      <Tooltip
        title={title}
        {...tooltipProps}
        styles={{
          ...tooltipProps?.styles,
          root: { pointerEvents: 'none', ...tooltipProps?.styles?.root },
        }}
      >
        {node}
      </Tooltip>
    );
  },
);

ActionIcon.displayName = 'ActionIcon';

export default ActionIcon;
