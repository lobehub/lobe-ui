import { useCallback, useEffect, useRef, useState } from 'react';

import { useStreamdownProfiler } from '@/Markdown/streamProfiler';
import { type StreamSmoothingPreset } from '@/Markdown/type';

import {
  getStreamAnimationDisableReason,
  getStreamAnimationOverloadConfig,
  shouldRecoverStreamAnimation,
  STREAM_SMOOTHING_PRESET_CONFIG,
  type StreamAnimationDisableReason,
} from './streamAnimationAutoDisable';

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

const getNow = () => {
  return typeof performance === 'undefined' ? Date.now() : performance.now();
};

export const countChars = (text: string): number => {
  return [...text].length;
};

interface UseSmoothStreamContentOptions {
  autoDisableAnimation?: boolean;
  enabled?: boolean;
  preset?: StreamSmoothingPreset;
}

export interface StreamAnimationAutoDisableStatus {
  animationAutoDisabled: boolean;
  animationDisableReason: StreamAnimationDisableReason;
  arrivalCps: number;
  backlog: number;
  disableThresholdBacklog: number;
  disableThresholdCps: number;
  recoverThresholdBacklog: number;
  recoverThresholdCps: number;
}

export interface UseSmoothStreamContentResult extends StreamAnimationAutoDisableStatus {
  content: string;
}

