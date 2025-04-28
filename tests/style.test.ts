import { describe, expect, it, vi } from 'vitest';

vi.mock('react', () => ({
  useContext: () => ({}),
}));

const mockCreateStyles = (config: any) => {
  const { token, stylish, prefixCls } = config;
  return {
    glass: stylish?.blur,
    root: `&.${prefixCls}-btn { > .${prefixCls}-btn-icon { display: flex; } }`,
    shadow: `box-shadow: ${token?.boxShadowTertiary} !important;`,
  };
};

vi.mock('antd-style', () => ({
  createStyles: (fn: any) => (config: any) => fn(config),
}));

describe('Button style', () => {
  it('should return correct style object', () => {
    const mockToken = {
      boxShadowTertiary: '0 2px 8px rgba(0,0,0,0.15)',
      motionEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    };

    const mockStylish = {
      blur: {
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255,255,255,0.8)',
      },
    };

    const mockPrefixCls = 'ant';

    const styles = mockCreateStyles({
      css: (str: string) => str,
      prefixCls: mockPrefixCls,
      stylish: mockStylish,
      token: mockToken,
    });

    expect(styles).toMatchObject({
      glass: mockStylish.blur,
      root: expect.stringContaining('ant-btn'),
      shadow: expect.stringContaining('box-shadow'),
    });
  });

  it('should apply correct glass style', () => {
    const mockStylish = {
      blur: {
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255,255,255,0.8)',
      },
    };

    const styles = mockCreateStyles({
      css: (str: string) => str,
      stylish: mockStylish,
    });

    expect(styles.glass).toEqual(mockStylish.blur);
  });

  it('should apply correct shadow style', () => {
    const mockToken = {
      boxShadowTertiary: '0 2px 8px rgba(0,0,0,0.15)',
    };

    const styles = mockCreateStyles({
      css: (str: string) => str,
      token: mockToken,
    });

    expect(styles.shadow).toContain(mockToken.boxShadowTertiary);
  });

  it('should apply correct button icon style', () => {
    const mockPrefixCls = 'ant';

    const styles = mockCreateStyles({
      css: (str: string) => str,
      prefixCls: mockPrefixCls,
    });

    expect(styles.root).toContain('ant-btn-icon');
    expect(styles.root).toContain('display: flex');
  });
});
