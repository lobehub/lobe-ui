import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

// Adapted from CopilotKit a2ui-playground (MIT), `renderers/domain.tsx` WeatherCard.
// The `d*` entries restyle the same markup for `variant="default"`, the plain lobe-ui card.

/** Condition tints from the lobe-ui preset palettes (they follow light / dark). */
const SUN = 'var(--lobe-gold-9)';
const CLOUD = 'var(--lobe-color-text-tertiary)';
const RAIN = 'var(--lobe-blue-9)';
const SNOW = 'var(--lobe-cyan-8)';
const STORM = 'var(--lobe-purple-9)';

export const tintStyles = stylex.create({
  'cloud': { color: CLOUD },
  'cloud-sun': { color: SUN },
  'drizzle': { color: RAIN },
  'fog': { color: CLOUD },
  'rain': { color: RAIN },
  'snow': { color: SNOW },
  'storm': { color: STORM },
  'sun': { color: SUN },
});

export const glowStyles = stylex.create({
  'cloud': { backgroundColor: `color-mix(in srgb, ${CLOUD} 14%, transparent)` },
  'cloud-sun': { backgroundColor: `color-mix(in srgb, ${SUN} 15%, transparent)` },
  'drizzle': { backgroundColor: `color-mix(in srgb, ${RAIN} 16%, transparent)` },
  'fog': { backgroundColor: `color-mix(in srgb, ${CLOUD} 12%, transparent)` },
  'rain': { backgroundColor: `color-mix(in srgb, ${RAIN} 20%, transparent)` },
  'snow': { backgroundColor: `color-mix(in srgb, ${SNOW} 16%, transparent)` },
  'storm': { backgroundColor: `color-mix(in srgb, ${STORM} 22%, transparent)` },
  'sun': { backgroundColor: `color-mix(in srgb, ${SUN} 22%, transparent)` },
});

