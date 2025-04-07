'use client';

import { useTheme } from 'antd-style';
import { kebabCase } from 'lodash-es';
import { forwardRef, useEffect, useId, useMemo, useState } from 'react';

import Image from '@/Image';
import { useMermaid } from '@/hooks/useMermaid';

import { mermaidThemes } from '../const';
import type { MermaidProps } from '../type';

export interface SyntaxMermaidProps {
  children: string;
  enablePanZoom?: MermaidProps['enablePanZoom'];
  theme?: MermaidProps['theme'];
  variant?: MermaidProps['variant'];
}

const SyntaxMermaid = forwardRef<HTMLDivElement, SyntaxMermaidProps>(
  ({ children, theme: customTheme, variant, enablePanZoom }, ref) => {
    const isDefaultTheme = customTheme === 'lobe-theme' || !customTheme;

    const background = useMemo(() => {
      if (isDefaultTheme) return;
      return mermaidThemes.find((item) => item.id === customTheme)?.background;
    }, [isDefaultTheme, customTheme]);

    const id = useId();
    const theme = useTheme();
    const mermaidId = kebabCase(`mermaid-${id}`);
    const { data } = useMermaid(children, {
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
      if (!data) return;
      // 创建Blob对象
      const svgBlob = new Blob([data], { type: 'image/svg+xml' });
      // 如果已有旧的URL，先释放它
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      // 创建并保存Blob URL
      const url = URL.createObjectURL(svgBlob);
      setBlobUrl(url);
    }, [data]);

    if (!data || !blobUrl) return null;

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
