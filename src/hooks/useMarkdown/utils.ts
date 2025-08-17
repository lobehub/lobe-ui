import { fixMarkdownEmphasisSpacing } from './fixMarkdownEmphasisSpacing';
import { preprocessLaTeX } from './latex';

// Cache configuration
const CACHE_SIZE = 50;

/**
 * Cache for storing processed content to avoid redundant processing
 */
export const contentCache = new Map<string, string>();

/**
 * Adds content to the cache with size limitation
 * Removes oldest entry if cache size limit is reached
 *
 * @param key The cache key
 * @param value The processed content to store
 */
export const addToCache = (key: string, value: string) => {
  if (contentCache.size >= CACHE_SIZE) {
    // Remove the oldest cache entry
    const firstKey = contentCache.keys().next().value;
    if (firstKey) contentCache.delete(firstKey);
  }
  contentCache.set(key, value);
};

/**
 * Transforms citation references in the format [n] to markdown links
 *
 * @param rawContent The markdown content with citation references
 * @param length The number of citations
 * @returns The content with citations transformed to markdown links
 */
export const transformCitations = (rawContent: string, length: number = 0) => {
  if (length === 0) return rawContent;

  // 生成引用索引
  const citationIndices = Array.from({ length })
    .fill('')
    .map((_, index) => index + 1);

  // 匹配所有潜在的引用
  const pattern = new RegExp(`\\[(${citationIndices.join('|')})\\]`, 'g');
  const matches: { id: string; index: number; length: number }[] = [];

  let match;
  while ((match = pattern.exec(rawContent)) !== null) {
    matches.push({
      id: match[1],
      index: match.index,
      length: match[0].length,
    });
  }

  // 识别所有需要排除的区域
  const excludedRanges: { end: number; start: number }[] = [];

  // 查找LaTeX块 $$...$$
  let latexBlockRegex = /\$\$([\S\s]*?)\$\$/g;
  while ((match = latexBlockRegex.exec(rawContent)) !== null) {
    excludedRanges.push({
      end: match.index + match[0].length - 1,
      start: match.index,
    });
  }

  // 查找行内LaTeX $...$
  let inlineLatexRegex = /\$([^$]*?)\$/g;
  while ((match = inlineLatexRegex.exec(rawContent)) !== null) {
    excludedRanges.push({
      end: match.index + match[0].length - 1,
      start: match.index,
    });
  }

  // 查找代码块 ```...```
  let codeBlockRegex = /```([\S\s]*?)```/g;
  while ((match = codeBlockRegex.exec(rawContent)) !== null) {
    excludedRanges.push({
      end: match.index + match[0].length - 1,
      start: match.index,
    });
  }

  // 查找行内代码 `...`
  let inlineCodeRegex = /`([^`]*?)`/g;
  while ((match = inlineCodeRegex.exec(rawContent)) !== null) {
    excludedRanges.push({
      end: match.index + match[0].length - 1,
      start: match.index,
    });
  }

  // 过滤掉在排除区域内的引用
  const validMatches = matches.filter((citation) => {
    return !excludedRanges.some(
      (range) => citation.index >= range.start && citation.index <= range.end,
    );
  });

  // 从后向前替换，避免索引变化问题
  let result = rawContent;
  for (let i = validMatches.length - 1; i >= 0; i--) {
    const citation = validMatches[i];
    const before = result.slice(0, Math.max(0, citation.index));
    const after = result.slice(Math.max(0, citation.index + citation.length));
    result = before + `[#citation-${citation.id}](citation-${citation.id})` + after;
  }

  // 处理连续引用
  return result.replaceAll('][', '] [');
};

/**
 * Preprocessing options for markdown content
 */
interface PreprocessOptions {
  citationsLength?: number;
  enableCustomFootnotes?: boolean;
  enableLatex?: boolean;
}

/**
 * Preprocesses markdown content by applying various transformations:
 * - LaTeX preprocessing
 * - Citation transformations
 * - Bold syntax fixing
 *
 * @param str The raw markdown content
 * @param options Preprocessing options
 * @returns The processed markdown content
 */
export const preprocessContent = (
  str: string,
  { enableCustomFootnotes, enableLatex, citationsLength }: PreprocessOptions = {},
) => {
  let content = str;

  // Process LaTeX expressions
  if (enableLatex) {
    content = preprocessLaTeX(content);
  }

  // Process custom footnotes/citations
  if (enableCustomFootnotes) {
    content = transformCitations(content, citationsLength);
  }

  return fixMarkdownEmphasisSpacing(content);
};
