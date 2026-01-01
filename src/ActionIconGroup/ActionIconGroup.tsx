'use client';

import { cx } from 'antd-style';
import { MoreHorizontal } from 'lucide-react';
import { type FC, useMemo } from 'react';

import ActionIcon from '@/ActionIcon';
import DropdownMenu from '@/DropdownMenu';
import { Center } from '@/Flex';
import { TooltipGroup } from '@/Tooltip';

import { variants } from './style';
import type { ActionIconGroupProps } from './type';

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
        className={cx(variants({ disabled, glass, shadow, variant }), className)}
        horizontal={horizontal}
        padding={2}
        ref={ref}
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
                onClick={(e) => {
                  onActionClick?.({
                    domEvent: e,
                    key: String(key),
                    keyPath: [String(key)],
                  });
                  onClick?.(e as any);
                }}
                size={size}
                title={label}
                tooltipProps={{
                  placement: tooltipPlacement,
                }}
                {...actionIconProps}
                disabled={disabled || loading || itemRest?.disabled}
              />
            );
          })}
        {menu && (
          <DropdownMenu items={menuItems}>
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
