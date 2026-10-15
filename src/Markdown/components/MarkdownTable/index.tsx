'use client';

import { memo, useCallback, useRef } from 'react';

import CopyButton from '@/CopyButton';
import { styleProps } from '@/styles/stylex/props';

import { hastTableToMarkdown } from './hastTableToMarkdown';
import { styles } from './style';

interface MarkdownTableProps {
  children?: React.ReactNode;
  node?: any;
}

const MarkdownTable = memo<MarkdownTableProps>(({ node, children, ...rest }) => {
  const nodeRef = useRef(node);
  nodeRef.current = node;

  const getMarkdown = useCallback(() => hastTableToMarkdown(nodeRef.current), []);

  return (
    <div {...styleProps(styles.wrapper, 'lobe-markdown-table')}>
      <CopyButton
        className={'lobe-markdown-table-copy table-copy-button'}
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
