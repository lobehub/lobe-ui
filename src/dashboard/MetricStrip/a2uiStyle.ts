import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';

/**
 * `a2ui` metric look: the A2UI playground `Stat` / `StatGroup`. Adapted from CopilotKit
 * a2ui-playground (MIT), `renderers/data.tsx` (`Stat`, `StatGroup`, `KpiValue`, `Delta`).
 */
export const a2uiMetricStyles = stylex.create({
  caption: {
    display: '-webkit-box',
    overflow: 'hidden',
    color: a2ui.fgMuted80,
    fontSize: 11,
    lineHeight: 1.375,
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
  },
  chart: {
    minInlineSize: 0,
  },
  delta: {
    flex: 'none',
    gap: 2,
    alignItems: 'flex-start',
    display: 'inline-flex',
    fontSize: 12,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 500,
    lineHeight: 1.25,
    minInlineSize: 0,
  },
  deltaIcon: {
    flex: 'none',
    marginBlockStart: 1,
  },
  /** One KPI cell of a StatGroup (`gap-1.5`), and the container its figure scales against. */
  groupCell: {
    containerType: 'inline-size',
    gap: 6,
    paddingBlock: 14,
    paddingInline: 16,
    backgroundColor: a2ui.surface,
    display: 'flex',
    flexDirection: 'column',
    minInlineSize: 0,
  },
  /** The cells sit on a hairline-coloured grid: the 1px gaps are the seams. */
  groupGrid: {
    gap: 1,
    backgroundColor: a2ui.line,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(132px, 1fr))',
  },
  groupRoot: {
    overflow: 'hidden',
    inlineSize: '100%',
    minInlineSize: 0,
  },
  head: {
    gap: 8,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    minInlineSize: 0,
  },
  icon: {
    flex: 'none',
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'grid',
    placeItems: 'center',
    blockSize: 24,
    inlineSize: 24,
  },
  iconDefault: {
    borderColor: a2ui.overlay8,
    backgroundColor: a2ui.overlay4,
    color: a2ui.fgMuted,
  },
  label: {
    overflow: 'hidden',
    color: a2ui.fgMuted,
    fontSize: 12,
    fontWeight: 500,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  /** A clickable Stat card rendered as a `<button>`. */
  press: {
    cursor: 'pointer',
    fontSize: 'inherit',
    textAlign: 'start',
  },
  /** A single Stat card (`gap-2`, `px-4 py-3.5`), also the container its figure scales against. */
  statRoot: {
    containerType: 'inline-size',
    flex: '1',
    gap: 8,
    paddingBlock: 14,
    paddingInline: 16,
    display: 'flex',
    flexDirection: 'column',
    inlineSize: '100%',
    minInlineSize: 0,
  },
  value: {
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 600,
    letterSpacing: '-0.025em',
    lineHeight: 1.1,
    maxInlineSize: '100%',
    minInlineSize: 0,
    whiteSpace: 'nowrap',
  },
  valuePhrase: {
    overflowWrap: 'normal',
    whiteSpace: 'normal',
    wordBreak: 'keep-all',
  },
  valueRow: {
    rowGap: 4,
    columnGap: 8,
    alignItems: 'baseline',
    display: 'flex',
    flexWrap: 'wrap',
    minInlineSize: 0,
  },
});
