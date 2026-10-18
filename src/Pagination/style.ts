import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

import { paginationJumpMarker } from './marker.stylex';

const enabledHover = ':hover:not(:disabled)';
const currentAtRest = ':is([aria-current="page"]):is(:disabled, :not(:hover))';

export const styles = stylex.create({
  aligned: {
    display: 'flex',
    width: '100%',
  },
  button: {
    borderColor: 'currentcolor',
    borderRadius: cssVar.borderRadius,
    borderStyle: 'none',
    borderWidth: 'medium',
    paddingInline: 6,
    transition: 'background-color 0.15s',
    alignItems: 'center',
    backgroundColor: {
      [currentAtRest]: cssVar.colorFillSecondary,
      default: 'transparent',
      [enabledHover]: cssVar.colorFillTertiary,
    },
    color: {
      'default': cssVar.colorTextSecondary,
      [enabledHover]: cssVar.colorText,
      ':disabled:not([aria-current="page"])': cssVar.colorTextQuaternary,
      ':is([aria-current="page"]):not(:hover:not(:disabled))': cssVar.colorText,
    },
    cursor: { 'default': 'pointer', ':disabled': 'default' },
    display: 'inline-flex',
    fontSize: 13,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: { 'default': 500, ':is([aria-current="page"])': 600 },
    justifyContent: 'center',
    height: 28,
    minWidth: 28,
  },
  center: {
    justifyContent: 'center',
  },
  ellipsis: {
    font: 'inherit',
    padding: 0,
    borderColor: 'currentcolor',
    borderRadius: cssVar.borderRadius,
    borderStyle: 'none',
    borderWidth: 'medium',
    flex: 'none',
    placeItems: 'center',
    backgroundColor: 'transparent',
    color: {
      'default': cssVar.colorTextQuaternary,
      ':focus-visible': cssVar.colorText,
      ':hover:not(:disabled)': cssVar.colorText,
    },
    cursor: { 'default': 'pointer', ':disabled': 'default' },
    display: 'inline-grid',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    height: 28,
    width: 28,
  },
  ellipsisDots: {
    gridColumn: 1,
    gridRow: 1,
    fontSize: 8,
    letterSpacing: 2,
    textIndent: 2,
    visibility: {
      default: 'visible',
      [stylex.when.ancestor(':focus-visible', paginationJumpMarker)]: 'hidden',
      [stylex.when.ancestor(':hover:not(:disabled)', paginationJumpMarker)]: 'hidden',
    },
  },
  ellipsisIcon: {
    gridColumn: 1,
    gridRow: 1,
    visibility: {
      default: 'hidden',
      [stylex.when.ancestor(':focus-visible', paginationJumpMarker)]: 'visible',
      [stylex.when.ancestor(':hover:not(:disabled)', paginationJumpMarker)]: 'visible',
    },
  },
  end: {
    justifyContent: 'flex-end',
  },
  jumper: {
    gap: 6,
    alignItems: 'center',
    color: cssVar.colorTextSecondary,
    display: 'inline-flex',
    fontSize: 13,
    marginInlineStart: 8,
    whiteSpace: 'nowrap',
  },
  jumperInput: {
    width: 50,
  },
  root: {
    gap: 4,
    alignItems: 'center',
    display: 'inline-flex',
    fontVariantNumeric: 'tabular-nums',
  },
  simplePager: {
    gap: 6,
    alignItems: 'center',
    color: cssVar.colorTextSecondary,
    display: 'inline-flex',
    fontSize: 13,
    whiteSpace: 'nowrap',
  },
  simpleSlash: {
    color: cssVar.colorTextQuaternary,
  },
  sizeChanger: {
    flex: 'none',
    marginInlineStart: 8,
  },
  small: {
    fontSize: 12,
    height: 24,
    minWidth: 24,
  },
  smallEllipsis: {
    height: 24,
    width: 24,
  },
  start: {
    justifyContent: 'flex-start',
  },
  total: {
    color: cssVar.colorTextTertiary,
    fontSize: 12,
    marginInlineEnd: 8,
    whiteSpace: 'nowrap',
  },
});
