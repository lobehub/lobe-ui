import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { FALLBACK, useStyles } from '../src/Image/style';

const mockToken = {
  borderRadius: 4,
  borderRadiusLG: 8,
  colorBgMask: '#000',
};

const mockStylish = {
  blur: 'blur',
  variantBorderlessWithoutHover: 'borderless',
  variantFilledWithoutHover: 'filled',
  variantOutlinedWithoutHover: 'outlined',
};

vi.mock('antd-style', () => ({
  createStyles: (fn: any) => (props?: any) =>
    fn(
      {
        css: (strings: TemplateStringsArray, ...values: any[]) =>
          strings.reduce((acc, str, i) => acc + str + (values[i] || ''), ''),
        cx: (...args: any[]) => args.join(' '),
        prefixCls: 'test',
        stylish: mockStylish,
        token: mockToken,
      },
      props,
    ),
}));

describe('useStyles', () => {
  it('should generate styles with default options', () => {
    const { result } = renderHook(() => useStyles());
    const styles = result.current as any;

    expect(styles).toBeDefined();
    expect(styles.root).toBeDefined();
    expect(styles.image).toBeDefined();
    expect(styles.actions).toBeDefined();
    expect(styles.mask).toBeDefined();
    expect(styles.toolbar).toBeDefined();
    expect(styles.preview).toBeDefined();
    expect(styles.borderless).toBeDefined();
    expect(styles.outlined).toBeDefined();
    expect(styles.filled).toBeDefined();
  });

  it('should handle custom dimensions', () => {
    const { result } = renderHook(() =>
      useStyles({
        maxHeight: 200,
        maxWidth: 300,
        minHeight: 100,
        minWidth: 150,
      }),
    );

    const imageStyle = (result.current as any).image;

    expect(imageStyle).toContain('.test-image-img');
    expect(imageStyle).toContain('min-width: 150px');
    expect(imageStyle).toContain('max-width: 300px');
    expect(imageStyle).toContain('min-height: 100px');
    expect(imageStyle).toContain('max-height: 200px');
  });

  it('should handle string dimensions', () => {
    const { result } = renderHook(() =>
      useStyles({
        maxHeight: '50vh',
        maxWidth: '100%',
        minHeight: '20vh',
        minWidth: '50%',
      }),
    );

    const imageStyle = (result.current as any).image;

    expect(imageStyle).toContain('.test-image-img');
    expect(imageStyle).toContain('min-width: 50%');
    expect(imageStyle).toContain('max-width: 100%');
    expect(imageStyle).toContain('min-height: 20vh');
    expect(imageStyle).toContain('max-height: 50vh');
  });

  it('should handle alwaysShowActions', () => {
    const { result: showResult } = renderHook(() =>
      useStyles({
        alwaysShowActions: true,
      }),
    );

    expect((showResult.current as any).actions).toContain('opacity: 1');

    const { result: hideResult } = renderHook(() =>
      useStyles({
        alwaysShowActions: false,
      }),
    );

    // When alwaysShowActions is false, opacity should be empty string (missing), so check for the property
    expect((hideResult.current as any).actions).toContain('opacity: ;');

    // When alwaysShowActions is undefined, should also be opacity: ;
    const { result: undefResult } = renderHook(() => useStyles({}));
    expect((undefResult.current as any).actions).toContain('opacity: ;');
  });

  it('should handle custom objectFit', () => {
    const { result } = renderHook(() =>
      useStyles({
        objectFit: 'contain',
      }),
    );

    expect((result.current as any).image).toContain('object-fit: contain');

    const { result: defaultResult } = renderHook(() => useStyles());
    expect((defaultResult.current as any).image).toContain('object-fit: cover');
  });
});

describe('FALLBACK', () => {
  it('should be a valid data URL', () => {
    expect(FALLBACK).toMatch(/^data:image\/svg\+xml;base64,/);
  });
});
