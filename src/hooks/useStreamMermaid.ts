'use client';

import { useTheme } from 'antd-style';
import type { MermaidConfig } from 'mermaid/dist/config.type';
import { useEffect, useMemo, useRef, useState } from 'react';

import { createMermaidConfig, loadMermaid } from './useMermaid';

/**
 * 流式 Mermaid 渲染 - 支持内容逐步更新
 */
export const useStreamMermaid = (
  content: string,
  {
    enabled = true,
    id,
    theme: customTheme,
  }: {
    enabled?: boolean;
    id: string;
    theme?: MermaidConfig['theme'];
  },
): string => {
  const theme = useTheme();
  const [data, setData] = useState<string>('');
  const previousContentRef = useRef<string>('');
  const latestContentRef = useRef(content);
  const renderTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // 提取主题相关配置到 useMemo 中
  const mermaidConfig = useMemo(
    () => createMermaidConfig(theme, customTheme),
    [
      theme.fontFamilyCode,
      theme.isDarkMode,
      theme.colorTextDescription,
      theme.fontFamily,
      theme.colorTextSecondary,
      theme.colorBgContainer,
      theme.colorInfoBg,
      theme.colorInfoText,
      theme.geekblue,
      theme.colorWarning,
      theme.colorSuccess,
      theme.colorError,
      theme.colorBorder,
      theme.colorInfoBorder,
      theme.colorSuccessBorder,
      theme.colorSuccessBg,
      theme.colorSuccessText,
      theme.colorText,
      customTheme,
    ],
  );

  // Update latest content ref
  useEffect(() => {
    latestContentRef.current = content;
  }, [content]);

  // Debounced rendering for streaming content
  useEffect(() => {
    if (!enabled) {
      setData('');
      previousContentRef.current = '';
      const timeoutId = renderTimeoutRef.current;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      return;
    }

    const currentContent = latestContentRef.current;

    // Skip if content hasn't changed
    if (currentContent === previousContentRef.current && data) {
      return;
    }

    // Clear previous timeout
    const timeoutId = renderTimeoutRef.current;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Debounce rendering for streaming content (wait 300ms after last change)
    renderTimeoutRef.current = setTimeout(async () => {
      const contentToRender = latestContentRef.current;

      // Skip if content changed during debounce
      if (contentToRender !== currentContent) {
        return;
      }

      try {
        const mermaidInstance = await loadMermaid();
        if (!mermaidInstance) return;

        // 验证语法
        const isValid = await mermaidInstance.parse(contentToRender);

        if (isValid) {
          // 初始化并渲染
          mermaidInstance.initialize(mermaidConfig);
          const { svg } = await mermaidInstance.render(id, contentToRender);

          // Only update if content hasn't changed during rendering
          if (latestContentRef.current === contentToRender) {
            setData(svg);
            previousContentRef.current = contentToRender;
          }
        }
      } catch (error_) {
        // Silently handle errors during streaming
        // Only log if this is the final content
        if (contentToRender === latestContentRef.current) {
          console.error('Mermaid 解析错误:', error_);
        }
      }
    }, 300);

    return () => {
      const timeoutId = renderTimeoutRef.current;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [enabled, content, id, mermaidConfig, data]);

  return data;
};
