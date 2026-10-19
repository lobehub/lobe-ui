'use client';

import clsx from 'clsx';
import type { FC } from 'react';

import Spotlight from '@/awesome/Spotlight';
import CopyButton from '@/CopyButton';
import { Flexbox } from '@/Flex';
import { SyntaxHighlighterImpl } from '@/Highlighter/SyntaxHighlighter';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { snippetClasses } from './stable';
import { styles, variantStyles } from './style';
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
      data-code-type="highlighter"
      gap={8}
      height={38}
      paddingBlock={0}
      paddingInline={'12px 8px'}
      ref={ref}
      {...toDataAttributes({ shadow, variant })}
      {...rest}
      {...styleProps(
        [styles.root, variantStyles[variant], shadow && styles.shadow],
        clsx(snippetClasses(), className),
        rest.style,
      )}
    >
      {spotlight && <Spotlight className={snippetClasses('spotlight')} />}
      <SyntaxHighlighterImpl
        className={clsx('lobe-snippet-highlight', snippetClasses('highlight'))}
        language={language}
        xstyle={styles.highlight}
      >
        {[prefix, tirmedChildren].filter(Boolean).join(' ')}
      </SyntaxHighlighterImpl>
      {copyable && (
        <CopyButton className={snippetClasses('copy')} content={tirmedChildren} size={'small'} />
      )}
    </Flexbox>
  );
};

Snippet.displayName = 'Snippet';

export default Snippet;
