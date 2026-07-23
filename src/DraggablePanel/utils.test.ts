import { describe, expect, it } from 'vitest';

import { isBelowCollapseThreshold } from './utils';

describe('isBelowCollapseThreshold', () => {
  it('enters collapse preview when a horizontal panel reaches the threshold', () => {
    expect(
      isBelowCollapseThreshold({
        axis: 'width',
        collapseThreshold: 300,
        size: { height: '100%', width: '300px' },
      }),
    ).toBe(true);
  });

  it('enters collapse preview when a vertical panel reaches the threshold', () => {
    expect(
      isBelowCollapseThreshold({
        axis: 'height',
        collapseThreshold: 180,
        size: { height: 180, width: '100%' },
      }),
    ).toBe(true);
  });

  it('leaves collapse preview after dragging back above the threshold', () => {
    expect(
      isBelowCollapseThreshold({
        axis: 'width',
        collapseThreshold: 300,
        size: { height: '100%', width: 320 },
      }),
    ).toBe(false);
  });

  it('keeps existing resize behavior when no threshold is configured', () => {
    expect(
      isBelowCollapseThreshold({
        axis: 'width',
        size: { height: '100%', width: 0 },
      }),
    ).toBe(false);
  });
});
