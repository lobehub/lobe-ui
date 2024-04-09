'use client';

import { createStyles } from 'antd-style';
import { FC, ReactNode } from 'react';

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

export interface TabProps {
  children: ReactNode;
}

const Tab: FC<TabProps> = ({ children }) => {
  const { styles } = useStyles();

  return (
    <div className={styles.body}>
      <div>{children}</div>
    </div>
  );
};

export default Tab;
