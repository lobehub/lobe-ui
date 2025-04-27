'use client';

import { cva } from 'class-variance-authority';
import { memo, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import CopyButton from '@/CopyButton';
import SyntaxHighlighter from '@/Highlighter/SyntaxHighlighter';
import Spotlight from '@/awesome/Spotlight';

import { useStyles } from './style';
import type { SnippetProps } from './type';

const Snippet = memo<SnippetProps>(
  ({
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
    const { styles, cx } = useStyles();

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            shadow: false,
            variant: 'filled',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: styles.filled,
              outlined: styles.outlined,
              borderless: styles.borderless,
            },
            shadow: {
              false: null,
              true: styles.shadow,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    const tirmedChildren = children.trim();

    return (
      <Flexbox
        align={'center'}
        className={cx(variants({ shadow, variant }), className)}
        data-code-type="highlighter"
        gap={8}
        horizontal
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
  },
);

Snippet.displayName = 'Snippet';

export default Snippet;
