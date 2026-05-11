import { describe, expect, it } from 'vitest';

import { containsScript, isFullHtmlDocument, isHtmlContentClosed } from './const';

describe('isFullHtmlDocument', () => {
  it('detects a doctype declaration regardless of case', () => {
    expect(isFullHtmlDocument('<!DOCTYPE html><html></html>')).toBe(true);
    expect(isFullHtmlDocument('<!doctype html><html></html>')).toBe(true);
  });

  it('detects an <html> root tag without doctype', () => {
    expect(isFullHtmlDocument('<html><body>hi</body></html>')).toBe(true);
  });

  it('treats fragments as not full', () => {
    expect(isFullHtmlDocument('<div>hi</div>')).toBe(false);
    expect(isFullHtmlDocument('<p>just a paragraph</p>')).toBe(false);
    expect(isFullHtmlDocument('')).toBe(false);
  });

  it('only inspects the head of the content', () => {
    const tailDoctype = '<div></div>'.repeat(200) + '<!DOCTYPE html>';
    expect(isFullHtmlDocument(tailDoctype)).toBe(false);
  });
});

describe('isHtmlContentClosed', () => {
  it('returns true once </html> appears near the end', () => {
    expect(isHtmlContentClosed('<html><body></body></html>')).toBe(true);
  });

  it('returns false while content is still streaming', () => {
    expect(isHtmlContentClosed('<html><body><div>partial')).toBe(false);
    expect(isHtmlContentClosed('')).toBe(false);
  });
});

describe('containsScript', () => {
  it('matches <script>, <script ...>, and case variants', () => {
    expect(containsScript('<script>alert(1)</script>')).toBe(true);
    expect(containsScript('<SCRIPT src="x.js"></SCRIPT>')).toBe(true);
    expect(containsScript('<Script type="module">')).toBe(true);
  });

  it('returns false for markup with no script tag', () => {
    expect(containsScript('<div><p>hi</p></div>')).toBe(false);
    expect(containsScript('<html><body>plain</body></html>')).toBe(false);
    expect(containsScript('')).toBe(false);
  });

  it('does not match attribute-like substrings', () => {
    expect(containsScript('<a data-name="myscript">')).toBe(false);
  });
});
