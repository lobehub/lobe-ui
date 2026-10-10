'use client';

import clsx from 'clsx';
import { type FC } from 'react';
import useControlledState from 'use-merge-value';

import { styleProps } from '@/styles/stylex/props';

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
  const initialActiveKey = defaultActiveKey ?? items?.find((item) => !item.disabled)?.key ?? null;
  const [value, setValue] = useControlledState<string | null>(initialActiveKey, {
    defaultValue: initialActiveKey,
    onChange: (next) => {
      if (next != null) onChange?.(next);
    },
    value: activeKey,
  });

  const hasPanels = items?.some((item) => item.children != null);

  return (
    <TabsRoot
      {...styleProps(styles.root, clsx(classNames?.root, className), {
        ...style,
        ...customStyles?.root,
      })}
      orientation={orientation}
      ref={ref}
      size={size}
      value={value}
      variant={variant}
      onValueChange={(next) => setValue(next ?? null)}
    >
      <TabsList className={classNames?.list} style={customStyles?.list}>
        <TabsIndicator className={classNames?.indicator} style={customStyles?.indicator} />
        {items?.map((item) => (
          <TabsTab
            className={classNames?.tab}
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
            className={classNames?.panel}
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
