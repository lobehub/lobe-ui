import { clampSidebarWidth } from './width';

describe('clampSidebarWidth', () => {
  it('keeps a finite width inside the rail limits', () => {
    expect(clampSidebarWidth(120, 264)).toBe(200);
    expect(clampSidebarWidth(900, 264)).toBe(480);
    expect(clampSidebarWidth(320.4, 264)).toBe(320);
  });

  it('falls back when the stored width is not a number', () => {
    expect(clampSidebarWidth(Number.NaN, 264)).toBe(264);
  });
});
