import type { Key, ReactNode } from 'react';

import type { IconProps } from '@/Icon';

/**
 * Switch menu item shared by DropdownMenu / ContextMenu.
 * Similar to checkbox but renders as a toggle switch.
 */
export interface MenuSwitchItemType {
  checked?: boolean;
  closeOnClick?: boolean;
  danger?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  extra?: ReactNode;
  icon?: IconProps['icon'];
  key: Key;
  label?: ReactNode;
  onCheckedChange?: (checked: boolean) => void;
  title?: ReactNode;
  type: 'switch';
}
