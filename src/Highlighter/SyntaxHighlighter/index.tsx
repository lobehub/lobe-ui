'use client';

import { cx } from 'antd-style';
import { type CSSProperties, memo, useMemo } from 'react';

import { resolveAnimationConfig } from '@/styles/animations';

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
    const isAnimated = !!animated;
    const isDefaultTheme = theme === 'lobe-theme' || !theme;
    const showBackground = !isDefaultTheme && variant === 'filled';
    const resolvedTheme = isDefaultTheme ? undefined : theme;

    const animationResolved = useMemo(() => resolveAnimationConfig(animated), [animated]);
    const mergedStyle = useMemo(
      () =>
        animationResolved
          ? ({
              ...style,
              '--lobe-markdown-stream-animation': animationResolved.cssValue,
            } as CSSProperties)
          : style,
      [animationResolved, style],
    );

    const shikiClassName = cx(
      variants({ animated: isAnimated, shiki: true, showBackground, variant }),
      className,
    );
    const fallbackClassName = cx(
      variants({ animated: isAnimated, shiki: false, showBackground, variant }),
      className,
    );

    if (isAnimated) {
      return (
        <StreamRenderer
          className={shikiClassName}
          enableTransformer={enableTransformer}
          fallbackClassName={fallbackClassName}
          language={language}
          style={mergedStyle}
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
