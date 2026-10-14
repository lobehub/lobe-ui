import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  cell: {
    'font': 'inherit',
    'margin': 0,
    'borderWidth': 0,
    'gap': 6,
    'paddingInline': 16,
    'alignItems': 'flex-start',
    'backgroundColor': { 'default': 'transparent', ':hover': cssVar.colorFillQuaternary },
    'boxShadow': 'inset -1px 0 0 var(--filter-seam), inset 0 -1px 0 var(--filter-seam)',
    'color': 'inherit',
    'cursor': 'pointer',
    'display': 'flex',
    'flexDirection': 'column',
    'minInlineSize': 0,
    'paddingBlockEnd': 16,
    'paddingBlockStart': 14,
    'position': 'relative',
    'textAlign': 'start',
    '::after': {
      insetInline: 0,
      backgroundColor: 'transparent',
      blockSize: 3,
      content: '""',
      insetBlockEnd: 1,
      position: 'absolute',
    },
  },
  cellActive: {
    'backgroundColor': cssVar.colorFillTertiary,
    '::after': {
      backgroundColor: cssVar.colorText,
    },
  },
  count: {
    color: cssVar.colorText,
    fontSize: cssVar.fontSizeHeading4,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 600,
    lineHeight: 1.15,
  },
  countDanger: {
    color: cssVar.colorError,
  },
  countWarning: {
    color: cssVar.colorWarning,
  },
  frame: {
    '--filter-seam': `var(--lobe-fill-border, ${cssVar.colorFill})`,
    'borderRadius': 'inherit',
    'overflow': 'hidden',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(148px, 1fr))',
    inlineSize: 'calc(100% + 1px)',
    marginBlockEnd: -1,
  },
  label: {
    color: cssVar.colorTextSecondary,
    fontSize: 13,
    fontWeight: 500,
    lineHeight: 1.4,
  },
  labelActive: {
    color: cssVar.colorText,
  },
});
