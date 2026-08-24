import { describe, expect, it } from 'vitest';

import { findOpenFenceLanguage } from './fenceState';

describe('findOpenFenceLanguage', () => {
  it('returns null for plain prose', () => {
    expect(findOpenFenceLanguage('Hello there')).toBe(null);
    expect(findOpenFenceLanguage('')).toBe(null);
  });

  it('returns the language while a fence is open', () => {
    expect(findOpenFenceLanguage('```html\n<!DOCTYPE')).toBe('html');
    expect(findOpenFenceLanguage('intro\n\n```html\n<html>')).toBe('html');
  });

  it('returns null when the fence has closed', () => {
    expect(findOpenFenceLanguage('```html\n<p>x</p>\n```')).toBe(null);
    expect(findOpenFenceLanguage('```html\n<p>x</p>\n```\ntrailing')).toBe(null);
  });

  it('lowercases the language', () => {
    expect(findOpenFenceLanguage('```HTML\n<!DOCTYPE')).toBe('html');
    expect(findOpenFenceLanguage('```JavaScript\nconst x')).toBe('javascript');
  });

  it('handles a bare ``` open fence (no language)', () => {
    expect(findOpenFenceLanguage('```\nplain code')).toBe('');
  });

  it('tracks alternating open/close correctly', () => {
    // 3 fences: open html, close, open js — last is js, open
    expect(findOpenFenceLanguage('```html\nx\n```\n```js\ny')).toBe('js');
  });

  it('ignores ``` not at line start', () => {
    // backticks in the middle of a line are inline code, not a fence
    expect(findOpenFenceLanguage('inline `code` and ``` not-a-fence')).toBe(null);
  });

  it('returns language while streaming inside the fence', () => {
    // Simulate progressive arrival
    const stages = [
      '```',
      '```html',
      '```html\n',
      '```html\n<!DOC',
      '```html\n<!DOCTYPE html>\n<html>',
    ];
    for (const s of stages.slice(1)) {
      // First stage has empty language since newline hasn't arrived
      const result = findOpenFenceLanguage(s);
      expect(result === 'html' || result === '').toBe(true);
    }
  });
});
