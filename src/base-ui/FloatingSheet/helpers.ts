/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Logarithmic damping for drag resistance beyond snap bounds.
 * Adapted from vaul.
 */
export function dampenValue(v: number): number {
  return 8 * (Math.log(v + 1) - 2);
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
