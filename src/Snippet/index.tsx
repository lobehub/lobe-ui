import { CopyButton, SyntaxHighlighter } from '@/index';

import { memo } from 'react';
import { useStyles } from './style';

export interface SnippetProps extends DivProps {
  /**
   * @description The content to be displayed inside the Snippet component
   */
  children: string;
  /**
   * @description The symbol to be displayed before the content inside the Snippet component
   */
  symbol: string;
  /**
   * @description The language of the content inside the Snippet component
   * @default 'tsx'
   */
  language: string;
  /**
   * @description Whether the Snippet component is copyable or not
   * @default true
   */
  copyable?: boolean;
  /**
   * @description The type of the Snippet component
   * @default 'ghost'
   */
  type?: 'ghost' | 'block';
}

const Snippet = memo<SnippetProps>(
  ({ symbol, language = 'tsx', children, copyable = true, type = 'ghost', ...props }) => {
    const { styles } = useStyles(type);

    return (
      <div className={styles} {...props}>
        <SyntaxHighlighter language={language}>
          {[symbol, children].filter(Boolean).join(' ')}
        </SyntaxHighlighter>
        {copyable && <CopyButton size={{ fontSize: 14, blockSize: 24 }} content={children} />}
      </div>
    );
  },
);

export default Snippet;
