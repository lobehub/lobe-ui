import { describe, expect, it, vi } from 'vitest';

import { useStyles } from '../src/mobile/ChatInputArea/style';

vi.mock('antd-style', () => {
  const mockToken = {
    colorFillQuaternary: '#f5f5f5',
    colorFillTertiary: '#e5e5e5',
  };

  return {
    createStyles: (fn: any) => {
      const styles = fn({
        css: (strings: TemplateStringsArray, ...values: any[]) => {
          let result = strings[0];
          for (const [i, value] of values.entries()) {
            result += value + strings[i + 1];
          }
          return result;
        },
        token: mockToken,
      });
      return () => styles;
    },
  };
});

describe('ChatInputArea styles', () => {
  it('should generate correct styles', () => {
    const styles = useStyles();
    const typedStyles = styles as any;

    // Test container styles
    expect(typedStyles.container).toContain('flex: none');
    expect(typedStyles.container).toContain('padding-block: 12px');
    expect(typedStyles.container).toContain('background: #f5f5f5');
    expect(typedStyles.container).toContain('border-block-start: 1px solid #e5e5e5');

    // Test expand styles
    expect(typedStyles.expand).toContain('position: absolute');
    expect(typedStyles.expand).toContain('width: 100%');
    expect(typedStyles.expand).toContain('height: 100%');

    // Test expand button styles
    expect(typedStyles.expandButton).toContain('position: absolute');
    expect(typedStyles.expandButton).toContain('inset-inline-end: 14px');

    // Test expand text area styles
    expect(typedStyles.expandTextArea).toContain('flex: 1');

    // Test inner styles
    expect(typedStyles.inner).toContain('height: inherit');
    expect(typedStyles.inner).toContain('padding-block: 0');
    expect(typedStyles.inner).toContain('padding-inline: 8px');
  });
});
