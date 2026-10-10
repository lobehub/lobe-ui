import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const softEase = 'cubic-bezier(0.32, 0.72, 0, 1)';
const startingOrEnding = ':is([data-starting-style], [data-ending-style])';
const pushTransform = 'translate(var(--drawer-push-x, 0), var(--drawer-push-y, 0))';
const edge = `var(--drawer-edge-width, 1px)`;

/* antd's boxShadowDrawer{Left,Right,Up,Down} geometry and alphas, scaled against colorShadow's own
   alpha (opaque black in light, rgba(255,255,255,0.2) in dark). Direction styles set the cast sign
   and weight styles scale the alpha, so the two compose without a style per combination. */
const castShadow = (x: number, y: number, blur: number, spread: number, alpha: number) =>
  `calc(var(--drawer-cast-x, 0) * ${x}px) calc(var(--drawer-cast-y, 0) * ${y}px) ${blur}px ${spread}px color-mix(in srgb, var(--lobe-color-shadow, #000) calc(${alpha}% * var(--drawer-cast-alpha, 1)), transparent)`;

const panelShadow = `${castShadow(6, 6, 16, 0, 8)}, ${castShadow(3, 3, 6, -4, 12)}, ${castShadow(9, 9, 28, 8, 5)}`;

export const styles = stylex.create({
  backdrop: {
    inset: 0,
    transition: `opacity 180ms ${softEase}`,
    backgroundColor: cssVar.colorBgMask,
    opacity: { default: null, [startingOrEnding]: 0 },
    position: 'fixed',
    zIndex: 1200,
  },

  popup: {
    display: 'flex',
    pointerEvents: 'none',
    position: 'fixed',
    zIndex: 1201,
    /* Clamped here rather than on the panel, so an oversized size prop shrinks the box instead of
       detaching the panel from its anchored edge. */
    maxHeight: '100dvh',
    maxWidth: '100dvw',
  },

  popupLeft: {
    insetBlock: 0,
    insetInlineStart: 0,
  },

  popupRight: {
    insetBlock: 0,
    insetInlineEnd: 0,
  },

  popupTop: {
    insetInline: 0,
    insetBlockStart: 0,
  },

  popupBottom: {
    insetInline: 0,
    insetBlockEnd: 0,
  },

  panel: {
    flex: '1',
    overflow: 'hidden',
    transition: `transform 300ms ${softEase}`,
    backgroundColor: cssVar.colorBgContainer,
    boxShadow: panelShadow,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    pointerEvents: 'auto',
    position: 'relative',
    transform: pushTransform,
    minHeight: 0,
    minWidth: 0,
  },

  panelLeft: {
    '--drawer-cast-x': '1',
    'borderInlineEndColor': cssVar.colorBorder,
    'borderInlineEndStyle': 'solid',
    'borderInlineEndWidth': edge,
    'transform': { default: pushTransform, [startingOrEnding]: 'translateX(-100%)' },
  },

  panelRight: {
    '--drawer-cast-x': '-1',
    'borderInlineStartColor': cssVar.colorBorder,
    'borderInlineStartStyle': 'solid',
    'borderInlineStartWidth': edge,
    'transform': { default: pushTransform, [startingOrEnding]: 'translateX(100%)' },
  },

  panelTop: {
    '--drawer-cast-y': '1',
    'borderBlockEndColor': cssVar.colorBorder,
    'borderBlockEndStyle': 'solid',
    'borderBlockEndWidth': edge,
    'transform': { default: pushTransform, [startingOrEnding]: 'translateY(-100%)' },
  },

  panelBottom: {
    '--drawer-cast-y': '-1',
    'borderBlockStartColor': cssVar.colorBorder,
    'borderBlockStartStyle': 'solid',
    'borderBlockStartWidth': edge,
    'transform': { default: pushTransform, [startingOrEnding]: 'translateY(100%)' },
  },

  panelRoundedLeft: {
    borderEndEndRadius: 12,
    borderStartEndRadius: 12,
  },

  panelRoundedRight: {
    borderEndStartRadius: 12,
    borderStartStartRadius: 12,
  },

  panelRoundedTop: {
    borderEndEndRadius: 12,
    borderEndStartRadius: 12,
  },

  panelRoundedBottom: {
    borderStartEndRadius: 12,
    borderStartStartRadius: 12,
  },

  panelFlush: {
    '--drawer-cast-alpha': '0',
    '--drawer-edge-width': '0',
  },

  panelBoosted: {
    '--drawer-cast-alpha': '1.75',
  },

  panelRecessed: {
    '--drawer-cast-alpha': '0.5',
  },

  header: {
    flex: 'none',
    gap: 8,
    paddingBlock: 12,
    paddingInline: 16,
    alignItems: 'center',
    borderBlockEndColor: cssVar.colorSplit,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: 56,
  },

  containerInner: {
    flex: '1',
    gap: 8,
    marginInline: 'auto',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },

  containerInnerFooter: {
    justifyContent: 'flex-end',
  },

  title: {
    margin: 0,
    color: cssVar.colorText,
    fontSize: 17,
    fontWeight: 600,
    letterSpacing: '-0.005em',
    lineHeight: 1.4,
  },

  extra: {
    flex: 'none',
    gap: 4,
    alignItems: 'center',
    display: 'flex',
    marginInlineEnd: -4,
  },

  extraFloating: {
    insetBlockStart: 12,
    insetInlineEnd: 12,
    marginInlineEnd: 0,
    position: 'absolute',
    zIndex: 1,
  },

  close: {
    'padding': 0,
    'borderColor': 'currentcolor',
    'borderRadius': 8,
    'borderStyle': 'none',
    'borderWidth': 'medium',
    'transition': `color 160ms ${softEase}, background 160ms ${softEase}, transform 160ms ${softEase}`,
    'alignItems': 'center',
    'backgroundColor': { default: 'transparent', ':hover': cssVar.colorFillSecondary },
    'color': { default: cssVar.colorTextTertiary, ':hover': cssVar.colorText },
    'cursor': 'pointer',
    'display': 'flex',
    'justifyContent': 'center',
    'position': 'relative',
    'transform': {
      default: null,
      ':hover:not(:active)': 'scale(1.04)',
      ':active': 'scale(0.96)',
    },
    'height': 32,
    'width': 32,
    '::after': {
      inset: -4,
      content: '""',
      position: 'absolute',
    },
  },

  content: {
    flex: '1',
    display: 'flex',
    minHeight: 0,
    overflowX: 'hidden',
    overflowY: 'auto',
  },

  bodyContent: {
    marginInline: 'auto',
    paddingBlock: 12,
    paddingInline: 16,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    width: '100%',
  },

  contentSidebar: {
    overflowX: 'hidden',
    overflowY: 'hidden',
  },

  bodyContentSidebar: {
    paddingBlock: 0,
    paddingInline: 0,
    flexDirection: 'row',
    height: '100%',
    minHeight: 0,
  },

  sidebar: {
    flex: 'none',
    paddingBlock: 12,
    paddingInline: 16,
    backgroundColor: cssVar.colorBgLayout,
    borderInlineEndColor: cssVar.colorBorderSecondary,
    borderInlineEndStyle: 'solid',
    borderInlineEndWidth: 1,
    overflowX: 'hidden',
    overflowY: 'auto',
  },

  sidebarContent: {
    flex: '1',
    paddingBlock: 12,
    paddingInline: 16,
    minWidth: 0,
    overflowX: 'hidden',
    overflowY: 'auto',
  },

  footer: {
    flex: 'none',
    gap: 8,
    paddingBlock: 12,
    paddingInline: 16,
    alignItems: 'center',
    borderBlockStartColor: cssVar.colorSplit,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
});
