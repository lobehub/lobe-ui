import { describe, expect, it } from 'vitest';

import {
  getStreamAnimationDisableReason,
  getStreamAnimationOverloadConfig,
  shouldRecoverStreamAnimation,
  STREAM_SMOOTHING_PRESET_CONFIG,
} from './streamAnimationAutoDisable';

describe('getStreamAnimationDisableReason', () => {
  const overloadConfig = {
    disableArrivalCps: 720,
    disableBacklogChars: 360,
    recoverArrivalCps: 180,
    recoverBacklogChars: 120,
  };

  it('disables animation when the arrival rate exceeds the overload threshold', () => {
    const result = getStreamAnimationDisableReason({
      arrivalCps: 1200,
      backlog: 80,
      overloadConfig,
    });

    expect(result).toBe('arrival-rate');
  });

  it('disables animation when backlog growth exceeds the threshold', () => {
    const result = getStreamAnimationDisableReason({
      arrivalCps: 320,
      backlog: 420,
      overloadConfig,
    });

    expect(result).toBe('backlog');
  });

  it('keeps animation enabled while rate and backlog remain within bounds', () => {
    const result = getStreamAnimationDisableReason({
      arrivalCps: 280,
      backlog: 96,
      overloadConfig,
    });

    expect(result).toBe('none');
  });

  it('recovers animation after input cools down and backlog returns within bounds', () => {
    const result = shouldRecoverStreamAnimation({
      activeInputWindowMs: 220,
      animationAutoDisabled: true,
      arrivalCps: 160,
      backlog: 48,
      consecutiveHealthySamples: 0,
      idleMs: 420,
      instantCps: 0,
      overloadConfig,
    });

    expect(result).toBe(true);
  });

  it('recovers animation after consecutive low-rate healthy samples', () => {
    const result = shouldRecoverStreamAnimation({
      activeInputWindowMs: 220,
      animationAutoDisabled: true,
      arrivalCps: 260,
      backlog: 48,
      consecutiveHealthySamples: 2,
      idleMs: 120,
      instantCps: 90,
      overloadConfig,
    });

    expect(result).toBe(true);
  });

  it('keeps animation degraded while input is still active without enough healthy samples', () => {
    const result = shouldRecoverStreamAnimation({
      activeInputWindowMs: 220,
      animationAutoDisabled: true,
      arrivalCps: 160,
      backlog: 48,
      consecutiveHealthySamples: 1,
      idleMs: 120,
      instantCps: 90,
      overloadConfig,
    });

    expect(result).toBe(false);
  });

  it('uses a recovery arrival threshold high enough for sustained low-rate streams', () => {
    const overloadConfig = getStreamAnimationOverloadConfig(
      STREAM_SMOOTHING_PRESET_CONFIG.balanced,
    );

    expect(overloadConfig.disableArrivalCps).toBe(720);
    expect(overloadConfig.recoverArrivalCps).toBe(432);
  });
});
