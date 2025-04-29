import { describe, expect, it, vi } from 'vitest';

import { LAYOUT, useStyles } from '../src/DraggablePanel/style';

vi.mock('antd-style', () => ({
  createStyles: (fn: any) => (config: any, props: any) => fn(config, props),
  css: (template: any) => template,
  cx: (...args: any[]) => args.join(' '),
}));

describe('DraggablePanel styles', () => {
  it('should have correct LAYOUT constants', () => {
    expect(LAYOUT).toEqual({
      offset: 16,
      toggleLength: 40,
      toggleShort: 16,
    });
  });

  it('should return styles object with correct properties', () => {
    const mockToken = {
      colorBgContainerSecondary: '#fff',
      colorBorderSecondary: '#d9d9d9',
      colorPrimary: '#1890ff',
      colorText: '#000',
      colorTextSecondary: '#666',
      colorTextTertiary: '#999',
      motionEaseOut: 'ease-out',
    };

    const mockStyleConfig = {
      prefixCls: 'test',
      stylish: {
        variantFilled: 'background: #f0f0f0',
      },
      token: mockToken,
    };

    const mockProps = {
      headerHeight: 48,
      showHandleWideArea: true,
    };

    // @ts-expect-error - ignore type errors for test
    const styles = useStyles(mockStyleConfig, mockProps) as any;

    // Test border styles
    expect(styles.borderTop).toBeDefined();
    expect(styles.borderBottom).toBeDefined();
    expect(styles.borderLeft).toBeDefined();
    expect(styles.borderRight).toBeDefined();

    // Test float positions
    expect(styles.topFloat).toBeDefined();
    expect(styles.bottomFloat).toBeDefined();
    expect(styles.leftFloat).toBeDefined();
    expect(styles.rightFloat).toBeDefined();

    // Test handle styles
    expect(styles.handleRoot).toBeDefined();
    expect(styles.handleTop).toBeDefined();
    expect(styles.handleBottom).toBeDefined();
    expect(styles.handleLeft).toBeDefined();
    expect(styles.handleRight).toBeDefined();

    // Test toggle styles
    expect(styles.toggleRoot).toBeDefined();
    expect(styles.toggleTop).toBeDefined();
    expect(styles.toggleBottom).toBeDefined();
    expect(styles.toggleLeft).toBeDefined();
    expect(styles.toggleRight).toBeDefined();

    // Test component styles
    expect(styles.fixed).toBeDefined();
    expect(styles.fullscreen).toBeDefined();
    expect(styles.panel).toBeDefined();
    expect(styles.root).toBeDefined();

    // Test specific style values
    expect(styles.toggleTop).toContain('inset-block-start: -8px');
    expect(styles.toggleTop).toContain('height: 0px');
  });
});
