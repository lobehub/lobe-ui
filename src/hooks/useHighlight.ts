'use client';

import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import { useTheme, useThemeMode } from 'antd-style';
import { useMemo } from 'react';
import type { BuiltinTheme } from 'shiki';
import useSWR, { SWRResponse } from 'swr';
import { Md5 } from 'ts-md5';

import { languages } from '@/Highlighter/const';

export const FALLBACK_LANG = 'txt';

// 应用级缓存，避免重复计算
const MD5_LENGTH_THRESHOLD = 10_000; // 超过该长度使用异步MD5

// 颜色替换映射类型
type ColorReplacements = {
  [themeName: string]: {
    [color: string]: string;
  };
};

// 懒加载 shiki
const loadShiki = () => import('shiki').then((mod) => mod.codeToHtml);
const shikiPromise = loadShiki();

// 辅助函数：安全的HTML转义
const escapeHtml = (str: string): string => {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
};

// 主高亮组件
export const useHighlight = (
  text: string,
  {
    language,
    enableTransformer,
    theme: builtinTheme,
  }: { enableTransformer?: boolean; language: string; theme?: BuiltinTheme },
): SWRResponse<string, Error> => {
  const { isDarkMode } = useThemeMode();
  const theme = useTheme();
  const lang = language.toLowerCase();

  // 匹配支持的语言
  const matchedLanguage = useMemo(
    () => (languages.includes(lang as any) ? lang : FALLBACK_LANG),
    [lang],
  );

  // 优化transformer创建
  const transformers = useMemo(() => {
    if (!enableTransformer) return;
    return [
      transformerNotationDiff(),
      transformerNotationHighlight(),
      transformerNotationWordHighlight(),
      transformerNotationFocus(),
      transformerNotationErrorLevel(),
    ];
  }, [enableTransformer]);

  // 优化颜色替换配置
  const colorReplacements = useMemo(
    (): ColorReplacements => ({
      'slack-dark': {
        '#4ec9b0': theme.yellow,
        '#569cd6': theme.colorError,
        '#6a9955': theme.gray,
        '#9cdcfe': theme.colorText,
        '#b5cea8': theme.purple10,
        '#c586c0': theme.colorInfo,
        '#ce9178': theme.colorSuccess,
        '#dcdcaa': theme.colorWarning,
        '#e6e6e6': theme.colorText,
      },
      'slack-ochin': {
        '#002339': theme.colorText,
        '#0444ac': theme.geekblue,
        '#0991b6': theme.colorError,
        '#174781': theme.purple10,
        '#2f86d2': theme.colorText,
        '#357b42': theme.gray,
        '#7b30d0': theme.colorInfo,
        '#7eb233': theme.colorWarningTextActive,
        '#a44185': theme.colorSuccess,
        '#dc3eb7': theme.yellow11,
      },
    }),
    [theme],
  );

  // 构建缓存键
  const cacheKey = useMemo((): string | null => {
    // 长文本使用 hash
    const hash = text.length < MD5_LENGTH_THRESHOLD ? text : Md5.hashStr(text);
    return [matchedLanguage, builtinTheme || (isDarkMode ? 'd' : 'l'), hash]
      .filter(Boolean)
      .join('-');
  }, [text, matchedLanguage, isDarkMode, builtinTheme]);

  // 使用SWR获取高亮HTML
  return useSWR(
    cacheKey,
    async (): Promise<string> => {
      try {
        // 尝试完整渲染
        const codeToHtml = await shikiPromise;
        const html = await codeToHtml(text, {
          colorReplacements: builtinTheme ? undefined : colorReplacements,
          lang: matchedLanguage,
          theme: builtinTheme || (isDarkMode ? 'slack-dark' : 'slack-ochin'),
          transformers,
        });

        return html;
      } catch (error) {
        console.error('高级渲染失败:', error);

        try {
          // 尝试简单渲染 (不使用转换器)
          const codeToHtml = await shikiPromise;
          const html = await codeToHtml(text, {
            lang: matchedLanguage,
            theme: isDarkMode ? 'dark-plus' : 'light-plus',
          });
          return html;
        } catch {
          // 最终降级到纯文本
          const fallbackHtml = `<pre class="fallback"><code>${escapeHtml(text)}</code></pre>`;
          return fallbackHtml;
        }
      }
    },
    {
      dedupingInterval: 3000, // 3秒内相同请求只执行一次
      errorRetryCount: 2, // 最多重试2次
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
};

export { escapeHtml, loadShiki, MD5_LENGTH_THRESHOLD, shikiPromise };
