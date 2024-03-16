import { createStyles } from 'antd-style';
import { isArray, isString } from 'lodash-es';
import { FC, ReactNode, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import TabsNav from '../TabsNav';

const useStyles = createStyles(({ css, token, prefixCls }) => {
  return {
    body: css`
      padding-inline: 1em;
    `,
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

export interface _TabItemProps {
  children: ReactNode;
}

const _TabItem: FC<_TabItemProps> = ({ children }) => {
  const { styles } = useStyles();

  let content = children;

  if (isString(children) || isArray(children)) content = <p>{children}</p>;

  return <div className={styles.body}>{content}</div>;
};

export interface _TabsProps {
  children: ReactNode[];
  defaultIndex?: number | string;
  items: string[];
}

const _Tabs: FC<_TabsProps> = ({ defaultIndex = '0', items, children }) => {
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

export type TabsProps = typeof _Tabs & {
  Tab: typeof _TabItem;
};

const Tabs = _Tabs as TabsProps;
Tabs.Tab = _TabItem;

export default Tabs;
