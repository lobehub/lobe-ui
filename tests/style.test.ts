import { describe, expect, it } from 'vitest';

import { DEFAULT_PADDING, getPadding } from '../src/Collapse/style';

describe('Collapse style', () => {
  it('should return default padding if not provided', () => {
    expect(getPadding()).toBe(DEFAULT_PADDING);
  });

  it('should return provided padding', () => {
    expect(getPadding('20px')).toBe('20px');
    expect(getPadding(16)).toBe(16);
  });

  it('should return 0 padding if 0 provided', () => {
    expect(getPadding(0)).toBe(0);
  });

  // Skip testing useStyles directly since it's a React hook
  // and should be tested in component integration tests
  it.skip('should generate styles correctly', () => {
    const mockToken = {
      borderRadius: 4,
      borderRadiusLG: 8,
      colorBgContainer: '#fff',
      colorFillQuaternary: '#f0f0f0',
      colorFillSecondary: '#eee',
      colorFillTertiary: '#f5f5f5',
      colorTextDescription: '#666',
      motionEaseOut: 'ease-out',
    };

    const mockStylish = {
      shadow: 'box-shadow: 0 2px 8px rgba(0,0,0,0.15)',
      variantOutlinedWithoutHover: 'outline: none',
    };

    // This test should be moved to component integration tests
    // where the hook can be properly used within a React component context
  });
});
