'use client';

import { CSSProperties, ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import useControlledState from 'use-merge-value';

import MobileSafeArea from '@/MobileSafeArea';

import { useStyles } from './style';

export interface MobileTabBarItemProps {
  icon: ReactNode | ((active: boolean) => ReactNode);
  key: string;
  onClick?: () => void;
  title: ReactNode | ((active: boolean) => ReactNode);
}

export interface MobileTabBarProps {
  activeKey?: string;
  className?: string;
  defaultActiveKey?: string;
  items: MobileTabBarItemProps[];
  onChange?: (key: string) => void;
  safeArea?: boolean;
  style?: CSSProperties;
}

const MobileTabBar = memo<MobileTabBarProps>(
  ({ className, safeArea, style, items, activeKey, defaultActiveKey, onChange }) => {
    const [currentActive, setCurrentActive] = useControlledState<string>(
      defaultActiveKey || items[0].key,
      {
        defaultValue: defaultActiveKey,
        onChange,
        value: activeKey,
      },
    );
    const { styles, cx } = useStyles();

    return (
      <Flexbox className={cx(styles.container, className)} style={style}>
        <Flexbox align={'center'} className={styles.inner} horizontal justify={'space-around'}>
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

export default MobileTabBar;
