'use client';

import { createStyles } from 'antd-style';
import { type FC, type ReactNode, useMemo } from 'react';

import { SearchResultCards } from '@/SearchBar';

const useStyles = createStyles(({ css, token }) => ({
  fallback: css`
    padding-block: 1em;
    font-size: 0.875em;
    color: ${token.colorTextSecondary};

    ol {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5em;

      margin: 0;
      padding: 0;

      list-style-type: none;
    }

    ol li {
      position: relative;

      overflow: hidden;
      display: flex;
      flex-direction: row;

      margin: 0 !important;
      padding-block: 0 !important;
      padding-inline: 0 0.4em !important;
      border: 1px solid ${token.colorBorderSecondary};
      border-radius: 0.25em;

      text-overflow: ellipsis;
      white-space: nowrap;

      &::before {
        content: counter(list-item);
        counter-increment: list-item;

        display: block;

        margin-inline-end: 0.4em;
        padding-inline: 0.6em;

        background: ${token.colorFillSecondary};
      }

      p,
      a {
        overflow: hidden;

        margin: 0 !important;
        padding: 0 !important;

        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  `,
}));

interface FootnotesProps {
  'children': ReactNode;
  'data-footnote-links'?: string;
  'data-footnotes'?: boolean;
}

const Footnotes: FC<FootnotesProps> = ({ children, ...rest }) => {
  const { styles, cx } = useStyles();

  const links = useMemo(() => {
    try {
      return JSON.parse(rest['data-footnote-links'] || '');
    } catch (error) {
      console.error(error);
      console.log(rest);
      return [];
    }
  }, [rest['data-footnote-links']]);

  const isError = links.length === 0;
  return (
    <section className={cx('footnotes', isError && styles.fallback)} data-footnotes="true">
      {isError ? children : <SearchResultCards dataSource={links} />}
    </section>
  );
};

Footnotes.displayName = 'MdxFootnotes';

export default Footnotes;
