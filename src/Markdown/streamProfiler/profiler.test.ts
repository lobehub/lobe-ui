import { describe, expect, it, vi } from 'vitest';

import { createStreamdownProfiler } from './profiler';

describe('createStreamdownProfiler', () => {
  it('aggregates render and animation samples into a snapshot', () => {
    const profiler = createStreamdownProfiler({ label: 'demo', notifyIntervalMs: 0 });

    profiler.recordRootCommit({
      actualDuration: 4,
      baseDuration: 6,
      blockCount: 2,
      phase: 'mount',
      textLength: 120,
    });
    profiler.recordRootCommit({
      actualDuration: 8,
      baseDuration: 10,
      blockCount: 3,
      phase: 'update',
      textLength: 180,
    });
    profiler.recordBlockCommit({
      actualDuration: 3,
      baseDuration: 4,
      blockChars: 42,
      blockIndex: 0,
      blockKey: '0',
      phase: 'mount',
      state: 'streaming',
    });
    profiler.recordBlockCommit({
      actualDuration: 1.5,
      baseDuration: 2,
      blockChars: 68,
      blockIndex: 1,
      blockKey: '68',
      phase: 'update',
      state: 'animating',
    });
    profiler.recordCalculation({
      durationMs: 1.25,
      itemCount: 3,
      name: 'block-lex',
      textLength: 180,
    });
    profiler.recordCalculation({
      durationMs: 2.75,
      itemCount: 3,
      name: 'block-lex',
      textLength: 220,
    });
    profiler.recordAnimationFrame({
      backlog: 14,
      durationMs: 1.2,
      frameIntervalMs: 16,
      inputActive: true,
      revealChars: 3,
      settling: false,
    });
    profiler.recordAnimationFrame({
      backlog: 8,
      durationMs: 4.6,
      frameIntervalMs: 20,
      inputActive: false,
      revealChars: 0,
      settling: true,
    });
    profiler.recordInputAppend({
      appendedChars: 12,
      contentLength: 12,
    });
    profiler.recordInputAppend({
      appendedChars: 24,
      contentLength: 36,
    });

    const snapshot = profiler.getSnapshot();

    expect(snapshot.label).toBe('demo');
    expect(snapshot.root.count).toBe(2);
    expect(snapshot.root.mountCount).toBe(1);
    expect(snapshot.root.updateCount).toBe(1);
    expect(snapshot.root.avgMs).toBeCloseTo(6);
    expect(snapshot.blocksAggregate.count).toBe(2);
    expect(snapshot.blocksAggregate.trackedCount).toBe(2);
    expect(snapshot.blocks[0].blockIndex).toBe(0);
    expect(snapshot.blocks[0].lastState).toBe('streaming');
    expect(snapshot.calculations[0].name).toBe('block-lex');
    expect(snapshot.calculations[0].count).toBe(2);
    expect(snapshot.calculations[0].avgMs).toBeCloseTo(2);
    expect(snapshot.animation.count).toBe(2);
    expect(snapshot.animation.slowFrameCount).toBe(1);
    expect(snapshot.animation.revealFrameCount).toBe(1);
    expect(snapshot.animation.skippedFrameCount).toBe(1);
    expect(snapshot.fps.currentFps).toBeCloseTo(50);
    expect(snapshot.fps.avgFps).toBeCloseTo(55.56, 2);
    expect(snapshot.fps.index).toBe(83);
    expect(snapshot.fps.samples).toHaveLength(2);
    expect(snapshot.input.count).toBe(2);
    expect(snapshot.input.avgChars).toBe(18);
  });

  it('resets all aggregates and increments the session id', () => {
    const profiler = createStreamdownProfiler({ label: 'first' });

    profiler.recordRootCommit({
      actualDuration: 3,
      baseDuration: 4,
      blockCount: 1,
      phase: 'mount',
      textLength: 32,
    });

    const firstSessionId = profiler.getSnapshot().sessionId;

    profiler.reset('second');

    const snapshot = profiler.getSnapshot();

    expect(snapshot.sessionId).toBe(firstSessionId + 1);
    expect(snapshot.label).toBe('second');
    expect(snapshot.root.count).toBe(0);
    expect(snapshot.blocks).toHaveLength(0);
    expect(snapshot.calculations).toHaveLength(0);
    expect(snapshot.animation.count).toBe(0);
    expect(snapshot.fps.samples).toHaveLength(0);
    expect(snapshot.input.count).toBe(0);
  });

  it('batches listener notifications', () => {
    vi.useFakeTimers();

    try {
      const profiler = createStreamdownProfiler({ notifyIntervalMs: 50 });
      const listener = vi.fn();
      const unsubscribe = profiler.subscribe(listener);

      profiler.recordRootCommit({
        actualDuration: 2,
        baseDuration: 3,
        blockCount: 1,
        phase: 'mount',
        textLength: 16,
      });
      profiler.recordAnimationFrame({
        backlog: 4,
        durationMs: 1,
        frameIntervalMs: 16.67,
        inputActive: true,
        revealChars: 1,
        settling: false,
      });

      expect(listener).not.toHaveBeenCalled();

      vi.advanceTimersByTime(49);
      expect(listener).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
    } finally {
      vi.useRealTimers();
    }
  });
});
