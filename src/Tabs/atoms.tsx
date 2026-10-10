'use client';

import './style.css';

import { Tabs as BaseUITabs } from '@base-ui/react/tabs';
import clsx from 'clsx';
import { createContext, type FC, use, useMemo } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { indicatorStyles, listStyles, panelStyles, tabStyles } from './style';
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

  return (
    <BaseUITabs.List className={styleProps(listStyles(variant), className).className} {...rest} />
  );
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

  return (
    <BaseUITabs.Tab
      className={styleProps(tabStyles(size, variant), className).className}
      {...rest}
    />
  );
};

TabsTab.displayName = 'TabsTab';

export const TabsPanel: FC<TabsPanelProps> = ({ className, ...rest }) => {
  return <BaseUITabs.Panel className={styleProps(panelStyles, className).className} {...rest} />;
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
      className={
        styleProps(indicatorStyles(variant), clsx('lobe-tabs-indicator', className)).className
      }
      {...rest}
    />
  );
};

TabsIndicator.displayName = 'TabsIndicator';

export { tabsStyles } from './style';
