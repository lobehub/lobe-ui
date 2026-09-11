import { act, renderHook } from '@testing-library/react';
import { useSyncExternalStore } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useRepopOnFarTriggerSwitch } from './useRepopOnFarTriggerSwitch';

type State = {
  activeTriggerElement: Element | null;
  open: boolean;
  popupElement: HTMLElement | null;
};

const createStore = (initial: State) => {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    set(patch: Partial<State>) {
      state = { ...state, ...patch };
      listeners.forEach((listener) => listener());
    },
    get state() {
      return state;
    },
    useState(key: keyof State) {
      return useSyncExternalStore(
        (listener) => {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
        () => state[key],
      );
    },
  };
};

const triggerAt = (x: number, y = 0) => {
  const el = document.createElement('button');
  el.getBoundingClientRect = () => ({ height: 20, left: x, top: y, width: 20 }) as DOMRect;
  return el;
};

const setup = () => {
  const popup = document.createElement('div');
  const animate = vi.fn();
  (popup as any).animate = animate;
  const store = createStore({ activeTriggerElement: null, open: false, popupElement: popup });
  const hook = renderHook(() => useRepopOnFarTriggerSwitch(store));
  return { animate, hook, store };
};

describe('useRepopOnFarTriggerSwitch', () => {
  it('morphs between near triggers and re-pops past the threshold', () => {
    const { animate, hook, store } = setup();

    act(() => store.set({ activeTriggerElement: triggerAt(0), open: true }));
    expect(hook.result.current).toBe(false);

    act(() => store.set({ activeTriggerElement: triggerAt(100) }));
    expect(hook.result.current).toBe(false);
    expect(animate).not.toHaveBeenCalled();

    act(() => store.set({ activeTriggerElement: triggerAt(500) }));
    expect(hook.result.current).toBe(true);
    expect(animate).toHaveBeenCalledTimes(1);

    act(() => store.set({ activeTriggerElement: triggerAt(540) }));
    expect(hook.result.current).toBe(false);
  });

  it('forgets the last trigger when the popup closes', () => {
    const { animate, hook, store } = setup();

    act(() => store.set({ activeTriggerElement: triggerAt(0), open: true }));
    act(() => store.set({ open: false }));
    act(() => store.set({ activeTriggerElement: triggerAt(900), open: true }));

    expect(hook.result.current).toBe(false);
    expect(animate).not.toHaveBeenCalled();
  });

  it('never re-pops when disabled', () => {
    const popup = document.createElement('div');
    const animate = vi.fn();
    (popup as any).animate = animate;
    const store = createStore({
      activeTriggerElement: triggerAt(0),
      open: true,
      popupElement: popup,
    });
    const hook = renderHook(() => useRepopOnFarTriggerSwitch(store, { enabled: false }));

    act(() => store.set({ activeTriggerElement: triggerAt(900) }));

    expect(hook.result.current).toBe(false);
    expect(animate).not.toHaveBeenCalled();
  });
});
