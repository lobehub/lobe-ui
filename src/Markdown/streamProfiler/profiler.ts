import { type StreamAnimationDisableReason } from '@/Markdown/SyntaxMarkdown/streamAnimationAutoDisable';
import { type BlockState } from '@/Markdown/SyntaxMarkdown/useStreamQueue';

export type StreamdownProfilerPhase = 'mount' | 'nested-update' | 'update';

export interface StreamdownMetricSummary {
  avgMs: number;
  count: number;
  lastMs: number;
  maxMs: number;
  totalMs: number;
}

export interface StreamdownRootSummary extends StreamdownMetricSummary {
  lastBaseDuration: number;
  lastBlockCount: number;
  lastPhase: StreamdownProfilerPhase;
  lastTextLength: number;
  maxBaseDuration: number;
  maxBlockCount: number;
  maxTextLength: number;
  mountCount: number;
  updateCount: number;
}

export interface StreamdownBlockSummary extends StreamdownMetricSummary {
  blockChars: number;
  blockIndex: number;
  blockKey: string;
  lastPhase: StreamdownProfilerPhase;
  lastState: BlockState;
  mountCount: number;
  updateCount: number;
}

export interface StreamdownCalculationSummary extends StreamdownMetricSummary {
  lastItemCount: number;
  lastTextLength: number;
  maxItemCount: number;
  name: string;
}

export interface StreamdownAnimationSummary extends StreamdownMetricSummary {
  animationAutoDisabled: boolean;
  disableCount: number;
  lastArrivalCps: number;
  lastBacklog: number;
  lastDisableReason: StreamAnimationDisableReason;
  lastInputActive: boolean;
  lastRevealChars: number;
  lastSettling: boolean;
  maxArrivalCps: number;
  maxBacklog: number;
  maxRevealChars: number;
  recoverThresholdBacklog: number;
  recoverThresholdCps: number;
  revealFrameCount: number;
  skippedFrameCount: number;
  slowFrameCount: number;
  thresholdBacklog: number;
  thresholdCps: number;
}

export interface StreamdownFpsSummary {
  avgFps: number;
  currentFps: number;
  index: number;
  maxFps: number;
  minFps: number;
  samples: number[];
  targetFps: number;
}

export interface StreamdownInputSummary {
  avgChars: number;
  count: number;
  lastChars: number;
  lastContentLength: number;
  maxChars: number;
  totalChars: number;
}

export interface StreamdownProfilerSnapshot {
  animation: StreamdownAnimationSummary;
  blocks: StreamdownBlockSummary[];
  blocksAggregate: StreamdownMetricSummary & {
    trackedCount: number;
  };
  calculations: StreamdownCalculationSummary[];
  createdAt: number;
  fps: StreamdownFpsSummary;
  input: StreamdownInputSummary;
  label: string;
  root: StreamdownRootSummary;
  sessionId: number;
  updatedAt: number;
}

export interface StreamdownRootCommitSample {
  actualDuration: number;
  baseDuration: number;
  blockCount: number;
  phase: StreamdownProfilerPhase;
  textLength: number;
}

export interface StreamdownBlockCommitSample {
  actualDuration: number;
  baseDuration: number;
  blockChars: number;
  blockIndex: number;
  blockKey: string;
  phase: StreamdownProfilerPhase;
  state: BlockState;
}

export interface StreamdownCalculationSample {
  durationMs: number;
  itemCount?: number;
  name: string;
  textLength?: number;
}

export interface StreamdownAnimationFrameSample {
  backlog: number;
  durationMs: number;
  frameIntervalMs?: number;
  inputActive: boolean;
  revealChars: number;
  settling: boolean;
}

export interface StreamdownAnimationModeSample {
  animationAutoDisabled: boolean;
  arrivalCps: number;
  backlog: number;
  reason: StreamAnimationDisableReason;
  recoverThresholdBacklog: number;
  recoverThresholdCps: number;
  thresholdBacklog: number;
  thresholdCps: number;
}

export interface StreamdownInputAppendSample {
  appendedChars: number;
  contentLength: number;
}

