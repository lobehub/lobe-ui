import type { Key, ReactNode } from 'react';

import type { IconProps } from '@/Icon';

/**
 * Checkbox menu item shared by DropdownMenu / ContextMenu.
 * This is intentionally aligned with Base UI's `Menu.CheckboxItem` API we use.
 */
export interface MenuCheckboxItemType {
  checked?: boolean;
  closeOnClick?: boolean;
  danger?: boolean;
  defaultChecked?: boolean;
  desc?: ReactNode;
  disabled?: boolean;
  extra?: ReactNode;
  icon?: IconProps['icon'];
  key: Key;
  label?: ReactNode;
  onCheckedChange?: (checked: boolean) => void;
  title?: ReactNode;
  type: 'checkbox';
}
