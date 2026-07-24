'use client';

import { type Ref } from 'react';
import { memo, useMemo } from 'react';

import { useStreamMermaid } from '@/hooks/useStreamMermaid';

import { mermaidThemes } from '../const';
import { type SyntaxMermaidProps } from '../type';
import MermaidFallback from './MermaidFallback';
import MermaidSvg from './MermaidSvg';

interface StreamMermaidProps {
  children: string;
  className?: string;
  fallbackClassName?: string;
  ref?: Ref<HTMLDivElement>;
  style?: SyntaxMermaidProps['style'];
  theme?: SyntaxMermaidProps['theme'];
  variant?: SyntaxMermaidProps['variant'];
}

const StreamMermaid = memo<StreamMermaidProps>(
  ({ children, className, fallbackClassName, ref, style, theme: customTheme, variant }) => {
    const safeChildren = children ?? '';
    const isDefaultTheme = customTheme === 'lobe-theme' || !customTheme;

    const background = useMemo(() => {
      if (isDefaultTheme) return;
      return mermaidThemes.find((item) => item.id === customTheme)?.background;
    }, [isDefaultTheme, customTheme]);

    const { svg, error, loading } = useStreamMermaid(safeChildren, {
      enabled: true,
      theme: isDefaultTheme ? undefined : customTheme,
    });

    const containerStyle = {
      background: variant === 'filled' ? background : undefined,
      margin: 0,
      minWidth: 300,
      padding: variant === 'borderless' ? 0 : 16,
      position: 'relative' as const,
      width: '100%',
      ...style,
    };

    if (error && !loading) {
      return (
        <MermaidFallback className={fallbackClassName} message={error} style={style}>
          {safeChildren}
        </MermaidFallback>
      );
    }

    if (!svg) {
      return (
        <div className={fallbackClassName} style={style}>
          <div style={{ padding: 16 }}>Rendering...</div>
        </div>
      );
    }

    return <MermaidSvg className={className} ref={ref} style={containerStyle} svg={svg} />;
  },
);

StreamMermaid.displayName = 'StreamMermaid';

export default StreamMermaid;
