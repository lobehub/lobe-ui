import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { focusRing } from '@/styles/stylex/focusRing';

import { tableRowMarker } from './marker.stylex';

export const styles = stylex.create({
  bordered: {
    borderColor: cssVar.colorBorderSecondary,
    borderRadius: cssVar.borderRadiusLG,
    borderStyle: 'solid',
    borderWidth: 1,
  },
  borderedCell: {
    borderInlineEndColor: cssVar.colorBorderSecondary,
    borderInlineEndStyle: 'solid',
    borderInlineEndWidth: 1,
  },
  caretActive: {
    color: cssVar.colorText,
  },
  cell: {
    backgroundColor: {
      default: cssVar.colorBgContainer,
      [stylex.when.ancestor(':hover', tableRowMarker)]:
        `color-mix(in srgb, ${cssVar.colorBgContainer}, ${cssVar.colorText} 3%)`,
    },
    borderBlockEndColor: cssVar.colorBorderSecondary,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    fontVariantNumeric: 'tabular-nums',
  },
  cellLastRow: {
    borderBlockEndColor: 'currentcolor',
    borderBlockEndStyle: 'none',
    borderBlockEndWidth: 0,
  },
  cellMiddle: {
    paddingBlock: 12,
    paddingInline: 16,
  },
  cellSmall: {
    paddingBlock: 8,
    paddingInline: 12,
  },
  clickable: {
    cursor: 'pointer',
  },
  ellipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: 0,
  },
  empty: {
    color: cssVar.colorTextDescription,
    textAlign: 'center',
  },
  filterActive: {
    color: { 'default': cssVar.colorPrimary, ':hover': cssVar.colorText },
  },
  filterButton: {
    padding: 2,
    borderColor: 'currentcolor',
    borderRadius: 4,
    borderStyle: 'none',
    borderWidth: 0,
    alignItems: 'center',
    backgroundColor: { 'default': 'transparent', ':hover': cssVar.colorFillTertiary },
    color: { 'default': cssVar.colorTextQuaternary, ':hover': cssVar.colorText },
    cursor: 'pointer',
    display: 'inline-flex',
    justifyContent: 'center',
  },
  fixed: {
    zIndex: 1,
  },
  header: {
    backgroundColor: cssVar.colorBgContainer,
    boxShadow: `inset 0 -1px 0 ${cssVar.colorBorderSecondary}, inset 0 999px 0 ${cssVar.colorFillQuaternary}`,
    color: cssVar.colorTextSecondary,
    fontSize: 13,
    fontWeight: 500,
    insetBlockStart: 0,
    position: 'sticky',
    textAlign: 'start',
    zIndex: 2,
  },
  headerInner: {
    gap: 6,
    alignItems: 'center',
    display: 'inline-flex',
  },
  loading: {
    inset: 0,
    alignItems: 'center',
    backgroundColor: `color-mix(in srgb, ${cssVar.colorBgContainer} 60%, transparent)`,
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 3,
  },
  pagination: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBlockStart: 12,
  },
  root: {
    minWidth: 0,
  },
  sortButton: {
    font: 'inherit',
    padding: 0,
    borderColor: 'currentcolor',
    borderRadius: 4,
    borderStyle: 'none',
    borderWidth: 0,
    gap: 6,
    alignItems: 'center',
    backgroundColor: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
    display: 'inline-flex',
  },
  sortCaret: {
    color: cssVar.colorTextQuaternary,
    display: 'inline-flex',
    flexDirection: 'column',
  },
  table: {
    borderCollapse: 'separate',
    borderSpacing: 0,
    fontSize: 14,
    width: '100%',
  },
  wrapper: {
    overflow: 'auto',
    position: 'relative',
  },
});

export const cellSizeStyles = {
  middle: styles.cellMiddle,
  small: styles.cellSmall,
};

export const filterButtonStyles = [styles.filterButton, focusRing.info];
export const sortButtonStyles = [styles.sortButton, focusRing.info];
