import { describe, expect, it } from 'vitest';
import { fixMarkdownBold } from './utils';

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
});
