import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import type { Pluggable } from 'unified';

import { animatedPlugin } from '@/Markdown/plugins/animated';
import { rehypeFootnoteLinks, remarkCustomFootnotes } from '@/Markdown/plugins/footnote';
import { rehypeKatexDir } from '@/Markdown/plugins/katexDir';
import { preprocessLaTeX } from '@/hooks/useMarkdown/latex';

// 使用普通 Map 代替 WeakMap，并限制缓存大小
const CACHE_SIZE = 50;
export const contentCache = new Map<string, string>();

// 添加内容到缓存时，保持缓存大小不超过限制
export const addToCache = (key: string, value: string) => {
  if (contentCache.size >= CACHE_SIZE) {
    // 移除最早加入的缓存项
    const firstKey = contentCache.keys().next().value;
    if (firstKey) contentCache.delete(firstKey);
  }
  contentCache.set(key, value);
};

// 使用工厂函数处理插件，减少组件中的逻辑负担
export const createPlugins = (props: {
  allowHtml?: boolean;
  animated?: boolean;
  enableCustomFootnotes?: boolean;
  enableLatex?: boolean;
  isChatMode: boolean;
  rehypePlugins?: Pluggable | Pluggable[];
  remarkPlugins?: Pluggable | Pluggable[];
  remarkPluginsAhead?: Pluggable | Pluggable[];
}) => {
  const {
    allowHtml,
    enableLatex,
    enableCustomFootnotes,
    isChatMode,
    rehypePlugins,
    remarkPlugins,
    remarkPluginsAhead,
    animated,
  } = props;

  // 预处理插件数组
  const normalizedRehypePlugins = Array.isArray(rehypePlugins)
    ? rehypePlugins
    : rehypePlugins
      ? [rehypePlugins]
      : [];

  const normalizedRemarkPlugins = Array.isArray(remarkPlugins)
    ? remarkPlugins
    : remarkPlugins
      ? [remarkPlugins]
      : [];

  const normalizedRemarkPluginsAhead = Array.isArray(remarkPluginsAhead)
    ? remarkPluginsAhead
    : remarkPluginsAhead
      ? [remarkPluginsAhead]
      : [];

  // 创建 rehype 插件列表
  const rehypePluginsList = [
    allowHtml && rehypeRaw,
    enableLatex && rehypeKatex,
    enableLatex && rehypeKatexDir,
    enableCustomFootnotes && rehypeFootnoteLinks,
    animated && animatedPlugin,
    ...normalizedRehypePlugins,
  ].filter(Boolean) as Pluggable[];

  // 创建 remark 插件列表
  const remarkPluginsList = [
    ...normalizedRemarkPluginsAhead,
    [remarkGfm, { singleTilde: false }],
    enableCustomFootnotes && remarkCustomFootnotes,
    enableLatex && remarkMath,
    isChatMode && remarkBreaks,
    ...normalizedRemarkPlugins,
  ].filter(Boolean) as Pluggable[];

  return {
    rehypePluginsList,
    remarkPluginsList,
  };
};

export function fixMarkdownBold(text: string): string {
  let count = 0;
  let count2 = 0;
  let result = '';
  let inCodeBlock = false;
  let inInlineCode = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (text.slice(i, i + 3) === '```') {
      inCodeBlock = !inCodeBlock;
      result += '```';
      i += 2;
      continue;
    }
    if (char === '`') {
      inInlineCode = !inInlineCode;
      result += '`';
      continue;
    }

    if (char === '*' && !inInlineCode && !inCodeBlock) {
      count++;
      if (count === 2) {
        count2++;
      }
      if (count > 2) {
        result += char;
        continue;
      }
      if (count === 2 && count2 % 2 === 0) {
        const prevChar = i > 0 ? text[i - 2] : '';
        const isPrevCharSymbol = /[\p{P}\p{S}]/u.test(prevChar);

        result += i + 1 < text.length && text[i + 1] !== ' ' && isPrevCharSymbol ? '* ' : '*';
      } else {
        result += '*';
      }
    } else {
      result += char;
      count = 0;
    }
  }
  return result;
}

export const transformCitations = (rawContent: string, length: number = 0) => {
  if (length === 0) return rawContent;

  // 生成动态正则表达式模式
  const idx = Array.from({ length })
    .fill('')
    .map((_, index) => index + 1);

  const pattern = new RegExp(`\\[(${idx.join('|')})\\]`, 'g');

  return rawContent
    .replaceAll(pattern, (match, id) => `[#citation-${id}](citation-${id})`)
    .replaceAll('][', '] [');
};

export const preprocessContent = (
  str: string,
  {
    enableCustomFootnotes,
    enableLatex,
    citationsLength,
  }: {
    citationsLength?: number;
    enableCustomFootnotes?: boolean;
    enableLatex?: boolean;
  } = {},
) => {
  let content = str;
  // 处理LaTeX公式
  if (enableLatex) {
    content = preprocessLaTeX(content);
  }

  // 处理自定义脚注
  if (enableCustomFootnotes) {
    content = transformCitations(content, citationsLength);
  }

  return fixMarkdownBold(content);
};
