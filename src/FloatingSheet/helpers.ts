/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Rubber-band damping for drag resistance beyond snap bounds.
 * Returns 0 when v <= 0, near 1:1 for small v, then grows logarithmically.
 */
export function dampenValue(v: number): number {
  if (v <= 0) return 0;
  return 8 * Math.log1p(v / 8);
}

/**
 * Resolve a size value to pixels.
 * 0 < v <= 1 → fraction of containerHeight.
 * v > 1 → pixel value.
 * v === 0 → 0.
 */
export function resolveSize(value: number, containerHeight: number): number {
  if (value === 0) return 0;
  if (value > 0 && value <= 1) return value * containerHeight;
  return value;
}
