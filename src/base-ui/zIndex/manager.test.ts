import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Z_INDEX_LAYER } from './constants';
import { __resetLayerZIndexForTests, __seedMainTopForTests, acquireLayerZIndex } from './manager';

describe('acquireLayerZIndex', () => {
  beforeEach(() => {
    __resetLayerZIndexForTests();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    __resetLayerZIndexForTests();
  });

  it('first floating acquire returns >= floating base + step', () => {
    const z = acquireLayerZIndex('floating');
    expect(z).toBeGreaterThanOrEqual(Z_INDEX_LAYER.floating + Z_INDEX_LAYER.step);
  });

  it('successive floating acquires step by step', () => {
    const z1 = acquireLayerZIndex('floating');
    const z2 = acquireLayerZIndex('floating');
    expect(z2 - z1).toBe(Z_INDEX_LAYER.step);
  });

  it('modal after floating uses shared main counter (modal > floating)', () => {
    const zF = acquireLayerZIndex('floating');
    const zM = acquireLayerZIndex('modal');
    expect(zM).toBeGreaterThan(zF);
  });

  it('floating after modal beats modal (open order wins over tier)', () => {
    const zM = acquireLayerZIndex('modal');
    const zF = acquireLayerZIndex('floating');
    expect(zF).toBeGreaterThan(zM);
  });

  it('toast acquires from independent counter at or above toast base', () => {
    acquireLayerZIndex('floating');
    acquireLayerZIndex('modal');
    const zT = acquireLayerZIndex('toast');
    expect(zT).toBeGreaterThanOrEqual(Z_INDEX_LAYER.toast + Z_INDEX_LAYER.step);
  });

  it('500 main acquires stays below toast tier and emits no warning', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let last = 0;
    for (let i = 0; i < 500; i++) {
      last = acquireLayerZIndex('floating');
    }
    expect(last).toBeLessThan(Z_INDEX_LAYER.toast);
    expect(spy).not.toHaveBeenCalled();
  });

  it('warns exactly once when main counter reaches toast tier', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    __seedMainTopForTests(Z_INDEX_LAYER.toast - Z_INDEX_LAYER.step);
    acquireLayerZIndex('floating'); // crosses threshold
    acquireLayerZIndex('floating'); // already above, should not re-warn
    acquireLayerZIndex('floating'); // ditto
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('__resetLayerZIndexForTests clears the warn-once flag too', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    __seedMainTopForTests(Z_INDEX_LAYER.toast - Z_INDEX_LAYER.step);
    acquireLayerZIndex('floating');
    expect(spy).toHaveBeenCalledTimes(1);
    __resetLayerZIndexForTests();
    __seedMainTopForTests(Z_INDEX_LAYER.toast - Z_INDEX_LAYER.step);
    acquireLayerZIndex('floating');
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
