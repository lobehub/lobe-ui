import { describe, expect, it } from 'vitest';

import { fixMarkdownEmphasisSpacing } from './fixMarkdownEmphasisSpacing';

describe('fixMarkdownEmphasisSpacing', () => {
  it('should add space after closing markers if needed', () => {
    expect(fixMarkdownEmphasisSpacing('**123：**456')).toBe('**123：** 456');
    expect(fixMarkdownEmphasisSpacing('**bold text**')).toBe('**bold text**');
    expect(fixMarkdownEmphasisSpacing('**bold text** and more')).toBe('**bold text** and more');
    expect(fixMarkdownEmphasisSpacing('**123**456')).toBe('**123**456');
  });

  it('should handle italic markers (*xx*)', () => {
    expect(fixMarkdownEmphasisSpacing('*123：*456')).toBe('*123：* 456');
    expect(fixMarkdownEmphasisSpacing('*italic text*')).toBe('*italic text*');
    expect(fixMarkdownEmphasisSpacing('*italic text* and more')).toBe('*italic text* and more');
    expect(fixMarkdownEmphasisSpacing('*123*456')).toBe('*123*456');
  });

  it('should handle bold markers (__xx__)', () => {
    expect(fixMarkdownEmphasisSpacing('__123：__456')).toBe('__123：__ 456');
    expect(fixMarkdownEmphasisSpacing('__bold text__')).toBe('__bold text__');
    expect(fixMarkdownEmphasisSpacing('__bold text__ and more')).toBe('__bold text__ and more');
    expect(fixMarkdownEmphasisSpacing('__123__456')).toBe('__123__456');
  });

  it('should handle italic markers (_xx_)', () => {
    expect(fixMarkdownEmphasisSpacing('_123：_456')).toBe('_123：_ 456');
    expect(fixMarkdownEmphasisSpacing('_italic text_')).toBe('_italic text_');
    expect(fixMarkdownEmphasisSpacing('_italic text_ and more')).toBe('_italic text_ and more');
    expect(fixMarkdownEmphasisSpacing('_123_456')).toBe('_123_456');
  });

  it('should handle strikethrough markers (~~xx~~)', () => {
    expect(fixMarkdownEmphasisSpacing('~~123：~~456')).toBe('~~123：~~ 456');
    expect(fixMarkdownEmphasisSpacing('~~strikethrough text~~')).toBe('~~strikethrough text~~');
    expect(fixMarkdownEmphasisSpacing('~~strikethrough text~~ and more')).toBe(
      '~~strikethrough text~~ and more',
    );
    expect(fixMarkdownEmphasisSpacing('~~123~~456')).toBe('~~123~~456');
  });

  it('should handle multiple sections with different emphasis types', () => {
    expect(fixMarkdownEmphasisSpacing('**bold1** **bold2**')).toBe('**bold1** **bold2**');
    expect(fixMarkdownEmphasisSpacing('**123：**456**789:**123')).toBe('**123：** 456**789:** 123');
    expect(fixMarkdownEmphasisSpacing('*italic1* __bold2__ ~~strike3~~')).toBe(
      '*italic1* __bold2__ ~~strike3~~',
    );
    expect(fixMarkdownEmphasisSpacing('*123：*456__789：__123~~000：~~456')).toBe(
      '*123：* 456__789：__ 123~~000：~~ 456',
    );
  });

  it('should handle mixed emphasis types in sequence', () => {
    // These should preserve existing spaces
    expect(fixMarkdownEmphasisSpacing('**bold** then *italic*')).toBe('**bold** then *italic*');
    expect(fixMarkdownEmphasisSpacing('__bold__ then _italic_')).toBe('__bold__ then _italic_');
    expect(fixMarkdownEmphasisSpacing('~~strike~~ then **bold**')).toBe('~~strike~~ then **bold**');
    // Test cases where no space is needed (no symbols/punctuation)
    expect(fixMarkdownEmphasisSpacing('**bold**then*italic*')).toBe('**bold**then*italic*');
    expect(fixMarkdownEmphasisSpacing('text**bold**then*italic*text')).toBe(
      'text**bold**then*italic*text',
    );
  });

  it('should not affect text without bold markers', () => {
    expect(fixMarkdownEmphasisSpacing('normal text')).toBe('normal text');
  });

  it('should not affect empty strings', () => {
    expect(fixMarkdownEmphasisSpacing('')).toBe('');
  });

  it('should handle odd number of asterisks', () => {
    expect(fixMarkdownEmphasisSpacing('*text* *')).toBe('*text* *');
  });

  it('should handle asterisks within words', () => {
    expect(fixMarkdownEmphasisSpacing('t*e*st')).toBe('t*e*st');
  });

  it('should ignore bold markers inside inline code', () => {
    expect(fixMarkdownEmphasisSpacing('This is `**not bold**`')).toBe('This is `**not bold**`');
    expect(fixMarkdownEmphasisSpacing('`**code**` and **bold**')).toBe('`**code**` and **bold**');
    expect(fixMarkdownEmphasisSpacing('`**` and **bold**')).toBe('`**` and **bold**');
  });

  it('should ignore bold markers inside code blocks', () => {
    const codeBlock = `
    \`\`\`
    **123：**456**789:**123
    \`\`\`
    `;
    expect(fixMarkdownEmphasisSpacing(codeBlock)).toBe(codeBlock);
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
    expect(fixMarkdownEmphasisSpacing(text)).toBe(expected);
  });

  it('should not have a space after emphasis when not followed by symbols', () => {
    // Test ** (bold)
    expect(fixMarkdownEmphasisSpacing('你**我**他')).toBe('你**我**他');
    expect(fixMarkdownEmphasisSpacing('你**我：**他')).toBe('你**我：** 他');
    expect(fixMarkdownEmphasisSpacing('你**我:**他')).toBe('你**我:** 他');
    expect(fixMarkdownEmphasisSpacing('你**我: **他')).toBe('你**我:** 他');

    // Test * (italic)
    expect(fixMarkdownEmphasisSpacing('你*我*他')).toBe('你*我*他');
    expect(fixMarkdownEmphasisSpacing('你*我：*他')).toBe('你*我：* 他');
    expect(fixMarkdownEmphasisSpacing('你*我:*他')).toBe('你*我:* 他');

    // Test __ (bold)
    expect(fixMarkdownEmphasisSpacing('你__我__他')).toBe('你__我__他');
    expect(fixMarkdownEmphasisSpacing('你__我：__他')).toBe('你__我：__ 他');
    expect(fixMarkdownEmphasisSpacing('你__我:__他')).toBe('你__我:__ 他');

    // Test _ (italic)
    expect(fixMarkdownEmphasisSpacing('你_我_他')).toBe('你_我_他');
    expect(fixMarkdownEmphasisSpacing('你_我：_他')).toBe('你_我：_ 他');
    expect(fixMarkdownEmphasisSpacing('你_我:_他')).toBe('你_我:_ 他');

    // Test ~~ (strikethrough)
    expect(fixMarkdownEmphasisSpacing('你~~我~~他')).toBe('你~~我~~他');
    expect(fixMarkdownEmphasisSpacing('你~~我：~~他')).toBe('你~~我：~~ 他');
    expect(fixMarkdownEmphasisSpacing('你~~我:~~他')).toBe('你~~我:~~ 他');
  });
});
