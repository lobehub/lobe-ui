import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';
const chromeBar = '#151515';

const labelFromBelow = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(70%)' },
  to: { opacity: 1, transform: 'none' },
});
const labelFromAbove = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(-70%)' },
  to: { opacity: 1, transform: 'none' },
});

// The chrome stays dark in both themes: it sits on the black letterbox and
// must not flash white around a dark recording.
export const styles = stylex.create({
  barButton: {
    padding: 0,
    borderRadius: 6,
    borderStyle: 'none',
    flex: 'none',
    outline: { 'default': 'none', ':focus-visible': '2px solid rgb(255 255 255 / 60%)' },
    alignItems: 'center',
    backgroundColor: {
      'default': 'transparent',
      ':hover': 'rgb(255 255 255 / 12%)',
    },
    color: 'inherit',
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'inherit',
    fontSize: 12,
    justifyContent: 'center',
    height: 28,
    minWidth: 28,
  },
  barButtonActive: {
    backgroundColor: 'rgb(255 255 255 / 18%)',
  },
  caption: {
    borderRadius: 8,
    paddingBlock: 8,
    paddingInline: 12,
    transition: { default: 'inset-block-end 200ms ease', [reducedMotion]: 'none' },
    backgroundColor: 'rgb(0 0 0 / 78%)',
    color: '#fff',
    fontSize: 13,
    insetBlockEnd: 16,
    insetInlineStart: 16,
    lineHeight: 1.5,
    position: 'absolute',
    zIndex: 2,
    maxWidth: '70%',
  },
  captionItem: {
    marginBlockStart: { 'default': 8, ':first-child': 0 },
  },
  captionRaised: {
    insetBlockEnd: 76,
  },
  captionTitle: {
    gap: 6,
    alignItems: 'center',
    display: 'flex',
    fontWeight: 600,
  },
  centerPlay: {
    borderRadius: '50%',
    borderStyle: 'none',
    alignItems: 'center',
    backgroundColor: 'rgb(0 0 0 / 55%)',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    insetBlockStart: '50%',
    insetInlineStart: '50%',
    justifyContent: 'center',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    zIndex: 2,
    height: 56,
    width: 56,
  },
  chip: {
    borderRadius: 6,
    borderStyle: 'none',
    gap: 2,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: { 'default': 'rgb(255 255 255 / 10%)', ':hover': 'rgb(255 255 255 / 16%)' },
    color: 'inherit',
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'inherit',
    fontSize: 12,
    paddingInlineEnd: 4,
    paddingInlineStart: 8,
    height: 24,
    maxWidth: '40%',
    minWidth: 0,
  },
  chipLabelBackward: {
    animationDuration: { default: '220ms', [reducedMotion]: '0s' },
    animationName: labelFromAbove,
    animationTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
  },
  chipLabelForward: {
    animationDuration: { default: '220ms', [reducedMotion]: '0s' },
    animationName: labelFromBelow,
    animationTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
  },
  chipText: {
    overflow: 'hidden',
    display: 'block',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  controls: {
    paddingInline: 12,
    color: '#fff',
    paddingBlockEnd: 6,
  },
  controlsBelow: {
    backgroundColor: chromeBar,
    paddingBlockStart: 6,
  },
  controlsHidden: {
    opacity: 0,
    pointerEvents: 'none',
  },
  controlsOverlay: {
    insetInline: 0,
    transition: { default: 'opacity 200ms ease', [reducedMotion]: 'none' },
    backgroundImage: 'linear-gradient(to bottom, rgb(0 0 0 / 0%), rgb(0 0 0 / 72%))',
    insetBlockEnd: 0,
    paddingBlockStart: 40,
    position: 'absolute',
    zIndex: 3,
  },
  disabled: {
    opacity: 0.4,
    pointerEvents: 'none',
  },
  dot: {
    borderRadius: '50%',
    flex: 'none',
    height: 6,
    width: 6,
  },
  error: {
    inset: 0,
    gap: 10,
    alignItems: 'center',
    backgroundColor: '#000',
    color: '#ccc',
    display: 'flex',
    flexDirection: 'column',
    fontSize: 13,
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 4,
  },
  errorActions: {
    gap: 8,
    display: 'flex',
  },
  errorButton: {
    borderColor: 'rgb(255 255 255 / 20%)',
    borderRadius: 6,
    borderStyle: 'solid',
    borderWidth: 1,
    gap: 6,
    paddingInline: 10,
    textDecoration: 'none',
    alignItems: 'center',
    backgroundColor: { 'default': 'rgb(255 255 255 / 8%)', ':hover': 'rgb(255 255 255 / 14%)' },
    color: '#fff',
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'inherit',
    fontSize: 12,
    height: 28,
  },
  frame: {
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
    width: '100%',
  },
  frameNo: {
    color: '#8a8a8a',
    fontFamily: cssVar.fontFamilyCode,
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },
  hairline: {
    backgroundColor: 'rgb(0 0 0 / 55%)',
    insetBlockStart: 8,
    pointerEvents: 'none',
    position: 'absolute',
    height: 4,
    width: 1,
  },
  head: {
    borderRadius: '50%',
    backgroundColor: '#fff',
    insetBlockStart: 4,
    marginInlineStart: -6,
    pointerEvents: 'none',
    position: 'absolute',
    height: 12,
    width: 12,
  },
  marker: {
    padding: 0,
    borderColor: 'rgb(0 0 0 / 60%)',
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: 1.5,
    outline: { 'default': 'none', ':focus-visible': '2px solid #fff' },
    transition: { default: 'transform 120ms ease', [reducedMotion]: 'none' },
    cursor: 'pointer',
    insetBlockStart: -2,
    marginInlineStart: -5,
    position: 'absolute',
    transform: { 'default': null, ':hover': 'scale(1.3)' },
    zIndex: 1,
    height: 10,
    width: 10,
  },
  preview: {
    gap: 4,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    insetBlockEnd: 24,
    marginInlineStart: -88,
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 2,
    width: 176,
  },
  previewCanvas: {
    borderColor: '#333',
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: '#000',
    display: 'block',
    height: 99,
    width: 176,
  },
  previewLabel: {
    borderRadius: 6,
    overflow: 'hidden',
    paddingBlock: 3,
    paddingInline: 8,
    backgroundColor: 'rgb(0 0 0 / 82%)',
    fontSize: 12,
    lineHeight: 1.4,
    textAlign: 'center',
    textOverflow: 'ellipsis',
    maxWidth: 176,
  },
  previewTime: {
    color: '#ddd',
    fontFamily: cssVar.fontFamilyCode,
    fontSize: 11,
  },
  previewTitle: {
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  root: {
    borderRadius: cssVar.borderRadiusLG,
    outline: 'none',
    overflow: 'hidden',
    backgroundColor: '#000',
    boxShadow: { 'default': null, ':focus-visible': `0 0 0 2px ${cssVar.colorPrimaryBorder}` },
    color: '#fff',
    lineHeight: 1,
    position: 'relative',
    maxWidth: '100%',
  },
  rateButton: {
    paddingInline: 6,
    fontFamily: cssVar.fontFamilyCode,
  },
  row: {
    gap: 4,
    alignItems: 'center',
    display: 'flex',
    fontSize: 12,
    height: 32,
  },
  sectionChip: {
    borderColor: 'rgb(255 255 255 / 14%)',
    borderRadius: 6,
    borderStyle: 'solid',
    borderWidth: 1,
    gap: 6,
    outline: { 'default': 'none', ':focus-visible': '2px solid rgb(255 255 255 / 60%)' },
    paddingInline: 8,
    alignItems: 'center',
    backgroundColor: { 'default': 'transparent', ':hover': 'rgb(255 255 255 / 8%)' },
    color: { 'default': '#bbb', ':hover': '#fff' },
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'inherit',
    fontSize: 12,
    height: 24,
  },
  sectionChipActive: {
    backgroundColor: 'rgb(255 255 255 / 16%)',
    color: '#fff',
  },
  sectionChipTime: {
    fontFamily: cssVar.fontFamilyCode,
    opacity: 0.7,
  },
  sectionList: {
    gap: 6,
    paddingBlock: 8,
    paddingInline: 12,
    backgroundColor: '#151515',
    display: 'flex',
    flexWrap: 'wrap',
  },
  segment: {
    borderRadius: 2,
    overflow: 'hidden',
    transition: {
      default: 'height 120ms ease, inset-block-start 120ms ease',
      [reducedMotion]: 'none',
    },
    backgroundColor: 'rgb(255 255 255 / 24%)',
    insetBlockStart: 8,
    position: 'absolute',
    height: 4,
  },
  segmentFill: {
    insetBlock: 0,
    insetInlineStart: 0,
    position: 'absolute',
  },
  segmentHovered: {
    insetBlockStart: 6,
    height: 8,
  },
  spacer: {
    flex: '1',
  },
  surface: {
    inset: 0,
    cursor: 'pointer',
    position: 'absolute',
  },
  time: {
    color: '#ddd',
    fontFamily: cssVar.fontFamilyCode,
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },
  track: {
    outline: 'none',
    cursor: 'pointer',
    position: 'relative',
    touchAction: 'none',
    height: 20,
  },
  video: {
    display: 'block',
    objectFit: 'contain',
    height: '100%',
    width: '100%',
  },
});

export const markerColor = (color?: string) => {
  switch (color) {
    case undefined:
    case 'info': {
      return cssVar.colorInfo;
    }
    case 'success': {
      return cssVar.colorSuccess;
    }
    case 'warning': {
      return cssVar.colorWarning;
    }
    case 'error': {
      return cssVar.colorError;
    }
    default: {
      return color;
    }
  }
};
