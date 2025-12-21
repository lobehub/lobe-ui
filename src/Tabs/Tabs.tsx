'use client';

import { Tabs as AntdTabs } from 'antd';
import { cva } from 'class-variance-authority';
import { MoreHorizontalIcon } from 'lucide-react';
import { type FC, useMemo } from 'react';

import ActionIcon from '@/ActionIcon';

import { useStyles } from './style';
import type { TabsProps } from './type';

const Tabs: FC<TabsProps> = ({ className, compact, variant = 'rounded', items, ...rest }) => {
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
      {...rest}
      classNames={{
        ...rest?.classNames,
        popup: {
          root: styles.dropdown,
          ...rest?.classNames?.popup,
        },
      }}
      more={{
        icon: <ActionIcon icon={MoreHorizontalIcon} />,
        ...rest?.more,
      }}
    />
  );
};

Tabs.displayName = 'Tabs';

export default Tabs;
