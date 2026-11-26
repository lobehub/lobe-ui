import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';

// Adapted from CopilotKit a2ui-playground (MIT): renderers/data.tsx `Progress`, `RadialProgress`, `Ring`.
export const styles = stylex.create({
  bar: {
    flex: 'none',
    height: '100%',
    transition: 'width 0.3s',
  },
  caption: {
    color: a2ui.fgMuted80,
    fontSize: 11,
    lineHeight: 1.5,
  },
  card: {
    gap: 16,
    alignItems: 'center',
    display: 'flex',
    minWidth: 0,
    paddingBlock: 14,
    paddingInline: 16,
    width: '100%',
  },
  label: {
    overflow: 'hidden',
    minWidth: 0,
    color: a2ui.fg90,
    fontSize: 12.5,
    fontWeight: 500,
    lineHeight: 1.5,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  lineRoot: {
    gap: 8,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    width: '100%',
  },
  meta: {
    gap: 12,
    alignItems: 'baseline',
    display: 'flex',
    justifyContent: 'space-between',
    minWidth: 0,
  },
  ring: {
    flexShrink: 0,
    position: 'relative',
  },
  ringBar: {
    fill: 'none',
    transition: 'stroke-dashoffset 700ms cubic-bezier(0.22, 1, 0.36, 1)',
  },
  ringCenter: {
    alignItems: 'center',
    display: 'flex',
    inset: 0,
    justifyContent: 'center',
    position: 'absolute',
  },
  ringSvg: {
    display: 'block',
    rotate: '-90deg',
  },
  ringTrack: {
    fill: 'none',
    stroke: a2ui.lineStrong,
  },
  ringValue: {
    color: a2ui.fg,
    fontSize: 17,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 600,
    letterSpacing: '-0.025em',
    lineHeight: 1.5,
  },
  side: {
    gap: 4,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  sideCaption: {
    color: a2ui.fgMuted,
    fontSize: 11,
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1.5,
  },
  sideLabel: {
    overflow: 'hidden',
    color: a2ui.fg,
    fontSize: 13,
    fontWeight: 500,
    lineHeight: 1.5,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  track: {
    borderRadius: 999,
    overflow: 'hidden',
    alignItems: 'center',
    display: 'flex',
    height: 6,
    width: '100%',
    backgroundColor: a2ui.overlay7,
  },
  value: {
    flexShrink: 0,
    color: a2ui.fgMuted,
    fontSize: 12,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 500,
    lineHeight: 1.5,
  },
});

/** Tone colour per status: normal accent, success positive, exception negative, active info. */
export const toneColor = {
  active: a2ui.info,
  exception: a2ui.negative,
  normal: a2ui.accent,
  success: a2ui.positive,
};
