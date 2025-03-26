import { describe, expect, it, vi } from 'vitest';

import { useStyles } from '../src/Markdown/style';

// Mock antd-style
vi.mock('antd-style', () => ({
  createStyles: (fn: any) => fn,
}));

const mockCss = (strings: TemplateStringsArray, ...values: any[]) =>
  strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StylesType = Record<string, any>;

describe('useStyles', () => {
  it('should generate default styles', () => {
    const mockToken = {
      borderRadius: '4px',
      colorTextSecondary: '#666',
      cyan11A: '#00bcd4',
      cyan9A: '#00b8d4',
    };

    const styles = (useStyles as any)(
      {
        css: mockCss,
        isDarkMode: false,
        token: mockToken,
      },
      {},
    ) as StylesType;

    expect(styles).toBeDefined();
    expect(typeof styles.chat).toBe('string');
    expect(typeof styles.latex).toBe('string');
    expect(typeof styles.root).toBe('string');
  });

  it('should handle dark mode', () => {
    const mockToken = {
      borderRadius: '4px',
      colorTextSecondary: '#666',
      cyan11A: '#00bcd4',
      cyan9A: '#00b8d4',
    };

    const styles = (useStyles as any)(
      {
        css: mockCss,
        isDarkMode: true,
        token: mockToken,
      },
      {},
    ) as StylesType;

    expect(styles).toBeDefined();
    expect(typeof styles.chat).toBe('string');
    expect(typeof styles.latex).toBe('string');
    expect(typeof styles.root).toBe('string');
  });

  it('should handle custom parameters', () => {
    const mockToken = {
      borderRadius: '8px',
      colorTextSecondary: '#666',
      cyan11A: '#00bcd4',
      cyan9A: '#00b8d4',
    };

    const styles = (useStyles as any)(
      {
        css: mockCss,
        isDarkMode: false,
        token: mockToken,
      },
      {
        fontSize: 16,
        headerMultiple: 0.5,
        lineHeight: 2,
        marginMultiple: 2,
      },
    ) as StylesType;

    expect(styles).toBeDefined();
    expect(typeof styles.chat).toBe('string');
    expect(typeof styles.latex).toBe('string');
    expect(typeof styles.root).toBe('string');
  });
});
