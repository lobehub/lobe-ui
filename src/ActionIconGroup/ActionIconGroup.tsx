'use client';

import { MoreHorizontal } from 'lucide-react';
import { type FC, useMemo } from 'react';

import ActionIcon from '@/ActionIcon';
import DropdownMenu from '@/DropdownMenu';
import { Center } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';
import { stylish } from '@/styles/stylex/stylish';
import { TooltipGroup } from '@/Tooltip';

import { styles } from './style';
import type { ActionIconGroupProps } from './type';

const variantStyles = {
  borderless: styles.borderless,
  filled: stylish.variantFilledWithoutHover,
  outlined: stylish.variantOutlinedWithoutHover,
};

const ActionIconGroup: FC<ActionIconGroupProps> = ({
  variant = 'filled',
  disabled,
  shadow,
  glass,
  actionIconProps,
  items = [],
  horizontal = true,
  menu,
  onActionClick,
  className,
  size = 'small',
  ref,
  ...rest
}) => {
  const tooltipPlacement = useMemo(
    () => (actionIconProps?.tooltipProps?.placement || horizontal ? 'top' : 'right'),
    [actionIconProps, horizontal],
  );

  const menuItems = useMemo(() => {
    const rawItems = typeof menu === 'function' ? menu() : menu;
    if (!rawItems) return [];
    return rawItems.map((item) => ({
      ...(item as any),
      onClick: (info: any) => {
        (item as any)?.onClick?.(info);
        onActionClick?.(info);
      },
    }));
  }, [menu, onActionClick]);

  return (
    <TooltipGroup>
      <Center
        horizontal={horizontal}
        padding={2}
        ref={ref}
        className={
          styleProps(
            [
              styles.root,
              variantStyles[variant],
              glass && styles.glass,
              shadow && styles.shadow,
              disabled && styles.disabled,
            ],
            className,
          ).className
        }
        {...rest}
      >
        {items?.length > 0 &&
          items.map((item) => {
            const { icon, key, label, onClick, danger, loading, ...itemRest } = item;
            return (
              <ActionIcon
                danger={danger}
                icon={icon}
                key={key}
                loading={loading}
                size={size}
                title={label}
                tooltipProps={{
                  placement: tooltipPlacement,
                }}
                onClick={(e) => {
                  onActionClick?.({
                    domEvent: e,
                    key: String(key),
                    keyPath: [String(key)],
                  });
                  onClick?.(e as any);
                }}
                {...actionIconProps}
                disabled={disabled || loading || itemRest?.disabled}
              />
            );
          })}
        {menu && (
          <DropdownMenu items={menuItems} nativeButton={false}>
            <ActionIcon
              disabled={disabled}
              icon={MoreHorizontal}
              key="more"
              size={size}
              {...actionIconProps}
              tooltipProps={{
                placement: tooltipPlacement,
                ...actionIconProps?.tooltipProps,
              }}
            />
          </DropdownMenu>
        )}
      </Center>
    </TooltipGroup>
  );
};

ActionIconGroup.displayName = 'ActionIconGroup';

export default ActionIconGroup;
