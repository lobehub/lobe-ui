'use client';

import { kebabCase } from 'es-toolkit/compat';
import { memo, useEffect, useId, useMemo, useState } from 'react';
import type { Ref } from 'react';

import Image from '@/Image';
import { useStreamMermaid } from '@/hooks/useStreamMermaid';

import { mermaidThemes } from '../const';
import type { SyntaxMermaidProps } from '../type';

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

    const id = useId();
    const mermaidId = kebabCase(`mermaid-${id}`);
    const data = useStreamMermaid(safeChildren, {
      enabled: true,
      id: mermaidId,
      theme: isDefaultTheme ? undefined : customTheme,
    });
    const isLoading = !data;
    const [blobUrl, setBlobUrl] = useState<string>();

    // 组件卸载时清理 Blob URL，避免内存泄漏
    useEffect(() => {
      return () => {
        if (blobUrl) URL.revokeObjectURL(blobUrl);
      };
    }, [blobUrl]);

    useEffect(() => {
      if (isLoading || !data) {
        // Clear blob URL when loading or no data
        setBlobUrl(undefined);
        return;
      }

      let finalSvgString = data;

      // 修复Firefox点击预览mermaid图时宽高为0导致不显示的异常
      if (
        typeof window !== 'undefined' &&
        typeof navigator !== 'undefined' &&
        navigator.userAgent.includes('Firefox')
      ) {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(data, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;
        if (svgElement && svgElement.hasAttribute('viewBox')) {
          const viewBox = svgElement.getAttribute('viewBox')!;
          const viewBoxParts = viewBox.split(' ');
          if (Array.isArray(viewBoxParts) && viewBoxParts.length === 4) {
            svgElement.setAttribute('width', viewBoxParts[2]);
            svgElement.setAttribute('height', viewBoxParts[3]);
          }
          finalSvgString = new XMLSerializer().serializeToString(svgDoc);
        }
      }

      // 创建Blob对象
      const svgBlob = new Blob([finalSvgString], { type: 'image/svg+xml' });
      // 创建并保存Blob URL
      const url = URL.createObjectURL(svgBlob);
      setBlobUrl(url);
    }, [isLoading, data]);

    if (!blobUrl) {
      return (
        <div className={fallbackClassName} style={style}>
          <div style={{ padding: 16 }}>Rendering...</div>
        </div>
      );
    }

    return (
      <Image
        alt={'mermaid'}
        className={className}
        maxHeight={480}
        minWidth={300}
        objectFit={'contain'}
        ref={ref}
        src={blobUrl}
        style={{
          background: variant === 'filled' ? background : undefined,
          borderRadius: 0,
          margin: 0,
          minWidth: 300,
          padding: variant === 'borderless' ? 0 : 16,
          position: 'relative',
          width: '100%',
          ...style,
        }}
        variant={'borderless'}
        width={'100%'}
      />
    );
  },
);

StreamMermaid.displayName = 'StreamMermaid';

export default StreamMermaid;
