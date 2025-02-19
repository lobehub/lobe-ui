'use client';

import { createStyles } from 'antd-style';
import { ReactNode } from 'react';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    display: inline-flex;
    vertical-align: text-top;
    line-height: var(--lobe-markdown-line-height);
    a {
      color: inherit;
    }
  `,
  content: css`
    width: 16px;
    height: 16px;
    margin-inline: 2px;
    border-radius: 4px;

    font-family: ${token.fontFamilyCode};
    font-size: 10px;
    color: ${token.colorTextSecondary} !important;
    text-align: center;
    vertical-align: top;

    background: ${token.colorFillSecondary};
    transition: all 100ms ${token.motionEaseOut};
  `,
  hover: css`
    cursor: pointer;

    :hover {
      color: ${token.colorBgSpotlight} !important;
      background: ${token.colorPrimary};
    }
  `,
  supContainer: css`
    vertical-align: super;
  `,
}));
interface CitationProps {
  children?: ReactNode;
  href?: string;
  id: string;
  inSup?: boolean;
}

const Citation = ({ children, href, inSup, id }: CitationProps) => {
  const { styles, cx } = useStyles();

  if (inSup) {
    return (
      <span className={styles.container}>
        <a
          aria-describedby="footnote-label"
          className={cx(styles.content, styles.hover)}
          data-footnote-ref="true"
          href={href}
          id={id}
        >
          {children}
        </a>
      </span>
    );
  }

  return (
    <sup className={cx(styles.container, styles.supContainer)}>
      {href ? (
        <a className={cx(styles.content, styles.hover)} href={href}>
          {children}
        </a>
      ) : (
        <span className={cx(styles.content, styles.hover)}>{children}</span>
      )}
    </sup>
  );
};

export default Citation;
