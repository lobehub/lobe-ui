'use client';

import { createStyles } from 'antd-style';
import { memo, useCallback, useRef } from 'react';

import CopyButton from '@/CopyButton';

import { hastTableToMarkdown } from './hastTableToMarkdown';

const useStyles = createStyles(({ css, token }) => ({
  copyButton: css`
    position: absolute;
    z-index: 1;

    /* Vertical center of the header row = top padding (0.75em) + half of
       the text line-box (line-height * 0.5em). Pulling the button up by
       50% of its own height with transform parks it on that exact line. */
    inset-block-start: calc(0.75em + (var(--lobe-markdown-line-height) * 0.5em));
    inset-inline-end: 0.5em;
    transform: translateY(-50%);

    opacity: 0;
    background: ${token.colorBgContainer};
    box-shadow: 0 0 0 1px ${token.colorBorderSecondary};

    transition: opacity ${token.motionDurationMid} ${token.motionEaseInOut};
  `,
  wrapper: css`
    position: relative;

    display: block;

    width: max-content;
    max-width: 100%;
    margin-block: calc(var(--lobe-markdown-margin-multiple) * 0.5em);

    &:hover .table-copy-button,
    &:focus-within .table-copy-button {
      opacity: 1;
    }

    /* Hand spacing to the wrapper so the absolutely-positioned copy
       button anchors against the visible table edge instead of empty
       margin space. */
    > table {
      margin-block: 0;
    }

    /* Reserve room for the copy button so right-aligned header text
       doesn't slide under it. */
    > table thead th:last-child {
      padding-inline-end: calc(1em + 32px);
    }
  `,
}));

interface MarkdownTableProps {
  children?: React.ReactNode;
  node?: any;
}

const MarkdownTable = memo<MarkdownTableProps>(({ node, children, ...rest }) => {
  const { styles, cx } = useStyles();
  const nodeRef = useRef(node);
  nodeRef.current = node;

  const getMarkdown = useCallback(() => hastTableToMarkdown(nodeRef.current), []);

  return (
    <div className={styles.wrapper}>
      <CopyButton
        className={cx(styles.copyButton, 'table-copy-button')}
        content={getMarkdown}
        glass={false}
        size={{ blockSize: 24, size: 14 }}
        title="Copy table"
        variant="filled"
      />
      <table {...rest}>{children}</table>
    </div>
  );
});

MarkdownTable.displayName = 'MarkdownTable';

export default MarkdownTable;
