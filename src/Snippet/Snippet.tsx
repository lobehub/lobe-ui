'use client';

import { cx } from 'antd-style';
import type { FC } from 'react';

import Spotlight from '@/awesome/Spotlight';
import CopyButton from '@/CopyButton';
import { Flexbox } from '@/Flex';
import SyntaxHighlighter from '@/Highlighter/SyntaxHighlighter';

import { styles, variants } from './style';
import { type SnippetProps } from './type';

const Snippet: FC<SnippetProps> = ({
  ref,
  prefix,
  language = 'tsx',
  children,
  copyable = true,
  variant = 'filled',
  spotlight,
  shadow,
  className,
  ...rest
}) => {
  const tirmedChildren = children.trim();

  return (
    <Flexbox
      horizontal
      align={'center'}
      className={cx(variants({ shadow, variant }), className)}
      data-code-type="highlighter"
      gap={8}
      ref={ref}
      {...rest}
    >
      {spotlight && <Spotlight />}
      <SyntaxHighlighter className={styles.hightlight} language={language}>
        {[prefix, tirmedChildren].filter(Boolean).join(' ')}
      </SyntaxHighlighter>
      {copyable && <CopyButton content={tirmedChildren} size={'small'} />}
    </Flexbox>
  );
};

Snippet.displayName = 'Snippet';

export default Snippet;
