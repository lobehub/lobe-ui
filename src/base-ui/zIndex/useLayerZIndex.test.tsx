import { act, cleanup, render } from '@testing-library/react';
import * as React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Z_INDEX_LAYER } from './constants';
import { __resetLayerZIndexForTests } from './manager';
import { useLayerZIndex } from './useLayerZIndex';

function Probe({
  initial,
  explicit,
  tier = 'floating' as const,
}: {
  initial: 'open' | 'closed';
  explicit?: number;
  tier?: 'floating' | 'modal' | 'toast';
}) {
  const { zIndex, ref } = useLayerZIndex(tier, explicit);
  return <div data-testid="probe" ref={ref} style={{ zIndex }} {...{ [`data-${initial}`]: '' }} />;
}

function DynamicProbe({ initial, explicit }: { initial: 'open' | 'closed'; explicit?: number }) {
  const { zIndex, ref } = useLayerZIndex('floating', explicit);
  return <div data-testid="probe" ref={ref} style={{ zIndex }} {...{ [`data-${initial}`]: '' }} />;
}

const setState = (el: HTMLElement, state: 'open' | 'closed') => {
  el.removeAttribute('data-open');
  el.removeAttribute('data-closed');
  el.setAttribute(`data-${state}`, '');
};

describe('useLayerZIndex', () => {
  beforeEach(() => {
    __resetLayerZIndexForTests();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    __resetLayerZIndexForTests();
  });

  it('mounts with data-open: acquires immediately', () => {
    const { getByTestId } = render(<Probe initial="open" />);
    const el = getByTestId('probe');
    expect(Number(el.style.zIndex)).toBeGreaterThanOrEqual(
      Z_INDEX_LAYER.floating + Z_INDEX_LAYER.step,
    );
  });

  it('mounts with data-closed: no acquire until attribute flips', async () => {
    const { getByTestId } = render(<Probe initial="closed" />);
    const el = getByTestId('probe');
    expect(el.style.zIndex).toBe('');
    await act(async () => {
      setState(el, 'open');
    });
    expect(Number(el.style.zIndex)).toBeGreaterThan(0);
  });

  it('re-acquires on closed → open → closed → open (open order wins)', async () => {
    const { getByTestId } = render(<Probe initial="closed" />);
    const el = getByTestId('probe');
    await act(async () => {
      setState(el, 'open');
    });
    const first = Number(el.style.zIndex);
    await act(async () => {
      setState(el, 'closed');
    });
    await act(async () => {
      setState(el, 'open');
    });
    const second = Number(el.style.zIndex);
    expect(second).toBeGreaterThan(first);
  });

  it('explicitZIndex short-circuits acquire (counter untouched)', () => {
    const first = render(<Probe explicit={777} initial="open" />);
    expect(first.getByTestId('probe').style.zIndex).toBe('777');
    first.unmount();
    const second = render(<Probe initial="open" />);
    const el = second.getByTestId('probe');
    expect(Number(el.style.zIndex)).toBe(Z_INDEX_LAYER.floating + Z_INDEX_LAYER.step);
  });

  it('updates explicit zIndex when prop changes', () => {
    const { getByTestId, rerender } = render(<DynamicProbe explicit={100} initial="open" />);
    expect(getByTestId('probe').style.zIndex).toBe('100');
    rerender(<DynamicProbe explicit={200} initial="open" />);
    expect(getByTestId('probe').style.zIndex).toBe('200');
    // Switching to undefined should fall back to dynamic acquire
    rerender(<DynamicProbe explicit={undefined} initial="open" />);
    expect(Number(getByTestId('probe').style.zIndex)).toBeGreaterThanOrEqual(
      Z_INDEX_LAYER.floating + Z_INDEX_LAYER.step,
    );
  });
});
