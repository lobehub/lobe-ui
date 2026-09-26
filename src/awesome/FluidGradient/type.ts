import type { LandingPalette } from '@/awesome/landingTokens';
import type { DivProps } from '@/types';

export interface FluidGradientProps extends DivProps {
  /**
   * Three color stops blended by the shader. Defaults to the landing palette for the current theme.
   */
  colors?: LandingPalette;
  /**
   * Peak opacity of the texture, from 0 to 1.
   * @default 0.45
   */
  intensity?: number;
  /**
   * Animation speed multiplier. The texture renders a still frame when reduced motion is preferred.
   * @default 1
   */
  speed?: number;
}
