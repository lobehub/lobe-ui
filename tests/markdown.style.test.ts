import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useStyles } from '../src/Markdown/markdown.style';

// Mock token values
const mockToken = {
  borderRadiusLG: 8,
  colorBgLayout: '#fff',
  colorBorder: '#d9d9d9',
  colorBorderSecondary: '#f0f0f0',
  colorFillQuaternary: '#fafafa',
  colorFillSecondary: '#f5f5f5',
  colorFillTertiary: '#fafafa',
  colorInfoHover: '#69b1ff',
  colorInfoText: '#1677ff',
  colorTextSecondary: '#666',
  fontFamily: 'sans-serif',
  fontFamilyCode: 'monospace',
  motionEaseOut: 'ease-out',
} as const;

let mockCss: ReturnType<typeof vi.fn>;
let mockCx: ReturnType<typeof vi.fn>;

beforeEach(() => {
  mockCss = vi.fn((...args) => args);
  mockCx = vi.fn((...args) => args.join(' '));
  vi.doMock('antd-style', () => ({
    createStyles: (callback: any) => {
      return (options: any) => {
        return callback({ css: mockCss, cx: mockCx, token: mockToken }, options);
      };
    },
  }));
  // Force re-import to use doMock
  vi.resetModules();
});

describe('markdown.style', () => {
  // We need to re-import useStyles after doMock
  let useStylesLocal: typeof useStyles;
  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/no-await-expression-member
    useStylesLocal = (await import('../src/Markdown/markdown.style')).useStyles;
  });

  it('should generate styles with default values', () => {
    const styles = useStylesLocal({}) as any;
    expect(styles.root).toBeDefined();
    expect(styles.variant).toBeDefined();
  });

  it('should generate styles with custom values', () => {
    const styles = useStylesLocal({
      fontSize: 20,
      headerMultiple: 1.5,
      lineHeight: 2,
      marginMultiple: 2.5,
    }) as any;
    expect(styles.root).toBeDefined();
    expect(styles.variant).toBeDefined();
  });

  it('should include variant styles', () => {
    useStylesLocal({});
    expect(mockCx).toHaveBeenCalled();
  });

  it('should apply correct CSS variables', () => {
    const options = {
      fontSize: 24,
      headerMultiple: 2,
      lineHeight: 2,
      marginMultiple: 3,
    };
    useStylesLocal(options);

    // The first call to mockCss is for the root style, which is an array of template literal parts and interpolations
    // We want to check that the correct values are in the array
    const calls = mockCss.mock.calls;
    // Find the call that contains '--lobe-markdown-font-size'
    const rootCall = calls.find(
      (call) =>
        Array.isArray(call[0]) &&
        call[0].some(
          (str: string) => typeof str === 'string' && str.includes('--lobe-markdown-font-size'),
        ),
    ) as any;
    expect(rootCall).toBeDefined();

    // The call is of the form: [templateParts[], ...interpolations]
    // The interpolations are in order: fontSize, headerMultiple, marginMultiple, lineHeight, borderRadiusLG, colorFillQuaternary, '.ignore-markdown-style'
    // So we check that the interpolations match options
    // [ ..., fontSize, headerMultiple, marginMultiple, lineHeight, ... ]
    expect(rootCall[1]).toBe(options.fontSize);
    expect(rootCall[2]).toBe(options.headerMultiple);
    expect(rootCall[3]).toBe(options.marginMultiple);
    expect(rootCall[4]).toBe(options.lineHeight);
  });

  it('should handle layout styles', () => {
    useStylesLocal({});
    // Find the root style call
    const calls = mockCss.mock.calls;
    const rootCall = calls.find(
      (call) =>
        Array.isArray(call[0]) &&
        call[0].some((str: string) => typeof str === 'string' && str.includes('width: 100%')),
    ) as any;
    expect(rootCall).toBeDefined();
    // The template parts should contain 'width: 100%', 'max-width: 100%', and 'line-height: var(--lobe-markdown-line-height)'
    const templateStr = rootCall[0].join('');
    expect(templateStr).toContain('width: 100%');
    expect(templateStr).toContain('max-width: 100%');
    expect(templateStr).toContain('line-height: var(--lobe-markdown-line-height)');
  });

  it('should use marginMultiple=2 as the new default', () => {
    useStylesLocal({});
    // The first call to mockCss is for the root style
    const calls = mockCss.mock.calls;
    // Find the call that contains '--lobe-markdown-margin-multiple'
    const rootCall = calls.find(
      (call) =>
        Array.isArray(call[0]) &&
        call[0].some(
          (str: string) =>
            typeof str === 'string' && str.includes('--lobe-markdown-margin-multiple'),
        ),
    ) as any;
    expect(rootCall).toBeDefined();
    // The third interpolation is marginMultiple, default should be 2
    expect(rootCall[3]).toBe(2);
  });
});
