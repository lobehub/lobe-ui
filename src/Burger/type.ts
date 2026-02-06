import type { DrawerProps, MenuProps } from 'antd';
import type { CSSProperties, Ref } from 'react';

import type { ActionIconProps } from '@/ActionIcon';

export interface BurgerProps {
  className?: string;
  drawerProps?: Partial<Omit<DrawerProps, 'items' | 'opened' | 'setOpened'>>;
  fullscreen?: boolean;
  headerHeight?: number;
  iconProps?: Partial<ActionIconProps>;
  items: MenuProps['items'];
  onClick?: MenuProps['onClick'];
  opened: boolean;
  openKeys?: MenuProps['openKeys'];
  ref?: Ref<HTMLDivElement>;
  rootClassName?: string;
  selectedKeys?: MenuProps['selectedKeys'];
  setOpened: (state: boolean) => void;
  size?: ActionIconProps['size'];
  style?: CSSProperties;
  variant?: ActionIconProps['variant'];
}
