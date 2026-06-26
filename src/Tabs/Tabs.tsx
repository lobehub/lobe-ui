'use client';

import { Tabs as AntdTabs } from 'antd';
import { cx } from 'antd-style';
import { MoreHorizontalIcon } from 'lucide-react';
import { type FC } from 'react';

import ActionIcon from '@/ActionIcon';

import { styles, variants } from './style';
import type { TabsProps } from './type';

/**
 * @deprecated Use `Tabs` from `@lobehub/ui/base-ui` instead.
 */
const Tabs: FC<TabsProps> = ({
  className,
  compact,
  variant = 'rounded',
  items,
  classNames,
  ...rest
}) => {
  const hasContent = items?.some((item) => !!item.children);
  const popupClassNames = {
    root: styles.dropdown,
    ...(typeof classNames === 'function' ? undefined : classNames?.popup),
  };
  const mergedClassNames: TabsProps['classNames'] =
    typeof classNames === 'function'
      ? Object.assign((info: Parameters<typeof classNames>[0]) => classNames(info), {
          popup: popupClassNames,
        })
      : {
          ...classNames,
          popup: popupClassNames,
        };

  return (
    <AntdTabs
      className={cx(variants({ compact, underlined: hasContent, variant }), className)}
      items={items}
      {...rest}
      classNames={mergedClassNames}
      more={{
        icon: <ActionIcon icon={MoreHorizontalIcon} />,
        ...rest?.more,
      }}
    />
  );
};

Tabs.displayName = 'Tabs';

export default Tabs;
