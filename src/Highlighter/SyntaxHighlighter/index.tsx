'use client';

import { cx } from 'antd-style';
import { memo } from 'react';

import type { SyntaxHighlighterProps } from '../type';
import StaticRenderer from './StaticRenderer';
import StreamRenderer from './StreamRenderer';
import { variants } from './style';

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
    const isDefaultTheme = theme === 'lobe-theme' || !theme;
    const showBackground = !isDefaultTheme && variant === 'filled';
    const resolvedTheme = isDefaultTheme ? undefined : theme;

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
