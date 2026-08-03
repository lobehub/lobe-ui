import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  __resetToastHostRegistryForTests,
  isActiveToastHost,
  registerToastHost,
  subscribeToastHost,
} from './hostGuard';

describe('hostGuard', () => {
  afterEach(() => {
    __resetToastHostRegistryForTests();
  });

  it('the first registered host is active', () => {
    registerToastHost('a');
    expect(isActiveToastHost('a')).toBe(true);
  });

  it('a later registered host is not active while the first stays mounted', () => {
    registerToastHost('a');
    registerToastHost('b');
    expect(isActiveToastHost('a')).toBe(true);
    expect(isActiveToastHost('b')).toBe(false);
  });

  it('unregistering the active host promotes the next mounted host', () => {
    const unregisterA = registerToastHost('a');
    registerToastHost('b');
    unregisterA();
    expect(isActiveToastHost('b')).toBe(true);
  });

  it('unregistering an inactive host does not disturb the active host', () => {
    registerToastHost('a');
    const unregisterB = registerToastHost('b');
    unregisterB();
    expect(isActiveToastHost('a')).toBe(true);
  });

  it('a host can reclaim active status by re-registering after fully unregistering', () => {
    const unregisterA = registerToastHost('a');
    unregisterA();
    registerToastHost('a');
    expect(isActiveToastHost('a')).toBe(true);
  });

  it('notifies subscribers on register and unregister', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToastHost(listener);

    const unregisterA = registerToastHost('a');
    expect(listener).toHaveBeenCalledTimes(1);

    unregisterA();
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
  });

  it('stops notifying a listener after it unsubscribes', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToastHost(listener);
    unsubscribe();

    registerToastHost('a');
    expect(listener).not.toHaveBeenCalled();
  });
});
