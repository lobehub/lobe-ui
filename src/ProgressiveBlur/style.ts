import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const reducedTransparency = '@media (prefers-reduced-transparency: reduce)';
const noBackdropFilter =
  '@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))';

const direction = 'var(--lobe-progressive-blur-direction)';
const size = 'var(--lobe-progressive-blur-height)';
const opacity = 'var(--lobe-progressive-blur-gradient-opacity)';
// Without the blur the gradient alone has to carry the contrast; opacity above 1 is clamped.
const fallbackOpacity = `calc(${opacity} * 2)`;
// `-webkit-backdrop-filter` is set inline by the component (LAYER_WEBKIT_BACKDROP_FILTER):
// StyleX rejects vendor-prefixed keys.
// lightningcss adds `-webkit-mask-image` for the build targets.
const layerBlur = 'blur(var(--lobe-progressive-blur-layer-blur))';
// The mask only reads alpha, so the opaque stop color is irrelevant to the theme.
const layerMask = `linear-gradient(${direction}, transparent var(--lobe-progressive-blur-layer-start), #000 var(--lobe-progressive-blur-layer-end))`;

export const styles = stylex.create({
  block: {
    '--lobe-progressive-blur-color': cssVar.colorBgLayout,
    '--lobe-progressive-blur-gradient-opacity': '0.5',
    '--lobe-progressive-blur-height': '64px',
  },
  bottom: {
    '--lobe-progressive-blur-direction': 'to bottom',
    'bottom': 0,
    'height': size,
    'left': 0,
    'right': 0,
  },
  content: {
    flex: '1',
    overflow: 'auto',
    minHeight: 0,
    minWidth: 0,
  },
  edge: {
    contain: 'paint',
    pointerEvents: 'none',
    position: 'absolute',
  },
  gradient: {
    inset: 0,
    backgroundImage: `linear-gradient(${direction}, transparent, var(--lobe-progressive-blur-color))`,
    opacity,
    position: 'absolute',
  },
  gradientAuto: {
    opacity: {
      default: opacity,
      [noBackdropFilter]: fallbackOpacity,
      [reducedTransparency]: fallbackOpacity,
    },
  },
  gradientOnly: {
    opacity: fallbackOpacity,
  },
  layer: {
    inset: 0,
    backdropFilter: layerBlur,
    maskImage: layerMask,
    position: 'absolute',
  },
  layerAuto: {
    display: {
      default: null,
      [noBackdropFilter]: 'none',
      [reducedTransparency]: 'none',
    },
  },
  left: {
    '--lobe-progressive-blur-direction': 'to left',
    'bottom': 0,
    'left': 0,
    'top': 0,
    'width': size,
  },
  right: {
    '--lobe-progressive-blur-direction': 'to right',
    'bottom': 0,
    'right': 0,
    'top': 0,
    'width': size,
  },
  top: {
    '--lobe-progressive-blur-direction': 'to top',
    'height': size,
    'left': 0,
    'right': 0,
    'top': 0,
  },
  wrapper: {
    overflow: 'hidden',
    contain: 'paint',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    minHeight: 0,
  },
});
