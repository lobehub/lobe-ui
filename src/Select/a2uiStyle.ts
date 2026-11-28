import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

// Adapted from CopilotKit Gen UI 2.0 standard catalog (MIT): `Select` (`controlStyle` at size xl,
// pill, and `SELECT_STYLE`: 32px right padding with a 12px chevron 12px from the edge). The
// standard list is the native one; the popup here takes the standard panel look (`PANEL_STYLE`).
export const styles = stylex.create({
  icon: {
    color: cssVar.colorTextTertiary,
  },
  popup: {
    borderColor: a2ui.line,
    borderRadius: 12,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: a2ui.surface2,
    boxShadow: a2ui.shadowMd,
  },
  trigger: {
    gap: 8,
    paddingInlineEnd: 12,
    alignItems: 'center',
    cursor: { 'default': 'pointer', ':is([data-disabled])': 'not-allowed' },
    display: 'flex',
    lineHeight: 1.5,
    opacity: { 'default': null, ':is([data-disabled])': 0.5 },
    outline: 'none',
    textAlign: 'start',
    userSelect: 'none',
  },
});
