'use client';

import { STREAM_FADE_DURATION } from '@lobehub/streamdown';
import clsx from 'clsx';
import { type CSSProperties, memo } from 'react';

import { styleProps } from '@/styles/stylex/props';

import type { SyntaxHighlighterProps } from '../type';
import StaticRenderer from './StaticRenderer';
import StreamRenderer from './StreamRenderer';
import { styles } from './style';

type SyntaxHighlighterImplProps = SyntaxHighlighterProps & {
  xstyle?: Parameters<typeof styleProps>[0];
};

export const SyntaxHighlighterImpl = memo<SyntaxHighlighterImplProps>(
  ({
    animated,
    children,
    className,
    enableTransformer,
    language,
    style,
    theme,
    variant = 'borderless',
    xstyle,
  }) => {
    const isDefaultTheme = theme === 'lobe-theme' || !theme;
    const showBackground = !isDefaultTheme && variant === 'filled';
    const resolvedTheme = isDefaultTheme ? undefined : theme;

    const classes = clsx(
      'lobe-syntax-highlighter',
      !showBackground && 'lobe-syntax-highlighter-transparent',
      animated && 'lobe-syntax-highlighter-animated',
      variant === 'borderless'
        ? 'lobe-syntax-highlighter-unpadded'
        : 'lobe-syntax-highlighter-padded',
    );
    const mergedStyle = animated
      ? ({
          '--lobe-syntax-highlighter-stream-fade': `${STREAM_FADE_DURATION}ms`,
          ...style,
        } as CSSProperties)
      : style;

    const shiki = styleProps(
      [styles.root, xstyle],
      clsx(classes, 'ant-highlighter-highlighter-shiki lobe-syntax-highlighter-shiki', className),
      mergedStyle,
    );
    const fallback = styleProps(
      [styles.root, styles.unshiki, xstyle],
      clsx(classes, className),
      mergedStyle,
    );

    const Renderer = animated ? StreamRenderer : StaticRenderer;

    return (
      <Renderer
        className={shiki.className}
        enableTransformer={enableTransformer}
        fallbackClassName={fallback.className}
        language={language}
        style={shiki.style}
        theme={resolvedTheme}
      >
        {children}
      </Renderer>
    );
  },
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children && prevProps.language === nextProps.language,
);

const SyntaxHighlighter = memo<SyntaxHighlighterProps>((props) => (
  <SyntaxHighlighterImpl {...props} />
));

SyntaxHighlighter.displayName = 'SyntaxHighlighter';

export default SyntaxHighlighter;
