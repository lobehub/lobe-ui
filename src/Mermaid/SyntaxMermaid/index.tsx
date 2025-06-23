'use client';

import { useTheme } from 'antd-style';
import { kebabCase } from 'lodash-es';
import { memo, useEffect, useId, useMemo, useState } from 'react';

import Image from '@/Image';
import { useMermaid } from '@/hooks/useMermaid';

import { mermaidThemes } from '../const';
import type { SyntaxMermaidProps } from '../type';

const SyntaxMermaid = memo<SyntaxMermaidProps>(
  ({ ref, children, theme: customTheme, variant, enablePanZoom }) => {
    const isDefaultTheme = customTheme === 'lobe-theme' || !customTheme;

    const background = useMemo(() => {
      if (isDefaultTheme) return;
      return mermaidThemes.find((item) => item.id === customTheme)?.background;
    }, [isDefaultTheme, customTheme]);

    const id = useId();
    const theme = useTheme();
    const mermaidId = kebabCase(`mermaid-${id}`);
    const { data, isLoading } = useMermaid(children, {
      id: mermaidId,
      theme: isDefaultTheme ? undefined : customTheme,
    });
    const [blobUrl, setBlobUrl] = useState<string>();

    // 组件卸载时清理 Blob URL，避免内存泄漏
    useEffect(() => {
      return () => {
        if (blobUrl) URL.revokeObjectURL(blobUrl);
      };
    }, [blobUrl]);

    useEffect(() => {
      if (isLoading || !data) return;
      let finalSvgString = data;

      // 修复Firefox点击预览mermaid图时宽高为0导致不显示的异常
      if (navigator.userAgent.includes('Firefox')) {
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

      // // 创建Blob对象
      const svgBlob = new Blob([finalSvgString], { type: 'image/svg+xml' });
      // // 创建并保存Blob URL
      const url = URL.createObjectURL(svgBlob);
      setBlobUrl(url);
    }, [isLoading, data]);

    if (!blobUrl) return null;

    return (
      <Image
        alt={'mermaid'}
        maxHeight={480}
        objectFit={'contain'}
        preview={
          enablePanZoom
            ? {
                mask: false,
                styles: {
                  mask: {
                    background: background || theme.colorBgContainerSecondary,
                  },
                },
              }
            : false
        }
        ref={ref}
        src={blobUrl}
        style={{
          background: variant === 'filled' ? background : undefined,
          borderRadius: 0,
          margin: 0,
          padding: variant === 'borderless' ? 0 : 16,
          position: 'relative',
        }}
        variant={'borderless'}
      />
    );
  },
);

SyntaxMermaid.displayName = 'SyntaxMermaid';

export default SyntaxMermaid;
