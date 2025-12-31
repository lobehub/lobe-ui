import type {
  MenuPopupProps,
  MenuPortalProps,
  MenuPositionerProps,
  MenuRootProps,
  MenuTriggerProps,
} from '@base-ui/react/menu';
import type { Key, ReactNode } from 'react';

import type { IconProps } from '@/Icon';
import type { GenericItemType } from '@/Menu';

export type DropdownMenuPlacement =
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'
  | 'topLeft'
  | 'topCenter'
  | 'topRight';

export interface DropdownMenuCheckboxItem {
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
  type: 'checkbox';
}

export type DropdownItem = GenericItemType | DropdownMenuCheckboxItem;

export interface DropdownMenuProps<Payload = unknown> extends Omit<
  MenuRootProps<Payload>,
  'children'
> {
  children: ReactNode;
  items: DropdownItem[] | (() => DropdownItem[]);
  placement?: DropdownMenuPlacement;
  popupProps?: MenuPopupProps;
  portalProps?: MenuPortalProps;
  positionerProps?: MenuPositionerProps;
  triggerProps?: Omit<MenuTriggerProps<Payload>, 'children'>;
}
