import type { DivProps } from '@/types';

export interface GrainientProps extends DivProps {
  /**
   * Angle of the color blend, in degrees.
   * @default 0
   */
  blendAngle?: number;
  /**
   * Softness of the color edges.
   * @default 0.05
   */
  blendSoftness?: number;
  /**
   * Horizontal offset of the field center.
   * @default 0
   */
  centerX?: number;
  /**
   * Vertical offset of the field center.
   * @default 0
   */
  centerY?: number;
  /**
   * First color stop, as hex.
   * @default '#FF9FFC'
   */
  color1?: string;
  /**
   * Second color stop, as hex.
   * @default '#5227FF'
   */
  color2?: string;
  /**
   * Third color stop, as hex.
   * @default '#B497CF'
   */
  color3?: string;
  /**
   * Shifts the blend toward color1 (negative) or color3 (positive).
   * @default 0
   */
  colorBalance?: number;
  /**
   * Output contrast.
   * @default 1.5
   */
  contrast?: number;
  /**
   * Output gamma.
   * @default 1
   */
  gamma?: number;
  /**
   * Film grain strength. 0 turns it off.
   * @default 0.1
   */
  grainAmount?: number;
  /**
   * Animate the grain with time.
   * @default false
   */
  grainAnimated?: boolean;
  /**
   * Film grain scale.
   * @default 2
   */
  grainScale?: number;
  /**
   * Wash the colors toward white for a light surface. `'auto'` follows the current theme.
   * @default false
   */
  lightMode?: boolean | 'auto';
  /**
   * Scale of the rotation noise.
   * @default 2
   */
  noiseScale?: number;
  /**
   * Noise-driven rotation, in degrees.
   * @default 500
   */
  rotationAmount?: number;
  /**
   * Output saturation.
   * @default 1
   */
  saturation?: number;
  /**
   * Animation speed. A still frame is drawn when reduced motion is preferred.
   * @default 0.25
   */
  timeSpeed?: number;
  /**
   * Warp amplitude divisor; higher is calmer.
   * @default 50
   */
  warpAmplitude?: number;
  /**
   * Frequency of the warp waves.
   * @default 5
   */
  warpFrequency?: number;
  /**
   * Speed of the warp waves.
   * @default 2
   */
  warpSpeed?: number;
  /**
   * How strongly the field is warped.
   * @default 1
   */
  warpStrength?: number;
  /**
   * Zoom of the field.
   * @default 0.9
   */
  zoom?: number;
}
