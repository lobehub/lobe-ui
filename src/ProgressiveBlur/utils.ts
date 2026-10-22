export const PROGRESSIVE_BLUR_MAX_BLUR = 12;
export const PROGRESSIVE_BLUR_MAX_LAYERS = 8;

/** Inline counterpart of the layer's `backdrop-filter`, which StyleX cannot vendor-prefix. */
export const LAYER_WEBKIT_BACKDROP_FILTER = 'blur(var(--lobe-progressive-blur-layer-blur))';

const round = (value: number) => Math.round(value * 1000) / 1000;

const clamp = (value: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min;

export interface ProgressiveBlurLayer {
  /** Blur radius in px. */
  blur: number;
  /** Mask stop (percent along the axis) where the layer is fully applied. */
  end: number;
  /** Mask stop (percent along the axis) where the layer starts to apply. */
  start: number;
}

/**
 * Splits the band into `layers` segments. Layer `i` fades in over segment `i` and stays on up
 * to the edge, and its blur doubles at each step up to `maxBlur`, so the stack ramps from 0 to
 * `maxBlur` toward the edge.
 */
export const getBlurLayers = (layers: number, maxBlur: number): ProgressiveBlurLayer[] => {
  const count = Math.round(clamp(layers, 1, PROGRESSIVE_BLUR_MAX_LAYERS));
  const blur = clamp(maxBlur, 0, PROGRESSIVE_BLUR_MAX_BLUR);

  return Array.from({ length: count }, (_, index) => ({
    blur: round(blur / 2 ** (count - 1 - index)),
    end: round(((index + 1) / count) * 100),
    start: round((index / count) * 100),
  }));
};

export const toCssSize = (value: number | string) =>
  typeof value === 'number' ? `${value}px` : value;

export const clampOpacity = (value: number) => clamp(value, 0, 1);
