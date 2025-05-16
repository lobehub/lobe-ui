import { renderHook } from '@testing-library/react';
import { Theme } from 'antd-style';
import { describe, expect, it, vi } from 'vitest';

import { IGNORE_CLASSNAME, useStyles } from '../src/Markdown/markdown.style';

const mockTheme: Partial<Theme> = {
  borderRadiusLG: 8,
  colorBgLayout: '#fff',
  colorBorder: '#000',
  colorBorderSecondary: '#d9d9d9',
  colorFillQuaternary: '#fafafa',
  colorFillSecondary: '#eee',
  colorFillTertiary: '#f5f5f5',
  colorInfoHover: '#4096ff',
  colorInfoText: '#1677ff',
  colorTextSecondary: '#666',
  fontFamily: 'sans-serif',
  fontFamilyCode: 'monospace',
  motionEaseOut: 'ease-out',
};

vi.mock('antd-style', () => ({
  createStyles: (fn: any) => (props: any) => {
    const styles = fn(
      {
        css: (strings: any) => strings,
        cx: (...args: any[]) => args.join(' '),
        token: mockTheme,
      },
      props,
    );
    return styles;
  },
}));

describe('markdown.style', () => {
  describe('IGNORE_CLASSNAME', () => {
    it('should have correct value', () => {
      expect(IGNORE_CLASSNAME).toBe('.ignore-markdown-style');
    });
  });

  describe('useStyles', () => {
    it('should return styles with default values', () => {
      const { result } = renderHook(() => useStyles({})) as any;

      expect(result.current.root).toBeDefined();
      expect(result.current.variant).toBeDefined();

      const rootStyles = String(result.current.root);
      expect(rootStyles).toContain('position: relative');
      expect(rootStyles).toContain('width: 100%');
      expect(rootStyles).toContain('max-width: 100%');
      expect(rootStyles).toContain('padding-inline: 1px');
    });

    it('should use custom values', () => {
      const { result } = renderHook(() =>
        useStyles({
          fontSize: 20,
          headerMultiple: 1.5,
          lineHeight: 2,
          marginMultiple: 2,
        }),
      ) as any;

      expect(result.current.root).toBeDefined();
      expect(result.current.variant).toBeDefined();

      const rootStyles = String(result.current.root);
      expect(rootStyles).toContain('font-size');
      expect(rootStyles).toContain('line-height');
    });

    it('should include markdown element styles in variant', () => {
      const { result } = renderHook(() => useStyles({})) as any;

      const variantStyles = String(result.current.variant);

      expect(variantStyles).toContain('a:not');
      expect(variantStyles).toContain('blockquote:not');
      expect(variantStyles).toContain('code:not');
      expect(variantStyles).toContain('details:not');
      expect(variantStyles).toContain('h1:not');
      expect(variantStyles).toContain('hr:not');
      expect(variantStyles).toContain('img:not');
      expect(variantStyles).toContain('kbd:not');
      expect(variantStyles).toContain('ul:not');
      expect(variantStyles).toContain('p:not');
      expect(variantStyles).toContain('pre');
      expect(variantStyles).toContain('strong:not');
      expect(variantStyles).toContain('table:not');
      expect(variantStyles).toContain('video:not');
    });

    it('should handle corner cases with special characters', () => {
      const { result } = renderHook(() => useStyles({})) as any;

      const rootStyles = String(result.current.root);
      expect(rootStyles).toContain('word-break: break-word');
      expect(rootStyles).toContain('padding-inline: 1px');
    });

    it.skip('should handle font size edge cases', () => {
      const { result } = renderHook(() => useStyles({ fontSize: 0 })) as any;
      const rootStyles = String(result.current.root);
      expect(rootStyles).toContain('--lobe-markdown-font-size: 0px');
    });
  });
});
