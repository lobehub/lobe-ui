'use client';

import { createStyles } from 'antd-style';
import { FC } from 'react';

import { DivProps } from '@/types';

const useStyles = createStyles(({ css }) => {
  return {
    body: css`
      padding-inline: 1em;

      > div {
        margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);
      }
    `,
  };
});

export type TabProps = DivProps;

const Tab: FC<TabProps> = ({ children, className, ...rest }) => {
  const { cx, styles } = useStyles();

  return (
    <div className={cx(styles.body, className)} {...rest}>
      <div>{children}</div>
    </div>
  );
};

export default Tab;
