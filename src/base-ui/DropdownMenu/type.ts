import type {
  MenuPopupProps,
  MenuPortalProps,
  MenuPositionerProps,
  MenuRootProps,
  MenuTriggerProps,
} from '@base-ui/react/menu';
import type { ReactNode } from 'react';

import type { BaseMenuItemType, IconAlign, MenuCheckboxItemType, MenuSwitchItemType } from '@/Menu';
import type { Trigger } from '@/types';
import type { Placement } from '@/utils/placement';

import type { IconSpaceMode } from './renderItems';

export type DropdownMenuPlacement = Placement;

export type DropdownMenuCheckboxItem = MenuCheckboxItemType;

export type DropdownMenuSwitchItem = MenuSwitchItemType;

export type DropdownItem = BaseMenuItemType;

export interface DropdownMenuProps<Payload = unknown> extends Omit<
  MenuRootProps<Payload>,
  'children'
> {
  children: ReactNode;
  /**
   * 图标与 label+desc 的垂直对齐方式
   * - 'center': 图标垂直居中（默认）
   * - 'start': 图标与第一行文本顶部对齐，仅在 item 有 desc 时生效
   * @default 'center'
   */
  iconAlign?: IconAlign;
  /**
   * 图标空间保留模式
   * - 'global': 当任何一个选项有图标时，所有 item 都保留图标位
   * - 'group': 只有当一个分组中存在图标时，该分组才保留图标位
   * @default 'global'
   */
  iconSpaceMode?: IconSpaceMode;
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
