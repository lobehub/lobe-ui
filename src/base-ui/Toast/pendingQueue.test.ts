import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  __resetPendingToastQueueForTests,
  markToastHostReady,
  runWhenToastHostReady,
} from './pendingQueue';

describe('pendingQueue', () => {
  beforeEach(() => {
    __resetPendingToastQueueForTests();
  });

  afterEach(() => {
    __resetPendingToastQueueForTests();
    vi.useRealTimers();
  });

  it('runs immediately once the host is marked ready', () => {
    markToastHostReady();
    const run = vi.fn();

    runWhenToastHostReady(run);

    expect(run).toHaveBeenCalledTimes(1);
  });

  it('queues actions while not ready and runs them in order once ready', () => {
    const order: number[] = [];
    runWhenToastHostReady(() => order.push(1));
    runWhenToastHostReady(() => order.push(2));
    expect(order).toEqual([]);

    markToastHostReady();

    expect(order).toEqual([1, 2]);
  });

  it('does not re-run an already-flushed queue on a later ready call', () => {
    const run = vi.fn();
    runWhenToastHostReady(run);

    markToastHostReady();
    markToastHostReady();

    expect(run).toHaveBeenCalledTimes(1);
  });

  it('drops the oldest queued action once the cap is exceeded', () => {
    const order: number[] = [];
    for (let i = 0; i < 25; i += 1) {
      runWhenToastHostReady(() => order.push(i));
    }

    markToastHostReady();

    expect(order).toHaveLength(20);
    expect(order[0]).toBe(5);
    expect(order.at(-1)).toBe(24);
  });

  it('drops queued actions older than the TTL once the queue is finally flushed', () => {
    vi.useFakeTimers();
    const run = vi.fn();
    runWhenToastHostReady(run);

    vi.advanceTimersByTime(6000);
    markToastHostReady();

    expect(run).not.toHaveBeenCalled();
  });

  it('still runs queued actions flushed within the TTL', () => {
    vi.useFakeTimers();
    const run = vi.fn();
    runWhenToastHostReady(run);

    vi.advanceTimersByTime(1000);
    markToastHostReady();

    expect(run).toHaveBeenCalledTimes(1);
  });
});
