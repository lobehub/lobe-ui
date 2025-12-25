'use client';

import clsx from 'clsx';
import { MoreHorizontal } from 'lucide-react';
import { type FC, useMemo } from 'react';

import ActionIcon from '@/ActionIcon';
import Dropdown from '@/Dropdown';
import { Center } from '@/Flex';

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
  const rootClassName = clsx(
    'lobe-action-icon-group',
    variant === 'filled' && 'lobe-action-icon-group--filled',
    variant === 'outlined' && 'lobe-action-icon-group--outlined',
    variant === 'borderless' && 'lobe-action-icon-group--borderless',
    disabled && 'lobe-action-icon-group--disabled',
    glass && 'lobe-action-icon-group--glass',
    shadow && 'lobe-action-icon-group--shadow',
    className,
  );

  const tooltipPlacement = useMemo(
    () => (actionIconProps?.tooltipProps?.placement || horizontal ? 'top' : 'right'),
    [actionIconProps, horizontal],
  );

  return (
    <Center className={rootClassName} horizontal={horizontal} padding={2} ref={ref} {...rest}>
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
        <Dropdown
          menu={{
            ...menu,
            onClick: (item) => {
              onActionClick?.(item);
            },
          }}
          trigger={['click']}
        >
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
        </Dropdown>
      )}
    </Center>
  );
};

ActionIconGroup.displayName = 'ActionIconGroup';

export default ActionIconGroup;
