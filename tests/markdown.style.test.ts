import { describe, expect, it, vi } from 'vitest';

import { IGNORE_CLASSNAME, useStyles } from '../src/Markdown/markdown.style';

// Mock antd-style
vi.mock('antd-style', () => ({
  createStyles: (fn: any) =>
    function (props: any) {
      const context = {
        css: (strings: TemplateStringsArray, ...values: any[]) =>
          strings.reduce((acc, str, i) => acc + str + (values[i] || ''), ''),
        cx: (...args: any[]) => args.join(' '),
        token: {
          borderRadiusLG: 8,
          colorBgLayout: '#fff',
          colorBorder: '#d9d9d9',
          colorBorderSecondary: '#d9d9d9',
          colorFillQuaternary: '#f0f0f0',
          colorFillSecondary: '#f5f5f5',
          colorFillTertiary: '#fafafa',
          colorInfoHover: '#40a9ff',
          colorInfoText: '#1890ff',
          colorTextSecondary: '#666',
          fontFamily: 'sans-serif',
          fontFamilyCode: 'monospace',
          motionEaseOut: 'ease-out',
        },
      };
      return fn(context, props);
    },
}));

describe('markdown.style', () => {
  it('should create styles with default values', () => {
    const styles = useStyles({});
    expect(styles).toMatch(/--lobe-markdown-font-size:\s*16px/);
    expect(styles).toMatch(/--lobe-markdown-header-multiple:\s*1/);
    expect(styles).toMatch(/--lobe-markdown-margin-multiple:\s*1.5/);
    expect(styles).toMatch(/--lobe-markdown-line-height:\s*1.8/);
    expect(styles).toMatch(/--lobe-markdown-border-radius:\s*8/);
    expect(styles).toMatch(/--lobe-markdown-border-color:\s*#f0f0f0/);
  });

  it('should create styles with custom values', () => {
    const styles = useStyles({
      fontSize: 20,
      headerMultiple: 2,
      lineHeight: 2,
      marginMultiple: 2,
    });
    expect(styles).toMatch(/--lobe-markdown-font-size:\s*20px/);
    expect(styles).toMatch(/--lobe-markdown-header-multiple:\s*2/);
    expect(styles).toMatch(/--lobe-markdown-margin-multiple:\s*2/);
    expect(styles).toMatch(/--lobe-markdown-line-height:\s*2/);
  });

  it('should export IGNORE_CLASSNAME constant', () => {
    expect(IGNORE_CLASSNAME).toBe('.ignore-markdown-style');
  });

  it('should include styles for markdown elements', () => {
    const styles = useStyles({});

    // Test basic styles
    expect(styles).toMatch(/position:\s*relative/);
    expect(styles).toMatch(/width:\s*100%/);
    expect(styles).toMatch(/max-width:\s*100%/);

    // Test element styles
    expect(styles).toMatch(/blockquote:not\(\.ignore-markdown-style blockquote\)/);
    expect(styles).toMatch(/code:not\(\.ignore-markdown-style code\)/);
    expect(styles).toMatch(/details:not\(\.ignore-markdown-style details\)/);
    expect(styles).toMatch(/h1:not\(\.ignore-markdown-style h1\)/);
    expect(styles).toMatch(/hr:not\(\.ignore-markdown-style hr\)/);
    expect(styles).toMatch(/img:not\(\.ignore-markdown-style img\)/);
    expect(styles).toMatch(/kbd:not\(\.ignore-markdown-style kbd\)/);
    expect(styles).toMatch(/li:not\(\.ignore-markdown-style li\)/);
    expect(styles).toMatch(/p:not\(\.ignore-markdown-style kbd\)/);
    expect(styles).toMatch(/pre:not\(\.ignore-markdown-style pre\)/);
    expect(styles).toMatch(/strong:not\(\.ignore-markdown-style strong\)/);
    expect(styles).toMatch(/svg:not\(\.ignore-markdown-style svg\)/);
    expect(styles).toMatch(/table:not\(\.ignore-markdown-style table\)/);
    expect(styles).toMatch(/video:not\(\.ignore-markdown-style video\)/);

    // Test specific style properties
    expect(styles).toMatch(/color:\s*#1890ff/); // Link color
    expect(styles).toMatch(/color:\s*#40a9ff/); // Link hover color
    expect(styles).toMatch(/font-family:\s*monospace/); // Code font
    expect(styles).toMatch(/background:\s*#f5f5f5/); // Code background
  });
});
