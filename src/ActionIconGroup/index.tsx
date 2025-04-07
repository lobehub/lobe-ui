'use client';

import { cva } from 'class-variance-authority';
import { MoreHorizontal } from 'lucide-react';
import { forwardRef, useMemo } from 'react';
import { Center, CenterProps } from 'react-layout-kit';

import ActionIcon, { type ActionIconProps } from '@/ActionIcon';
import Dropdown, { type DropdownProps } from '@/Dropdown';
import type { MenuInfo, MenuItemType } from '@/Menu';
import type { TooltipProps } from '@/Tooltip';

import { useStyles } from './style';

export interface ItemType extends MenuItemType {
  tooltipProps?: TooltipProps;
}

export type ActionEvent = Pick<MenuInfo, 'key' | 'keyPath' | 'domEvent'>;

export interface ActionIconGroupProps extends CenterProps {
  actionIconProps?: Partial<Omit<ActionIconProps, 'icon' | 'size'>>;
  disabled?: boolean;
  glass?: boolean;
  items?: ItemType[];
  menu?: DropdownProps['menu'];
  onActionClick?: (action: ActionEvent) => void;
  shadow?: boolean;
  size?: ActionIconProps['size'];
  variant?: 'filled' | 'outlined' | 'borderless';
}

const ActionIconGroup = forwardRef<HTMLDivElement, ActionIconGroupProps>(
  (
    {
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
      ...rest
    },
    ref,
  ) => {
    const { cx, styles } = useStyles();

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            disabled: false,
            glass: false,
            shadow: false,
            variant: 'filled',
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
            disabled: {
              false: null,
              true: styles.disabled,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    const tooltipPlacement = useMemo(
      () => (actionIconProps?.tooltipProps?.placement || horizontal ? 'top' : 'right'),
      [actionIconProps, horizontal],
    );

    return (
      <Center
        className={cx(variants({ disabled, glass, shadow, variant }), className)}
        horizontal={horizontal}
        padding={2}
        ref={ref}
        {...rest}
      >
        {items?.length > 0 &&
          items.map((item) => {
            const { icon, key, label, onClick, danger, ...itemRest } = item;
            return (
              <ActionIcon
                danger={danger}
                icon={icon}
                key={key}
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
                {...actionIconProps}
                disabled={disabled || itemRest?.disabled}
                tooltipProps={{
                  placement: itemRest?.tooltipProps?.placement || tooltipPlacement,
                  ...itemRest?.tooltipProps,
                }}
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
  },
);

ActionIconGroup.displayName = 'ActionIconGroup';

export default ActionIconGroup;
