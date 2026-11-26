import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';

// Adapted from CopilotKit a2ui-playground (MIT): renderers/data.tsx `Rating`.
export const styles = stylex.create({
  count: {
    color: a2ui.fgMuted,
    fontSize: 11.5,
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1.5,
  },
  emptyStar: {
    fill: a2ui.overlay8,
    inset: 0,
    position: 'absolute',
    stroke: a2ui.overlay12,
  },
  fill: {
    overflow: 'hidden',
    inset: 0,
    position: 'absolute',
  },
  fillStar: {
    display: 'block',
    fill: a2ui.warning,
    stroke: a2ui.warning,
  },
  label: {
    color: a2ui.fgMuted,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1.5,
  },
  root: {
    gap: 6,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  row: {
    gap: 10,
    alignItems: 'center',
    display: 'flex',
    minWidth: 0,
  },
  star: {
    flexShrink: 0,
    display: 'block',
    position: 'relative',
  },
  stars: {
    gap: 2,
    alignItems: 'center',
    display: 'flex',
  },
  value: {
    color: a2ui.fg,
    fontSize: 13,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 600,
    lineHeight: 1.5,
  },
});
