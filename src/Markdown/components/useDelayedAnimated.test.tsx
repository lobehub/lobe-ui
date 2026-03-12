import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDelayedAnimated } from './useDelayedAnimated';

const Demo = ({ animated, delayMs }: { animated?: boolean; delayMs?: number }) => {
  const value = useDelayedAnimated(animated, delayMs);

  return <div data-testid="value">{String(value)}</div>;
};

describe('useDelayedAnimated', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('keeps animation enabled until the configured delay completes', () => {
    const { rerender } = render(<Demo animated delayMs={1600} />);

    expect(screen.getByTestId('value').textContent).toBe('true');

    rerender(<Demo animated={false} delayMs={1600} />);
    expect(screen.getByTestId('value').textContent).toBe('true');

    act(() => {
      vi.advanceTimersByTime(1599);
    });
    expect(screen.getByTestId('value').textContent).toBe('true');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByTestId('value').textContent).toBe('false');
  });
});
