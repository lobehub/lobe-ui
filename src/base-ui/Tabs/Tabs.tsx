'use client';

import { cx } from 'antd-style';
import { type FC } from 'react';
import useControlledState from 'use-merge-value';

import { TabsIndicator, TabsList, TabsPanel, TabsRoot, TabsTab } from './atoms';
import { styles } from './style';
import type { TabsProps } from './type';

const Tabs: FC<TabsProps> = ({
  activeKey,
  className,
  classNames,
  defaultActiveKey,
  items,
  onChange,
  orientation = 'horizontal',
  ref,
  size = 'middle',
  style,
  styles: customStyles,
  variant = 'rounded',
}) => {
  const [value, setValue] = useControlledState<string | null>(defaultActiveKey ?? null, {
    defaultValue: defaultActiveKey,
    onChange: (next) => {
      if (next != null) onChange?.(next);
    },
    value: activeKey,
  });

  const hasPanels = items?.some((item) => item.children != null);

  return (
    <TabsRoot
      className={cx(styles.root, classNames?.root, className)}
      orientation={orientation}
      ref={ref}
      size={size}
      style={{ ...style, ...customStyles?.root }}
      value={value}
      variant={variant}
      onValueChange={(next) => setValue(next ?? null)}
    >
      <TabsList className={cx(classNames?.list)} style={customStyles?.list}>
        <TabsIndicator className={cx(classNames?.indicator)} style={customStyles?.indicator} />
        {items?.map((item) => (
          <TabsTab
            className={cx(classNames?.tab)}
            disabled={item.disabled}
            key={item.key}
            style={customStyles?.tab}
            value={item.key}
          >
            {item.icon}
            {item.label}
          </TabsTab>
        ))}
      </TabsList>
      {hasPanels &&
        items?.map((item) => (
          <TabsPanel
            className={cx(classNames?.panel)}
            key={item.key}
            style={customStyles?.panel}
            value={item.key}
          >
            {item.children}
          </TabsPanel>
        ))}
    </TabsRoot>
  );
};

Tabs.displayName = 'Tabs';

export default Tabs;
