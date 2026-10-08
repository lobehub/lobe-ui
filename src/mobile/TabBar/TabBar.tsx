'use client';

import * as stylex from '@stylexjs/stylex';
import { memo } from 'react';
import useMergeState from 'use-merge-value';

import { Flexbox } from '@/Flex';
import SafeArea from '@/mobile/SafeArea';
import { styleProps } from '@/styles/stylex/props';

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
      <Flexbox
        as={'footer'}
        flex={'none'}
        ref={ref}
        width={'100vw'}
        {...styleProps(styles.container, className)}
        {...rest}
      >
        <Flexbox
          horizontal
          align={'center'}
          height={48}
          justify={'space-around'}
          {...styleProps(styles.inner, className)}
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
                {...stylex.props(styles.tab, active && styles.active)}
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
                  {...stylex.props(styles.icon)}
                >
                  {typeof item.icon === 'function' ? item.icon(active) : item.icon}
                </Flexbox>
                <div {...stylex.props(styles.title)}>
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