export const useSmoothStreamContent = (
  content: string,
  {
    autoDisableAnimation = true,
    enabled = true,
    preset = 'balanced',
  }: UseSmoothStreamContentOptions = {},
): UseSmoothStreamContentResult => {
  const config = STREAM_SMOOTHING_PRESET_CONFIG[preset];
  const overloadConfig = getStreamAnimationOverloadConfig(config);
  const profiler = useStreamdownProfiler();
  const [displayedContent, setDisplayedContent] = useState(content);
  const [animationStatus, setAnimationStatus] = useState<StreamAnimationAutoDisableStatus>({
    animationAutoDisabled: false,
    animationDisableReason: 'none',
    arrivalCps: config.defaultCps,
    backlog: 0,
    disableThresholdBacklog: overloadConfig.disableBacklogChars,
    disableThresholdCps: overloadConfig.disableArrivalCps,
    recoverThresholdBacklog: overloadConfig.recoverBacklogChars,
    recoverThresholdCps: overloadConfig.recoverArrivalCps,
  });

  const displayedContentRef = useRef(content);
  const displayedCountRef = useRef(countChars(content));

  const targetContentRef = useRef(content);
  const targetCharsRef = useRef([...content]);
  const targetCountRef = useRef(targetCharsRef.current.length);

  const emaCpsRef = useRef(config.defaultCps);
  const lastInputTsRef = useRef(0);
  const lastInputCountRef = useRef(targetCountRef.current);
  const chunkSizeEmaRef = useRef(1);
  const arrivalCpsEmaRef = useRef(config.defaultCps);
  const healthyRecoverySamplesRef = useRef(0);
  const animationAutoDisabledRef = useRef(false);
  const animationDisableReasonRef = useRef<StreamAnimationDisableReason>('none');

  const rafRef = useRef<number | null>(null);
  const lastFrameTsRef = useRef<number | null>(null);
  const wakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateAnimationStatus = useCallback(
    ({
      animationAutoDisabled,
      animationDisableReason,
      arrivalCps,
      backlog,
    }: {
      animationAutoDisabled: boolean;
      animationDisableReason: StreamAnimationDisableReason;
      arrivalCps: number;
      backlog: number;
    }) => {
      animationAutoDisabledRef.current = animationAutoDisabled;
      animationDisableReasonRef.current = animationDisableReason;

      setAnimationStatus((prev) => {
        const nextBacklog = Math.max(0, backlog);
        const nextArrivalCps = Math.max(0, arrivalCps);

        if (
          prev.animationAutoDisabled === animationAutoDisabled &&
          prev.animationDisableReason === animationDisableReason &&
          prev.arrivalCps === nextArrivalCps &&
          prev.backlog === nextBacklog &&
          prev.disableThresholdBacklog === overloadConfig.disableBacklogChars &&
          prev.disableThresholdCps === overloadConfig.disableArrivalCps &&
          prev.recoverThresholdBacklog === overloadConfig.recoverBacklogChars &&
          prev.recoverThresholdCps === overloadConfig.recoverArrivalCps
        ) {
          return prev;
        }

        return {
          animationAutoDisabled,
          animationDisableReason,
          arrivalCps: nextArrivalCps,
          backlog: nextBacklog,
          disableThresholdBacklog: overloadConfig.disableBacklogChars,
          disableThresholdCps: overloadConfig.disableArrivalCps,
          recoverThresholdBacklog: overloadConfig.recoverBacklogChars,
          recoverThresholdCps: overloadConfig.recoverArrivalCps,
        };
      });
    },
    [
      overloadConfig.disableArrivalCps,
      overloadConfig.disableBacklogChars,
      overloadConfig.recoverArrivalCps,
      overloadConfig.recoverBacklogChars,
    ],
  );

  const resetAnimationAutoDisable = useCallback(() => {
    updateAnimationStatus({
      animationAutoDisabled: false,
      animationDisableReason: 'none',
      arrivalCps: arrivalCpsEmaRef.current,
      backlog: 0,
    });
  }, [updateAnimationStatus]);

  const clearWakeTimer = useCallback(() => {
    if (wakeTimerRef.current !== null) {
      clearTimeout(wakeTimerRef.current);
      wakeTimerRef.current = null;
    }
  }, []);

  const stopFrameLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastFrameTsRef.current = null;
  }, []);

  const stopScheduling = useCallback(() => {
    stopFrameLoop();
    clearWakeTimer();
  }, [clearWakeTimer, stopFrameLoop]);

  const startFrameLoopRef = useRef<() => void>(() => {});

  const scheduleFrameWake = useCallback(
    (delayMs: number) => {
      clearWakeTimer();

      wakeTimerRef.current = setTimeout(
        () => {
          wakeTimerRef.current = null;
          startFrameLoopRef.current();
        },
        Math.max(1, Math.ceil(delayMs)),
      );
    },
    [clearWakeTimer],
  );

  const syncImmediate = useCallback(
    (nextContent: string, { resetAutoDisabled = false }: { resetAutoDisabled?: boolean } = {}) => {
      stopScheduling();

      const chars = [...nextContent];
      const now = getNow();

      targetContentRef.current = nextContent;
      targetCharsRef.current = chars;
      targetCountRef.current = chars.length;

      displayedContentRef.current = nextContent;
      displayedCountRef.current = chars.length;
      setDisplayedContent(nextContent);

      lastInputTsRef.current = now;
      lastInputCountRef.current = chars.length;

      if (resetAutoDisabled) {
        emaCpsRef.current = config.defaultCps;
        chunkSizeEmaRef.current = 1;
        arrivalCpsEmaRef.current = config.defaultCps;
        healthyRecoverySamplesRef.current = 0;
        animationAutoDisabledRef.current = false;
        animationDisableReasonRef.current = 'none';
      }

      updateAnimationStatus({
        animationAutoDisabled: animationAutoDisabledRef.current,
        animationDisableReason: animationDisableReasonRef.current,
        arrivalCps: arrivalCpsEmaRef.current,
        backlog: 0,
      });
    },
    [config.defaultCps, stopScheduling, updateAnimationStatus],
  );

  const startFrameLoop = useCallback(() => {
    clearWakeTimer();
    if (rafRef.current !== null) return;

    const tick = (ts: number) => {
      const frameStart = getNow();

      if (lastFrameTsRef.current === null) {
        lastFrameTsRef.current = ts;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const frameIntervalMs = Math.max(0, ts - lastFrameTsRef.current);
      const dtSeconds = Math.max(0.001, Math.min(frameIntervalMs / 1000, 0.05));
      lastFrameTsRef.current = ts;

      const targetCount = targetCountRef.current;
      const displayedCount = displayedCountRef.current;
      const backlog = targetCount - displayedCount;

      if (backlog <= 0) {
        stopFrameLoop();
        return;
      }

      const now = getNow();
      const idleMs = now - lastInputTsRef.current;
      const inputActive = idleMs <= config.activeInputWindowMs;
      const settling = !inputActive && idleMs >= config.settleAfterMs;

      const canRecoverAnimation = shouldRecoverStreamAnimation({
        activeInputWindowMs: config.activeInputWindowMs,
        animationAutoDisabled: autoDisableAnimation && animationAutoDisabledRef.current,
        arrivalCps: arrivalCpsEmaRef.current,
        backlog,
        consecutiveHealthySamples: healthyRecoverySamplesRef.current,
        idleMs,
        instantCps: 0,
        overloadConfig,
      });

      if (canRecoverAnimation) {
        resetAnimationAutoDisable();
      }

      updateAnimationStatus({
        animationAutoDisabled: animationAutoDisabledRef.current,
        animationDisableReason: animationDisableReasonRef.current,
        arrivalCps: arrivalCpsEmaRef.current,
        backlog,
      });

      const baseCps = clamp(emaCpsRef.current, config.minCps, config.maxCps);
      const baseLagChars = Math.max(1, Math.round((baseCps * config.targetBufferMs) / 1000));
      const lagUpperBound = Math.max(baseLagChars + 2, baseLagChars * 3);
      const targetLagChars = inputActive
        ? Math.round(
            clamp(baseLagChars + chunkSizeEmaRef.current * 0.35, baseLagChars, lagUpperBound),
          )
        : 0;
      const desiredDisplayed = Math.max(0, targetCount - targetLagChars);

      let currentCps: number;
      if (inputActive) {
        const backlogPressure = targetLagChars > 0 ? backlog / targetLagChars : 1;
        const chunkPressure = targetLagChars > 0 ? chunkSizeEmaRef.current / targetLagChars : 1;
        const arrivalPressure = arrivalCpsEmaRef.current / Math.max(baseCps, 1);
        const combinedPressure = clamp(
          backlogPressure * 0.6 + chunkPressure * 0.25 + arrivalPressure * 0.15,
          1,
          4.5,
        );
        const activeCap = clamp(
          config.maxActiveCps + chunkSizeEmaRef.current * 6,
          config.maxActiveCps,
          config.maxFlushCps,
        );
        currentCps = clamp(baseCps * combinedPressure, config.minCps, activeCap);
      } else if (settling) {
        // If upstream likely ended, cap the remaining tail duration so
        // we do not keep replaying old backlog for seconds.
        const drainTargetMs = clamp(backlog * 8, config.settleDrainMinMs, config.settleDrainMaxMs);
        const settleCps = (backlog * 1000) / drainTargetMs;
        currentCps = clamp(settleCps, config.flushCps, config.maxFlushCps);
      } else {
        const idleFlushCps = Math.max(
          config.flushCps,
          baseCps * 1.8,
          arrivalCpsEmaRef.current * 0.8,
        );
        currentCps = clamp(idleFlushCps, config.flushCps, config.maxFlushCps);
      }

      const urgentBacklog = inputActive && targetLagChars > 0 && backlog > targetLagChars * 2.2;
      const burstyInput = inputActive && chunkSizeEmaRef.current >= targetLagChars * 0.9;
      const minRevealChars = inputActive ? (urgentBacklog || burstyInput ? 2 : 1) : 2;
      let revealChars = Math.max(minRevealChars, Math.round(currentCps * dtSeconds));

      if (inputActive) {
        const shortfall = desiredDisplayed - displayedCount;
        if (shortfall <= 0) {
          stopFrameLoop();
          scheduleFrameWake(config.activeInputWindowMs - idleMs);

          profiler?.recordAnimationFrame({
            backlog,
            durationMs: getNow() - frameStart,
            frameIntervalMs,
            inputActive,
            revealChars: 0,
            settling,
          });
          return;
        }
        revealChars = Math.min(revealChars, shortfall, backlog);
      } else {
        revealChars = Math.min(revealChars, backlog);
      }

      const nextCount = displayedCount + revealChars;
      const segment = targetCharsRef.current.slice(displayedCount, nextCount).join('');

      if (segment) {
        const nextDisplayed = displayedContentRef.current + segment;
        displayedContentRef.current = nextDisplayed;
        displayedCountRef.current = nextCount;
        setDisplayedContent(nextDisplayed);
      } else {
        displayedContentRef.current = targetContentRef.current;
        displayedCountRef.current = targetCount;
        setDisplayedContent(targetContentRef.current);
      }

      profiler?.recordAnimationFrame({
        backlog,
        durationMs: getNow() - frameStart,
        frameIntervalMs,
        inputActive,
        revealChars: segment ? revealChars : backlog,
        settling,
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [
    clearWakeTimer,
    config.activeInputWindowMs,
    config.flushCps,
    config.maxActiveCps,
    config.maxCps,
    config.maxFlushCps,
    config.minCps,
    config.settleAfterMs,
    config.settleDrainMaxMs,
    config.settleDrainMinMs,
    config.targetBufferMs,
    autoDisableAnimation,
    overloadConfig.recoverArrivalCps,
    overloadConfig.recoverBacklogChars,
    resetAnimationAutoDisable,
    scheduleFrameWake,
    stopFrameLoop,
    updateAnimationStatus,
  ]);
  startFrameLoopRef.current = startFrameLoop;

  useEffect(() => {
    if (!enabled) {
      syncImmediate(content, { resetAutoDisabled: true });
      return;
    }

    const prevTargetContent = targetContentRef.current;
    if (content === prevTargetContent) return;

    const now = getNow();
    const appendOnly = content.startsWith(prevTargetContent);

    if (!appendOnly) {
      syncImmediate(content, { resetAutoDisabled: true });
      return;
    }

    const appended = content.slice(prevTargetContent.length);
    const appendedChars = [...appended];
    const appendedCount = appendedChars.length;

    profiler?.recordInputAppend({
      appendedChars: appendedCount,
      contentLength: countChars(content),
    });

    targetContentRef.current = content;
    targetCharsRef.current = [...targetCharsRef.current, ...appendedChars];
    targetCountRef.current += appendedCount;

    const idleMs = Math.max(0, now - lastInputTsRef.current);
    const deltaChars = targetCountRef.current - lastInputCountRef.current;
    const deltaMs = Math.max(1, idleMs);
    const instantCps = deltaChars > 0 ? (deltaChars * 1000) / deltaMs : 0;

    if (deltaChars > 0) {
      const normalizedInstantCps = clamp(instantCps, config.minCps, config.maxFlushCps * 2);
      const chunkEmaAlpha = 0.35;
      chunkSizeEmaRef.current =
        chunkSizeEmaRef.current * (1 - chunkEmaAlpha) + appendedCount * chunkEmaAlpha;
      arrivalCpsEmaRef.current =
        arrivalCpsEmaRef.current * (1 - chunkEmaAlpha) + normalizedInstantCps * chunkEmaAlpha;

      const clampedCps = clamp(instantCps, config.minCps, config.maxActiveCps);
      emaCpsRef.current = emaCpsRef.current * (1 - config.emaAlpha) + clampedCps * config.emaAlpha;
    }

    const nextBacklog = Math.max(0, targetCountRef.current - displayedCountRef.current);
    const healthyRecoverySample =
      nextBacklog <= overloadConfig.recoverBacklogChars &&
      instantCps <= overloadConfig.recoverArrivalCps;

    healthyRecoverySamplesRef.current =
      autoDisableAnimation && animationAutoDisabledRef.current && healthyRecoverySample
        ? healthyRecoverySamplesRef.current + 1
        : 0;

    const canRecoverAnimation = shouldRecoverStreamAnimation({
      activeInputWindowMs: config.activeInputWindowMs,
      animationAutoDisabled: autoDisableAnimation && animationAutoDisabledRef.current,
      arrivalCps: arrivalCpsEmaRef.current,
      backlog: nextBacklog,
      consecutiveHealthySamples: healthyRecoverySamplesRef.current,
      idleMs,
      instantCps,
      overloadConfig,
    });

    if (canRecoverAnimation) {
      healthyRecoverySamplesRef.current = 0;
      resetAnimationAutoDisable();
    }

    const disableReason =
      autoDisableAnimation && !animationAutoDisabledRef.current
        ? getStreamAnimationDisableReason({
            arrivalCps: arrivalCpsEmaRef.current,
            backlog: nextBacklog,
            overloadConfig,
          })
        : animationDisableReasonRef.current;

    if (disableReason !== 'none') {
      healthyRecoverySamplesRef.current = 0;
      animationAutoDisabledRef.current = true;
      animationDisableReasonRef.current = disableReason;
    }

    lastInputTsRef.current = now;
    lastInputCountRef.current = targetCountRef.current;

    if (animationAutoDisabledRef.current || appendedCount > config.largeAppendChars) {
      syncImmediate(content, { resetAutoDisabled: false });
      return;
    }

    updateAnimationStatus({
      animationAutoDisabled: false,
      animationDisableReason: 'none',
      arrivalCps: arrivalCpsEmaRef.current,
      backlog: nextBacklog,
    });

    startFrameLoop();
  }, [
    autoDisableAnimation,
    config.emaAlpha,
    config.activeInputWindowMs,
    config.largeAppendChars,
    config.maxActiveCps,
    config.maxCps,
    config.maxFlushCps,
    config.minCps,
    content,
    enabled,
    overloadConfig.disableArrivalCps,
    overloadConfig.disableBacklogChars,
    overloadConfig.recoverArrivalCps,
    overloadConfig.recoverBacklogChars,
    resetAnimationAutoDisable,
    startFrameLoop,
    syncImmediate,
    profiler,
    updateAnimationStatus,
  ]);

  useEffect(() => {
    return () => {
      stopScheduling();
    };
  }, [stopScheduling]);

  return {
    ...animationStatus,
    content: displayedContent,
  };
};
