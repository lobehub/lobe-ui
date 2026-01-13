'use client';

import { useTheme } from 'antd-style';
import type { MermaidConfig } from 'mermaid';
import { useEffect, useMemo, useState } from 'react';
import { Md5 } from 'ts-md5';

// 缓存已验证的图表内容
export const MD5_LENGTH_THRESHOLD = 10_000;

// Application-level cache for rendered Mermaid SVG
// Key: cacheKey string, Value: Promise<string>
const mermaidCache = new Map<string, Promise<string>>();

// Maximum cache size to prevent memory leaks
const MAX_CACHE_SIZE = 500;

// Clean up old cache entries when limit is reached
const cleanupCache = () => {
  if (mermaidCache.size > MAX_CACHE_SIZE) {
    // Remove oldest 20% of entries
    const entriesToRemove = Math.floor(MAX_CACHE_SIZE * 0.2);
    const keysToRemove = Array.from(mermaidCache.keys()).slice(0, entriesToRemove);
    for (const key of keysToRemove) {
      mermaidCache.delete(key);
    }
  }
};

// 懒加载 mermaid 实例
let mermaidPromise: Promise<typeof import('mermaid').default | null> | null = null;

export const loadMermaid = (): Promise<typeof import('mermaid').default | null> => {
  if (typeof window === 'undefined') return Promise.resolve(null);

  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((mod) => mod.default);
  }

  return mermaidPromise;
};

// Helper to create mermaid config
export const createMermaidConfig = (
  theme: ReturnType<typeof useTheme>,
  customTheme?: MermaidConfig['theme'],
): MermaidConfig => ({
  fontFamily: theme.fontFamilyCode,
  gantt: {
    useWidth: 1920,
  },
  securityLevel: 'loose',
  startOnLoad: false,
  theme: customTheme || (theme.isDarkMode ? 'dark' : 'neutral'),
  themeVariables: customTheme
    ? undefined
    : {
        errorBkgColor: theme.colorTextDescription,
        errorTextColor: theme.colorTextDescription,
        fontFamily: theme.fontFamily,
        lineColor: theme.colorTextSecondary,
        mainBkg: theme.colorBgContainer,
        noteBkgColor: theme.colorInfoBg,
        noteTextColor: theme.colorInfoText,
        pie1: theme.geekblue,
        pie2: theme.colorWarning,
        pie3: theme.colorSuccess,
        pie4: theme.colorError,
        primaryBorderColor: theme.colorBorder,
        primaryColor: theme.colorBgContainer,
        primaryTextColor: theme.colorText,
        secondaryBorderColor: theme.colorInfoBorder,
        secondaryColor: theme.colorInfoBg,
        secondaryTextColor: theme.colorInfoText,
        tertiaryBorderColor: theme.colorSuccessBorder,
        tertiaryColor: theme.colorSuccessBg,
        tertiaryTextColor: theme.colorSuccessText,
        textColor: theme.colorText,
      },
});

/**
 * 验证并处理 Mermaid 图表内容 - 优化版本（移除 SWR）
 */
export const useMermaid = (
  content: string,
  {
    id,
    theme: customTheme,
  }: {
    id: string;
    theme?: MermaidConfig['theme'];
  },
): string => {
  const theme = useTheme();
  const [data, setData] = useState<string>('');

  // 提取主题相关配置到 useMemo 中 - 只依赖实际使用的 theme 属性
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

  // 为长内容生成哈希键
  const cacheKey = useMemo((): string => {
    const hash = content.length < MD5_LENGTH_THRESHOLD ? content : Md5.hashStr(content);
    return [id, customTheme || (theme.isDarkMode ? 'd' : 'l'), hash].filter(Boolean).join('-');
  }, [content, id, theme.isDarkMode, customTheme]);

  useEffect(() => {
    // Check cache first
    const cachedPromise = mermaidCache.get(cacheKey);
    if (cachedPromise) {
      cachedPromise
        .then((svg) => {
          setData(svg);
        })
        .catch(() => {
          // Silently handle errors, fallback will be handled in the promise
        });
      return;
    }

    // Create new promise for rendering
    const renderPromise = (async (): Promise<string> => {
      try {
        const mermaidInstance = await loadMermaid();
        if (!mermaidInstance) return '';

        // 验证语法
        const isValid = await mermaidInstance.parse(content);

        if (isValid) {
          // 初始化并渲染
          mermaidInstance.initialize(mermaidConfig);
          const { svg } = await mermaidInstance.render(id, content);
          return svg;
        } else {
          throw new Error('Mermaid 语法无效');
        }
      } catch (error_) {
        console.error('Mermaid 解析错误:', error_);
        return '';
      }
    })();

    // Cache the promise
    mermaidCache.set(cacheKey, renderPromise);
    cleanupCache();

    // Handle promise result
    renderPromise
      .then((svg) => {
        // Only update if this is still the current cache key
        if (mermaidCache.get(cacheKey) === renderPromise) {
          setData(svg);
        }
      })
      .catch(() => {
        // Remove failed promise from cache
        if (mermaidCache.get(cacheKey) === renderPromise) {
          mermaidCache.delete(cacheKey);
        }
      });
  }, [cacheKey, content, id, mermaidConfig]);

  return data;
};
