import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

// Adapted from CopilotKit Gen UI 2.0 standard catalog (MIT), `standard/composites.tsx` FollowUp
// (`PILL_BUTTON`). The `d*` entries restyle the same markup for `variant="default"`.
export const styles = stylex.create({
  a2uiItem: {
    borderColor: a2ui.line,
    paddingBlock: 6,
    paddingInline: 12,
    backgroundColor: {
      'default': a2ui.surface,
      ':hover': `color-mix(in srgb, ${a2ui.fg} 4%, ${a2ui.surface})`,
    },
    color: a2ui.fg,
    fontSize: '0.875em',
    fontWeight: 500,
    lineHeight: 1.429,
  },
  a2uiTitle: {
    color: a2ui.fgMuted,
    fontSize: '0.875em',
    lineHeight: 1.429,
  },
  dItem: {
    borderColor: `var(--lobe-fill-border, ${cssVar.colorFill})`,
    paddingBlock: 4,
    paddingInline: 12,
    backgroundColor: { 'default': cssVar.colorBgContainer, ':hover': cssVar.colorFillTertiary },
    color: cssVar.colorText,
    fontFamily: cssVar.fontFamily,
    fontSize: cssVar.fontSize,
    lineHeight: cssVar.lineHeight,
  },
  dRoot: {
    color: cssVar.colorText,
    fontFamily: cssVar.fontFamily,
    fontSize: cssVar.fontSize,
  },
  dTitle: {
    color: cssVar.colorTextDescription,
    fontSize: cssVar.fontSizeSM,
  },
  item: {
    font: 'inherit',
    margin: 0,
    borderRadius: 9999,
    borderStyle: 'solid',
    borderWidth: 1,
    cursor: 'pointer',
    textAlign: 'start',
    transitionDuration: '150ms',
    transitionProperty: 'background-color, border-color',
  },
  items: {
    gap: 8,
    display: 'flex',
    flexWrap: 'wrap',
  },
  root: {
    gap: 8,
    display: 'flex',
    flexDirection: 'column',
  },
});
