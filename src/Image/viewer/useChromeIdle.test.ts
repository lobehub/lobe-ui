import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useChromeIdle } from './useChromeIdle';

const dispatch = (type: string, target: EventTarget = document.body) =>
  act(() => {
    target.dispatchEvent(new Event(type, { bubbles: true }));
  });

const idle = (ms = 2000) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
});

describe('useChromeIdle', () => {
  it('hides after the idle window and wakes on pointer movement', () => {
    const { result } = renderHook(() => useChromeIdle());
    expect(result.current.hidden).toBe(false);

    idle();
    expect(result.current.hidden).toBe(true);

    dispatch('pointermove');
    expect(result.current.hidden).toBe(false);

    idle();
    expect(result.current.hidden).toBe(true);
  });

  it('wakes on keydown and wheel activity', () => {
    const { result } = renderHook(() => useChromeIdle());

    idle();
    expect(result.current.hidden).toBe(true);

    dispatch('keydown', document);
    expect(result.current.hidden).toBe(false);

    idle();
    dispatch('wheel', document);
    expect(result.current.hidden).toBe(false);
  });

  it('does not hide while the pointer rests over the chrome', () => {
    const { result } = renderHook(() => useChromeIdle());
    const node = document.createElement('div');
    const control = document.createElement('button');
    node.append(control);
    document.body.append(node);
    act(() => {
      result.current.ref(node);
    });

    dispatch('pointermove', control);
    idle();
    expect(result.current.hidden).toBe(false);

    dispatch('pointermove', document.body);
    idle();
    expect(result.current.hidden).toBe(true);
  });

  it('does not hide while focus is inside the chrome', () => {
    const { result } = renderHook(() => useChromeIdle());
    const node = document.createElement('div');
    const control = document.createElement('button');
    node.append(control);
    document.body.append(node);
    act(() => {
      result.current.ref(node);
    });

    control.focus();
    idle();
    expect(result.current.hidden).toBe(false);

    control.blur();
    idle();
    expect(result.current.hidden).toBe(true);
  });

  it('setHeld pins the chrome visible until released', () => {
    const { result } = renderHook(() => useChromeIdle());

    idle();
    expect(result.current.hidden).toBe(true);

    act(() => {
      result.current.setHeld(true);
    });
    expect(result.current.hidden).toBe(false);

    idle(4000);
    expect(result.current.hidden).toBe(false);

    act(() => {
      result.current.setHeld(false);
    });
    idle();
    expect(result.current.hidden).toBe(true);
  });
});
