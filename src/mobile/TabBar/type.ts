import { ReactNode, Ref } from 'react';

import { FlexboxProps } from '@/Flex';

export interface TabBarItemType {
  icon: ReactNode | ((active: boolean) => ReactNode);
  key: string;
  onClick?: () => void;
  title: ReactNode | ((active: boolean) => ReactNode);
}

export interface TabBarProps extends Omit<FlexboxProps, 'onChange'> {
  activeKey?: string;
  defaultActiveKey?: string;
  items: TabBarItemType[];
  onChange?: (key: string) => void;
  ref?: Ref<HTMLDivElement>;
  safeArea?: boolean;
}
