import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

import { toastDodge } from './dodge.stylex';

const focusVisible = ':focus-visible:not([data-lobe-focus-ring="managed"])';
const forcedColors = '@media (forced-colors: active)';
const reducedMotion = '@media (prefers-reduced-motion: reduce)';
const hover = ':hover:not(:active)';
const startingOrEnding = ':is([data-starting-style], [data-ending-style])';
const expanded = ':is([data-expanded]):not([data-starting-style], [data-ending-style])';
const swiping = ':is([data-swiping])';
const viewportOffsetX = 'var(--toast-viewport-offset-x, 16px)';
const viewportOffsetY = 'var(--toast-viewport-offset-y, 16px)';

export const styles = stylex.create({
  action: {
    borderColor: 'currentcolor',
    borderRadius: cssVar.borderRadiusSM,
    borderStyle: 'none',
    borderWidth: 'medium',
    paddingInline: 12,
    transition: 'background 0.2s, color 0.2s',
    alignItems: 'center',
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: 12,
    fontWeight: 500,
    justifyContent: 'center',
    lineHeight: 1,
    height: 28,
  },

  actionDanger: {
    '--lobe-focus-ring-color': cssVar.colorError,
    'backgroundColor': {
      'default': cssVar.colorError,
      [hover]: cssVar.colorErrorHover,
      ':active': cssVar.colorErrorActive,
    },
    'color': cssVar.colorBgLayout,
    'outlineColor': {
      default: null,
      [focusVisible]: `color-mix(in srgb, ${cssVar.colorError} 90%, transparent)`,
      [forcedColors]: { default: null, [focusVisible]: 'CanvasText' },
    },
  },

  actionGhost: {
    borderColor: {
      'default': cssVar.colorBorder,
      [hover]: cssVar.colorPrimary,
      ':active': cssVar.colorPrimaryActive,
    },
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: 'transparent',
    color: {
      'default': cssVar.colorText,
      [hover]: cssVar.colorPrimary,
      ':active': cssVar.colorPrimaryActive,
    },
  },

  actionPrimary: {
    backgroundColor: {
      'default': cssVar.colorPrimary,
      [hover]: cssVar.colorPrimaryHover,
      ':active': cssVar.colorPrimaryActive,
    },
    color: cssVar.colorBgLayout,
  },

  actionSecondary: {
    backgroundColor: {
      'default': cssVar.colorFillSecondary,
      [hover]: cssVar.colorFillTertiary,
      ':active': cssVar.colorFill,
    },
    color: cssVar.colorText,
  },

  actionText: {
    backgroundColor: {
      'default': 'transparent',
      [hover]: cssVar.colorFillTertiary,
      ':active': cssVar.colorFillSecondary,
    },
    color: cssVar.colorPrimary,
  },

  actions: {
    gap: 8,
    alignItems: 'center',
    alignSelf: 'flex-end',
    display: 'flex',
    flexGrow: 1,
    flexShrink: 0,
    justifyContent: 'flex-end',
    marginBlockStart: 8,
  },

  close: {
    padding: 0,
    borderColor: 'currentcolor',
    borderRadius: cssVar.borderRadiusSM,
    borderStyle: 'none',
    borderWidth: 'medium',
    transition: 'all 0.2s',
    alignItems: 'center',
    backgroundColor: { 'default': 'transparent', ':hover': cssVar.colorFillSecondary },
    color: { 'default': cssVar.colorTextSecondary, ':hover': cssVar.colorText },
    cursor: 'pointer',
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'center',
    marginInlineStart: 'auto',
    height: 20,
    width: 20,
  },

  content: {
    overflow: 'hidden',
    transition: 'opacity 0.2s',
    opacity: {
      'default': null,
      ':is([data-behind]):not([data-expanded])': 0,
      ':is([data-expanded])': 1,
    },
    pointerEvents: {
      'default': null,
      ':is([data-behind]):not([data-expanded])': 'none',
      ':is([data-expanded])': 'auto',
    },
  },

  contentArea: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },

  description: {
    margin: 0,
    color: cssVar.colorTextSecondary,
    fontSize: 13,
    lineHeight: 1.5,
  },

  descriptionStandalone: {
    color: cssVar.colorText,
  },

  icon: {
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'center',
  },

  root: {
    '--toast-collapsed-height': 'var(--toast-frontmost-height, var(--toast-height))',
    '--toast-gap': '12px',
    '--toast-peek': '12px',
    '--toast-scale': 'calc(1 - var(--toast-index) * 0.05)',
    '--toast-shrink': 'calc(1 - var(--toast-scale))',
    'borderRadius': `var(--toast-border-radius, ${cssVar.borderRadiusLG})`,
    'insetInline': 0,
    'paddingBlock': 12,
    'paddingInline': 16,
    'backgroundClip': 'padding-box',
    'backgroundColor': cssVar.colorBgElevated,
    'boxShadow': `${cssVar.boxShadowSecondary}, var(--lobe-ring)`,
    'boxSizing': 'border-box',
    'color': cssVar.colorText,
    'cursor': 'default',
    'opacity': {
      'default': null,
      ':is([data-limited], [data-starting-style], [data-ending-style])': 0,
    },
    'position': 'absolute',
    'transitionDuration': { default: '0.4s, 0.4s, 0.15s', [swiping]: '0s' },
    'transitionProperty': { default: 'transform, opacity, height', [swiping]: 'none' },
    'transitionTimingFunction': {
      default: 'cubic-bezier(0.22, 1, 0.36, 1), ease, ease',
      [swiping]: 'ease',
    },
    'userSelect': 'none',
    // eslint-disable-next-line @stylexjs/valid-styles -- the rule only allows numeric z-index; calc() is valid CSS
    'zIndex': 'calc(1000 - var(--toast-index))',
    'height': {
      'default': 'var(--toast-collapsed-height)',
      ':is([data-expanded])': 'var(--toast-height)',
    },
    'width': '100%',
  },

  rootBottom: {
    'insetBlock': 'auto 0',
    'transform': {
      default:
        'translateX(var(--toast-swipe-movement-x)) translateY(calc(var(--toast-swipe-movement-y) - (var(--toast-index) * var(--toast-peek)) - (var(--toast-shrink) * var(--toast-collapsed-height)))) scale(var(--toast-scale))',
      [expanded]:
        'translateX(var(--toast-swipe-movement-x)) translateY(calc(var(--toast-swipe-movement-y) + var(--toast-offset-y) * -1 + var(--toast-index) * var(--toast-gap) * -1)) scale(1)',
      [startingOrEnding]: 'translateY(150%)',
    },
    'transformOrigin': 'bottom center',
    '::after': {
      insetInline: 0,
      content: "''",
      insetBlockStart: '100%',
      position: 'absolute',
      height: 'calc(var(--toast-gap) + var(--toast-peek) + 8px)',
    },
  },

  rootTop: {
    'insetBlock': '0 auto',
    'transform': {
      default:
        'translateX(var(--toast-swipe-movement-x)) translateY(calc(var(--toast-swipe-movement-y) + (var(--toast-index) * var(--toast-peek)) + (var(--toast-shrink) * var(--toast-collapsed-height)))) scale(var(--toast-scale))',
      [expanded]:
        'translateX(var(--toast-swipe-movement-x)) translateY(calc(var(--toast-swipe-movement-y) + var(--toast-offset-y) + var(--toast-index) * var(--toast-gap))) scale(1)',
      [startingOrEnding]: 'translateY(-150%)',
    },
    'transformOrigin': 'top center',
    '::after': {
      insetInline: 0,
      content: "''",
      insetBlockEnd: '100%',
      position: 'absolute',
      height: 'calc(var(--toast-gap) + var(--toast-peek) + 8px)',
    },
  },

  title: {
    margin: 0,
    color: cssVar.colorText,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.5,
  },

  titleRow: {
    gap: 8,
    alignItems: 'flex-start',
    display: 'flex',
  },

  toastBody: {
    gap: 12,
    alignItems: 'flex-start',
    display: 'flex',
  },

  viewport: {
    outline: '0',
    position: 'fixed',
    zIndex: 100_000,
    maxWidth: `calc(100vw - ${viewportOffsetX} * 2)`,
    width: {
      'default': 'var(--toast-width, 360px)',
      '@media (width <= 480px)': `calc(100vw - ${viewportOffsetX} * 2)`,
    },
  },

  viewportBottom: {
    insetBlockEnd: viewportOffsetY,
    insetInlineStart: '50%',
    transform: 'translateX(-50%)',
  },

  viewportBottomLeft: {
    insetBlockEnd: viewportOffsetY,
    insetInlineStart: viewportOffsetX,
  },

  viewportBottomRight: {
    insetBlockEnd: viewportOffsetY,
    insetInlineEnd: viewportOffsetX,
    transform:
      'translate(calc(-1 * var(--toast-shift-x, 0px)), calc(-1 * var(--toast-shift-y, 0px)))',
    transitionDuration: { default: toastDodge.duration, [reducedMotion]: '0s' },
    transitionProperty: { default: 'transform', [reducedMotion]: 'none' },
    transitionTimingFunction: { default: toastDodge.ease, [reducedMotion]: 'ease' },
  },

  viewportTop: {
    insetBlockStart: viewportOffsetY,
    insetInlineStart: '50%',
    transform: 'translateX(-50%)',
  },

  viewportTopLeft: {
    insetBlockStart: viewportOffsetY,
    insetInlineStart: viewportOffsetX,
  },

  viewportTopRight: {
    insetBlockStart: viewportOffsetY,
    insetInlineEnd: viewportOffsetX,
  },
});

export const viewportPositionStyles = {
  'bottom': styles.viewportBottom,
  'bottom-left': styles.viewportBottomLeft,
  'bottom-right': styles.viewportBottomRight,
  'top': styles.viewportTop,
  'top-left': styles.viewportTopLeft,
  'top-right': styles.viewportTopRight,
};

export const rootPositionStyles = {
  'bottom': styles.rootBottom,
  'bottom-left': styles.rootBottom,
  'bottom-right': styles.rootBottom,
  'top': styles.rootTop,
  'top-left': styles.rootTop,
  'top-right': styles.rootTop,
};

export const actionVariantStyles = {
  danger: styles.actionDanger,
  ghost: styles.actionGhost,
  primary: styles.actionPrimary,
  secondary: styles.actionSecondary,
  text: styles.actionText,
};
