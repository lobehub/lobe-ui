'use client';

import { Tabs as AntdTabs } from 'antd';
import { cx } from 'antd-style';
import { MoreHorizontalIcon } from 'lucide-react';
import { type FC } from 'react';

import ActionIcon from '@/ActionIcon';

import { styles, variants } from './style';
import type { TabsProps } from './type';

const Tabs: FC<TabsProps> = ({ className, compact, variant = 'rounded', items, ...rest }) => {
  const hasContent = items?.some((item) => !!item.children);

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
