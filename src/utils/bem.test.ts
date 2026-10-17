import { describe, expect, it } from 'vitest';

import { bem } from './bem';

describe('bem', () => {
  it('prefixes the block with the lobe- namespace', () => {
    expect(bem('slider').block).toBe('lobe-slider');
    expect(bem('slider')()).toBe('lobe-slider');
  });

  it('appends an element with the BEM separator', () => {
    expect(bem('draggable-panel')('handle')).toBe('lobe-draggable-panel__handle');
    expect(bem('alert')('icon')).toBe('lobe-alert__icon');
  });

  it('falls back to the block when the element is empty', () => {
    expect(bem('slider')('')).toBe('lobe-slider');
  });

  it('caches one factory per block', () => {
    expect(bem('slider')).toBe(bem('slider'));
    expect(bem('slider')).not.toBe(bem('switch'));
  });
});
