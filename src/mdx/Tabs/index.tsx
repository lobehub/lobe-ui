'use client';

import { cx } from 'antd-style';
import { type FC, type ReactNode, useState } from 'react';

import { Flexbox, type FlexboxProps } from '@/Flex';
import { default as LobeTabs, type TabsProps as LobeTabsProps } from '@/Tabs';

import { styles } from './style';

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
    <Flexbox className={cx(styles.container, className)} {...rest}>
      <LobeTabs
        compact
        activeKey={activeIndex}
        className={cx(styles.header, tabNavClassName)}
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
