'use client';

import { cva } from 'class-variance-authority';
import { memo, useMemo } from 'react';

import type { SyntaxHighlighterProps } from '../type';
import StaticRenderer from './StaticRenderer';
import StreamRenderer from './StreamRenderer';
import { useStyles } from './style';

const SyntaxHighlighter = memo<SyntaxHighlighterProps>(
  ({
    animated,
    children,
    className,
    enableTransformer,
    language,
    style,
    theme,
    variant = 'borderless',
  }) => {
    const { styles, cx } = useStyles();
    const isDefaultTheme = theme === 'lobe-theme' || !theme;
    const showBackground = !isDefaultTheme && variant === 'filled';
    const resolvedTheme = isDefaultTheme ? undefined : theme;

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            animated: false,
            shiki: true,
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
            animated: {
              true: styles.animated,
              false: null,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    const shikiClassName = cx(
      variants({ animated, shiki: true, showBackground, variant }),
      className,
    );
    const fallbackClassName = cx(
      variants({ animated, shiki: false, showBackground, variant }),
      className,
    );

    if (animated) {
      return (
        <StreamRenderer
          className={shikiClassName}
          enableTransformer={enableTransformer}
          fallbackClassName={fallbackClassName}
          language={language}
          style={style}
          theme={resolvedTheme}
        >
          {children}
        </StreamRenderer>
      );
    }

    return (
      <StaticRenderer
        className={shikiClassName}
        enableTransformer={enableTransformer}
        fallbackClassName={fallbackClassName}
        language={language}
        style={style}
        theme={resolvedTheme}
      >
        {children}
      </StaticRenderer>
    );
  },
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children && prevProps.language === nextProps.language,
);

SyntaxHighlighter.displayName = 'SyntaxHighlighter';

export default SyntaxHighlighter;
