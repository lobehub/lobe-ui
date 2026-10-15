'use client';

import clsx from 'clsx';
import type { MouseEvent, ReactElement, Ref } from 'react';
import { memo, useMemo } from 'react';

import type { ButtonProps } from '@/Button';
import { ButtonImpl } from '@/Button/Button';
import Icon from '@/Icon';
import type { styleProps } from '@/styles/stylex/props';
import Tooltip from '@/Tooltip';

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
    const { blockSize, borderRadius } = useMemo(() => calcSize(size), [size]);
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
        className={classNames?.icon}
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
        className={clsx(classNames?.root, className)}
        danger={danger}
        disabled={disabled}
        htmlType="button"
        icon={iconNode}
        loading={loading}
        ref={ref as unknown as Ref<HTMLButtonElement>}
        size={resolveButtonSize(size)}
        tabIndex={disabled ? -1 : 0}
        type={resolveButtonType(variant)}
        style={{
          ...outdentMargin,
          borderRadius,
          height: blockSize,
          width: blockSize,
          ...slotStyles?.root,
          ...style,
        }}
        xstyle={[
          styles.root,
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
