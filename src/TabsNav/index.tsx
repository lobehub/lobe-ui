'use client';

import { Tabs, TabsProps } from 'antd';
import { cva } from 'class-variance-authority';
import { MoreHorizontalIcon } from 'lucide-react';
import { memo, useMemo } from 'react';

import ActionIcon from '@/ActionIcon';

import { useStyles } from './style';

export interface TabsNavProps extends TabsProps {
  compact?: boolean;
  variant?: 'square' | 'rounded' | 'point';
}

const TabsNav = memo<TabsNavProps>(
  ({ className, compact, variant = 'rounded', items, ...rest }) => {
    const { styles, cx } = useStyles();
    const hasContent = items?.some((item) => !!item.children);

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            compact: false,
            underlined: false,
            variant: 'rounded',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              square: null,
              rounded: styles.rounded,
              point: styles.point,
            },
            compact: {
              false: styles.margin,
              true: styles.compact,
            },
            underlined: {
              false: styles.hideHolder,
              true: null,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    return (
      <Tabs
        className={cx(variants({ compact, underlined: hasContent, variant }), className)}
        items={items}
        more={{
          icon: <ActionIcon icon={MoreHorizontalIcon} />,
        }}
        popupClassName={cx(styles.dropdown)}
        {...rest}
      />
    );
  },
);

TabsNav.displayName = 'TabsNav';

export default TabsNav;
