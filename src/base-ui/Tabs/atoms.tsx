'use client';

import { Tabs as BaseUITabs } from '@base-ui/react/tabs';
import { cx } from 'antd-style';
import { createContext, type FC, use, useMemo } from 'react';

import { indicatorVariants, listVariants, styles, tabVariants } from './style';
import type {
  TabsIndicatorProps,
  TabsListProps,
  TabsPanelProps,
  TabsRootProps,
  TabsSize,
  TabsTabProps,
  TabsVariant,
} from './type';

interface TabsContextValue {
  size: TabsSize;
  variant: TabsVariant;
}

const TabsContext = createContext<TabsContextValue>({ size: 'middle', variant: 'rounded' });

export const useTabsContext = () => use(TabsContext);

type TabsRootInternalProps = TabsRootProps & {
  size?: TabsSize;
  variant?: TabsVariant;
};

export const TabsRoot: FC<TabsRootInternalProps> = ({
  children,
  size = 'middle',
  variant = 'rounded',
  ...rest
}) => {
  const contextValue = useMemo(() => ({ size, variant }), [size, variant]);

  return (
    <TabsContext value={contextValue}>
      <BaseUITabs.Root {...rest}>{children}</BaseUITabs.Root>
    </TabsContext>
  );
};

TabsRoot.displayName = 'TabsRoot';

export const TabsList: FC<TabsListProps> = ({ className, variant: variantProp, ...rest }) => {
  const ctx = useTabsContext();
  const variant = variantProp ?? ctx.variant;

  return <BaseUITabs.List className={cx(listVariants({ variant }), className)} {...rest} />;
};

TabsList.displayName = 'TabsList';

export const TabsTab: FC<TabsTabProps> = ({
  className,
  size: sizeProp,
  variant: variantProp,
  ...rest
}) => {
  const ctx = useTabsContext();
  const size = sizeProp ?? ctx.size;
  const variant = variantProp ?? ctx.variant;

  return <BaseUITabs.Tab className={cx(tabVariants({ size, variant }), className)} {...rest} />;
};

TabsTab.displayName = 'TabsTab';

export const TabsPanel: FC<TabsPanelProps> = ({ className, ...rest }) => {
  return <BaseUITabs.Panel className={cx(styles.panel, className)} {...rest} />;
};

TabsPanel.displayName = 'TabsPanel';

export const TabsIndicator: FC<TabsIndicatorProps> = ({
  className,
  variant: variantProp,
  ...rest
}) => {
  const ctx = useTabsContext();
  const variant = variantProp ?? ctx.variant;

  return (
    <BaseUITabs.Indicator
      renderBeforeHydration
      className={cx(indicatorVariants({ variant }), className)}
      {...rest}
    />
  );
};

TabsIndicator.displayName = 'TabsIndicator';

export { styles as tabsStyles } from './style';
