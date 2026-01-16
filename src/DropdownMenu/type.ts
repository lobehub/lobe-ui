import type {
  MenuPopupProps,
  MenuPortalProps,
  MenuPositionerProps,
  MenuRootProps,
  MenuTriggerProps,
} from '@base-ui/react/menu';
import type { ReactNode } from 'react';

import type { BaseMenuItemType, MenuCheckboxItemType, MenuSwitchItemType } from '@/Menu';
import type { Trigger } from '@/types';
import type { Placement } from '@/utils/placement';

export type DropdownMenuPlacement = Placement;

export type DropdownMenuCheckboxItem = MenuCheckboxItemType;

export type DropdownMenuSwitchItem = MenuSwitchItemType;

export type DropdownItem = BaseMenuItemType;

export interface DropdownMenuProps<Payload = unknown> extends Omit<
  MenuRootProps<Payload>,
  'children'
> {
  children: ReactNode;
  items: DropdownItem[] | (() => DropdownItem[]);
  nativeButton?: boolean;
  placement?: DropdownMenuPlacement;
  popupProps?: MenuPopupProps;
  portalProps?: MenuPortalProps;
  positionerProps?: MenuPositionerProps;
  /**
   * 触发方式
   * @default 'click'
   */
  trigger?: Trigger;
  triggerProps?: Omit<MenuTriggerProps<Payload>, 'children'>;
}
