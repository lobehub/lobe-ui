import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

// Adapted from CopilotKit a2ui-playground (MIT), `renderers/domain.tsx` ProfileCard.
// The `d*` entries restyle the same markup for `variant="default"`, the plain lobe-ui card.
export const styles = stylex.create({
  at: {
    color: `color-mix(in srgb, ${a2ui.fgMuted} 50%, transparent)`,
    flexShrink: 0,
  },
  avatar: {
    borderRadius: 999,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: 'var(--lobe-purple-fill-secondary)',
    blockSize: 64,
    boxShadow: `0 0 0 4px ${a2ui.surface}`,
    color: 'var(--lobe-purple-active)',
    display: 'flex',
    flexShrink: 0,
    fontSize: 18,
    fontWeight: 600,
    inlineSize: 64,
    justifyContent: 'center',
    position: 'relative',
  },
  avatarImg: {
    inset: 0,
    position: 'absolute',
  },
  banner: {
    overflow: 'hidden',
    backgroundImage:
      'linear-gradient(120deg, color-mix(in srgb, var(--lobe-purple-6), var(--lobe-geekblue-6)), var(--lobe-blue-4) 55%, color-mix(in srgb, var(--lobe-geekblue-3), var(--lobe-color-bg-elevated)))',
    blockSize: 64,
    position: 'relative',
  },
  bannerSheen: {
    inset: 0,
    backgroundImage: `radial-gradient(circle at 80% -20%, color-mix(in srgb, ${cssVar.colorTextLightSolid} 18%, transparent), transparent 55%)`,
    position: 'absolute',
  },
  bio: {
    marginBlock: 0,
    color: a2ui.fg80,
    fontSize: 13,
    lineHeight: 1.625,
    marginBlockStart: 10,
  },
  body: {
    paddingInline: 16,
    paddingBlockEnd: 16,
  },
  company: {
    gap: 4,
    alignItems: 'center',
    color: a2ui.fg85,
    display: 'inline-flex',
    fontWeight: 500,
    minInlineSize: 0,
  },
  contact: {
    borderRadius: 8,
    gap: 10,
    paddingBlock: 6,
    paddingInline: 6,
    textDecoration: 'none',
    alignItems: 'center',
    backgroundColor: { 'default': null, ':hover': a2ui.overlay4 },
    color: { 'default': a2ui.fgMuted, ':hover': a2ui.fg },
    display: 'flex',
    fontSize: 12.5,
    minInlineSize: 0,
    transitionDuration: '150ms',
    transitionProperty: 'color, background-color',
  },
  contactIcon: {
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: a2ui.overlay5,
    blockSize: 24,
    display: 'flex',
    flexShrink: 0,
    inlineSize: 24,
    justifyContent: 'center',
  },
  contacts: {
    gap: 2,
    display: 'flex',
    flexDirection: 'column',
    marginBlockStart: 14,
  },
  head: {
    gap: 12,
    alignItems: 'flex-end',
    display: 'flex',
    justifyContent: 'space-between',
    marginBlockStart: -32,
  },
  location: {
    gap: 4,
    alignItems: 'center',
    color: a2ui.fgMuted,
    display: 'flex',
    fontSize: 11.5,
    marginBlockEnd: 4,
    minInlineSize: 0,
  },
  name: {
    overflow: 'hidden',
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: '-0.025em',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  nameBlock: {
    display: 'flex',
    flexDirection: 'column',
    marginBlockStart: 10,
    minInlineSize: 0,
  },
  role: {
    gap: 4,
    alignItems: 'center',
    color: a2ui.fgMuted,
    display: 'flex',
    fontSize: 12.5,
    minInlineSize: 0,
  },
  root: {
    overflow: 'hidden',
    inlineSize: '100%',
    minInlineSize: 0,
  },
  stat: {
    paddingBlock: 10,
    paddingInline: 8,
    alignItems: 'center',
    backgroundColor: a2ui.surface,
    display: 'flex',
    flexDirection: 'column',
    minInlineSize: 0,
  },
  statLabel: {
    overflow: 'hidden',
    color: a2ui.fgMuted,
    fontSize: 11,
    maxInlineSize: '100%',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  stats: {
    borderColor: a2ui.line,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    gap: 1,
    overflow: 'hidden',
    backgroundColor: a2ui.line,
    display: 'grid',
    marginBlockStart: 14,
  },
  statValue: {
    fontSize: 15,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 600,
    letterSpacing: '-0.025em',
  },
  tags: {
    marginBlockStart: 12,
  },

  // variant="default": the plain lobe-ui card.
  dAvatar: {
    backgroundColor: cssVar.colorFillSecondary,
    boxShadow: `0 0 0 4px ${cssVar.colorBgContainer}`,
    color: cssVar.colorTextSecondary,
  },
  dBanner: {
    backgroundColor: cssVar.colorFillTertiary,
    backgroundImage: 'none',
  },
  dBio: {
    color: cssVar.colorTextSecondary,
    fontSize: cssVar.fontSize,
    lineHeight: cssVar.lineHeight,
  },
  dContact: {
    color: { 'default': cssVar.colorTextSecondary, ':hover': cssVar.colorText },
    fontSize: cssVar.fontSize,
  },
  dContactIcon: {
    borderRadius: cssVar.borderRadiusSM,
    backgroundColor: cssVar.colorFillTertiary,
  },
  dMuted: {
    color: cssVar.colorTextSecondary,
    fontSize: cssVar.fontSizeSM,
  },
  dName: {
    color: cssVar.colorTextHeading,
    fontSize: cssVar.fontSizeLG,
    letterSpacing: 'normal',
  },
  dRole: {
    color: cssVar.colorTextSecondary,
    fontSize: cssVar.fontSize,
  },
  dStat: {
    backgroundColor: cssVar.colorFillQuaternary,
  },
  dStatLabel: {
    color: cssVar.colorTextDescription,
    fontSize: cssVar.fontSizeSM,
  },
  dStats: {
    borderRadius: cssVar.borderRadius,
    borderWidth: 0,
    gap: 4,
    backgroundColor: 'transparent',
  },
  dStatValue: {
    fontSize: cssVar.fontSizeLG,
    letterSpacing: 'normal',
  },
});