export interface StreamdownProfiler {
  getSnapshot: () => StreamdownProfilerSnapshot;
  recordAnimationFrame: (sample: StreamdownAnimationFrameSample) => void;
  recordAnimationMode: (sample: StreamdownAnimationModeSample) => void;
  recordBlockCommit: (sample: StreamdownBlockCommitSample) => void;
  recordCalculation: (sample: StreamdownCalculationSample) => void;
  recordInputAppend: (sample: StreamdownInputAppendSample) => void;
  recordRootCommit: (sample: StreamdownRootCommitSample) => void;
  reset: (label?: string) => void;
  subscribe: (listener: () => void) => () => void;
}

export interface CreateStreamdownProfilerOptions {
  label?: string;
  maxBlocks?: number;
  notifyIntervalMs?: number;
}

interface MutableMetric {
  count: number;
  lastMs: number;
  maxMs: number;
  totalMs: number;
}

interface MutableRootSummary extends MutableMetric {
  lastBaseDuration: number;
  lastBlockCount: number;
  lastPhase: StreamdownProfilerPhase;
  lastTextLength: number;
  maxBaseDuration: number;
  maxBlockCount: number;
  maxTextLength: number;
  mountCount: number;
  updateCount: number;
}

interface MutableBlockSummary extends MutableMetric {
  blockChars: number;
  blockIndex: number;
  blockKey: string;
  lastPhase: StreamdownProfilerPhase;
  lastState: BlockState;
  mountCount: number;
  updateCount: number;
}

interface MutableCalculationSummary extends MutableMetric {
  lastItemCount: number;
  lastTextLength: number;
  maxItemCount: number;
  name: string;
}

interface MutableAnimationSummary extends MutableMetric {
  animationAutoDisabled: boolean;
  disableCount: number;
  lastArrivalCps: number;
  lastBacklog: number;
  lastDisableReason: StreamAnimationDisableReason;
  lastInputActive: boolean;
  lastRevealChars: number;
  lastSettling: boolean;
  maxArrivalCps: number;
  maxBacklog: number;
  maxRevealChars: number;
  recoverThresholdBacklog: number;
  recoverThresholdCps: number;
  revealFrameCount: number;
  skippedFrameCount: number;
  slowFrameCount: number;
  thresholdBacklog: number;
  thresholdCps: number;
}

interface MutableFpsSummary {
  currentFps: number;
  frameCount: number;
  index: number;
  maxFps: number;
  minFps: number;
  samples: number[];
  totalFrameIntervalMs: number;
}

interface MutableInputSummary {
  count: number;
  lastChars: number;
  lastContentLength: number;
  maxChars: number;
  totalChars: number;
}

interface MutableStreamdownProfilerState {
  animation: MutableAnimationSummary;
  blocks: Map<string, MutableBlockSummary>;
  blocksAggregate: MutableMetric;
  calculations: Map<string, MutableCalculationSummary>;
  createdAt: number;
  fps: MutableFpsSummary;
  input: MutableInputSummary;
  label: string;
  root: MutableRootSummary;
  sessionId: number;
  updatedAt: number;
}

const DEFAULT_LABEL = 'streamdown';
const DEFAULT_MAX_BLOCKS = 12;
const DEFAULT_NOTIFY_INTERVAL_MS = 120;
const DEFAULT_TARGET_FPS = 60;
const MAX_FPS_SAMPLES = 90;
const MAX_TRACKED_FPS = 120;
const SLOW_FRAME_JS_BUDGET_MS = 4;

const getNow = () => {
  return typeof performance === 'undefined' ? Date.now() : performance.now();
};

const createMetric = (): MutableMetric => ({
  count: 0,
  lastMs: 0,
  maxMs: 0,
  totalMs: 0,
});

const toMetricSummary = (metric: MutableMetric): StreamdownMetricSummary => ({
  avgMs: metric.count === 0 ? 0 : metric.totalMs / metric.count,
  count: metric.count,
  lastMs: metric.lastMs,
  maxMs: metric.maxMs,
  totalMs: metric.totalMs,
});

const clampDuration = (durationMs: number) => {
  if (!Number.isFinite(durationMs)) return 0;
  return Math.max(0, durationMs);
};

const applyMetric = (metric: MutableMetric, durationMs: number) => {
  const safeDuration = clampDuration(durationMs);

  metric.count += 1;
  metric.lastMs = safeDuration;
  metric.maxMs = Math.max(metric.maxMs, safeDuration);
  metric.totalMs += safeDuration;
};

const createRootSummary = (): MutableRootSummary => ({
  ...createMetric(),
  lastBaseDuration: 0,
  lastBlockCount: 0,
  lastPhase: 'mount',
  lastTextLength: 0,
  maxBaseDuration: 0,
  maxBlockCount: 0,
  maxTextLength: 0,
  mountCount: 0,
  updateCount: 0,
});

