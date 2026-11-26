import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';

// Adapted from CopilotKit a2ui-playground (MIT): renderers/data.tsx `Timeline`.
export const styles = stylex.create({
  body: {
    gap: 2,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    minWidth: 0,
  },
  bodyGap: {
    paddingBottom: 18,
  },
  card: {
    margin: 0,
    paddingBlock: 16,
    paddingInline: 16,
    width: '100%',
    listStyle: 'none',
  },
  description: {
    margin: 0,
    color: a2ui.fgMuted,
    fontSize: 12.5,
    lineHeight: 1.625,
  },
  dotCurrent: {
    borderRadius: 999,
    height: 6,
    width: 6,
    backgroundColor: a2ui.accent,
  },
  dotUpcoming: {
    borderRadius: 999,
    height: 6,
    width: 6,
    backgroundColor: a2ui.fgMuted40,
  },
  head: {
    gap: 12,
    alignItems: 'baseline',
    display: 'flex',
    justifyContent: 'space-between',
    minWidth: 0,
  },
  item: {
    gap: 14,
    display: 'flex',
    minWidth: 0,
    position: 'relative',
  },
  marker: {
    borderRadius: 999,
    borderStyle: 'solid',
    borderWidth: 1,
    position: 'relative',
    zIndex: 1,
    display: 'grid',
    placeItems: 'center',
    height: 20,
    marginTop: 2,
    width: 20,
  },
  markerCurrent: {
    borderColor: a2ui.accent,
    boxShadow: `0 0 0 4px color-mix(in oklch, ${a2ui.accent} 12%, transparent)`,
    color: a2ui.accent,
    backgroundColor: `color-mix(in oklch, ${a2ui.accent} 16%, transparent)`,
  },
  markerDone: {
    borderColor: 'transparent',
    color: a2ui.positive,
    backgroundColor: `color-mix(in oklch, ${a2ui.positive} 18%, transparent)`,
  },
  markerError: {
    borderColor: 'transparent',
    color: a2ui.negative,
    backgroundColor: `color-mix(in oklch, ${a2ui.negative} 18%, transparent)`,
  },
  markerUpcoming: {
    borderColor: a2ui.lineStrong,
    color: a2ui.fgMuted,
    backgroundColor: a2ui.surface,
  },
  rail: {
    position: 'relative',
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'center',
    width: 20,
  },
  railLine: {
    position: 'absolute',
    top: 24,
    bottom: -2,
    width: 1,
    backgroundColor: a2ui.lineStrong,
  },
  railLineDone: {
    backgroundColor: `color-mix(in oklch, ${a2ui.positive} 45%, transparent)`,
  },
  time: {
    flexShrink: 0,
    color: a2ui.fgMuted,
    fontSize: 11,
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1.5,
  },
  title: {
    overflow: 'hidden',
    color: a2ui.fg,
    fontSize: 13,
    fontWeight: 500,
    lineHeight: 1.5,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  titleUpcoming: {
    color: a2ui.fg65,
  },
});
