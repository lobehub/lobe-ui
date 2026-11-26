import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';

const NARROW = '@container (min-width: 16rem)';

// Adapted from CopilotKit a2ui-playground (MIT): renderers/data.tsx `KeyValueList`.
export const styles = stylex.create({
  card: {
    containerType: 'inline-size',
    gap: 8,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    paddingBlock: 14,
    paddingInline: 16,
    width: '100%',
  },
  cols2: {
    gridTemplateColumns: {
      'default': null,
      '@container (min-width: 28rem)': 'repeat(2, minmax(0, 1fr))',
    },
  },
  cols3: {
    gridTemplateColumns: {
      'default': null,
      '@container (min-width: 28rem)': 'repeat(2, minmax(0, 1fr))',
      '@container (min-width: 42rem)': 'repeat(3, minmax(0, 1fr))',
    },
  },
  header: {
    gap: 12,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    minWidth: 0,
  },
  hint: {
    color: a2ui.fgMuted80,
    fontSize: 11,
    lineHeight: 1.5,
  },
  label: {
    margin: 0,
    minWidth: 0,
    color: a2ui.fgMuted,
    fontSize: 12.5,
    lineHeight: 1.5,
  },
  list: {
    columnGap: 24,
    display: 'grid',
    margin: 0,
    minWidth: 0,
  },
  row: {
    borderBottomColor: { 'default': a2ui.line, ':last-child': 'transparent' },
    borderBottomStyle: { 'default': 'dashed', ':last-child': 'none' },
    borderBottomWidth: { 'default': 1, ':last-child': 0 },
    gap: { default: 2, [NARROW]: 16 },
    alignItems: { default: null, [NARROW]: 'baseline' },
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      [NARROW]: 'minmax(0, auto) minmax(0, 1fr)',
    },
    minWidth: 0,
    paddingBlock: 8,
  },
  value: {
    alignItems: { default: null, [NARROW]: 'flex-end' },
    display: 'flex',
    flexDirection: 'column',
    margin: 0,
    minWidth: 0,
    textAlign: { default: null, [NARROW]: 'right' },
  },
  valueText: {
    minWidth: 0,
    overflowWrap: 'break-word',
    color: a2ui.fg,
    fontSize: 13,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 500,
    lineHeight: 1.5,
  },
});
