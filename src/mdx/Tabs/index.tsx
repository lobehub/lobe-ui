'use client';

import './style.css';

import { type FC, type ReactNode, useState } from 'react';

import { Flexbox, type FlexboxProps } from '@/Flex';
import LobeTabs, { type TabsProps as LobeTabsProps } from '@/Tabs';

export interface TabsProps extends Omit<FlexboxProps, 'children'> {
  children: ReactNode[];
  defaultIndex?: number | string;
  items: string[];
  tabNavProps?: Partial<LobeTabsProps>;
}

const Tabs: FC<TabsProps> = ({
  defaultIndex = '0',
  items,
  children,
  className,
  tabNavProps = {},
  ...rest
}) => {
  const { className: tabNavClassName, onChange, ...tabNavRest } = tabNavProps;
  const [activeIndex, setActiveIndex] = useState<string>(String(defaultIndex));

  const index = Number(activeIndex);

  return (
    <Flexbox className={className} {...rest}>
      <LobeTabs
        activeKey={activeIndex}
        className={tabNavClassName}
        variant={'square'}
        classNames={{
          indicator: 'lobe-mdx-tabs-indicator',
          list: 'lobe-mdx-tabs-list',
          tab: 'lobe-mdx-tabs-tab',
        }}
        items={items.map((item, i) => ({
          key: String(i),
          label: item,
        }))}
        onChange={(v) => {
          setActiveIndex(v);
          onChange?.(v);
        }}
        {...tabNavRest}
      />
      {children?.[index] || ''}
    </Flexbox>
  );
};

export default Tabs;
