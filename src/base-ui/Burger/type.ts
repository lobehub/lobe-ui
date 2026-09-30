import type { CSSProperties, Key, ReactNode } from 'react';

import type { ActionIconProps } from '@/base-ui/ActionIcon';
import type { ListItem } from '@/base-ui/List';

export interface BurgerProps {
  activeKey?: Key | null;
  className?: string;
  footer?: ReactNode;
  fullscreen?: boolean;
  headerHeight?: number;
  items: ListItem[];
  onOpenChange: (opened: boolean) => void;
  onSelect?: (key: Key) => void;
  opened: boolean;
  size?: ActionIconProps['size'];
  style?: CSSProperties;
  variant?: ActionIconProps['variant'];
}
