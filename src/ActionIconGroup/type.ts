import type { CenterProps } from '@lobehub/ui/Flex';
import type { Ref } from 'react';

import type { ActionIconProps } from '@/ActionIcon';
import type { DropdownProps } from '@/Dropdown';
import type { MenuInfo, MenuItemType } from '@/Menu';

export type ActionIconGroupEvent = Pick<MenuInfo, 'key' | 'keyPath' | 'domEvent'>;

export interface ActionIconGroupProps extends Omit<CenterProps, 'children'> {
  actionIconProps?: Partial<Omit<ActionIconProps, 'icon' | 'size' | 'ref'>>;
  disabled?: boolean;
  glass?: boolean;
  items?: MenuItemType[];
  menu?: DropdownProps['menu'];
  onActionClick?: (action: ActionIconGroupEvent) => void;
  ref?: Ref<HTMLDivElement>;
  shadow?: boolean;
  size?: ActionIconProps['size'];
  variant?: 'filled' | 'outlined' | 'borderless';
}

export type { MenuItemType as ActionIconGroupItemType } from '@/Menu';
