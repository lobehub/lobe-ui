'use client';

import clsx from 'clsx';
import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { useControlledState } from '@/hooks/useControlledState';
import SafeArea from '@/mobile/SafeArea';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { mobileTabBarClasses } from './stable';
import { styles } from './style';
import type { TabBarProps } from './type';

const TabBar = memo<TabBarProps>(
  ({ ref, className, safeArea, items, activeKey, defaultActiveKey, onChange, ...rest }) => {
    const [currentActive, setCurrentActive] = useControlledState<string>(
      defaultActiveKey || items[0].key,
      {
        defaultValue: defaultActiveKey,
        onChange,
        value: activeKey,
      },
    );

    return (
      <Flexbox
        as={'footer'}
        flex={'none'}
        ref={ref}
        width={'100vw'}
        {...styleProps(styles.container, clsx(mobileTabBarClasses(), className))}
        {...rest}
      >
        <Flexbox
          horizontal
          align={'center'}
          height={48}
          justify={'space-around'}
          {...styleProps(styles.inner, mobileTabBarClasses('inner'))}
        >
          {items.map((item) => {
            const active = item.key === currentActive;
            return (
              <Flexbox
                align={'center'}
                gap={4}
                height={48}
                justify={'center'}
                key={item.key}
                width={48}
                {...styleProps([styles.tab, active && styles.active], mobileTabBarClasses('tab'))}
                {...toDataAttributes({ active })}
                onClick={() => {
                  setCurrentActive(item.key);
                  item?.onClick?.();
                }}
              >
                <Flexbox
                  align={'center'}
                  height={24}
                  justify={'center'}
                  width={24}
                  {...styleProps(styles.icon, mobileTabBarClasses('icon'))}
                >
                  {typeof item.icon === 'function' ? item.icon(active) : item.icon}
                </Flexbox>
                <div {...styleProps(styles.title, mobileTabBarClasses('title'))}>
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
