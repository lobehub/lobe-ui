import type {
  MenuPopupProps,
  MenuPortalProps,
  MenuPositionerProps,
  MenuRootProps,
  MenuTriggerProps,
} from '@base-ui/react/menu';
import type { ReactNode } from 'react';

import type { BaseMenuItemType, MenuCheckboxItemType } from '@/Menu';

export type DropdownMenuPlacement =
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'
  | 'topLeft'
  | 'topCenter'
  | 'topRight';

export type DropdownMenuCheckboxItem = MenuCheckboxItemType;

export type DropdownItem = BaseMenuItemType;

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