export const styles = stylex.create({
  bar: {
    borderRadius: 999,
    backgroundColor: a2ui.overlay7,
    blockSize: 5,
    position: 'relative',
  },
  barFill: {
    borderRadius: 999,
    insetBlock: 0,
    backgroundImage: `linear-gradient(90deg, var(--lobe-blue-8), var(--lobe-lime-9) 55%, var(--lobe-gold-9))`,
    position: 'absolute',
  },
  conditionText: {
    fontSize: 14,
    fontWeight: 500,
    marginBlockStart: 8,
  },
  daily: {
    paddingBlock: 8,
    paddingInline: 16,
    borderBlockStartColor: a2ui.line,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  day: {
    gap: 8,
    paddingBlock: 7,
    alignItems: 'center',
    display: 'grid',
    gridTemplateColumns: '44px 22px 34px 32px minmax(0, 1fr) 32px',
  },
  dayLabel: {
    fontSize: 13,
    fontWeight: 500,
  },
  dayMax: {
    fontSize: 12.5,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 500,
  },
  dayMin: {
    color: a2ui.fgMuted,
    fontSize: 12.5,
    fontVariantNumeric: 'tabular-nums',
    textAlign: 'end',
  },
  dayPrecip: {
    color: cssVar.colorInfoText,
    fontSize: 10.5,
    fontVariantNumeric: 'tabular-nums',
  },
  detail: {
    gap: 8,
    paddingBlock: 8,
    paddingInline: 10,
    alignItems: 'center',
    display: 'flex',
    minInlineSize: 0,
  },
  detailIcon: {
    color: a2ui.fgMuted,
    flexShrink: 0,
  },
  detailLabel: {
    overflow: 'hidden',
    color: a2ui.fgMuted,
    fontSize: 10.5,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  details: {
    gap: 8,
    paddingInline: 16,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))',
    paddingBlockEnd: 16,
    position: 'relative',
  },
  detailText: {
    display: 'flex',
    flexDirection: 'column',
    minInlineSize: 0,
  },
  detailValue: {
    fontSize: 13,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
  glow: {
    borderRadius: 999,
    blockSize: 256,
    filter: 'blur(64px)',
    inlineSize: 256,
    insetBlockStart: -80,
    insetInlineEnd: -64,
    pointerEvents: 'none',
    position: 'absolute',
  },
  hero: {
    gap: 16,
    paddingBlock: '16px',
    paddingInline: 20,
    alignItems: 'flex-start',
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
  },
  heroIcon: {
    filter: `drop-shadow(0 6px 18px color-mix(in srgb, ${cssVar.colorText} 14%, transparent))`,
    flexShrink: 0,
  },
  heroText: {
    display: 'flex',
    flexDirection: 'column',
    minInlineSize: 0,
  },
  hour: {
    borderRadius: 10,
    flex: '1',
    gap: 6,
    paddingBlock: 8,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    minInlineSize: 52,
  },
  hourCurrent: {
    backgroundColor: a2ui.overlay4,
    boxShadow: `0 0 0 1px ${a2ui.line}`,
  },
  hourLabel: {
    color: a2ui.fgMuted,
    fontSize: 11,
  },
  hourLabelCurrent: {
    color: a2ui.fg,
    fontWeight: 500,
  },
  hourly: {
    paddingBlock: 12,
    paddingInline: 8,
    borderBlockStartColor: a2ui.line,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    position: 'relative',
  },
  hourPrecip: {
    blockSize: 12,
    color: cssVar.colorInfoText,
    fontSize: 10,
    fontVariantNumeric: 'tabular-nums',
    lineHeight: '12px',
  },
  hourPrecipHidden: {
    opacity: 0,
  },
  hours: {
    gap: 2,
    paddingInline: 8,
    display: 'flex',
    scrollbarWidth: 'none',
    overflowX: 'auto',
  },
  hourTemp: {
    fontSize: 13,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 500,
  },
  location: {
    gap: 4,
    alignItems: 'center',
    color: a2ui.fgMuted,
    display: 'flex',
    fontSize: 12.5,
    fontWeight: 500,
    minInlineSize: 0,
  },
  range: {
    color: a2ui.fgMuted,
    fontSize: 12,
    fontVariantNumeric: 'tabular-nums',
    marginBlockStart: 2,
    whiteSpace: 'pre',
  },
  root: {
    overflow: 'hidden',
    inlineSize: '100%',
    minInlineSize: 0,
    position: 'relative',
  },
  temp: {
    fontSize: 56,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 600,
    letterSpacing: '-0.04em',
    lineHeight: 0.95,
  },
  tempRow: {
    alignItems: 'flex-start',
    display: 'flex',
    marginBlockStart: 6,
  },
  unit: {
    color: a2ui.fgMuted,
    fontSize: 20,
    fontWeight: 500,
    marginBlockStart: 6,
  },

  // variant="default": the plain lobe-ui card.
  dBar: {
    backgroundColor: cssVar.colorFillSecondary,
  },
  dCondition: {
    fontSize: cssVar.fontSizeLG,
  },
  dDayLabel: {
    fontSize: cssVar.fontSize,
    fontWeight: 400,
  },
  dDetail: {
    borderRadius: cssVar.borderRadius,
    backgroundColor: cssVar.colorFillQuaternary,
  },
  dDetailLabel: {
    color: cssVar.colorTextDescription,
    fontSize: cssVar.fontSizeSM,
  },
  dDetailValue: {
    fontSize: cssVar.fontSize,
  },
  dHourCurrent: {
    borderRadius: cssVar.borderRadius,
    backgroundColor: cssVar.colorFillTertiary,
    boxShadow: 'none',
  },
  dLine: {
    borderBlockStartColor: cssVar.colorBorderSecondary,
  },
  dLocation: {
    color: cssVar.colorTextSecondary,
    fontSize: cssVar.fontSize,
    fontWeight: 400,
  },
  dMuted: {
    color: cssVar.colorTextSecondary,
  },
  dSmall: {
    fontSize: cssVar.fontSizeSM,
  },
  dTemp: {
    fontWeight: 500,
    letterSpacing: '-0.02em',
  },
});
