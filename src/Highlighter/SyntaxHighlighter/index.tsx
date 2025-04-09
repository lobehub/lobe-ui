'use client';

import { cva } from 'class-variance-authority';
import { memo, useMemo } from 'react';

import { useHighlight } from '@/hooks/useHighlight';

import type { SyntaxHighlighterProps } from '../type';
import { useStyles } from './style';

const SyntaxHighlighter = memo<SyntaxHighlighterProps>(
  ({ ref, children, language, className, style, enableTransformer, variant, theme }) => {
    const { styles, cx } = useStyles();
    const isDefaultTheme = theme === 'lobe-theme' || !theme;
    const showBackground = !isDefaultTheme && variant === 'filled';
    const { data } = useHighlight(children, {
      enableTransformer,
      language,
      theme: isDefaultTheme ? undefined : theme,
    });

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            shiki: false,
            showBackground: false,
            variant: 'borderless',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            shiki: {
              false: styles.unshiki,
              true: styles.shiki,
            },
            variant: {
              filled: styles.padding,
              outlined: styles.padding,
              borderless: styles.noPadding,
            },
            showBackground: {
              false: styles.noBackground,
              true: null,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    if (!data)
      return (
        <div
          className={cx(variants({ shiki: false, showBackground, variant }), className)}
          dir="ltr"
          ref={ref}
          style={style}
        >
          <pre>
            <code>{children}</code>
          </pre>
        </div>
      );

    return (
      <div
        className={cx(variants({ shiki: true, showBackground, variant }), className)}
        dangerouslySetInnerHTML={{
          __html: data as string,
        }}
        dir="ltr"
        ref={ref}
        style={style}
      />
    );
  },
);

SyntaxHighlighter.displayName = 'SyntaxHighlighter';

export default SyntaxHighlighter;
