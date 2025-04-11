import type { TabsProps as AntdTabsProps } from 'antd';

export interface TabsProps extends AntdTabsProps {
  compact?: boolean;
  variant?: 'square' | 'rounded' | 'point';
}
