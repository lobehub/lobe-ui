'use client';

import { createStyles } from 'antd-style';
import { ReactNode } from 'react';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    display: inline-flex;
    line-height: var(--lobe-markdown-line-height);
  `,
  content: css`
    width: 16px;
    height: 16px;
    margin-inline: 2px;
    border-radius: 4px;

    font-family: ${token.fontFamilyCode};
    font-size: 10px;
    color: ${token.colorTextSecondary};
    text-align: center;

    background: ${token.colorFillSecondary};
  `,
  hover: css`
    cursor: pointer;

    :hover {
      color: ${token.colorPrimary};
      background: ${token.colorFill};
    }
  `,
}));
interface CitationProps {
  children?: ReactNode;
  id: string;
}

const Citation = ({ children }: CitationProps) => {
  const { styles, cx } = useStyles();

  return (
    <span className={styles.container}>
      <span className={cx(styles.content, styles.hover)}>{children}</span>
    </span>
  );
};

export default Citation;
