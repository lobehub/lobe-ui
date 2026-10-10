'use client';

import clsx from 'clsx';
import { memo } from 'react';

import { styleProps } from '@/styles/stylex/props';

import type { SyntaxMermaidProps } from '../type';
import StaticMermaid from './StaticMermaid';
import StreamMermaid from './StreamMermaid';
import { styles } from './style';

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

    const classes = clsx(
      !showBackground && 'lobe-mermaid-transparent',
      animated && 'lobe-mermaid-animated',
    );
    const padded = variant !== 'borderless' && styles.padded;
    const mermaidClassName = styleProps(
      [styles.root, padded],
      clsx('ant-mermaid-mermaid lobe-mermaid', classes, className),
    ).className;
    const fallback = styleProps(
      [styles.root, styles.unmermaid, padded],
      clsx(classes, fallbackClassName),
    ).className;

    if (animated) {
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
