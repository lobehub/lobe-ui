import { describe, expect, it, vi } from 'vitest';

import { useStyles } from '../src/Input/style';

// Mock antd-style's createStyles to avoid React hook issues
vi.mock('antd-style', () => ({
  createStyles: (callback: any) => () =>
    callback({
      css: (strings: TemplateStringsArray, ...values: any[]) =>
        strings.reduce((acc, str, i) => acc + str + (values[i] || ''), ''),
      cx: (...args: any[]) => args.join(' '),
      prefixCls: 'ant',
      stylish: {
        shadow: 'box-shadow: 0 2px 8px rgba(0,0,0,0.15);',
        variantBorderless: 'border: none;',
        variantBorderlessWithoutHover: 'border: none;',
        variantFilled: 'background: #f5f5f5;',
        variantFilledWithoutHover: 'background: #f0f0f0;',
        variantOutlined: 'border: 1px solid #d9d9d9;',
      },
      token: {
        colorBorder: '#d9d9d9',
      },
    }),
}));

describe('Input styles', () => {
  // @ts-ignore
  const styles = useStyles();

  it('should generate borderless style', () => {
    // @ts-ignore
    expect(styles.borderless).toContain('border: none;');
  });

  it('should generate borderlessOPT style', () => {
    // @ts-ignore
    expect(styles.borderlessOPT).toContain('.ant-otp');
    // @ts-ignore
    expect(styles.borderlessOPT).toContain('border: none;');
  });

  it('should generate filled style', () => {
    // @ts-ignore
    expect(styles.filled).toContain('background: #f5f5f5;');
    // @ts-ignore
    expect(styles.filled).toContain('background: #f0f0f0;');
  });

  it('should generate filledOPT style', () => {
    // @ts-ignore
    expect(styles.filledOPT).toContain('.ant-otp');
    // @ts-ignore
    expect(styles.filledOPT).toContain('background: #f5f5f5;');
  });

  it('should generate outlined style', () => {
    // @ts-ignore
    expect(styles.outlined).toContain('border: 1px solid #d9d9d9;');
  });

  it('should generate outlinedOPT style', () => {
    // @ts-ignore
    expect(styles.outlinedOPT).toContain('.ant-otp');
    // @ts-ignore
    expect(styles.outlinedOPT).toContain('border: 1px solid #d9d9d9;');
  });

  it('should generate root style', () => {
    // @ts-ignore
    expect(styles.root).toBeDefined();
  });

  it('should generate rootOPT style', () => {
    // @ts-ignore
    expect(styles.rootOPT).toContain('.ant-otp');
    // @ts-ignore
    expect(styles.rootOPT).toContain('border-color: #d9d9d9');
  });

  it('should generate shadow style', () => {
    // @ts-ignore
    expect(styles.shadow).toContain('box-shadow: 0 2px 8px rgba(0,0,0,0.15);');
  });

  it('should generate shadowOPT style', () => {
    // @ts-ignore
    expect(styles.shadowOPT).toContain('.ant-otp');
    // @ts-ignore
    expect(styles.shadowOPT).toContain('box-shadow: 0 2px 8px rgba(0,0,0,0.15);');
  });
});
