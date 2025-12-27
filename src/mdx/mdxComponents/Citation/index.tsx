'use client';

import { cx } from 'antd-style';
import { isEmpty } from 'es-toolkit/compat';
import type { FC, ReactNode } from 'react';

import PopoverPanel from '@/mdx/mdxComponents/Citation/PopoverPanel';
import { CitationItem } from '@/types/citation';

import { styles } from './style';

interface CitationProps {
  children?: ReactNode;
  citationDetail?: CitationItem;
  citations?: string[];
  href?: string;
  id: string;
  inSup?: boolean;
}

const Citation: FC<CitationProps> = ({ children, href, inSup, id, citationDetail }) => {
  const usePopover = !isEmpty(citationDetail);
  const url = citationDetail?.url || href;

  // [^1] 格式类型
  if (inSup) {
    return (
      <PopoverPanel {...citationDetail} usePopover={usePopover}>
        <span className={styles.container}>
          <a
            aria-describedby="footnote-label"
            data-footnote-ref="true"
            href={url}
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
        {url ? (
          <a
            aria-describedby="footnote-label"
            data-footnote-ref={true}
            href={url}
            rel="noreferrer"
            target={'_blank'}
          >
            {children}
          </a>
        ) : (
          <span aria-describedby="footnote-label" data-footnote-ref={true}>
            {children}
          </span>
        )}
      </sup>
    </PopoverPanel>
  );
};

Citation.displayName = 'MdxCitation';

export default Citation;
