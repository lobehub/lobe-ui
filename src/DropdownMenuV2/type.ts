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

export type DropdownMenuV2Placement =
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'
  | 'topLeft'
  | 'topCenter'
  | 'topRight';

export interface DropdownMenuV2CheckboxItem {
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

export type DropdownMenuV2ItemType = GenericItemType | DropdownMenuV2CheckboxItem;

export interface DropdownMenuV2Props<Payload = unknown> extends Omit<
  MenuRootProps<Payload>,
  'children'
> {
  children: ReactNode;
  items: DropdownMenuV2ItemType[] | (() => DropdownMenuV2ItemType[]);
  placement?: DropdownMenuV2Placement;
  popupProps?: MenuPopupProps;
  portalProps?: MenuPortalProps;
  positionerProps?: MenuPositionerProps;
  triggerProps?: Omit<MenuTriggerProps<Payload>, 'children'>;
}
