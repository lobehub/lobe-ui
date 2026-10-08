'use client';

import './style.css';

import { type FC, type ReactNode, useState } from 'react';

import { Flexbox, type FlexboxProps } from '@/Flex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import LobeTabs, { type TabsProps as LobeTabsProps, type TabsStyles } from '@/Tabs';

export interface TabsProps extends Omit<FlexboxProps, 'children'> {
  children: ReactNode[];
  defaultIndex?: number | string;
  items: string[];
  tabNavProps?: Partial<LobeTabsProps>;
}

const tabsStyles: TabsStyles = {
  indicator: { borderStartEndRadius: 3, borderStartStartRadius: 3, height: 3 },
  list: { boxShadow: 'none', gap: 8, padding: 4 },
  tab: {
    borderRadius: cssVar.borderRadius,
    fontSize: 14,
    fontWeight: 400,
    height: 'auto',
    lineHeight: '22px',
    paddingBlock: 8,
    paddingInline: 12,
    transition: 'background-color 100ms ease-out',
  },
};

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
        classNames={{ tab: 'lobe-mdx-tabs-tab' }}
        styles={tabsStyles}
        variant={'square'}
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
