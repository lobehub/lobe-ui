'use client';

import * as stylex from '@stylexjs/stylex';
import { type Ref } from 'react';
import { memo, useMemo } from 'react';

import { useStreamMermaid } from '@/hooks/useStreamMermaid';

import { mermaidThemes } from '../const';
import { getMermaidThemeVars } from '../themes';
import { type SyntaxMermaidProps } from '../type';
import MermaidFallback from './MermaidFallback';
import MermaidSvg from './MermaidSvg';
import { styles } from './style';

interface StreamMermaidProps {
  children: string;
  className?: string;
  dataAttributes?: Record<`data-${string}`, string>;
  fallbackClassName?: string;
  ref?: Ref<HTMLDivElement>;
  style?: SyntaxMermaidProps['style'];
  theme?: SyntaxMermaidProps['theme'];
  variant?: SyntaxMermaidProps['variant'];
}

const StreamMermaid = memo<StreamMermaidProps>(
  ({
    children,
    className,
    dataAttributes,
    fallbackClassName,
    ref,
    style,
    theme: customTheme,
    variant,
  }) => {
    const safeChildren = children ?? '';
    const isDefaultTheme = customTheme === 'lobe-theme' || !customTheme;

    const background = useMemo(() => {
      if (isDefaultTheme) return;
      return mermaidThemes.find((item) => item.id === customTheme)?.background;
    }, [isDefaultTheme, customTheme]);

    const { svg, error, loading } = useStreamMermaid(safeChildren);

    const containerStyle = {
      ...getMermaidThemeVars(customTheme),
      background: variant === 'filled' ? background : undefined,
      ...style,
    };

    if (error && !loading) {
      return (
        <MermaidFallback
          className={fallbackClassName}
          dataAttributes={dataAttributes}
          message={error}
          style={style}
        >
          {safeChildren}
        </MermaidFallback>
      );
    }

    if (!svg) {
      return (
        <div {...dataAttributes} className={fallbackClassName} style={style}>
          <div {...stylex.props(styles.status)}>Rendering...</div>
        </div>
      );
    }

    return (
      <MermaidSvg
        className={className}
        dataAttributes={dataAttributes}
        ref={ref}
        style={containerStyle}
        svg={svg}
      />
    );
  },
);

StreamMermaid.displayName = 'StreamMermaid';

export default StreamMermaid;
