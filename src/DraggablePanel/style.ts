import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

import { draggablePanelMarker, draggablePanelToggleMarker } from './marker.stylex';

export const SEAM_ARROW = {
  depth: 6.5,
  half: 11,
  lead: 6,
  stroke: 1.25,
};

const expandable = ':is([data-expandable="true"])';
const engaged = `${expandable}:is(:hover, :focus-within, [data-expand="false"])`;
const open = `${engaged}:not([data-resizing="true"])`;
const hovered = `${expandable}:is(:hover, :focus-within)`;

const seamBorder = ':is([data-border="false"])';
const seamResizing = ':is([data-resizing]):not([data-border="false"])';
const seamHover = ':hover:not([data-resizing], [data-border="false"])';

const seamTransition = `width 0.25s ${cssVar.motionEaseOut}, height 0.25s ${cssVar.motionEaseOut}, background 0.16s ${cssVar.motionEaseOut}`;

export const styles = stylex.create({
  body: {
    padding: 16,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  bottomFloat: {
    insetInline: 0,
    insetBlockEnd: 0,
    position: 'absolute',
    zIndex: 200,
    width: '100%',
  },
  container: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  content: {
    backgroundColor: 'var(--draggable-panel-bg, transparent)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    minHeight: 0,
    minWidth: 0,
  },
  fixed: {
    position: 'relative',
  },
  footer: {
    flex: 'none',
    gap: 8,
    paddingBlock: 8,
    paddingInline: 16,
    alignItems: 'center',
    borderBlockStartColor: cssVar.colorBorderSecondary,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
  },
  handle: {
    'outline': { 'default': null, ':focus-visible': `2px solid ${cssVar.colorPrimary}` },
    'outlineOffset': { 'default': null, ':focus-visible': -2 },
    'position': 'absolute',
    'touchAction': 'none',
    'zIndex': 100,
    '::after': {
      transition: seamTransition,
      backgroundColor: {
        default: cssVar.colorBorderSecondary,
        [seamBorder]: 'transparent',
        [seamHover]: cssVar.colorFill,
        [seamResizing]: cssVar.colorPrimary,
      },
      content: "''",
      position: 'absolute',
    },
    '::before': {
      transition: seamTransition,
      backgroundColor: {
        default: cssVar.colorBorderSecondary,
        [seamBorder]: 'transparent',
        [seamHover]: cssVar.colorFill,
        [seamResizing]: cssVar.colorPrimary,
      },
      content: "''",
      position: 'absolute',
    },
  },
  handleHorizontal: {
    'insetInline': 0,
    'cursor': 'row-resize',
    'height': 'var(--draggable-panel-handle-size)',
    '::after': {
      insetBlockStart: '50%',
      insetInlineEnd: 0,
      marginBlockStart: -0.5,
      height: 1,
      width: 'calc(50% - var(--draggable-panel-gap, 0px))',
    },
    '::before': {
      insetBlockStart: '50%',
      insetInlineStart: 0,
      marginBlockStart: -0.5,
      height: 1,
      width: 'calc(50% - var(--draggable-panel-gap, 0px))',
    },
  },
  handleVertical: {
    'insetBlock': 0,
    'cursor': 'col-resize',
    'width': 'var(--draggable-panel-handle-size)',
    '::after': {
      insetBlockEnd: 0,
      insetInlineStart: '50%',
      marginInlineStart: -0.5,
      height: 'calc(50% - var(--draggable-panel-gap, 0px))',
      width: 1,
    },
    '::before': {
      insetBlockStart: 0,
      insetInlineStart: '50%',
      marginInlineStart: -0.5,
      height: 'calc(50% - var(--draggable-panel-gap, 0px))',
      width: 1,
    },
  },
  header: {
    flex: 'none',
    gap: 8,
    paddingBlock: 8,
    paddingInline: 16,
    alignItems: 'center',
    borderBlockEndColor: cssVar.colorBorderSecondary,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    display: 'flex',
    fontWeight: 500,
    justifyContent: 'space-between',
  },
  leftFloat: {
    insetBlock: 0,
    insetInlineStart: 0,
    position: 'absolute',
    zIndex: 200,
    height: '100%',
  },
  rightFloat: {
    insetBlock: 0,
    insetInlineEnd: 0,
    position: 'absolute',
    zIndex: 200,
    height: '100%',
  },
  root: {
    '--draggable-panel-gap': {
      default: '0px',
      [open]: `${SEAM_ARROW.half + SEAM_ARROW.lead}px`,
    },
    'display': 'flex',
    'flexShrink': 0,
    'minHeight': 0,
    'minWidth': 0,
  },
  toggleBottom: {
    insetInline: 0,
    insetBlockEnd: -13,
    height: 26,
  },
  toggleButton: {
    padding: 0,
    borderStyle: 'none',
    borderWidth: 'medium',
    outline: { 'default': null, ':focus-visible': `2px solid ${cssVar.colorPrimary}` },
    backgroundColor: 'transparent',
    cursor: 'pointer',
    outlineOffset: { 'default': null, ':focus-visible': 3 },
    pointerEvents: 'all',
    position: 'relative',
    height: 40,
    width: 26,
  },
  toggleButtonHorizontal: {
    height: 26,
    width: 40,
  },
  toggleLeft: {
    insetBlock: 0,
    insetInlineStart: -13,
    width: 26,
  },
  togglePath: {
    vectorEffect: 'non-scaling-stroke',
    transition: `transform 0.24s ${cssVar.motionEaseOut}`,
    transform: {
      default: 'scaleX(0)',
      [stylex.when.ancestor(engaged, draggablePanelMarker)]: 'scaleX(var(--seam-bend))',
    },
    transformOrigin: 'center',
  },
  toggleRight: {
    insetBlock: 0,
    insetInlineEnd: -13,
    width: 26,
  },
  toggleRoot: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    opacity: {
      default: null,
      [stylex.when.ancestor(hovered, draggablePanelMarker)]: '1 !important',
    },
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 110,
  },
  toggleStopEnd: {
    stopColor: cssVar.colorBorderSecondary,
    transition: `stop-opacity 0.18s ${cssVar.motionEaseOut}`,
  },
  toggleStopTip: {
    stopColor: {
      default: cssVar.colorTextTertiary,
      [stylex.when.ancestor(':hover', draggablePanelToggleMarker)]: cssVar.colorTextSecondary,
    },
    transition: `stop-color 0.16s ${cssVar.motionEaseOut}`,
  },
  toggleSvg: {
    overflow: 'visible',
    transition: `opacity 0.18s ${cssVar.motionEaseOut}`,
    insetBlockStart: '50%',
    insetInlineStart: '50%',
    opacity: { default: 0, [stylex.when.ancestor(open, draggablePanelMarker)]: 1 },
    pointerEvents: 'none',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
  },
  toggleTop: {
    insetInline: 0,
    insetBlockStart: -13,
    height: 26,
  },
  topFloat: {
    insetInline: 0,
    insetBlockStart: 0,
    position: 'absolute',
    zIndex: 200,
    width: '100%',
  },
});
