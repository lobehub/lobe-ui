'use client';

import clsx from 'clsx';
import type { MouseEvent, ReactElement, Ref } from 'react';
import { memo, useMemo } from 'react';

import type { ButtonProps } from '@/Button';
import { ButtonImpl } from '@/Button/Button';
import Icon from '@/Icon';
import type { styleProps } from '@/styles/stylex/props';
import Tooltip from '@/Tooltip';
import { toDataAttributes } from '@/utils/bem';

import { actionIconClasses } from './stable';
import { styles } from './style';
import type { ActionIconOutdent, ActionIconProps, ActionIconVariant } from './type';
import { calcOutdent, calcSize } from './utils';

const resolveButtonType = (variant: ActionIconProps['variant']) => {
  if (variant === 'filled') return 'fill' as const;
  if (variant === 'outlined') return 'default' as const;
  return 'text' as const;
};

const activeStyles = {
  borderless: styles.active,
  filled: styles.activeFill,
  outlined: styles.activeOutlined,
};

const presetSizeStyles = {
  large: styles.sizeLarge,
  middle: styles.sizeMiddle,
  small: styles.sizeSmall,
};

const isPresetSize = (size: ActionIconProps['size']): size is keyof typeof presetSizeStyles =>
  typeof size === 'string' && size in presetSizeStyles;

const resolveButtonSize = (size: ActionIconProps['size']) => {
  if (size === 'small') return 'small' as const;
  if (size === 'large') return 'large' as const;
  return 'middle' as const;
};

type ActionIconImplProps = Omit<ActionIconProps, 'outdent' | 'variant'> & {
  outdent?: ActionIconOutdent;
  variant?: ActionIconVariant;
  xstyle?: Parameters<typeof styleProps>[0];
};

export const ActionIconImpl = memo<ActionIconImplProps>(
  ({
    active,
    className,
    classNames,
    color,
    danger,
    disabled,
    fill,
    fillOpacity,
    fillRule,
    focusable,
    glass,
    icon,
    loading,
    onClick,
    outdent,
    ref,
    shadow,
    size = 'middle',
    spin: iconSpinning,
    style,
    styles: slotStyles,
    title,
    tooltipProps,
    variant = 'borderless',
    xstyle,
    ...rest
  }) => {
    const presetSize = isPresetSize(size) ? size : undefined;
    const customSize = useMemo(() => (presetSize ? undefined : calcSize(size)), [presetSize, size]);
    const popupTriggerAria = rest as {
      'aria-expanded'?: unknown;
      'aria-haspopup'?: unknown;
      'aria-label'?: string;
    };
    const isPopupTrigger =
      popupTriggerAria['aria-haspopup'] !== undefined ||
      popupTriggerAria['aria-expanded'] !== undefined;
    const popupTriggerLabel =
      popupTriggerAria['aria-label'] ??
      (isPopupTrigger && typeof title === 'string' ? title : undefined);

    const handleClick: ButtonProps['onClick'] = (event) => {
      onClick?.(event as unknown as MouseEvent<HTMLDivElement>);
    };

    const iconNode = icon ? (
      <Icon
        className={clsx(actionIconClasses('icon'), classNames?.icon)}
        color={color}
        fill={fill}
        fillOpacity={fillOpacity}
        fillRule={fillRule}
        focusable={focusable}
        icon={icon}
        size={size}
        spin={iconSpinning}
        style={{ pointerEvents: 'none', ...slotStyles?.icon }}
      />
    ) : undefined;

    const outdentAmount = variant === 'borderless' && outdent ? calcOutdent(size) : undefined;
    const outdentMargin = outdentAmount
      ? outdent === 'end'
        ? { marginInlineEnd: `-${outdentAmount}` }
        : { marginInlineStart: `-${outdentAmount}` }
      : undefined;

    const node = (
      <ButtonImpl
        {...(rest as unknown as ButtonProps)}
        aria-label={popupTriggerLabel}
        className={clsx(actionIconClasses(), classNames?.root, className)}
        danger={danger}
        disabled={disabled}
        htmlType="button"
        icon={iconNode}
        loading={loading}
        ref={ref as unknown as Ref<HTMLButtonElement>}
        size={resolveButtonSize(size)}
        tabIndex={disabled ? -1 : 0}
        type={resolveButtonType(variant)}
        stableData={toDataAttributes({
          active,
          danger,
          glass,
          loading,
          shadow,
          size: typeof size === 'object' ? undefined : size,
          variant,
        })}
        style={{
          ...outdentMargin,
          ...(customSize && {
            borderRadius: customSize.borderRadius,
            height: customSize.blockSize,
            width: customSize.blockSize,
          }),
          ...slotStyles?.root,
          ...style,
        }}
        xstyle={[
          styles.root,
          presetSize && presetSizeStyles[presetSize],
          active && activeStyles[variant],
          danger && styles.dangerRoot,
          glass && styles.glass,
          shadow && styles.shadow,
          xstyle,
        ]}
        onClick={handleClick}
      />
    );

    if (!title) return node;

    return (
      <Tooltip
        title={title}
        {...tooltipProps}
        styles={{
          ...tooltipProps?.styles,
          container: { pointerEvents: 'none', ...tooltipProps?.styles?.container },
        }}
      >
        {node}
      </Tooltip>
    );
  },
);

ActionIconImpl.displayName = 'BaseActionIcon';

const ActionIcon = ActionIconImpl as unknown as <V extends ActionIconVariant = 'borderless'>(
  props: ActionIconProps<V>,
) => ReactElement;

export default ActionIcon;
