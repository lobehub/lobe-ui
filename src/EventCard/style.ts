import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

// Adapted from CopilotKit a2ui-playground (MIT), `renderers/domain.tsx` EventCard.
// The `d*` entries restyle the same markup for `variant="default"`, the plain lobe-ui card.
export const styles = stylex.create({
  attendees: {
    gap: 8,
    alignItems: 'center',
    color: a2ui.fgMuted,
    display: 'flex',
    fontSize: 12,
    fontVariantNumeric: 'tabular-nums',
  },
  body: {
    gap: 14,
    paddingInline: 16,
    display: 'flex',
    paddingBlockEnd: 16,
  },
  bodyNoCover: {
    paddingBlockStart: 16,
  },
  bodyWithCover: {
    marginBlockStart: -28,
    position: 'relative',
  },
  cover: {
    overflow: 'hidden',
    backgroundColor: a2ui.overlay2_5,
    blockSize: 128,
    position: 'relative',
  },
  coverFade: {
    inset: 0,
    backgroundImage: `linear-gradient(to top, ${a2ui.surface}, transparent 50%, transparent)`,
    position: 'absolute',
  },
  date: {
    borderColor: a2ui.lineStrong,
    borderRadius: 12,
    borderStyle: 'solid',
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: a2ui.surface,
    // The playground's surface-2: the card surface under a faint fill wash.
    backgroundImage: `linear-gradient(${a2ui.overlay4}, ${a2ui.overlay4})`,
    boxShadow: '0 6px 18px -6px var(--lobe-color-bg-mask)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    inlineSize: 56,
    position: 'relative',
  },
  day: {
    paddingBlock: 4,
    fontSize: 22,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 600,
    lineHeight: 1,
  },
  description: {
    marginBlock: 0,
    paddingInline: 16,
    color: a2ui.fg80,
    fontSize: 13,
    lineHeight: 1.625,
    paddingBlockEnd: 12,
  },
  dot: {
    borderRadius: 999,
    blockSize: 20,
    boxShadow: `0 0 0 2px ${a2ui.surface}`,
    inlineSize: 20,
    marginInlineStart: { 'default': -6, ':first-child': 0 },
  },
  dots: {
    display: 'flex',
  },
  footer: {
    gap: 12,
    paddingBlock: 12,
    paddingInline: 16,
    alignItems: 'center',
    borderBlockStartColor: a2ui.line,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    justifyContent: 'space-between',
  },
  main: {
    flex: '1',
    gap: 6,
    display: 'flex',
    flexDirection: 'column',
    minInlineSize: 0,
  },
  mainWithCover: {
    paddingBlockStart: 32,
  },
  meta: {
    gap: 4,
    color: a2ui.fgMuted,
    display: 'flex',
    flexDirection: 'column',
    fontSize: 12.5,
  },
  metaRow: {
    gap: 6,
    alignItems: 'center',
    display: 'flex',
    minInlineSize: 0,
  },
  month: {
    paddingBlock: 3,
    backgroundColor: a2ui.accent,
    color: a2ui.onSolid,
    fontSize: 11,
    fontWeight: 600,
    inlineSize: '100%',
    lineHeight: 1.25,
    textAlign: 'center',
  },
  root: {
    overflow: 'hidden',
    inlineSize: '100%',
    minInlineSize: 0,
  },
  tags: {
    paddingInline: 16,
    paddingBlockEnd: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: '-0.025em',
    lineHeight: 1.375,
  },
  weekday: {
    color: a2ui.fgMuted,
    fontSize: 10,
    paddingBlockEnd: 6,
  },

  // variant="default": the plain lobe-ui card.
  dDate: {
    borderColor: cssVar.colorBorderSecondary,
    borderRadius: cssVar.borderRadius,
    backgroundColor: cssVar.colorBgElevated,
    backgroundImage: 'none',
    boxShadow: cssVar.boxShadowTertiary,
  },
  dDescription: {
    color: cssVar.colorTextSecondary,
    fontSize: cssVar.fontSize,
    lineHeight: cssVar.lineHeight,
  },
  dFooter: {
    borderBlockStartColor: cssVar.colorBorderSecondary,
  },
  dMeta: {
    color: cssVar.colorTextSecondary,
    fontSize: cssVar.fontSize,
  },
  dMonth: {
    backgroundColor: cssVar.colorFillSecondary,
    color: cssVar.colorText,
    fontWeight: 500,
  },
  dSmall: {
    color: cssVar.colorTextSecondary,
    fontSize: cssVar.fontSizeSM,
  },
  dTitle: {
    color: cssVar.colorTextHeading,
    fontSize: cssVar.fontSizeLG,
    letterSpacing: 'normal',
  },
});

/** Attendee dots: lobe-ui preset palettes in place of the playground's chart colours. */
export const dotStyles = stylex.create({
  0: { backgroundImage: 'linear-gradient(135deg, var(--lobe-purple-9), var(--lobe-blue-9))' },
  1: { backgroundImage: 'linear-gradient(135deg, var(--lobe-blue-9), var(--lobe-green-9))' },
  2: { backgroundImage: 'linear-gradient(135deg, var(--lobe-green-9), var(--lobe-gold-9))' },
});
