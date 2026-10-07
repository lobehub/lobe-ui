import { describe, expect, it } from 'vitest';

import { resolveToastDodge } from './dodge';

const input = (
  viewportWidth: number,
  viewportHeight: number,
  panelWidth: number,
  panelHeight: number,
) => ({
  panelHeight,
  panelOffsetX: 8,
  panelOffsetY: 8,
  panelWidth,
  viewportHeight,
  viewportWidth,
});

describe('resolveToastDodge', () => {
  it('shifts left when the lane fits a full-width toast', () => {
    expect(resolveToastDodge(input(1440, 900, 640, 640))).toEqual({
      alignInline: 0,
      mode: 'left',
      reserve: 8,
      shiftX: 644,
      shiftY: 0,
      width: 360,
    });
  });

  it('shifts up when the panel is too wide but short', () => {
    const result = resolveToastDodge(input(1280, 800, 900, 320));

    expect(result.mode).toBe('up');
    expect(result.alignInline).toBe(8);
    expect(result.shiftX).toBe(0);
    expect(result.shiftY).toBe(324);
  });

  it('shrinks the toast when the lane is narrower than the full width', () => {
    const result = resolveToastDodge(input(1280, 800, 960, 784));

    expect(result.mode).toBe('shrink');
    expect(result.width).toBe(284);
    expect(result.shiftX).toBe(964);
  });

  it('reserves space under the panel when no lane is left', () => {
    const result = resolveToastDodge(input(1024, 768, 960, 752));

    expect(result.mode).toBe('reserve');
    expect(result.reserve).toBe(108);
    expect(result.alignInline).toBe(8);
    expect(result.shiftX).toBe(0);
    expect(result.shiftY).toBe(0);
  });

  it('lifts the panel to the toast inset so their bottom edges line up', () => {
    const result = resolveToastDodge(input(1440, 900, 640, 640));

    expect(result.reserve).toBe(8);
    expect(resolveToastDodge({ ...input(1440, 900, 640, 640), panelOffsetY: 16 }).reserve).toBe(0);
  });

  it('never shifts when the panel already clears the toast corner', () => {
    const result = resolveToastDodge({
      panelHeight: 400,
      panelOffsetX: 8,
      panelOffsetY: 8,
      panelWidth: 0,
      viewportHeight: 900,
      viewportWidth: 1440,
    });

    expect(result.shiftX).toBe(4);
    expect(result.mode).toBe('left');
  });
});
