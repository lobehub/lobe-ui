import { describe, expect, it, vi } from 'vitest';

import { useStyles } from '../src/HotkeyInput/style';

const mockCx = (...args: any[]) => args.filter(Boolean).join(' ');
const mockCss = (strings: any, ...values: any[]) => {
  let result = '';
  for (const [i, str] of strings.entries()) {
    result += str;
    if (i < values.length) {
      result += values[i];
    }
  }
  return result;
};

// Mock antd-style's createStyles
vi.mock('antd-style', () => ({
  createStyles: (fn: any) => {
    const mockTheme = {
      borderRadius: 6,
      colorBorder: '#d9d9d9',
      colorError: '#ff4d4f',
      colorFillTertiary: '#f5f5f5',
      colorTextDescription: '#8c8c8c',
      colorTextQuaternary: '#bfbfbf',
      motionEaseOut: 'ease-out',
    };

    const mockToken = {
      ...mockTheme,
    };

    return (props: any) =>
      fn({ css: mockCss, cx: mockCx, prefixCls: 'ant', token: mockToken }, props);
  },
}));

describe('useStyles', () => {
  it('should generate styles for ghost variant', () => {
    const styles = useStyles({ variant: 'ghost' }) as any;
    expect(styles.input).toContain('#f5f5f5');
    expect(styles.input).toContain('border: 1px solid');
    expect(styles.input).toContain('height: 36px');
  });

  it('should generate styles for block variant', () => {
    const styles = useStyles({ variant: 'block' }) as any;
    expect(styles.input).toContain('#f5f5f5');
    expect(styles.input).toContain('border: 1px solid transparent');
    expect(styles.input).toContain('height: 36px');
  });

  it('should generate styles for pure variant', () => {
    const styles = useStyles({ variant: 'pure' }) as any;
    expect(styles.input).toContain('height: unset');
    expect(styles.input).toContain('padding: 0');
    expect(styles.input).not.toContain('border');
  });

  it('should generate disabled styles', () => {
    const styles = useStyles({ variant: 'ghost' }) as any;
    expect(styles.inputDisabled).toContain('not-allowed');
    expect(styles.inputDisabled).toContain('opacity: 0.65');
  });

  it('should generate error styles', () => {
    const styles = useStyles({ variant: 'ghost' }) as any;
    expect(styles.inputError).toContain('#ff4d4f');
    expect(styles.errorText).toContain('12px');
  });

  it('should generate focused styles', () => {
    const styles = useStyles({ variant: 'ghost' }) as any;
    expect(styles.inputFocused).toContain('#bfbfbf');
  });

  it('should generate placeholder styles', () => {
    const styles = useStyles({ variant: 'ghost' }) as any;
    expect(styles.placeholder).toContain('#8c8c8c');
  });

  it('should generate hidden input styles', () => {
    const styles = useStyles({ variant: 'ghost' }) as any;
    expect(styles.hiddenInput).toContain('opacity: 0');
    expect(styles.hiddenInput).toContain('position: absolute');
    expect(styles.hiddenInput).toContain('z-index: -1');
  });
});
