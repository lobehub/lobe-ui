import { describe, expect, it, vi } from 'vitest';

import { useStyles } from '../src/Markdown/markdown.style';

// Mock antd-style module
vi.mock('antd-style', () => ({
  createStyles: (fn: any) => {
    return (params = {}) => {
      const theme = {
        css: (styles: string) => styles,
        fontFamily: 'sans-serif',
        fontSize: 14,
        isDarkMode: false,
        token: {
          borderRadiusLG: 8,
          colorBgLayout: '#fff',
          colorBorder: '#d9d9d9',
          colorBorderSecondary: '#d9d9d9',
          colorFillQuaternary: '#fafafa',
          colorFillSecondary: '#f5f5f5',
          colorFillTertiary: '#fafafa',
          colorInfoHover: '#69b1ff',
          colorInfoText: '#1677ff',
          colorTextSecondary: '#666',
          fontFamily: 'sans-serif',
          fontFamilyCode: 'monospace',
          fontSize: '14px',
          lineHeight: 1.5,
          motionEaseOut: 'ease-out',
        },
      };
      return fn(theme, params);
    };
  },
}));

describe('useStyles', () => {
  it('should generate default styles', () => {
    const styles = useStyles() as any;
    expect(styles.__root).toBeDefined();
    expect(styles.a).toBeDefined();
    expect(styles.blockquote).toBeDefined();
    expect(styles.code).toBeDefined();
    expect(styles.header).toBeDefined();
    expect(styles.list).toBeDefined();
    expect(styles.p).toBeDefined();
    expect(styles.pre).toBeDefined();
    expect(styles.table).toBeDefined();
  });

  it('should generate styles with custom parameters', () => {
    const styles = useStyles({
      fontSize: 20,
      headerMultiple: 1.2,
      lineHeight: 2,
      marginMultiple: 2,
    }) as any;

    // Test CSS variable values
    const cssVars = styles.__root.toString();
    expect(cssVars).toContain('font-size: var(--lobe-markdown-font-size)');
    expect(cssVars).toContain('line-height: var(--lobe-markdown-line-height)');
  });

  it('should handle dark mode styles', () => {
    vi.mock('antd-style', () => ({
      createStyles: (fn: any) => {
        return (params = {}) => {
          const darkTheme = {
            css: (styles: string) => styles,
            isDarkMode: true,
            token: {
              borderRadiusLG: 8,
              colorBorderSecondary: '#434343',
              colorFillSecondary: '#1f1f1f',
              colorTextSecondary: '#999',
              fontFamily: 'sans-serif',
              fontSize: '14px',
              lineHeight: 1.5,
            },
          };
          return fn(darkTheme, params);
        };
      },
    }));

    const styles = useStyles() as any;
    const cssVars = styles.__root.toString();
    expect(cssVars).toContain('--lobe-markdown-border-color');
  });
});
