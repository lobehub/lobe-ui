'use client';

import { FC, ReactNode, useState } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import TabsNav, { type TabsNavProps } from '@/TabsNav';

import { useStyles } from './style';

export interface TabsProps extends Omit<FlexboxProps, 'children'> {
  children: ReactNode[];
  defaultIndex?: number | string;
  items: string[];
  tabNavProps?: Partial<TabsNavProps>;
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
  const { cx, styles } = useStyles();

  const index = Number(activeIndex);

  return (
    <Flexbox className={cx(styles.container, className)} {...rest}>
      <TabsNav
        activeKey={activeIndex}
        className={cx(styles.header, tabNavClassName)}
        compact
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
