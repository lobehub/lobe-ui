'use client';

import { createStyles } from 'antd-style';
import { FC, ReactNode, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import TabsNav from '@/TabsNav';

const useStyles = createStyles(({ css, token, prefixCls }) => {
  return {
    container: css`
      --lobe-markdown-margin-multiple: 1;

      margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);
      background: ${token.colorFillQuaternary};
      border-radius: calc(var(--lobe-markdown-border-radius) * 1px);
      box-shadow: 0 0 0 1px var(--lobe-markdown-border-color);
    `,

    header: css`
      border-block-end: 1px solid var(--lobe-markdown-border-color);
      .${prefixCls}-tabs-tab-btn {
        font-size: var(--lobe-markdown-font-size);
        line-height: var(--lobe-markdown-line-height);
      }
    `,
  };
});

export interface TabsProps {
  children: ReactNode[];
  defaultIndex?: number | string;
  items: string[];
}

const Tabs: FC<TabsProps> = ({ defaultIndex = '0', items, children }) => {
  const [activeIndex, setActiveIndex] = useState<string>(String(defaultIndex));
  const { styles } = useStyles();

  const index = Number(activeIndex);

  return (
    <Flexbox className={styles.container}>
      <TabsNav
        activeKey={activeIndex}
        className={styles.header}
        items={items.map((item, i) => ({
          key: String(i),
          label: item,
        }))}
        onChange={setActiveIndex}
        variant={'compact'}
      />
      {children?.[index] || ''}
    </Flexbox>
  );
};

export default Tabs;
