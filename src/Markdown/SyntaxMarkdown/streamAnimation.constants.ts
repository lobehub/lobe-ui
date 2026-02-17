export const STREAM_ANIMATION_CLASS_NAME = 'animate-stream-char';

export const STREAM_ANIMATION_SCOPE_TAGS = [
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'li',
  'strong',
] as const;

export const STREAM_ANIMATION_EXCLUDED_TAGS = ['code', 'pre', 'kbd', 'script', 'style'] as const;

export const STREAM_ANIMATION_DEFAULTS = {
  backlogRate: 0.35,
  overlapMs: 120,
  windowMs: 100,
} as const;

export const STREAM_ANIMATION_LIMITS = {
  maxCharDelayMs: 42,
  maxCharDurationMs: 220,
  maxSegmentPlayMs: 1200,
  minCharDelayMs: 3,
  minCharDurationMs: 90,
  minSegmentPlayMs: 40,
  minWindowMs: 16,
} as const;

export const STREAM_ANIMATION_PLUGIN_DEFAULTS = {
  charDurationMs: 120,
  minCharDurationMs: 40,
  tailChars: 0,
} as const;

export const STREAM_ANIMATION_REHYPE_FALLBACK = {
  charDurationMs: 140,
  delayStepMs: 0,
  tailChars: Number.MAX_SAFE_INTEGER,
} as const;

export const STREAM_ANIMATION_TUNING = {
  charDurationMultiplier: 4,
  overlapLeadRatio: 0.45,
} as const;

export const STREAM_ANIMATION_DEMO_CONTROLS = {
  backlogRate: {
    defaultValue: STREAM_ANIMATION_DEFAULTS.backlogRate,
    max: 1.5,
    min: 0,
    step: 0.05,
  },
  overlapMs: {
    defaultValue: STREAM_ANIMATION_DEFAULTS.overlapMs,
    max: 220,
    min: 0,
    step: 10,
  },
  windowMs: {
    defaultValue: STREAM_ANIMATION_DEFAULTS.windowMs,
    max: 400,
    min: STREAM_ANIMATION_LIMITS.minWindowMs,
    step: 4,
  },
} as const;
