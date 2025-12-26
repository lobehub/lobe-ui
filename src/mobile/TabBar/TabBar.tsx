'use client';

import { cx } from 'antd-style';
import { memo } from 'react';
import useMergeState from 'use-merge-value';

import { Flexbox } from '@/Flex';
import SafeArea from '@/mobile/SafeArea';

import { styles } from './style';
import type { TabBarProps } from './type';

const TabBar = memo<TabBarProps>(
  ({ ref, className, safeArea, items, activeKey, defaultActiveKey, onChange, ...rest }) => {
    const [currentActive, setCurrentActive] = useMergeState<string>(
      defaultActiveKey || items[0].key,
      {
        defaultValue: defaultActiveKey,
        onChange,
        value: activeKey,
      },
    );

    return (
      <Flexbox as={'footer'} className={cx(styles.container, className)} ref={ref} {...rest}>
        <Flexbox
          align={'center'}
          className={cx(styles.inner, className)}
          horizontal
          justify={'space-around'}
        >
          {items.map((item) => {
            const active = item.key === currentActive;
            return (
              <Flexbox
                align={'center'}
                className={cx(styles.tab, active && styles.active)}
                gap={4}
                justify={'center'}
                key={item.key}
                onClick={() => {
                  setCurrentActive(item.key);
                  item?.onClick?.();
                }}
              >
                <Flexbox align={'center'} className={styles.icon} justify={'center'}>
                  {typeof item.icon === 'function' ? item.icon(active) : item.icon}
                </Flexbox>
                <div className={styles.title}>
                  {typeof item.title === 'function' ? item.title(active) : item.title}
                </div>
              </Flexbox>
            );
          })}
        </Flexbox>
        {safeArea && <SafeArea position={'bottom'} />}
      </Flexbox>
    );
  },
);

TabBar.displayName = 'MobileTabBar';

export default TabBar;
