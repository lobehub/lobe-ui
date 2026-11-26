import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';

// Adapted from CopilotKit a2ui-playground (MIT): `renderers/feedback.tsx` Alert and Callout.

export const a2uiAlertStyles = stylex.create({
  action: {
    alignSelf: 'center',
    display: 'flex',
    flexShrink: 0,
    marginInlineStart: 'auto',
  },
  alert: {
    borderRadius: 12,
    borderStyle: 'solid',
    borderWidth: 1,
    gap: 12,
    paddingBlock: 12,
    paddingInline: 14,
    boxSizing: 'border-box',
    display: 'flex',
    minWidth: 0,
    width: '100%',
  },
  alertContent: {
    minWidth: 0,
  },
  alertIcon: {
    alignSelf: 'flex-start',
    display: 'flex',
    flex: 'none',
    marginTop: 2,
    height: 16,
  },
  callout: {
    borderColor: 'var(--lobe-color-fill-secondary)',
    borderRadius: a2ui.radius,
    borderStyle: 'solid',
    borderWidth: 1,
    gap: 12,
    paddingBlock: 14,
    paddingInline: 16,
    backgroundImage:
      'linear-gradient(to right, var(--lobe-color-fill-tertiary) 0%, var(--lobe-color-fill-quaternary) 50%, transparent 100%)',
    boxSizing: 'border-box',
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: 0,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  calloutContent: {
    flex: 1,
    minWidth: 160,
  },
  calloutIcon: {
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'var(--lobe-color-fill-secondary)',
    color: a2ui.calloutIcon,
    display: 'grid',
    flex: 'none',
    fontSize: 15,
    justifyContent: 'center',
    height: 32,
    width: 32,
  },
  calloutText: {
    margin: 0,
    color: a2ui.fg80,
    fontSize: 12.5,
    lineHeight: 1.625,
  },
  calloutTitle: {
    margin: 0,
    fontSize: 13,
    fontWeight: 600,
  },
  message: {
    margin: 0,
    marginTop: 2,
    fontSize: 12.5,
    lineHeight: 1.625,
    opacity: 0.8,
  },
  title: {
    margin: 0,
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1.375,
  },
});

export const a2uiAlertTone = stylex.create({
  error: {
    borderColor: `color-mix(in oklab, ${a2ui.alertErrorBase} 25%, transparent)`,
    backgroundColor: `color-mix(in oklab, ${a2ui.alertErrorBase} 7%, transparent)`,
    color: a2ui.alertErrorText,
  },
  info: {
    borderColor: `color-mix(in oklab, ${a2ui.alertInfoBase} 20%, transparent)`,
    backgroundColor: `color-mix(in oklab, ${a2ui.alertInfoBase} 6%, transparent)`,
    color: a2ui.alertInfoText,
  },
  secondary: {
    borderColor: a2ui.lineStrong,
    backgroundColor: a2ui.overlay4,
    color: a2ui.fg,
  },
  success: {
    borderColor: `color-mix(in oklab, ${a2ui.alertSuccessBase} 20%, transparent)`,
    backgroundColor: `color-mix(in oklab, ${a2ui.alertSuccessBase} 6%, transparent)`,
    color: a2ui.alertSuccessText,
  },
  warning: {
    borderColor: `color-mix(in oklab, ${a2ui.alertWarningBase} 25%, transparent)`,
    backgroundColor: `color-mix(in oklab, ${a2ui.alertWarningBase} 7%, transparent)`,
    color: a2ui.alertWarningText,
  },
});

export const a2uiAlertIconTone = stylex.create({
  error: { color: a2ui.alertErrorIcon },
  info: { color: a2ui.alertInfoIcon },
  secondary: { color: a2ui.fgMuted },
  success: { color: a2ui.alertSuccessIcon },
  warning: { color: a2ui.alertWarningIcon },
});
