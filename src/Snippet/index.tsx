'use client';

import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import CopyButton from '@/CopyButton';
import SyntaxHighlighter from '@/Highlighter/SyntaxHighlighter';
import Spotlight from '@/Spotlight';
import { DivProps } from '@/types';

import { useStyles } from './style';

export interface SnippetProps extends DivProps {
  /**
   * @description The content to be displayed inside the Snippet component
   */
  children: string;
  /**
   * @description Whether the Snippet component is copyable or not
   * @default true
   */
  copyable?: boolean;
  /**
   * @description The language of the content inside the Snippet component
   * @default 'tsx'
   */
  language?: string;
  /**
   * @description Whether add spotlight background
   * @default false
   */
  spotlight?: boolean;
  /**
   * @description The symbol to be displayed before the content inside the Snippet component
   */
  symbol?: string;
  /**
   * @description The type of the Snippet component
   * @default 'ghost'
   */
  type?: 'ghost' | 'block';
}

const Snippet = memo<SnippetProps>(
  ({
    symbol,
    language = 'tsx',
    children,
    copyable = true,
    type = 'ghost',
    spotlight,
    className,
    ...rest
  }) => {
    const { styles, cx } = useStyles(type);

    return (
      <Flexbox
        align={'center'}
        className={cx(styles.container, className)}
        gap={8}
        horizontal
        {...rest}
      >
        {spotlight && <Spotlight />}
        <SyntaxHighlighter language={language}>
          {[symbol, children].filter(Boolean).join(' ')}
        </SyntaxHighlighter>
        {copyable && <CopyButton content={children} size={{ blockSize: 24, fontSize: 14 }} />}
      </Flexbox>
    );
  },
);

export default Snippet;
