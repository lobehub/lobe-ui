'use client';

import { Tabs as AntdTabs, TabsProps as AntdTabsProps } from 'antd';
import { cva } from 'class-variance-authority';
import { MoreHorizontalIcon } from 'lucide-react';
import { memo, useMemo } from 'react';

import ActionIcon from '@/ActionIcon';

import { useStyles } from './style';

export interface TabsProps extends AntdTabsProps {
  compact?: boolean;
  variant?: 'square' | 'rounded' | 'point';
}

const Tabs = memo<TabsProps>(({ className, compact, variant = 'rounded', items, ...rest }) => {
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
    <AntdTabs
      className={cx(variants({ compact, underlined: hasContent, variant }), className)}
      items={items}
      more={{
        icon: <ActionIcon icon={MoreHorizontalIcon} />,
      }}
      popupClassName={cx(styles.dropdown)}
      {...rest}
    />
  );
});

Tabs.displayName = 'Tabs';

export default Tabs;
