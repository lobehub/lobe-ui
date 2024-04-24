'use client';

import { createStyles } from 'antd-style';
import { FC, ReactNode, useState } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import TabsNav, { type TabsNavProps } from '@/TabsNav';

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

export interface TabsProps extends Omit<FlexboxProps, 'children'> {
  children: ReactNode[];
  defaultIndex?: number | string;
  items: string[];
  tabNavProps?: Partial<TabsNavProps>;
}

const Tabs: FC<TabsProps> = ({
  defaultIndex = '0',
  items,
  children,
  className,
  tabNavProps = {},
  ...rest
}) => {
  const { className: tabNavClassName, onChange, ...tabNavRest } = tabNavProps;
  const [activeIndex, setActiveIndex] = useState<string>(String(defaultIndex));
  const { cx, styles } = useStyles();

  const index = Number(activeIndex);

  return (
    <Flexbox className={cx(styles.container, className)} {...rest}>
      <TabsNav
        activeKey={activeIndex}
        className={cx(styles.header, tabNavClassName)}
        items={items.map((item, i) => ({
          key: String(i),
          label: item,
        }))}
        onChange={(v) => {
          setActiveIndex(v);
          onChange?.(v);
        }}
        variant={'compact'}
        {...tabNavRest}
      />
      {children?.[index] || ''}
    </Flexbox>
  );
};

export default Tabs;
