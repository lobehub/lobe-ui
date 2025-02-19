'use client';

import { createStyles } from 'antd-style';
import { isEmpty } from 'lodash-es';
import { ReactNode } from 'react';

import PopoverPanel from '@/mdx/mdxComponents/Citation/PopoverPanel';
import { CitationItem } from '@/types/citation';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    display: inline-flex;
    line-height: var(--lobe-markdown-line-height);
    vertical-align: text-top;

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
  citationDetail?: CitationItem;
  citations?: string[];
  href?: string;
  id: string;
  inSup?: boolean;
}

const Citation = ({ children, href, inSup, id, citationDetail }: CitationProps) => {
  const { styles, cx } = useStyles();
  const usePopover = !isEmpty(citationDetail);

  // [^1] 格式类型
  if (inSup) {
    return (
      <PopoverPanel {...citationDetail} usePopover={usePopover}>
        <span className={styles.container}>
          <a
            aria-describedby="footnote-label"
            className={cx(styles.content, styles.hover)}
            data-footnote-ref="true"
            href={citationDetail?.url || href}
            id={id}
            rel="noreferrer"
            target={citationDetail?.url ? '_blank' : undefined}
          >
            {children}
          </a>
        </span>
      </PopoverPanel>
    );
  }

  return (
    <PopoverPanel {...citationDetail} usePopover={usePopover}>
      <sup className={cx(styles.container, styles.supContainer)}>
        {href ? (
          <a className={cx(styles.content, styles.hover)} href={href}>
            {children}
          </a>
        ) : (
          <span className={cx(styles.content, styles.hover)}>{children}</span>
        )}
      </sup>
    </PopoverPanel>
  );
};

export default Citation;
