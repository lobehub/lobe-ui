import { describe, expect, it, vi } from 'vitest';

import { useStyles } from '../src/ActionIcon/style';

// Mock antd-style
vi.mock('antd-style', () => ({
  createStyles: (fn: any) => {
    return (props: any) =>
      fn(
        {
          css: (strings: any, ...values: any[]) => {
            if (typeof strings === 'string') return strings;
            return strings.reduce((acc: string, str: string, i: number) => {
              return acc + values[i - 1] + str;
            });
          },
          cx: (...args: any[]) => args.filter(Boolean).join(' '),
          stylish: {
            blur: 'blur-style',
          },
          token: {
            colorBorderSecondary: '#d9d9d9',
            colorFill: '#fafafa',
            colorFillSecondary: '#f5f5f5',
            colorFillTertiary: '#f0f0f0',
            colorText: '#000',
            colorTextTertiary: '#666',
            motionEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
          },
        },
        props,
      );
  },
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getStyles = (props: any) => useStyles(props) as any;

describe('ActionIcon style', () => {
  it('should return correct styles when active', () => {
    const styles = getStyles({ active: true, glass: false, variant: 'default' });
    expect(styles.block).toContain('color:');
    expect(styles.block).toContain('background:');
  });

  it('should return correct styles when glass is true', () => {
    const styles = getStyles({ active: false, glass: true, variant: 'default' });
    expect(styles.block).toContain('blur-style');
  });

  it('should return correct styles for ghost variant', () => {
    const styles = getStyles({ active: false, glass: false, variant: 'ghost' });
    expect(styles.block).toContain('#d9d9d9');
  });

  it('should return correct styles for block variant', () => {
    const styles = getStyles({ active: false, glass: false, variant: 'block' });
    expect(styles.block).toContain('#f0f0f0');
  });

  it('should have correct disabled styles', () => {
    const styles = getStyles({ active: false, glass: false, variant: 'default' });
    expect(styles.disabled).toMatch(/cursor:\s*not-allowed/);
    expect(styles.disabled).toMatch(/opacity:\s*0\.5/);
  });

  it('should have correct icon styles', () => {
    const styles = getStyles({ active: false, glass: false, variant: 'default' });
    expect(styles.icon).toMatch(/transition:\s*scale/);
    expect(styles.icon).toMatch(/scale:\s*0\.8/);
  });

  it('should have correct normal hover styles', () => {
    const styles = getStyles({ active: false, glass: false, variant: 'default' });
    expect(styles.normal).toMatch(/cursor:\s*pointer/);
    expect(styles.normal).toContain('#f5f5f5');
  });

  it('should have correct normal active styles', () => {
    const styles = getStyles({ active: false, glass: false, variant: 'default' });
    expect(styles.normal).toContain('#fafafa');
    expect(styles.normal).toContain('#000');
  });
});
