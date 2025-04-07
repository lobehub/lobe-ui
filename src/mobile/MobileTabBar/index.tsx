'use client';

import { ReactNode, forwardRef } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';
import useMergeState from 'use-merge-value';

import MobileSafeArea from '@/mobile/MobileSafeArea';

import { useStyles } from './style';

export interface MobileTabBarItemProps {
  icon: ReactNode | ((active: boolean) => ReactNode);
  key: string;
  onClick?: () => void;
  title: ReactNode | ((active: boolean) => ReactNode);
}

export interface MobileTabBarProps extends Omit<FlexboxProps, 'onChange'> {
  activeKey?: string;
  defaultActiveKey?: string;
  items: MobileTabBarItemProps[];
  onChange?: (key: string) => void;
  safeArea?: boolean;
}

const MobileTabBar = forwardRef<HTMLDivElement, MobileTabBarProps>(
  ({ className, safeArea, items, activeKey, defaultActiveKey, onChange, ...rest }, ref) => {
    const [currentActive, setCurrentActive] = useMergeState<string>(
      defaultActiveKey || items[0].key,
      {
        defaultValue: defaultActiveKey,
        onChange,
        value: activeKey,
      },
    );
    const { styles, cx } = useStyles();

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
        {safeArea && <MobileSafeArea position={'bottom'} />}
      </Flexbox>
    );
  },
);

MobileTabBar.displayName = 'MobileTabBar';

export default MobileTabBar;
