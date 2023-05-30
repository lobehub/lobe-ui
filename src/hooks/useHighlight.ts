import { getHighlighter, Highlighter } from 'shiki-es';
import { create } from 'zustand';

import { themeConfig } from '@/Highlighter/theme';

export const languageMap = [
  'javascript',
  'js',
  'jsx',
  'json',
  'markdown',
  'md',
  'less',
  'css',
  'typescript',
  'ts',
  'tsx',
  'diff',
  'bash',
] as const;

/**
 * @title 代码高亮的存储对象
 */
interface Store {
  /**
   * @title 将代码转化为 HTML 字符串
   * @param text - 代码文本
   * @param language - 代码语言
   * @param isDarkMode - 是否为暗黑模式
   * @returns HTML 字符串
   */
  codeToHtml: (text: string, language: string, isDarkMode: boolean) => string;
  /**
   * @title 高亮器对象
   */
  highlighter?: Highlighter;
  /**
   * @title 初始化高亮器对象
   * @returns 初始化 Promise 对象
   */
  initHighlighter: () => Promise<void>;
}

export const useHighlight = create<Store>((set, get) => ({
  highlighter: undefined,
  initHighlighter: async () => {
    if (!get().highlighter) {
      const highlighter = await getHighlighter({
        langs: languageMap as any,
        themes: [themeConfig(true), themeConfig(false)],
      });
      set({ highlighter });
    }
  },

  codeToHtml: (text, language, isDarkMode) => {
    const { highlighter } = get();
    if (!highlighter) return '';

    try {
      return highlighter?.codeToHtml(text, {
        lang: language,
        theme: isDarkMode ? 'dark' : 'light',
      });
    } catch (e) {
      return text;
    }
  },
}));
