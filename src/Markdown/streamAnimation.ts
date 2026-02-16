const AUTO_STREAM_ANIMATION_DURATION_MULTIPLIER = 1.8;
const DEFAULT_AUTO_STREAM_ANIMATION_DURATION_MS = 180;
const MIN_AUTO_STREAM_ANIMATION_DURATION_MS = 150;
export const MAX_AUTO_STREAM_ANIMATION_DURATION_MS = 600;

export const resolveStreamAnimationDurationMs = (
  streamAnimationWindowMs: number,
  streamAnimationDurationMs?: number,
) => {
  if (typeof streamAnimationDurationMs === 'number') {
    return Math.max(streamAnimationDurationMs, 0);
  }

  const normalizedWindowMs = Math.max(streamAnimationWindowMs, 0);
  const base =
    normalizedWindowMs > 0
      ? normalizedWindowMs * AUTO_STREAM_ANIMATION_DURATION_MULTIPLIER
      : DEFAULT_AUTO_STREAM_ANIMATION_DURATION_MS;

  return Math.min(
    MAX_AUTO_STREAM_ANIMATION_DURATION_MS,
    Math.max(MIN_AUTO_STREAM_ANIMATION_DURATION_MS, Math.round(base)),
  );
};
