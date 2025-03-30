import { describe, expect, it } from 'vitest';

import {
  MD5_LENGTH_THRESHOLD,
  escapeHtml,
  loadShiki,
  shikiPromise,
} from '../src/hooks/useHighlight';

describe('escapeHtml', () => {
  it('should escape HTML special characters', () => {
    const input = '<div class="test">Hello & "world" \'test\'</div>';
    const expected =
      '&lt;div class=&quot;test&quot;&gt;Hello &amp; &quot;world&quot; &#039;test&#039;&lt;/div&gt;';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('should handle empty string', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('should handle string without special characters', () => {
    const input = 'Hello world';
    expect(escapeHtml(input)).toBe(input);
  });

  it('should escape multiple occurrences of special characters', () => {
    const input = '<<>>&&&"""\'\'\'';
    const expected = '&lt;&lt;&gt;&gt;&amp;&amp;&amp;&quot;&quot;&quot;&#039;&#039;&#039;';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('should preserve null characters', () => {
    const input = 'Hello\0World';
    expect(escapeHtml(input)).toBe('Hello\0World');
  });

  it('should handle strings with multiple types of special characters', () => {
    const input = '<script>alert("&\'test\'")</script>';
    const expected = '&lt;script&gt;alert(&quot;&amp;&#039;test&#039;&quot;)&lt;/script&gt;';
    expect(escapeHtml(input)).toBe(expected);
  });
});

describe('MD5_LENGTH_THRESHOLD', () => {
  it('should be set to 10000', () => {
    expect(MD5_LENGTH_THRESHOLD).toBe(10_000);
  });
});

describe('loadShiki', () => {
  it('should return a Promise', () => {
    expect(loadShiki()).toBeInstanceOf(Promise);
  });

  it('should eventually resolve to a function', async () => {
    const codeToHtml = await loadShiki();
    expect(typeof codeToHtml).toBe('function');
  });
});

describe('shikiPromise', () => {
  it('should be a Promise', () => {
    expect(shikiPromise).toBeInstanceOf(Promise);
  });

  it('should resolve to a function', async () => {
    const codeToHtml = await shikiPromise;
    expect(typeof codeToHtml).toBe('function');
  });
});
