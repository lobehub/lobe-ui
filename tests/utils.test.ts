import { describe, expect, it } from 'vitest';

import {
  CACHE_SIZE,
  addToCache,
  contentCache,
  fixMarkdownBold,
  preprocessContent,
  transformCitations,
} from '../src/hooks/useMarkdown/utils';

describe('contentCache', () => {
  it('should be initialized as empty Map', () => {
    expect(contentCache.size).toBe(0);
  });
});

describe('addToCache', () => {
  it('should add content to cache', () => {
    addToCache('key1', 'value1');
    expect(contentCache.get('key1')).toBe('value1');
  });

  it('should remove oldest entry when cache is full', () => {
    contentCache.clear();

    // Fill cache to limit
    for (let i = 0; i < CACHE_SIZE; i++) {
      addToCache(`key${i}`, `value${i}`);
    }

    // Add one more entry
    addToCache('newKey', 'newValue');

    expect(contentCache.size).toBe(CACHE_SIZE);
    expect(contentCache.get('key0')).toBeUndefined();
    expect(contentCache.get('newKey')).toBe('newValue');
  });
});

describe('fixMarkdownBold', () => {
  it('should handle basic bold text', () => {
    expect(fixMarkdownBold('**bold**')).toBe('**bold**');
  });

  it('should add space after bold marker when followed by symbol', () => {
    expect(fixMarkdownBold('**bold**.')).toBe('**bold**.');
  });

  it('should not modify text in code blocks', () => {
    expect(fixMarkdownBold('```**bold**```')).toBe('```**bold**```');
  });

  it('should not modify text in inline code', () => {
    expect(fixMarkdownBold('`**bold**`')).toBe('`**bold**`');
  });

  it('should handle multiple asterisks', () => {
    expect(fixMarkdownBold('***bold***')).toBe('***bold***');
  });

  it('should handle multiple bold sections', () => {
    expect(fixMarkdownBold('**bold1** and **bold2**')).toBe('**bold1** and **bold2**');
  });

  it('should handle bold with special characters', () => {
    expect(fixMarkdownBold('**test**!')).toBe('**test**!');
    expect(fixMarkdownBold('**test**?')).toBe('**test**?');
  });
});

describe('transformCitations', () => {
  it('should return original content when length is 0', () => {
    expect(transformCitations('test [1]', 0)).toBe('test [1]');
  });

  it('should transform citation references to markdown links', () => {
    expect(transformCitations('test [1] text [2]', 2)).toBe(
      'test [#citation-1](citation-1) text [#citation-2](citation-2)',
    );
  });

  it('should not transform citations in code blocks', () => {
    expect(transformCitations('```[1]```', 1)).toBe('```[1]```');
  });

  it('should not transform citations in inline code', () => {
    expect(transformCitations('`[1]`', 1)).toBe('`[1]`');
  });

  it('should not transform citations in LaTeX blocks', () => {
    expect(transformCitations('$$[1]$$', 1)).toBe('$$[1]$$');
    expect(transformCitations('$[1]$', 1)).toBe('$[1]$');
  });

  it('should handle consecutive citations', () => {
    expect(transformCitations('[1][2]', 2)).toBe(
      '[#citation-1](citation-1)[#citation-2](citation-2)',
    );
  });

  it('should handle citations with surrounding text', () => {
    expect(transformCitations('before [1] after', 1)).toBe(
      'before [#citation-1](citation-1) after',
    );
  });

  it('should handle citations at start and end', () => {
    expect(transformCitations('[1] middle [2]', 2)).toBe(
      '[#citation-1](citation-1) middle [#citation-2](citation-2)',
    );
  });
});

describe('preprocessContent', () => {
  it('should process content with all options enabled', () => {
    const input = '**bold**, [1], $x^2$';
    const output = preprocessContent(input, {
      citationsLength: 1,
      enableCustomFootnotes: true,
      enableLatex: true,
    });
    expect(output).toContain('[#citation-1](citation-1)');
  });

  it('should process content with no options', () => {
    const input = '**bold**';
    expect(preprocessContent(input)).toBe('**bold**');
  });

  it('should only process LaTeX when enabled', () => {
    const input = '$x^2$';
    expect(preprocessContent(input, { enableLatex: true })).toBe('$x^2$');
  });

  it('should only process citations when enabled', () => {
    const input = '[1]';
    expect(
      preprocessContent(input, {
        citationsLength: 1,
        enableCustomFootnotes: true,
      }),
    ).toBe('[#citation-1](citation-1)');
  });

  it('should handle complex content with multiple features', () => {
    const input = '**bold** [1] $x^2$ ```code``` [2]';
    const output = preprocessContent(input, {
      citationsLength: 2,
      enableCustomFootnotes: true,
      enableLatex: true,
    });
    expect(output).toContain('[#citation-1](citation-1)');
    expect(output).toContain('[#citation-2](citation-2)');
    expect(output).toContain('```code```');
  });
});