const createAnimationSummary = (): MutableAnimationSummary => ({
  ...createMetric(),
  animationAutoDisabled: false,
  disableCount: 0,
  lastArrivalCps: 0,
  lastBacklog: 0,
  lastDisableReason: 'none',
  lastInputActive: false,
  lastRevealChars: 0,
  lastSettling: false,
  maxArrivalCps: 0,
  maxBacklog: 0,
  maxRevealChars: 0,
  revealFrameCount: 0,
  recoverThresholdBacklog: 0,
  recoverThresholdCps: 0,
  skippedFrameCount: 0,
  slowFrameCount: 0,
  thresholdBacklog: 0,
  thresholdCps: 0,
});

const createFpsSummary = (): MutableFpsSummary => ({
  currentFps: 0,
  frameCount: 0,
  index: 0,
  maxFps: 0,
  minFps: 0,
  samples: [],
  totalFrameIntervalMs: 0,
});

const createInputSummary = (): MutableInputSummary => ({
  count: 0,
  lastChars: 0,
  lastContentLength: 0,
  maxChars: 0,
  totalChars: 0,
});

const createState = (label: string, sessionId: number): MutableStreamdownProfilerState => {
  const now = getNow();

  return {
    animation: createAnimationSummary(),
    blocks: new Map(),
    blocksAggregate: createMetric(),
    calculations: new Map(),
    createdAt: now,
    fps: createFpsSummary(),
    input: createInputSummary(),
    label,
    root: createRootSummary(),
    sessionId,
    updatedAt: now,
  };
};

const clampFps = (fps: number) => {
  if (!Number.isFinite(fps)) return 0;
  return Math.max(0, Math.min(fps, MAX_TRACKED_FPS));
};

const buildSnapshot = (
  state: MutableStreamdownProfilerState,
  maxBlocks: number,
): StreamdownProfilerSnapshot => {
  const blocks = [...state.blocks.values()]
    .sort((left, right) => {
      if (right.count !== left.count) return right.count - left.count;
      if (right.totalMs !== left.totalMs) return right.totalMs - left.totalMs;
      return left.blockIndex - right.blockIndex;
    })
    .slice(0, maxBlocks)
    .map((block) => ({
      ...toMetricSummary(block),
      blockChars: block.blockChars,
      blockIndex: block.blockIndex,
      blockKey: block.blockKey,
      lastPhase: block.lastPhase,
      lastState: block.lastState,
      mountCount: block.mountCount,
      updateCount: block.updateCount,
    }));

  const calculations = [...state.calculations.values()]
    .sort((left, right) => {
      if (right.totalMs !== left.totalMs) return right.totalMs - left.totalMs;
      return right.count - left.count;
    })
    .map((calculation) => ({
      ...toMetricSummary(calculation),
      lastItemCount: calculation.lastItemCount,
      lastTextLength: calculation.lastTextLength,
      maxItemCount: calculation.maxItemCount,
      name: calculation.name,
    }));

  return {
    animation: {
      ...toMetricSummary(state.animation),
      animationAutoDisabled: state.animation.animationAutoDisabled,
      disableCount: state.animation.disableCount,
      lastArrivalCps: state.animation.lastArrivalCps,
      lastBacklog: state.animation.lastBacklog,
      lastDisableReason: state.animation.lastDisableReason,
      lastInputActive: state.animation.lastInputActive,
      lastRevealChars: state.animation.lastRevealChars,
      lastSettling: state.animation.lastSettling,
      maxArrivalCps: state.animation.maxArrivalCps,
      maxBacklog: state.animation.maxBacklog,
      maxRevealChars: state.animation.maxRevealChars,
      revealFrameCount: state.animation.revealFrameCount,
      recoverThresholdBacklog: state.animation.recoverThresholdBacklog,
      recoverThresholdCps: state.animation.recoverThresholdCps,
      skippedFrameCount: state.animation.skippedFrameCount,
      slowFrameCount: state.animation.slowFrameCount,
      thresholdBacklog: state.animation.thresholdBacklog,
      thresholdCps: state.animation.thresholdCps,
    },
    blocks,
    blocksAggregate: {
      ...toMetricSummary(state.blocksAggregate),
      trackedCount: state.blocks.size,
    },
    calculations,
    createdAt: state.createdAt,
    fps: {
      avgFps:
        state.fps.frameCount === 0 || state.fps.totalFrameIntervalMs <= 0
          ? 0
          : clampFps((state.fps.frameCount * 1000) / state.fps.totalFrameIntervalMs),
      currentFps: state.fps.currentFps,
      index: state.fps.index,
      maxFps: state.fps.maxFps,
      minFps: state.fps.minFps,
      samples: [...state.fps.samples],
      targetFps: DEFAULT_TARGET_FPS,
    },
    input: {
      avgChars: state.input.count === 0 ? 0 : state.input.totalChars / state.input.count,
      count: state.input.count,
      lastChars: state.input.lastChars,
      lastContentLength: state.input.lastContentLength,
      maxChars: state.input.maxChars,
      totalChars: state.input.totalChars,
    },
    label: state.label,
    root: {
      ...toMetricSummary(state.root),
      lastBaseDuration: state.root.lastBaseDuration,
      lastBlockCount: state.root.lastBlockCount,
      lastPhase: state.root.lastPhase,
      lastTextLength: state.root.lastTextLength,
      maxBaseDuration: state.root.maxBaseDuration,
      maxBlockCount: state.root.maxBlockCount,
      maxTextLength: state.root.maxTextLength,
      mountCount: state.root.mountCount,
      updateCount: state.root.updateCount,
    },
    sessionId: state.sessionId,
    updatedAt: state.updatedAt,
  };
};

