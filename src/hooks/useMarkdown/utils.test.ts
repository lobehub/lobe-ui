import { describe, expect, it, vi } from 'vitest';

import {
  addToCache,
  contentCache,
  createPlugins,
  fixMarkdownBold,
  preprocessContent,
  transformCitations,
} from './utils';

describe('fixMarkdownBold', () => {
  it('should add space after closing bold markers if needed', () => {
    expect(fixMarkdownBold('**123：**456')).toBe('**123：** 456');
    expect(fixMarkdownBold('**bold text**')).toBe('**bold text**');
    expect(fixMarkdownBold('**bold text** and more')).toBe('**bold text** and more');
    expect(fixMarkdownBold('**123**456')).toBe('**123**456');
  });

  it('should handle multiple bold sections', () => {
    expect(fixMarkdownBold('**bold1** **bold2**')).toBe('**bold1** **bold2**');
    expect(fixMarkdownBold('**123：**456**789:**123')).toBe('**123：** 456**789:** 123');
  });

  it('should not affect text without bold markers', () => {
    expect(fixMarkdownBold('normal text')).toBe('normal text');
  });

  it('should not affect empty strings', () => {
    expect(fixMarkdownBold('')).toBe('');
  });

  it('should handle odd number of asterisks', () => {
    expect(fixMarkdownBold('*text* *')).toBe('*text* *');
  });

  it('should handle asterisks within words', () => {
    expect(fixMarkdownBold('t*e*st')).toBe('t*e*st');
  });

  it('should ignore bold markers inside inline code', () => {
    expect(fixMarkdownBold('This is `**not bold**`')).toBe('This is `**not bold**`');
    expect(fixMarkdownBold('`**code**` and **bold**')).toBe('`**code**` and **bold**');
    expect(fixMarkdownBold('`**` and **bold**')).toBe('`**` and **bold**');
  });

  it('should ignore bold markers inside code blocks', () => {
    const codeBlock = `
    \`\`\`
    **123：**456**789:**123
    \`\`\`
    `;
    expect(fixMarkdownBold(codeBlock)).toBe(codeBlock);
  });

  it('should handle text with mixed content in code blocks', () => {
    const text = `
    **bold text**
    \`\`\`
    n**0.5
    \`\`\`
    More **bold text**
    `;
    const expected = `
    **bold text**
    \`\`\`
    n**0.5
    \`\`\`
    More **bold text**
    `;
    expect(fixMarkdownBold(text)).toBe(expected);
  });

  it('should not have a space after a bold character other than symbols', () => {
    expect(fixMarkdownBold('你**我**他')).toBe('你**我**他');
    expect(fixMarkdownBold('你**我：**他')).toBe('你**我：** 他');
    expect(fixMarkdownBold('你**我:**他')).toBe('你**我:** 他');
    // expect(fixMarkdownBold('你**我: **他')).toBe('你**我:** 他'); // TODO: Remove trailing spaces inside bold sections first, then add space after **
  });
});

describe('contentCache and addToCache', () => {
  beforeEach(() => {
    // Clear the cache before each test
    contentCache.clear();
  });

  it('should add items to the cache', () => {
    addToCache('key1', 'value1');
    expect(contentCache.get('key1')).toBe('value1');
  });

  it('should remove oldest item when cache size limit is reached', () => {
    // Mock the cache size constant to a smaller value for testing
    const testCacheSize = 3;

    // Add items up to the cache size limit
    for (let i = 0; i < testCacheSize; i++) {
      addToCache(`key${i}`, `value${i}`);
    }

    // Verify all items are in the cache
    for (let i = 0; i < testCacheSize; i++) {
      expect(contentCache.get(`key${i}`)).toBe(`value${i}`);
    }

    // Add one more item, which should cause the oldest item to be removed
    addToCache('keyNew', 'valueNew');

    // The oldest item should be removed
    expect(contentCache.get('key0')).toBeUndefined();

    // The new item should be in the cache
    expect(contentCache.get('keyNew')).toBe('valueNew');

    // Other items should still be in the cache
    for (let i = 1; i < testCacheSize; i++) {
      expect(contentCache.get(`key${i}`)).toBe(`value${i}`);
    }
  });
});

