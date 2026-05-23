'use client';

import { createStyles } from 'antd-style';
import { memo, useCallback, useRef } from 'react';

import CopyButton from '@/CopyButton';

import { hastTableToMarkdown } from './hastTableToMarkdown';

const useStyles = createStyles(({ css, token }) => ({
  copyButton: css`
    position: absolute;
    z-index: 1;
    inset-block-start: 6px;
    inset-inline-end: 6px;

    opacity: 0;

    transition: opacity ${token.motionDurationMid} ${token.motionEaseInOut};
  `,
  wrapper: css`
    position: relative;
    display: inline-block;
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
        size={{ blockSize: 24, size: 14 }}
        title="Copy table"
      />
      <table {...rest}>{children}</table>
    </div>
  );
});

MarkdownTable.displayName = 'MarkdownTable';

export default MarkdownTable;
