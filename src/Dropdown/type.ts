import type { DropdownProps as AntdDropdownProps } from 'antd/es';

import type { IconContentConfig } from '@/Icon';
import type { MenuProps } from '@/Menu';

export interface DropdownProps extends Omit<AntdDropdownProps, 'menu'> {
  iconProps?: IconContentConfig;
  menu: MenuProps;
}

export type { MenuItemType as DropdownMenuItemType } from '@/Menu';
