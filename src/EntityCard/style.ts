import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

const fillBorder = `var(--lobe-fill-border, ${cssVar.colorFill})`;

// Layout and the `a2ui` look adapted from CopilotKit Gen UI 2.0 standard catalog (MIT),
// `standard/composites.tsx` EntityCard, Stars and CardButton. Sizes are in em there: the card takes
// the font size of the text around it. The `d*` entries restyle the same markup for
// `variant="default"`, a plain lobe-ui card.
export const styles = stylex.create({
  actions: {
    gap: 8,
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  /** A2UI pill button (`PILL_BUTTON`). */
  button: {
    font: 'inherit',
    borderRadius: 9999,
    borderStyle: 'solid',
    borderWidth: 1,
    paddingBlock: 6,
    paddingInline: 12,
    textDecoration: 'none',
    cursor: 'pointer',
    fontSize: '0.875em',
    fontWeight: 500,
    lineHeight: 1.429,
    textAlign: 'start',
  },
  buttonGhost: {
    borderColor: 'transparent',
    backgroundColor: { 'default': 'transparent', ':hover': a2ui.overlay5 },
    color: a2ui.fg,
  },
  buttonOutline: {
    borderColor: a2ui.line,
    backgroundColor: { 'default': 'transparent', ':hover': a2ui.overlay5 },
    color: a2ui.fg,
  },
  buttonSoft: {
    borderColor: 'transparent',
    backgroundColor: { 'default': a2ui.secondary, ':hover': a2ui.overlay8 },
    color: a2ui.fg,
  },
  buttonSolid: {
    borderColor: 'transparent',
    backgroundColor: {
      'default': a2ui.primary,
      ':hover': `color-mix(in srgb, ${a2ui.primary} 88%, transparent)`,
    },
    color: a2ui.primaryFg,
  },
  a2uiBadge: {
    borderRadius: 9999,
    flex: 'none',
    paddingBlock: 1,
    paddingInline: 8,
    fontSize: '0.75em',
    fontWeight: 500,
    lineHeight: 1.333,
  },
  a2uiBody: {
    padding: 12,
    gap: 4,
  },
  a2uiCard: {
    borderColor: a2ui.line,
    borderRadius: 16,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: a2ui.surface,
  },
  a2uiDescription: {
    color: a2ui.fgMuted,
    fontSize: '0.875em',
    lineHeight: 1.429,
  },
  a2uiMeta: {
    color: a2ui.fg,
    fontSize: '0.875em',
    fontWeight: 500,
    lineHeight: 1.429,
    marginTop: 2,
  },
  a2uiRating: {
    color: a2ui.fgMuted,
    fontSize: '0.875em',
    lineHeight: 1.429,
  },
  a2uiSubtitle: {
    color: a2ui.fgMuted,
    fontSize: '0.75em',
    lineHeight: 1.333,
  },
  a2uiTitle: {
    color: a2ui.fg,
    fontSize: '1em',
    fontWeight: 500,
    lineHeight: 1.625,
  },
  body: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  clamp3: {
    overflow: 'hidden',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 3,
    display: '-webkit-box',
  },
  clickable: {
    cursor: 'pointer',
  },
  dBody: {
    gap: 4,
    paddingBlock: 12,
    paddingInline: 16,
  },
  dCard: {
    borderColor: fillBorder,
    borderRadius: cssVar.borderRadiusLG,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: cssVar.colorBgContainer,
    color: cssVar.colorText,
    fontFamily: cssVar.fontFamily,
    fontSize: cssVar.fontSize,
    lineHeight: cssVar.lineHeight,
  },
  dClickable: {
    borderColor: {
      'default': fillBorder,
      ':hover': `var(--lobe-fill-border-strong, ${cssVar.colorFillSecondary})`,
    },
  },
  dDescription: {
    color: cssVar.colorTextSecondary,
    fontSize: cssVar.fontSize,
  },
  dMeta: {
    color: cssVar.colorText,
    fontWeight: 500,
    marginTop: 2,
  },
  dRating: {
    color: cssVar.colorTextDescription,
    fontSize: cssVar.fontSizeSM,
  },
  dSubtitle: {
    color: cssVar.colorTextDescription,
    fontSize: cssVar.fontSizeSM,
  },
  dTitle: {
    color: cssVar.colorTextHeading,
    fontSize: cssVar.fontSizeLG,
    fontWeight: 600,
  },
  head: {
    gap: 8,
    alignItems: 'center',
    display: 'flex',
    minWidth: 0,
  },
  horizontal: {
    gap: 12,
    alignSelf: 'start',
    flexDirection: 'row',
  },
  image: {
    flex: 'none',
    display: 'block',
    objectFit: 'cover',
    width: '100%',
  },
  imageHorizontal: {
    alignSelf: 'start',
    aspectRatio: '1 / 1',
    width: 120,
  },
  imageSlot: {
    flex: 'none',
    overflow: 'hidden',
  },
  rating: {
    gap: 4,
    alignItems: 'center',
    display: 'inline-flex',
  },
  root: {
    overflow: 'hidden',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100%',
    minWidth: 0,
  },
  star: {
    fill: 'currentColor',
    flex: 'none',
    display: 'block',
    height: '0.93em',
    width: '0.93em',
  },
  starEmpty: {
    color: a2ui.lineStrong,
  },
  starFill: {
    color: a2ui.warning,
  },
  stars: {
    gap: 1,
    alignItems: 'center',
    display: 'inline-flex',
  },
  subtitle: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

/** Badge tint per colour (the official badge: a soft wash and the tone's text, no border). */
export const badgeTones = stylex.create({
  danger: {
    backgroundColor: cssVar.colorErrorFillTertiary,
    color: 'var(--lobe-color-error-text)',
  },
  default: {
    backgroundColor: a2ui.secondary,
    color: a2ui.fg,
  },
  discovery: {
    backgroundColor: 'var(--lobe-purple-fill-tertiary)',
    color: 'var(--lobe-purple-active)',
  },
  info: {
    backgroundColor: cssVar.colorInfoFillTertiary,
    color: 'var(--lobe-color-info-text)',
  },
  secondary: {
    backgroundColor: 'transparent',
    color: a2ui.fgMuted,
  },
  success: {
    backgroundColor: cssVar.colorSuccessFillTertiary,
    color: 'var(--lobe-color-success-text)',
  },
  warning: {
    backgroundColor: cssVar.colorWarningFillTertiary,
    color: 'var(--lobe-color-warning-text)',
  },
});
