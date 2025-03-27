import { useTheme } from 'antd-style';
import type { MermaidConfig } from 'mermaid/dist/config.type';
import { useEffect, useMemo, useState } from 'react';
import useSWR, { SWRResponse } from 'swr';
import { Md5 } from 'ts-md5';

// 缓存已验证的图表内容
const mermaidCache = new Map<string, boolean>();
const MD5_LENGTH_THRESHOLD = 10_000;

// 懒加载 mermaid 实例
const loadMermaid = () => {
  if (typeof window === 'undefined') return Promise.resolve(null);
  return import('mermaid').then((mod) => mod.default);
};
const mermaidPromise = loadMermaid();

/**
 * 验证并处理 Mermaid 图表内容
 */
export const useMermaid = (id: string, content: string): SWRResponse<string, Error> => {
  // 用于存储最近一次有效的内容
  const [validContent, setValidContent] = useState<string>('');

  // 为长内容生成哈希键
  const cacheKey = useMemo((): string => {
    const hash = content.length < MD5_LENGTH_THRESHOLD ? content : Md5.hashStr(content);
    return `mermaid-${id}-${hash}`;
  }, [content, id]);

  return useSWR(
    cacheKey,
    async (): Promise<string> => {
      // 检查缓存中是否已验证过
      if (mermaidCache.has(cacheKey)) return validContent;

      try {
        const mermaidInstance = await mermaidPromise;
        if (!mermaidInstance) return content;

        // 验证语法
        const isValid = await mermaidInstance.parse(content);

        if (isValid) {
          // 更新有效内容状态
          const { svg } = await mermaidInstance.render(id, content);
          setValidContent(svg);
          // 缓存验证结果
          mermaidCache.set(cacheKey, true);
          return svg;
        } else {
          throw new Error('Mermaid 语法无效');
        }
      } catch (error) {
        console.error('Mermaid 解析错误:', error);
        // 返回最近一次有效的内容，或空字符串
        return validContent || '';
      }
    },
    {
      dedupingInterval: 3000,
      errorRetryCount: 2,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
};

/**
 * 初始化 Mermaid 配置
 */
export const useMermaidInit = (): void => {
  const theme = useTheme();

  // 提取主题相关配置到 useMemo 中
  const mermaidConfig: MermaidConfig = useMemo(
    () => ({
      fontFamily: theme.fontFamilyCode,
      gantt: {
        useWidth: 1920,
      },
      securityLevel: 'loose',
      startOnLoad: false,
      theme: theme.isDarkMode ? 'dark' : 'neutral',
      themeVariables: {
        errorBkgColor: theme.colorTextDescription,
        errorTextColor: theme.colorTextDescription,
        fontFamily: theme.fontFamily,
        fontSize: 14,
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
    }),
    [theme.isDarkMode],
  );

  // 初始化 mermaid 配置
  useEffect(() => {
    const initMermaid = async () => {
      const mermaidInstance = await mermaidPromise;
      if (!mermaidInstance) return;
      mermaidInstance.initialize(mermaidConfig);
    };
    initMermaid();
  }, [mermaidConfig]);
};
