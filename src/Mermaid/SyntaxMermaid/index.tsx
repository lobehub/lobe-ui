'use client';

import { cx } from 'antd-style';
import { memo } from 'react';

import type { SyntaxMermaidProps } from '../type';
import StaticMermaid from './StaticMermaid';
import StreamMermaid from './StreamMermaid';
import { variants } from './style';

const SyntaxMermaid = memo<SyntaxMermaidProps>(
  ({
    animated,
    children,
    className,
    fallbackClassName,
    ref,
    style,
    theme: customTheme,
    variant = 'borderless',
  }) => {
    const isDefaultTheme = customTheme === 'lobe-theme' || !customTheme;
    const showBackground = !isDefaultTheme && variant === 'filled';
    const resolvedTheme = isDefaultTheme ? undefined : customTheme;

    const isAnimated = !!animated;
    const mermaidClassName = cx(
      variants({ animated: isAnimated, mermaid: true, showBackground, variant }),
      className,
    );
    const fallback = cx(
      variants({ animated: isAnimated, mermaid: false, showBackground, variant }),
      fallbackClassName,
    );

    if (isAnimated) {
      return (
        <StreamMermaid
          className={mermaidClassName}
          fallbackClassName={fallback}
          ref={ref}
          style={style}
          theme={resolvedTheme}
          variant={variant}
        >
          {children}
        </StreamMermaid>
      );
    }

    return (
      <StaticMermaid
        className={mermaidClassName}
        fallbackClassName={fallback}
        ref={ref}
        style={style}
        theme={resolvedTheme}
        variant={variant}
      >
        {children}
      </StaticMermaid>
    );
  },
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children && prevProps.animated === nextProps.animated,
);

SyntaxMermaid.displayName = 'SyntaxMermaid';

export default SyntaxMermaid;
