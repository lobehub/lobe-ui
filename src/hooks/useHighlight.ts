import { type Highlighter, type HighlighterCoreOptions, getHighlighter } from 'shikiji';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

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
  'python',
  'py',
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
   * @title Convert code to HTML string
   * @param text - The code text
   * @param language - The language of the code
   * @param isDarkMode - Whether it's in dark mode or not
   * @returns HTML string
   */
  codeToHtml: (text: string, language: string, isDarkMode: boolean) => string;
  /**
   * @title Highlighter object
   */
  highlighter?: Highlighter;
  /**
   * @title Initialize the highlighter object
   * @returns Initialization promise object
   */
  initHighlighter: (options?: HighlighterCoreOptions) => Promise<void>;
}

export const useHighlight = createWithEqualityFn<Store>(
  (set, get) => ({
    codeToHtml: (text, language, isDarkMode) => {
      const { highlighter } = get();

      if (!highlighter) return '';

      try {
        return highlighter?.codeToHtml(text, {
          lang: language,
          theme: isDarkMode ? 'dark' : 'light',
        });
      } catch {
        return text;
      }
    },
    highlighter: undefined,

    initHighlighter: async (options) => {
      if (!get().highlighter) {
        const highlighter = await getHighlighter({
          langs: options?.langs || (languageMap as any),
          themes: options?.themes || [themeConfig(true), themeConfig(false)],
        });

        set({ highlighter });
      }
    },
  }),
  shallow,
);
