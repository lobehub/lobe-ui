import { type StreamSmoothingPreset } from '@/Markdown/type';

export interface StreamSmoothingPresetConfig {
  activeInputWindowMs: number;
  defaultCps: number;
  emaAlpha: number;
  flushCps: number;
  largeAppendChars: number;
  maxActiveCps: number;
  maxCps: number;
  maxFlushCps: number;
  minCps: number;
  settleAfterMs: number;
  settleDrainMaxMs: number;
  settleDrainMinMs: number;
  targetBufferMs: number;
}

export const STREAM_SMOOTHING_PRESET_CONFIG: Record<
  StreamSmoothingPreset,
  StreamSmoothingPresetConfig
> = {
  balanced: {
    activeInputWindowMs: 220,
    defaultCps: 38,
    emaAlpha: 0.2,
    flushCps: 120,
    largeAppendChars: 120,
    maxActiveCps: 132,
    maxCps: 72,
    maxFlushCps: 280,
    minCps: 18,
    settleAfterMs: 360,
    settleDrainMaxMs: 520,
    settleDrainMinMs: 180,
    targetBufferMs: 120,
  },
  realtime: {
    activeInputWindowMs: 140,
    defaultCps: 50,
    emaAlpha: 0.3,
    flushCps: 170,
    largeAppendChars: 180,
    maxActiveCps: 180,
    maxCps: 96,
    maxFlushCps: 360,
    minCps: 24,
    settleAfterMs: 260,
    settleDrainMaxMs: 360,
    settleDrainMinMs: 140,
    targetBufferMs: 40,
  },
  silky: {
    activeInputWindowMs: 320,
    defaultCps: 28,
    emaAlpha: 0.14,
    flushCps: 96,
    largeAppendChars: 100,
    maxActiveCps: 102,
    maxCps: 56,
    maxFlushCps: 220,
    minCps: 14,
    settleAfterMs: 460,
    settleDrainMaxMs: 680,
    settleDrainMinMs: 240,
    targetBufferMs: 170,
  },
};

export interface StreamAnimationOverloadConfig {
  disableArrivalCps: number;
  disableBacklogChars: number;
  recoverArrivalCps: number;
  recoverBacklogChars: number;
}

export type StreamAnimationDisableReason = 'none' | 'arrival-rate' | 'backlog';

export const getStreamAnimationOverloadConfig = (
  config: StreamSmoothingPresetConfig,
): StreamAnimationOverloadConfig => {
  const disableArrivalCps = Math.max(config.maxFlushCps * 2, 720);

  return {
    disableArrivalCps,
    disableBacklogChars: Math.max(
      config.largeAppendChars * 3,
      Math.round(config.maxFlushCps * 1.2),
    ),
    recoverArrivalCps: Math.max(
      Math.round(disableArrivalCps * 0.6),
      Math.round(config.maxFlushCps * 1.15),
      240,
    ),
    recoverBacklogChars: Math.max(config.largeAppendChars, Math.round(config.maxCps * 1.2)),
  };
};

export const getStreamAnimationDisableReason = ({
  arrivalCps,
  backlog,
  overloadConfig,
}: {
  arrivalCps: number;
  backlog: number;
  overloadConfig: StreamAnimationOverloadConfig;
}): StreamAnimationDisableReason => {
  if (backlog >= overloadConfig.disableBacklogChars) return 'backlog';
  if (arrivalCps >= overloadConfig.disableArrivalCps) return 'arrival-rate';
  return 'none';
};

export const shouldRecoverStreamAnimation = ({
  consecutiveHealthySamples,
  animationAutoDisabled,
  arrivalCps,
  backlog,
  idleMs,
  instantCps,
  activeInputWindowMs,
  overloadConfig,
}: {
  consecutiveHealthySamples: number;
  animationAutoDisabled: boolean;
  arrivalCps: number;
  backlog: number;
  idleMs: number;
  instantCps: number;
  activeInputWindowMs: number;
  overloadConfig: StreamAnimationOverloadConfig;
}) => {
  if (!animationAutoDisabled) return false;
  if (backlog > overloadConfig.recoverBacklogChars) return false;
  const idleRecovered =
    idleMs > activeInputWindowMs && arrivalCps <= overloadConfig.recoverArrivalCps;
  const sustainedRecovered =
    instantCps <= overloadConfig.recoverArrivalCps && consecutiveHealthySamples >= 2;
  if (!idleRecovered && !sustainedRecovered) return false;
  return true;
};
