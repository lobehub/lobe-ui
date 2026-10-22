import type { CSSProperties, HTMLAttributes, Ref } from 'react';

export type ProgressiveBlurPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * - `auto`: blur layers, falling back to the gradient alone under
 *   `prefers-reduced-transparency: reduce` or without `backdrop-filter` support
 * - `blur`: always render the blur layers
 * - `gradient`: never render blur layers, only a stronger color gradient
 */
export type ProgressiveBlurMode = 'auto' | 'blur' | 'gradient';

export interface ProgressiveBlurClassNames {
  /** The element wrapping `children` (wrapper usage only). */
  content?: string;
  /** The blur band laid over the edge (wrapper usage only; in overlay usage the root is the band). */
  edge?: string;
  /** The color gradient laid on top of the blur layers. */
  gradient?: string;
  /** Every blur layer. */
  layer?: string;
  root?: string;
}

export interface ProgressiveBlurStyles {
  content?: CSSProperties;
  edge?: CSSProperties;
  gradient?: CSSProperties;
  layer?: CSSProperties;
  root?: CSSProperties;
}

export interface ProgressiveBlurProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  /**
   * Without children the component is an absolutely positioned overlay for the edge of the
   * nearest positioned ancestor. With children it renders a relative container that wraps them
   * and lays the blur band over its edge.
   */
  children?: HTMLAttributes<HTMLDivElement>['children'];
  /** Class names of the semantic parts. */
  classNames?: ProgressiveBlurClassNames;
  /**
   * Tint of the contrast gradient, any CSS color or token variable.
   * @default 'var(--lobe-color-bg-layout)'
   */
  color?: string;
  /**
   * Opacity of the contrast gradient, from 0 to 1. The gradient-only fallback doubles it
   * (capped at 1) so text keeps its contrast without the blur.
   * @default 0.5
   */
  gradientOpacity?: number;
  /**
   * Size of the band along the blur axis: its height for `top` / `bottom`, its width for
   * `left` / `right`. Numbers are pixels.
   * @default 64
   */
  height?: number | string;
  /**
   * Number of stacked blur layers (1–8). Each layer doubles the blur of the previous one.
   * @default 3
   */
  layers?: number;
  /**
   * Blur at the very edge, in pixels. Clamped to 0–12.
   * @default 12
   */
  maxBlur?: number;
  /**
   * Rendering mode.
   * @default 'auto'
   */
  mode?: ProgressiveBlurMode;
  /**
   * Edge the blur sits on; the blur ramps from 0 to `maxBlur` toward it.
   * @default 'bottom'
   */
  position?: ProgressiveBlurPosition;
  ref?: Ref<HTMLDivElement>;
  /** Inline styles of the semantic parts. */
  styles?: ProgressiveBlurStyles;
}
