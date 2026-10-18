'use client';

import clsx from 'clsx';
import { memo } from 'react';

import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { syntaxMermaidClasses } from '../stable';
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
      [styles.root, styles.diagram, padded],
      clsx(
        'lobe-mermaid',
        syntaxMermaidClasses(),
        syntaxMermaidClasses('diagram'),
        classes,
        className,
      ),
    ).className;
    const fallback = styleProps(
      [styles.root, styles.unmermaid, padded],
      clsx(syntaxMermaidClasses(), syntaxMermaidClasses('fallback'), classes, fallbackClassName),
    ).className;
    const dataAttributes = toDataAttributes({ animated, variant });

    if (animated) {
      return (
        <StreamMermaid
          className={mermaidClassName}
          dataAttributes={dataAttributes}
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
        dataAttributes={dataAttributes}
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
    prevProps.children === nextProps.children &&
    prevProps.animated === nextProps.animated &&
    prevProps.theme === nextProps.theme &&
    prevProps.variant === nextProps.variant,
);

SyntaxMermaid.displayName = 'SyntaxMermaid';

export default SyntaxMermaid;
