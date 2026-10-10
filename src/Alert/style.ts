import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

import { alertSummaryMarker } from './marker.stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';
const narrow = '@media (width <= 480px)';
const enabledHover = ':hover:not(:disabled)';

export const styles = stylex.create({
  action: {
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
    marginInlineStart: 'auto',
    minHeight: 32,
  },
  banner: {
    borderRadius: 0,
    boxShadow: 'none',
  },
  centered: {
    alignItems: 'center',
  },
  close: {
    'margin': 0,
    'padding': 0,
    'borderColor': 'currentcolor',
    'borderRadius': cssVar.borderRadiusSM,
    'borderStyle': 'none',
    'borderWidth': 'medium',
    'transition': `color 160ms ${cssVar.motionEaseOut}, background-color 160ms ${cssVar.motionEaseOut}, scale 160ms ${cssVar.motionEaseOut}`,
    'alignItems': 'center',
    'backgroundColor': { default: 'transparent', [enabledHover]: cssVar.colorFillTertiary },
    'color': { default: cssVar.colorTextTertiary, [enabledHover]: cssVar.colorText },
    'cursor': { 'default': 'pointer', ':disabled': 'not-allowed' },
    'display': 'inline-flex',
    'flexShrink': 0,
    'justifyContent': 'center',
    'opacity': { 'default': null, ':disabled': 0.45 },
    'position': 'relative',
    'scale': { 'default': 1, ':active:not(:disabled)': 0.96 },
    'transitionDuration': { default: null, [reducedMotion]: '0s' },
    'height': 32,
    'width': 32,
    '::after': {
      content: "''",
      insetBlockStart: '50%',
      insetInlineStart: '50%',
      position: 'absolute',
      translate: '-50% -50%',
      height: 40,
      width: 40,
    },
  },
  colorfulText: {
    color: 'var(--lobe-alert-accent)',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100%',
    width: '100%',
  },
  content: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  description: {
    color: cssVar.colorTextSecondary,
    fontSize: 13,
    lineHeight: '20px',
    overflowWrap: 'anywhere',
    textWrap: 'pretty',
  },
  detailed: {
    paddingBlock: 12,
    paddingInline: 14,
  },
  extra: {
    color: cssVar.colorText,
    position: 'relative',
    maxWidth: '100%',
  },
  extraBanner: {
    borderRadius: 0,
  },
  extraContent: {
    padding: 8,
    borderRadius: cssVar.borderRadiusSM,
    marginInline: 12,
    overflow: 'hidden',
    backgroundColor: cssVar.colorFillQuaternary,
    color: cssVar.colorText,
    fontSize: 12,
    marginBlockEnd: 12,
    marginBlockStart: 0,
  },
  extraHeader: {
    'borderRadius': 0,
    'gap': 6,
    'paddingBlock': 8,
    'paddingInline': 14,
    'transition': `color 160ms ${cssVar.motionEaseOut}, background-color 160ms ${cssVar.motionEaseOut}`,
    'alignItems': 'center',
    'backgroundColor': { 'default': 'transparent', ':hover': cssVar.colorFillQuaternary },
    'borderBlockStartColor': cssVar.colorBorderSecondary,
    'borderBlockStartStyle': 'solid',
    'borderBlockStartWidth': 1,
    'color': { 'default': cssVar.colorTextSecondary, ':hover': cssVar.colorText },
    'cursor': 'pointer',
    'display': 'flex',
    'fontSize': 12,
    'fontWeight': 500,
    'lineHeight': '20px',
    'userSelect': 'none',
    'minHeight': 40,
    '::marker': {
      content: "''",
      display: 'none',
    },
  },
  extraHeaderPlain: {
    paddingInline: 0,
    borderBlockStartColor: cssVar.colorBorderSecondary,
    marginBlockStart: 6,
  },
  extraIndicator: {
    transition: `transform 160ms ${cssVar.motionEaseOut}`,
    color: cssVar.colorTextTertiary,
    flexShrink: 0,
    transform: {
      default: null,
      [stylex.when.ancestor(':is(details[open] > *)', alertSummaryMarker)]: 'rotate(90deg)',
    },
    transitionDuration: { default: null, [reducedMotion]: '0s' },
  },
  extraPlain: {
    backgroundColor: 'transparent',
  },
  glass: {
    backdropFilter: 'saturate(150%) blur(10px)',
  },
  icon: {
    alignItems: 'center',
    color: 'var(--lobe-alert-accent)',
    display: 'inline-flex',
    flexShrink: 0,
    justifyContent: 'center',
    height: 20,
  },
  integrated: {
    borderRadius: cssVar.borderRadius,
    overflow: 'hidden',
  },
  neutralText: {
    color: cssVar.colorText,
  },
  outlined: {
    backgroundColor: 'transparent',
    boxShadow: `inset 0 0 0 1px ${cssVar.colorBorderSecondary}`,
  },
  plain: {
    paddingBlock: 2,
    paddingInline: 0,
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  root: {
    borderColor: 'currentcolor',
    borderRadius: cssVar.borderRadius,
    borderStyle: 'none',
    borderWidth: 'medium',
    gap: 10,
    paddingBlock: 10,
    paddingInline: 12,
    alignItems: 'flex-start',
    backgroundColor: 'var(--lobe-alert-background)',
    boxShadow: 'inset 0 0 0 1px var(--lobe-alert-soft-border)',
    boxSizing: 'border-box',
    color: cssVar.colorText,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: { default: null, [narrow]: 'wrap' },
    fontSize: 14,
    maxWidth: '100%',
    width: '100%',
  },
  soft: {
    backgroundColor: 'var(--lobe-alert-background)',
    boxShadow: 'inset 0 0 0 1px var(--lobe-alert-soft-border)',
  },
  title: {
    color: 'inherit',
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    overflowWrap: 'anywhere',
    textWrap: 'pretty',
  },
  titleDetailed: {
    fontWeight: 500,
  },
  toneError: {
    '--lobe-alert-accent': cssVar.colorError,
    '--lobe-alert-background': `color-mix(in srgb, ${cssVar.colorError} 5%, ${cssVar.colorBgContainer})`,
    '--lobe-alert-soft-border': `color-mix(in srgb, ${cssVar.colorError} 14%, transparent)`,
  },
  toneInfo: {
    '--lobe-alert-accent': cssVar.colorInfo,
    '--lobe-alert-background': `color-mix(in srgb, ${cssVar.colorInfo} 5%, ${cssVar.colorBgContainer})`,
    '--lobe-alert-soft-border': `color-mix(in srgb, ${cssVar.colorInfo} 14%, transparent)`,
  },
  toneSecondary: {
    '--lobe-alert-accent': cssVar.colorTextSecondary,
    '--lobe-alert-background': `color-mix(in srgb, ${cssVar.colorTextSecondary} 4%, ${cssVar.colorBgContainer})`,
    '--lobe-alert-soft-border': `color-mix(in srgb, ${cssVar.colorTextSecondary} 12%, transparent)`,
  },
  toneSuccess: {
    '--lobe-alert-accent': cssVar.colorSuccess,
    '--lobe-alert-background': `color-mix(in srgb, ${cssVar.colorSuccess} 5%, ${cssVar.colorBgContainer})`,
    '--lobe-alert-soft-border': `color-mix(in srgb, ${cssVar.colorSuccess} 14%, transparent)`,
  },
  toneWarning: {
    '--lobe-alert-accent': cssVar.colorWarning,
    '--lobe-alert-background': `color-mix(in srgb, ${cssVar.colorWarning} 5%, ${cssVar.colorBgContainer})`,
    '--lobe-alert-soft-border': `color-mix(in srgb, ${cssVar.colorWarning} 14%, transparent)`,
  },
  unifiedRoot: {
    borderRadius: 0,
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  wrappedAction: {
    marginBlockStart: { default: null, [narrow]: -2 },
    marginInlineStart: { default: 'auto', [narrow]: 30 },
    order: { default: null, [narrow]: 4 },
    width: { default: null, [narrow]: 'calc(100% - 30px)' },
  },
});

export const alertStyles = Object.fromEntries(
  Object.entries(styles).map(([key, value]) => [key, stylex.props(value).className ?? '']),
) as Record<keyof typeof styles, string>;
