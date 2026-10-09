import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const dodgeDuration = '608ms';
const dodgeEase =
  'linear(0, 0.08, 0.249, 0.437, 0.607, 0.745, 0.847, 0.917, 0.963, 0.99, 1.004, 1.011, 1.012, 1.011, 1.009, 1.007, 1.005, 1.003, 1.002, 1)';
const reducedMotion = '@media (prefers-reduced-motion: reduce)';
const dodge = `${dodgeDuration} ${dodgeEase}`;
const wrapperTransition = `padding-block-end ${dodge}, padding-block-start ${dodge}, padding-inline-end ${dodge}, padding-inline-start ${dodge}`;
const handleActive = ':is(:hover, :focus-visible)';

export const styles = stylex.create({
  actions: {
    flex: 'none',
    gap: 4,
    alignItems: 'center',
    display: 'flex',
  },
  body: {
    flex: '1',
    paddingInline: 0,
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    minHeight: 0,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  close: {
    borderRadius: 8,
    marginInlineEnd: -4,
    position: 'static',
    height: 32,
    width: 32,
  },
  footer: {
    flex: 'none',
    borderBlockStartColor: cssVar.colorBorderSecondary,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
  },
  header: {
    flex: 'none',
    borderBlockEndColor: cssVar.colorBorderSecondary,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    minHeight: 48,
  },
  headerActions: {
    flex: 'none',
    gap: 4,
    alignItems: 'center',
    display: 'flex',
  },
  panel: {
    borderRadius: 12,
    boxShadow: `${cssVar.boxShadowSecondary}, var(--lobe-ring)`,
    transformOrigin: '100% 100%',
    maxHeight: 'calc(100dvh - 32px - var(--floating-panel-reserve-block-end, 0px))',
    width: 'calc(100dvw - 32px)',
  },
  panelTop: {
    transformOrigin: '100% 0',
  },
  resizeHandle: {
    'backgroundColor': 'transparent',
    'position': 'absolute',
    'touchAction': 'none',
    'zIndex': 1,
    '::after': {
      borderRadius: 999,
      transition: 'opacity 120ms ease',
      backgroundColor: cssVar.colorPrimary,
      content: '""',
      opacity: { default: 0, [handleActive]: 0.55 },
      position: 'absolute',
    },
  },
  resizeHandleBottom: {
    'insetInline': 16,
    'cursor': 'ns-resize',
    'insetBlockEnd': -4,
    'height': 8,
    '::after': {
      insetInline: 0,
      insetBlockEnd: 3,
      height: 2,
    },
  },
  resizeHandleBottomLeft: {
    cursor: 'nesw-resize',
    insetBlockEnd: -5,
    insetInlineStart: -5,
    height: 16,
    width: 16,
  },
  resizeHandleBottomRight: {
    cursor: 'nwse-resize',
    insetBlockEnd: -5,
    insetInlineEnd: -5,
    height: 16,
    width: 16,
  },
  resizeHandleLeft: {
    'insetBlock': 16,
    'cursor': 'ew-resize',
    'insetInlineStart': -4,
    'width': 8,
    '::after': {
      insetBlock: 0,
      insetInlineStart: 3,
      width: 2,
    },
  },
  resizeHandleRight: {
    'insetBlock': 16,
    'cursor': 'ew-resize',
    'insetInlineEnd': -4,
    'width': 8,
    '::after': {
      insetBlock: 0,
      insetInlineEnd: 3,
      width: 2,
    },
  },
  resizeHandleTop: {
    'insetInline': 16,
    'cursor': 'ns-resize',
    'insetBlockStart': -4,
    'height': 8,
    '::after': {
      insetInline: 0,
      insetBlockStart: 3,
      height: 2,
    },
  },
  resizeHandleTopLeft: {
    cursor: 'nwse-resize',
    insetBlockStart: -5,
    insetInlineStart: -5,
    height: 16,
    width: 16,
  },
  resizeHandleTopRight: {
    cursor: 'nesw-resize',
    insetBlockStart: -5,
    insetInlineEnd: -5,
    height: 16,
    width: 16,
  },
  title: {
    flex: '1',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 0,
  },
  wrapper: {
    overflow: 'hidden',
    transition: wrapperTransition,
    transitionDuration: { default: null, [reducedMotion]: '0s' },
    transitionProperty: { default: null, [reducedMotion]: 'none' },
    transitionTimingFunction: { default: null, [reducedMotion]: 'ease' },
  },
});