export const createStreamdownProfiler = ({
  label = DEFAULT_LABEL,
  maxBlocks = DEFAULT_MAX_BLOCKS,
  notifyIntervalMs = DEFAULT_NOTIFY_INTERVAL_MS,
}: CreateStreamdownProfilerOptions = {}): StreamdownProfiler => {
  let state = createState(label, 1);
  let snapshot = buildSnapshot(state, maxBlocks);
  let notifyHandle: ReturnType<typeof setTimeout> | null = null;
  const listeners = new Set<() => void>();

  const notifyListeners = () => {
    for (const listener of listeners) {
      listener();
    }
  };

  const flushNotifications = () => {
    if (notifyHandle) {
      clearTimeout(notifyHandle);
      notifyHandle = null;
    }

    notifyListeners();
  };

  const scheduleNotify = () => {
    if (listeners.size === 0 || notifyHandle) return;

    notifyHandle = setTimeout(() => {
      notifyHandle = null;
      notifyListeners();
    }, notifyIntervalMs);
  };

  const commitMutation = (mutate: () => void) => {
    mutate();
    state.updatedAt = getNow();
    snapshot = buildSnapshot(state, maxBlocks);
    scheduleNotify();
  };

  return {
    getSnapshot: () => snapshot,
    recordAnimationFrame: (sample) => {
      commitMutation(() => {
        applyMetric(state.animation, sample.durationMs);

        state.animation.lastBacklog = Math.max(0, sample.backlog);
        state.animation.lastInputActive = sample.inputActive;
        state.animation.lastRevealChars = Math.max(0, sample.revealChars);
        state.animation.lastSettling = sample.settling;
        state.animation.maxBacklog = Math.max(state.animation.maxBacklog, sample.backlog);
        state.animation.maxRevealChars = Math.max(
          state.animation.maxRevealChars,
          sample.revealChars,
        );

        if (sample.durationMs >= SLOW_FRAME_JS_BUDGET_MS) {
          state.animation.slowFrameCount += 1;
        }

        if (sample.revealChars > 0) {
          state.animation.revealFrameCount += 1;
        } else {
          state.animation.skippedFrameCount += 1;
        }

        const frameIntervalMs = sample.frameIntervalMs;
        if (frameIntervalMs && Number.isFinite(frameIntervalMs) && frameIntervalMs > 0) {
          const fps = clampFps(1000 / frameIntervalMs);

          state.fps.currentFps = fps;
          state.fps.frameCount += 1;
          state.fps.index = Math.round(Math.min(1, fps / DEFAULT_TARGET_FPS) * 100);
          state.fps.maxFps = Math.max(state.fps.maxFps, fps);
          state.fps.minFps = state.fps.minFps === 0 ? fps : Math.min(state.fps.minFps, fps);
          state.fps.totalFrameIntervalMs += frameIntervalMs;
          state.fps.samples.push(fps);

          if (state.fps.samples.length > MAX_FPS_SAMPLES) {
            state.fps.samples.shift();
          }
        }
      });
    },
    recordAnimationMode: (sample) => {
      commitMutation(() => {
        if (sample.animationAutoDisabled && !state.animation.animationAutoDisabled) {
          state.animation.disableCount += 1;
        }

        state.animation.animationAutoDisabled = sample.animationAutoDisabled;
        state.animation.lastArrivalCps = Math.max(0, sample.arrivalCps);
        state.animation.lastBacklog = Math.max(0, sample.backlog);
        state.animation.lastDisableReason = sample.reason;
        state.animation.maxArrivalCps = Math.max(state.animation.maxArrivalCps, sample.arrivalCps);
        state.animation.maxBacklog = Math.max(state.animation.maxBacklog, sample.backlog);
        state.animation.recoverThresholdBacklog = Math.max(0, sample.recoverThresholdBacklog);
        state.animation.recoverThresholdCps = Math.max(0, sample.recoverThresholdCps);
        state.animation.thresholdBacklog = Math.max(0, sample.thresholdBacklog);
        state.animation.thresholdCps = Math.max(0, sample.thresholdCps);
      });
    },
    recordBlockCommit: (sample) => {
      commitMutation(() => {
        const key = sample.blockKey;
        const block =
          state.blocks.get(key) ??
          ({
            ...createMetric(),
            blockChars: sample.blockChars,
            blockIndex: sample.blockIndex,
            blockKey: sample.blockKey,
            lastPhase: sample.phase,
            lastState: sample.state,
            mountCount: 0,
            updateCount: 0,
          } satisfies MutableBlockSummary);

        applyMetric(block, sample.actualDuration);
        applyMetric(state.blocksAggregate, sample.actualDuration);

        block.blockChars = sample.blockChars;
        block.blockIndex = sample.blockIndex;
        block.lastPhase = sample.phase;
        block.lastState = sample.state;

        if (sample.phase === 'mount') {
          block.mountCount += 1;
        } else {
          block.updateCount += 1;
        }

        state.blocks.set(key, block);
      });
    },
    recordCalculation: (sample) => {
      if (!sample.name) return;

      commitMutation(() => {
        const calculation =
          state.calculations.get(sample.name) ??
          ({
            ...createMetric(),
            lastItemCount: 0,
            lastTextLength: 0,
            maxItemCount: 0,
            name: sample.name,
          } satisfies MutableCalculationSummary);

        applyMetric(calculation, sample.durationMs);

        const safeItemCount = Math.max(0, sample.itemCount ?? 0);
        const safeTextLength = Math.max(0, sample.textLength ?? 0);

        calculation.lastItemCount = safeItemCount;
        calculation.lastTextLength = safeTextLength;
        calculation.maxItemCount = Math.max(calculation.maxItemCount, safeItemCount);

        state.calculations.set(sample.name, calculation);
      });
    },
    recordInputAppend: (sample) => {
      if (sample.appendedChars <= 0) return;

      commitMutation(() => {
        state.input.count += 1;
        state.input.lastChars = sample.appendedChars;
        state.input.lastContentLength = sample.contentLength;
        state.input.maxChars = Math.max(state.input.maxChars, sample.appendedChars);
        state.input.totalChars += sample.appendedChars;
      });
    },
    recordRootCommit: (sample) => {
      commitMutation(() => {
        applyMetric(state.root, sample.actualDuration);

        state.root.lastBaseDuration = clampDuration(sample.baseDuration);
        state.root.lastBlockCount = Math.max(0, sample.blockCount);
        state.root.lastPhase = sample.phase;
        state.root.lastTextLength = Math.max(0, sample.textLength);
        state.root.maxBaseDuration = Math.max(state.root.maxBaseDuration, sample.baseDuration);
        state.root.maxBlockCount = Math.max(state.root.maxBlockCount, sample.blockCount);
        state.root.maxTextLength = Math.max(state.root.maxTextLength, sample.textLength);

        if (sample.phase === 'mount') {
          state.root.mountCount += 1;
        } else {
          state.root.updateCount += 1;
        }
      });
    },
    reset: (nextLabel = state.label) => {
      state = createState(nextLabel, state.sessionId + 1);
      snapshot = buildSnapshot(state, maxBlocks);
      flushNotifications();
    },
    subscribe: (listener) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
};
