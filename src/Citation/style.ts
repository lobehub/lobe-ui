import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

// Adapted from CopilotKit Gen UI 2.0 standard catalog (MIT), `standard/composites.tsx` Citation.
// The `d*` entries restyle the same markup for `variant="default"`.
export const styles = stylex.create({
  a2uiCard: {
    padding: 12,
    borderColor: a2ui.line,
    borderRadius: a2ui.radius,
    backgroundColor: a2ui.surface2,
    boxShadow: a2ui.shadowMd,
    color: a2ui.fg,
    fontFamily: a2ui.fontFamily,
    lineHeight: 1.5,
  },
  a2uiLink: {
    color: a2ui.info,
    fontSize: '0.75em',
    lineHeight: 1.333,
  },
  a2uiMarker: {
    borderRadius: 9999,
    paddingBlock: 2,
    paddingInline: 6,
    backgroundColor: { 'default': a2ui.secondary, ':hover': a2ui.overlay8 },
    color: a2ui.fgMuted,
    fontSize: '0.75em',
  },
  a2uiSnippet: {
    color: a2ui.fgMuted,
    fontSize: '0.875em',
    lineHeight: 1.429,
  },
  a2uiSource: {
    color: a2ui.fgMuted,
    fontSize: '0.75em',
    lineHeight: 1.333,
  },
  a2uiTitle: {
    color: a2ui.fg,
    fontSize: '0.875em',
    fontWeight: 500,
    lineHeight: 1.429,
  },
  card: {
    borderStyle: 'solid',
    borderWidth: 1,
    gap: 4,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    insetBlockStart: '100%',
    insetInlineStart: 0,
    position: 'absolute',
    textAlign: 'start',
    zIndex: 50,
    marginTop: 6,
    width: 280,
  },
  dCard: {
    padding: 12,
    borderColor: `var(--lobe-fill-border, ${cssVar.colorFill})`,
    borderRadius: cssVar.borderRadiusLG,
    backgroundColor: cssVar.colorBgElevated,
    boxShadow: cssVar.boxShadowSecondary,
    color: cssVar.colorText,
    fontFamily: cssVar.fontFamily,
    fontSize: cssVar.fontSize,
    lineHeight: cssVar.lineHeight,
  },
  dLink: {
    color: cssVar.colorInfo,
    fontSize: cssVar.fontSizeSM,
  },
  dMarker: {
    borderRadius: 4,
    paddingBlock: 2,
    paddingInline: 5,
    backgroundColor: { 'default': cssVar.colorFillTertiary, ':hover': cssVar.colorFillSecondary },
    color: cssVar.colorTextSecondary,
    fontFamily: cssVar.fontFamilyCode,
    fontSize: 10,
  },
  dSnippet: {
    color: cssVar.colorTextSecondary,
    fontSize: cssVar.fontSizeSM,
  },
  dSource: {
    color: cssVar.colorTextDescription,
    fontSize: cssVar.fontSizeSM,
  },
  dTitle: {
    color: cssVar.colorTextHeading,
    fontWeight: 500,
  },
  link: {
    textDecoration: { 'default': 'none', ':hover': 'underline' },
    alignSelf: 'flex-start',
  },
  marker: {
    font: 'inherit',
    borderStyle: 'none',
    borderWidth: 0,
    marginBlock: 0,
    marginInline: 2,
    cursor: 'pointer',
    fontWeight: 500,
    lineHeight: 1,
    verticalAlign: 'super',
  },
  root: {
    display: 'inline-flex',
    position: 'relative',
    verticalAlign: 'baseline',
  },
  source: {
    gap: 6,
    alignItems: 'center',
    display: 'flex',
  },
});
