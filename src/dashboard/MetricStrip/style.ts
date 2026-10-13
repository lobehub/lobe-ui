import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  /** Split strip and StatCard: one card per item. */
  card: {
    display: 'grid',
    minInlineSize: 0,
  },
  cell: {
    gap: 6,
    paddingBlock: 16,
    paddingInline: 20,
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    minInlineSize: 0,
  },
  /** Joined strip only: the divider on the cell's trailing and bottom edges. */
  cellSeam: {
    boxShadow: 'inset -1px 0 0 var(--metric-seam), inset 0 -1px 0 var(--metric-seam)',
  },
  delta: {
    fontSize: 13,
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1.4,
  },
  deltaDown: {
    color: cssVar.colorError,
  },
  deltaFlat: {
    color: cssVar.colorTextSecondary,
  },
  deltaUp: {
    color: cssVar.colorSuccess,
  },
  foot: {
    gap: 8,
    alignItems: 'baseline',
    display: 'flex',
    flexWrap: 'wrap',
  },
  /**
   * Clips the seam that would otherwise sit on the card's trailing and bottom
   * edges. A short last row used to show the seam color across the empty
   * track, which reads louder than the cells.
   */
  frame: {
    '--metric-seam': cssVar.colorBorderSecondary,
    'borderRadius': 'inherit',
    'overflow': 'hidden',
    'backgroundColor': 'transparent',
  },
  grid: {
    backgroundColor: 'transparent',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    inlineSize: 'calc(100% + 1px)',
    marginBlockEnd: -1,
  },
  /* One fixed 32px row (a small Segmented or ActionIcon fits): an action or mark in the head must
     not push the value down, so cells with and without header controls line up across a split
     strip or a row of StatCards. */
  head: {
    gap: 8,
    alignItems: 'center',
    blockSize: 32,
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'space-between',
    minInlineSize: 0,
  },
  headCopy: {
    flex: '1',
    gap: 6,
    alignItems: 'center',
    display: 'flex',
    minInlineSize: 0,
  },
  headAction: {
    flex: 'none',
    alignItems: 'center',
    display: 'flex',
  },
  chart: {
    inlineSize: '100%',
    marginBlockStart: 6,
    minInlineSize: 0,
  },
  hint: {
    color: cssVar.colorTextSecondary,
    fontSize: 13,
    lineHeight: 1.4,
  },
  label: {
    color: cssVar.colorTextSecondary,
    fontSize: 13,
    fontWeight: 500,
    lineHeight: 1.4,
  },
  link: {
    textDecoration: 'none',
    backgroundColor: { 'default': 'transparent', ':hover': cssVar.colorFillQuaternary },
    color: 'inherit',
  },
  mark: {
    borderColor: cssVar.colorFillSecondary,
    borderRadius: cssVar.borderRadiusSM,
    borderStyle: 'solid',
    borderWidth: 1,
    flex: 'none',
    alignItems: 'center',
    backgroundColor: cssVar.colorFillTertiary,
    blockSize: 24,
    color: cssVar.colorTextTertiary,
    display: 'inline-flex',
    inlineSize: 24,
    justifyContent: 'center',
  },
  press: {
    font: 'inherit',
    borderStyle: 'none',
    backgroundColor: { 'default': 'transparent', ':hover': cssVar.colorFillQuaternary },
    color: 'inherit',
    cursor: 'pointer',
    textAlign: 'start',
  },
  /** Grid cell around a rendered link, so the link fills it. */
  slot: {
    display: 'grid',
    minInlineSize: 0,
  },
  split: {
    gap: 12,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  },
  value: {
    overflow: 'hidden',
    color: cssVar.colorText,
    fontSize: cssVar.fontSizeHeading3,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 600,
    lineHeight: 1.15,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  valueDanger: {
    color: cssVar.colorError,
  },
  valueWarning: {
    color: cssVar.colorWarning,
  },
});
