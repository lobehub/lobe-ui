import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';

// Adapted from CopilotKit a2ui-playground (MIT): `renderers/feedback.tsx` EmptyState.
export const a2uiEmptyStyles = stylex.create({
  action: {
    marginTop: 8,
  },
  description: {
    margin: 0,
    color: a2ui.fgMuted,
    fontSize: 12.5,
    lineHeight: 1.625,
    maxWidth: 384,
  },
  icon: {
    borderColor: a2ui.line,
    borderRadius: 999,
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: a2ui.overlay4,
    color: a2ui.fgMuted,
    display: 'grid',
    justifyContent: 'center',
    marginBottom: 4,
    height: 40,
    width: 40,
  },
  root: {
    borderColor: a2ui.overlay12,
    borderRadius: a2ui.radius,
    borderStyle: 'dashed',
    borderWidth: 1,
    gap: 8,
    paddingBlock: 32,
    paddingInline: 24,
    alignItems: 'center',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    textAlign: 'center',
    width: '100%',
  },
  title: {
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
  },
});