describe('createPlugins', () => {
  it('should create rehype and remark plugin lists based on options', () => {
    const { rehypePluginsList, remarkPluginsList } = createPlugins({
      allowHtml: true,
      animated: true,
      enableCustomFootnotes: true,
      enableLatex: true,
      isChatMode: true,
    });

    // Check that plugin lists are created and contain items
    expect(Array.isArray(rehypePluginsList)).toBe(true);
    expect(Array.isArray(remarkPluginsList)).toBe(true);
    expect(rehypePluginsList.length).toBeGreaterThan(0);
    expect(remarkPluginsList.length).toBeGreaterThan(0);
  });

  it('should include only specified plugins', () => {
    const { rehypePluginsList, remarkPluginsList } = createPlugins({
      allowHtml: false,
      animated: false,
      enableCustomFootnotes: false,
      enableLatex: false,
      isChatMode: false,
    });

    // When all options are false, base plugins should still be included
    expect(rehypePluginsList.length).toBe(0);
    expect(remarkPluginsList.length).toBe(1); // remarkGfm is always included
  });

  it('should handle custom plugins properly', () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const customRehypePlugin = () => (tree: any) => tree;
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const customRemarkPlugin = () => (tree: any) => tree;

    const { rehypePluginsList, remarkPluginsList } = createPlugins({
      isChatMode: true,
      rehypePlugins: customRehypePlugin,
      remarkPlugins: customRemarkPlugin,
    });

    // Custom plugins should be included
    expect(rehypePluginsList).toContain(customRehypePlugin);
    expect(remarkPluginsList).toContain(customRemarkPlugin);
  });
});

describe('transformCitations', () => {
  it('should transform citation references to markdown links', () => {
    const content = 'This is a reference [1] and another [2].';
    const expected =
      'This is a reference [#citation-1](citation-1) and another [#citation-2](citation-2).';
    expect(transformCitations(content, 2)).toBe(expected);
  });

  it('should handle multiple consecutive citations', () => {
    const content = 'Multiple citations [1][2][3].';
    const expected =
      'Multiple citations [#citation-1](citation-1) [#citation-2](citation-2) [#citation-3](citation-3).';
    expect(transformCitations(content, 3)).toBe(expected);
  });

  it('should not transform citations beyond the specified length', () => {
    const content = 'References [1], [2], [3], and [4].';
    const expected =
      'References [#citation-1](citation-1), [#citation-2](citation-2), [3], and [4].';
    expect(transformCitations(content, 2)).toBe(expected);
  });

  it('should return the original content if length is 0', () => {
    const content = 'This is a reference [1].';
    expect(transformCitations(content, 0)).toBe(content);
  });

  it('should not transform text that looks like citations but is not', () => {
    const content = 'Example array[1] access.';
    expect(transformCitations(content, 2)).toBe(content);
  });
});

describe('preprocessContent', () => {
  // Mock the imported preprocessLaTeX function
  vi.mock('@/hooks/useMarkdown/latex', () => ({
    preprocessLaTeX: vi.fn((text) => `LaTeX processed: ${text}`),
  }));

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should apply LaTeX preprocessing when enableLatex is true', () => {
    const content = 'LaTeX content';
    const result = preprocessContent(content, { enableLatex: true });

    // Expect LaTeX processing followed by bold fixing
    expect(result).toBe(fixMarkdownBold(`LaTeX processed: ${content}`));
  });

  it('should apply citations transformation when enableCustomFootnotes is true', () => {
    const content = 'Citation [1] reference';
    const result = preprocessContent(content, {
      citationsLength: 1,
      enableCustomFootnotes: true,
    });

    // Expect citation transformation followed by bold fixing
    expect(result).toBe(fixMarkdownBold('Citation [#citation-1](citation-1) reference'));
  });

  it('should apply multiple transformations when multiple options are enabled', () => {
    const content = 'LaTeX with citation [1]';
    const result = preprocessContent(content, {
      citationsLength: 1,
      enableCustomFootnotes: true,
      enableLatex: true,
    });

    // Expect LaTeX processing, then citation transformation, then bold fixing
    expect(result).toBe(
      fixMarkdownBold('LaTeX processed: LaTeX with citation [#citation-1](citation-1)'),
    );
  });

  it('should only apply bold fixing when no other options are enabled', () => {
    const content = '**Bold** text';
    const result = preprocessContent(content);

    // Expect only bold fixing
    expect(result).toBe(fixMarkdownBold(content));
  });
});
