import { type Tabs as BaseUITabs } from '@base-ui/react/tabs';
import { type ComponentProps, type CSSProperties, type ReactNode, type Ref } from 'react';

export type TabsVariant = 'rounded' | 'square' | 'point';
export type TabsSize = 'small' | 'middle' | 'large';
export type TabsOrientation = 'horizontal' | 'vertical';

export interface TabsClassNames {
  indicator?: string;
  list?: string;
  panel?: string;
  root?: string;
  tab?: string;
}

export interface TabsStyles {
  indicator?: CSSProperties;
  list?: CSSProperties;
  panel?: CSSProperties;
  root?: CSSProperties;
  tab?: CSSProperties;
}

export interface TabsItem {
  children?: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  key: string;
  label: ReactNode;
}

export type TabsRootProps = Omit<ComponentProps<typeof BaseUITabs.Root>, 'className' | 'render'> & {
  className?: string;
};

export type TabsListProps = Omit<ComponentProps<typeof BaseUITabs.List>, 'className' | 'render'> & {
  className?: string;
  variant?: TabsVariant;
};

export type TabsTabProps = Omit<ComponentProps<typeof BaseUITabs.Tab>, 'className' | 'render'> & {
  className?: string;
  size?: TabsSize;
  variant?: TabsVariant;
};

export type TabsPanelProps = Omit<
  ComponentProps<typeof BaseUITabs.Panel>,
  'className' | 'render'
> & {
  className?: string;
};

export type TabsIndicatorProps = Omit<
  ComponentProps<typeof BaseUITabs.Indicator>,
  'className' | 'render'
> & {
  className?: string;
  variant?: TabsVariant;
};

export interface TabsProps {
  activeKey?: string;
  className?: string;
  classNames?: TabsClassNames;
  defaultActiveKey?: string;
  items?: TabsItem[];
  onChange?: (key: string) => void;
  orientation?: TabsOrientation;
  ref?: Ref<HTMLDivElement>;
  size?: TabsSize;
  style?: CSSProperties;
  styles?: TabsStyles;
  variant?: TabsVariant;
}
