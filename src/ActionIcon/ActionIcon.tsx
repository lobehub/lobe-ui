'use client';

import { cx } from 'antd-style';
import { Loader2 } from 'lucide-react';
import { type MouseEventHandler, memo, useCallback, useMemo } from 'react';

import { Center } from '@/Flex';
import Icon from '@/Icon';
import Tooltip from '@/Tooltip';

import { calcSize } from './components/utils';
import { variants } from './style';
import type { ActionIconProps } from './type';

const ActionIcon = memo<ActionIconProps>(
  ({
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
    ref,
    ...rest
  }) => {
    const { blockSize, borderRadius } = useMemo(() => calcSize(size), [size]);

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
            style={{
              pointerEvents: 'none',
            }}
          />
        )}
      </Center>
    );

    if (!title) return node;

    return (
      <Tooltip
        title={title}
        {...tooltipProps}
        styles={
          typeof tooltipProps?.styles === 'function'
            ? tooltipProps.styles
            : {
                ...tooltipProps?.styles,
                container: { pointerEvents: 'none', ...tooltipProps?.styles?.container },
              }
        }
      >
        {node}
      </Tooltip>
    );
  },
);

ActionIcon.displayName = 'ActionIcon';

export default ActionIcon;
