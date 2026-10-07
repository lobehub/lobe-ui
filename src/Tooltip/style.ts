import './style.css';

import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';
const layoutAnimation = ':is([data-layout-animation])';
const instant = ':is([data-instant])';
const instantOrRepop = ':is([data-instant], [data-repop])';
const popupLayoutTiming =
  ':is([data-layout-animation]):not([data-repop], [data-ending-style], [data-instant])';
const popupLayoutProperty = ':is([data-layout-animation]):not([data-repop], [data-instant])';
const popupRepopTiming = ':is([data-repop]):not([data-ending-style], [data-instant])';
const popupEndingTiming = ':is([data-ending-style]):not([data-instant])';
const positionerLayout = ':is([data-layout-animation]):not([data-instant], [data-repop])';
const startingOrEnding = ':is([data-starting-style], [data-ending-style])';
const anchorHidden = ":is([data-anchor-hidden], [data-zero-origin='true'])";
const placementTop =
  ":is([data-placement='top'], [data-placement='topLeft'], [data-placement='topRight'])";
const placementLeft =
  ":is([data-placement='left'], [data-placement='leftTop'], [data-placement='leftBottom'])";
const placementRight =
  ":is([data-placement='right'], [data-placement='rightTop'], [data-placement='rightBottom'])";

const springEnter =
  'linear(0, 0.041, 0.14, 0.268, 0.407, 0.541, 0.662, 0.765, 0.849, 0.915, 0.964, 0.998, 1.02, 1.032, 1.038, 1.039, 1.036, 1.032, 1.027, 1.022, 1.016, 1.012, 1.008, 1.005, 1.003)';
const springGlide =
  'linear(0, 0.041, 0.14, 0.268, 0.407, 0.541, 0.661, 0.765, 0.849, 0.915, 0.964, 0.998, 1.02, 1.032, 1.038, 1.039, 1.036, 1.032, 1.027, 1.022, 1.016, 1.012, 1.008, 1.005, 1.003)';

