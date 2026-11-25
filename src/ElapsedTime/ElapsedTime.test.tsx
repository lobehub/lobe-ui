import { act, cleanup, render } from '@testing-library/react';

import ElapsedTime from './ElapsedTime';
import { formatElapsed } from './useElapsed';

describe('ElapsedTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  test('formats short and clock durations', () => {
    expect(formatElapsed(850)).toBe('850ms');
    expect(formatElapsed(12_340)).toBe('12.3s');
    expect(formatElapsed(65_000)).toBe('1m 05s');
    expect(formatElapsed(3_725_000)).toBe('1h 02m');
    expect(formatElapsed(-5)).toBe('0ms');
    expect(formatElapsed(12_000, 'clock')).toBe('00:12');
    expect(formatElapsed(725_000, 'clock')).toBe('12:05');
    expect(formatElapsed(3_723_000, 'clock')).toBe('1:02:03');
  });

  test('ticks from mount when no start time is given', () => {
    const { container } = render(<ElapsedTime />);
    const node = container.firstElementChild as HTMLElement;
    expect(node.hasAttribute('data-running')).toBe(true);
    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(node.textContent).toBe('2.5s');
  });

  test('counts from startTime so a remount keeps the clock', () => {
    const startTime = Date.now() - 65_000;
    const { container, unmount } = render(<ElapsedTime startTime={startTime} />);
    expect(container.textContent).toBe('1m 05s');
    unmount();

    vi.advanceTimersByTime(5000);
    const again = render(<ElapsedTime startTime={startTime} />);
    expect(again.container.textContent).toBe('1m 10s');
  });

  test('endTime shows the final duration and stops ticking', () => {
    const startTime = Date.now() - 10_000;
    const { container } = render(<ElapsedTime endTime={startTime + 4200} startTime={startTime} />);
    const node = container.firstElementChild as HTMLElement;
    expect(node.textContent).toBe('4.2s');
    expect(node.hasAttribute('data-running')).toBe(false);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(node.textContent).toBe('4.2s');
  });

  test('running={false} holds the value', () => {
    const { container, rerender } = render(<ElapsedTime format="clock" />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(container.textContent).toBe('00:03');

    rerender(<ElapsedTime format="clock" running={false} />);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(container.textContent).toBe('00:03');
  });

  test('accepts dates and ISO strings, and a custom formatter', () => {
    const { container } = render(
      <ElapsedTime
        format={(ms) => `${Math.round(ms / 1000)} sec`}
        startTime={new Date(Date.now() - 9000).toISOString()}
      />,
    );
    expect(container.textContent).toBe('9 sec');
  });
});
