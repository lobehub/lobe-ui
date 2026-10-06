import type { Ref } from 'react';

import type { ActionIconProps } from '@/base-ui/ActionIcon';
import type { MenuInfo, MenuItemType } from '@/base-ui/menu';
import type { DropdownMenuProps } from '@/DropdownMenu';
import type { CenterProps } from '@/Flex';

export type ActionIconGroupEvent = Pick<MenuInfo, 'key' | 'keyPath' | 'domEvent'>;

export interface ActionIconGroupProps extends Omit<CenterProps, 'children'> {
  actionIconProps?: Partial<Omit<ActionIconProps, 'icon' | 'size' | 'ref'>>;
  disabled?: boolean;
  glass?: boolean;
  /**
   * @default true
   */
  horizontal?: boolean;
  items?: MenuItemType[];
  menu?: DropdownMenuProps['items'];
  onActionClick?: (action: ActionIconGroupEvent) => void;
  ref?: Ref<HTMLDivElement>;
  shadow?: boolean;
  size?: ActionIconProps['size'];
  variant?: 'filled' | 'outlined' | 'borderless';
}

export type { MenuItemType as ActionIconGroupItemType } from '@/base-ui/menu';