export const styles = stylex.create({
  arrow: {
    '--lobe-tooltip-arrow-offset-block': '4px',
    '--lobe-tooltip-arrow-offset-inline': '6px',
    'transition':
      'inset-inline-start var(--lobe-tooltip-layout-duration) var(--lobe-tooltip-layout-ease), inset-block-start var(--lobe-tooltip-layout-duration) var(--lobe-tooltip-layout-ease)',
    'display': 'flex',
    'insetBlockEnd': {
      'default': null,
      ":is([data-side='top'])": 'calc(var(--lobe-tooltip-arrow-offset-block) * -1)',
    },
    'insetBlockStart': {
      'default': null,
      ":is([data-side='bottom'])": 'calc(var(--lobe-tooltip-arrow-offset-block) * -1)',
    },
    'insetInlineEnd': {
      'default': null,
      ":is([data-side='left'])": 'calc(var(--lobe-tooltip-arrow-offset-inline) * -1)',
    },
    'insetInlineStart': {
      'default': null,
      ":is([data-side='right'])": 'calc(var(--lobe-tooltip-arrow-offset-inline) * -1)',
    },
    'pointerEvents': 'none',
    'position': 'absolute',
    'transform': {
      'default': null,
      ":is([data-side='left'])": 'rotate(90deg)',
      ":is([data-side='right'])": 'rotate(-90deg)',
      ":is([data-side='top'])": 'rotate(180deg)',
    },
    'transformOrigin': 'center',
    'height': 4,
    'width': 8,
  },
  arrowStroke: {
    stroke: cssVar.colorBorderSecondary,
  },
  arrowSvg: {
    fill: cssVar.colorBgElevated,
    display: 'block',
    height: '100%',
    width: '100%',
  },

  popup: {
    borderRadius: cssVar.borderRadiusSM,
    backgroundColor: cssVar.colorBgElevated,
    boxShadow: `${cssVar.boxShadowTertiary}, var(--lobe-ring)`,
    boxSizing: 'border-box',
    color: cssVar.colorTextLabel,
    fontSize: cssVar.fontSizeSM,
    lineHeight: 1.2,
    opacity: { default: null, [startingOrEnding]: 0 },
    position: 'relative',
    transform: {
      default: null,
      [startingOrEnding]:
        'translate3d(var(--lobe-tooltip-translate-x), var(--lobe-tooltip-translate-y), 0) scale(var(--lobe-tooltip-animation-scale))',
    },
    transformOrigin: 'var(--transform-origin)',
    /* `transition: none` is spelled out as longhands because StyleX layers longhands above
       shorthands. StyleX does not keep condition order, so the old cascade
       (layout < repop < ending-style < instant) is encoded with :not() guards. */
    transitionDuration: {
      default: 'var(--lobe-tooltip-fade-duration), var(--lobe-tooltip-animation-duration)',
      [instant]: '0s',
      [popupEndingTiming]: 'var(--lobe-tooltip-animation-duration-exit)',
      [popupLayoutTiming]:
        'var(--lobe-tooltip-fade-duration), var(--lobe-tooltip-animation-duration), var(--lobe-tooltip-layout-duration), var(--lobe-tooltip-layout-duration)',
      [popupRepopTiming]: '0s',
    },
    transitionProperty: {
      default: 'opacity, transform',
      [instantOrRepop]: 'none',
      [popupLayoutProperty]: 'opacity, transform, width, height',
    },
    /* Opacity gets its own monotonic curve: running it on the overshooting spring makes the
       fade look finished at ~0.96, pause, then visibly step to 1 at the clamp point — reads
       as a dropped frame. The spring stays on transform only. */
    transitionTimingFunction: {
      default: 'var(--lobe-tooltip-fade-ease), var(--lobe-tooltip-animation-ease-out)',
      [instant]: 'ease',
      [popupEndingTiming]: 'var(--lobe-tooltip-animation-ease-in)',
      [popupLayoutTiming]:
        'var(--lobe-tooltip-fade-ease), var(--lobe-tooltip-animation-ease-out), var(--lobe-tooltip-layout-ease), var(--lobe-tooltip-layout-ease)',
      [popupRepopTiming]: 'ease',
    },
    userSelect: 'none',
    /* Keep the popup on its own compositor layer for its whole lifetime: when the opacity
       transition ends the browser otherwise drops the layer and re-rasterizes with pixel
       snapping — a visible one-frame shift when the measured width is fractional
       (single-line tooltips). */
    willChange: 'transform, opacity',
    height: { default: null, [layoutAnimation]: 'var(--popup-height, auto)' },
    /* The 320px cap lives on the viewport, not here: Base UI measures content with
       --available-width set to max-content, and min(320px, max-content) is invalid, which
       recorded unclamped sizes. A percentage cap is out too — it tracks the positioner, which
       snaps to the new size and would freeze the shrink half of the morph. */
    maxWidth: 'var(--available-width)',
    /* Base UI writes the old size into --popup-width/height on a trigger switch and the new size
       one frame later; the box only morphs if width/height actually read them. */
    width: { default: null, [layoutAnimation]: 'var(--popup-width, auto)' },
  },

  positioner: {
    /* Springs baked as linear(): stiffness 700 / damping 38 (enter) and 380 / 28 (glide),
       both zeta ~0.72 with ~4% overshoot. Durations are the springs' settle times —
       change them together with the curves, not independently. */
    '--lobe-tooltip-animation-duration': { default: '280ms', [reducedMotion]: '0s' },
    '--lobe-tooltip-animation-duration-exit': { default: '100ms', [reducedMotion]: '0s' },
    '--lobe-tooltip-animation-ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
    '--lobe-tooltip-animation-ease-out': springEnter,
    '--lobe-tooltip-animation-scale': '0.97',
    '--lobe-tooltip-animation-translate': '3px',
    '--lobe-tooltip-fade-duration': { default: '160ms', [reducedMotion]: '0s' },
    '--lobe-tooltip-fade-ease': 'cubic-bezier(0.33, 1, 0.68, 1)',
    '--lobe-tooltip-layout-duration': { default: '380ms', [reducedMotion]: '0s' },
    '--lobe-tooltip-layout-ease': springGlide,
    '--lobe-tooltip-translate-x': {
      default: '0',
      [placementLeft]: 'var(--lobe-tooltip-animation-translate)',
      [placementRight]: 'calc(var(--lobe-tooltip-animation-translate) * -1)',
    },
    '--lobe-tooltip-translate-y': {
      default: 'calc(var(--lobe-tooltip-animation-translate) * -1)',
      [placementLeft]: '0',
      [placementRight]: '0',
      [placementTop]: 'var(--lobe-tooltip-animation-translate)',
    },
    /* Never show a tooltip when the anchor is hidden or the positioner falls back to (0,0). */
    'pointerEvents': { [anchorHidden]: 'none', default: null },
    'transitionDuration': {
      default: 'var(--lobe-tooltip-animation-duration)',
      [instantOrRepop]: '0s',
      [positionerLayout]: 'var(--lobe-tooltip-layout-duration)',
    },
    'transitionProperty': {
      default: 'none',
      [positionerLayout]:
        'inset-block-start, inset-inline-start, inset-inline-end, inset-block-end, transform',
    },
    'transitionTimingFunction': {
      default: 'var(--lobe-tooltip-animation-ease-out)',
      [instantOrRepop]: 'ease',
      [positionerLayout]: 'var(--lobe-tooltip-layout-ease)',
    },
    'visibility': { [anchorHidden]: 'hidden', default: null },
    'willChange': 'transform, opacity',
    'zIndex': 114_514,
    'height': 'var(--positioner-height)',
    'width': 'min(var(--positioner-width), 320px, var(--available-width))',
  },

  viewport: {
    '--lobe-tooltip-content-blur': '4px',
    '--lobe-tooltip-content-shift': '8px',
    '--lobe-tooltip-viewport-inline-padding': '8px',
    'overflow': 'clip',
    'paddingBlock': 4,
    'paddingInline': 'var(--lobe-tooltip-viewport-inline-padding)',
    'overflowWrap': 'break-word',
    'position': 'relative',
    'whiteSpace': 'normal',
    'maxWidth': 'calc(320px - 2px)',
  },
});
