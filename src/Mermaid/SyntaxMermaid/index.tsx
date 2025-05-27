'use client';

import { useTheme } from 'antd-style';
import { kebabCase } from 'lodash-es';
import { memo, useEffect, useId, useMemo, useRef, useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import Image from '@/Image';
import { useMermaid } from '@/hooks/useMermaid';

import { mermaidThemes } from '../const';
import type { SyntaxMermaidProps } from '../type';

const SyntaxMermaid = memo<SyntaxMermaidProps>(
  ({ ref, children, theme: customTheme, variant, enablePanZoom, enableNonPreviewWheelZoom }) => {
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
    const [isDragging, setIsDragging] = useState(false);
    const [shouldPreventPreview, setShouldPreventPreview] = useState(false);
    const containerRef = useRef(null);

    // 组件卸载时清理 Blob URL，避免内存泄漏
    useEffect(() => {
      return () => {
        if (blobUrl) URL.revokeObjectURL(blobUrl);
      };
    }, [blobUrl]);

    useEffect(() => {
      if (isLoading || !data) return;
      // 创建Blob对象
      const svgBlob = new Blob([data], { type: 'image/svg+xml' });
      // 创建并保存Blob URL
      const url = URL.createObjectURL(svgBlob);
      setBlobUrl(url);
    }, [isLoading, data]);

    const handlePanningStart = () => {
      setIsDragging(true);
      setShouldPreventPreview(false);
    };

    const handlePanning = () => {
      if (isDragging) {
        setShouldPreventPreview(true);
      }
    };

    const handlePanningStop = () => {
      setIsDragging(false);
      setTimeout(() => {
        setShouldPreventPreview(false);
      }, 100);
    };

    if (!blobUrl) return null;

    return (
      <div
        ref={containerRef}
        style={{
          background: variant === 'filled' ? background : undefined,
          borderRadius: 0,
          cursor: 'grab',
          margin: 0,
          maxHeight: 480,
          overflow: 'hidden',
          padding: variant === 'borderless' ? 0 : 16,
          position: 'relative',
        }}
      >
        <TransformWrapper
          centerOnInit={true}
          initialScale={1}
          maxScale={8}
          minScale={0.1}
          onPanning={handlePanning}
          onPanningStart={handlePanningStart}
          onPanningStop={handlePanningStop}
          panning={{
            disabled: false,
            velocityDisabled: false,
          }}
          wheel={{
            step: 0.1,
            touchPadDisabled: !enableNonPreviewWheelZoom,
            wheelDisabled: !enableNonPreviewWheelZoom,
          }}
        >
          <TransformComponent
            contentStyle={{ display: 'block', height: '100%', width: '100%' }}
            wrapperStyle={{ display: 'block', height: '100%', width: '100%' }}
          >
            <Image
              alt={'mermaid'}
              maxHeight={480}
              objectFit={'contain'}
              preview={
                enablePanZoom && !shouldPreventPreview
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
          </TransformComponent>
        </TransformWrapper>
      </div>
    );
  },
);

SyntaxMermaid.displayName = 'SyntaxMermaid';

export default SyntaxMermaid;
