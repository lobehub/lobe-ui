import { Anchor, AnchorProps } from 'antd';
import { useTheme } from 'antd-style';
import { memo, useMemo } from 'react';

import { AnchorItem } from '@/types';

import { useStyles } from './style';

export { default as TocMobile } from './TocMobile';

export interface TocProps {
  /**
   * @title 当前激活的目录项 key 值
   */
  activeKey?: string;
  getContainer?: AnchorProps['getContainer'];
  /**
   * @title 目录项列表
   */
  items: AnchorItem[];
  /**
   * @title 目录项切换的回调函数
   * @param activeKey - 切换后的目录项 key 值
   */
  onChange?: (activeKey: string) => void;
}
const Toc = memo<TocProps>(({ items, getContainer }) => {
  const { styles, cx } = useStyles();

  const theme = useTheme();

  const linkItems = useMemo(
    () =>
      items.map((item) => ({
        href: `#${item.id}`,
        title: item.title,
        key: item.id,
        children: item.children?.map((child) => ({
          href: `#${child.id}`,
          title: child?.title,
          key: child.id,
        })),
      })),
    [items],
  );

  return (
    <section className={cx(styles.container, styles.anchor)}>
      <h4>Table of Contents</h4>
      <Anchor
        getContainer={getContainer}
        items={linkItems}
        targetOffset={theme.headerHeight + 12}
      />
    </section>
  );
});

export default Toc;
