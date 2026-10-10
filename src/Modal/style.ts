import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const softEase = 'cubic-bezier(0.32, 0.72, 0, 1)';
const startingOrEnding = ':is([data-starting-style], [data-ending-style])';
const ending = ':is([data-ending-style])';

const spin = stylex.keyframes({
  to: { transform: 'rotate(360deg)' },
});

const deny = stylex.keyframes({
  '0%, 100%': { transform: 'translateX(0)' },
  '20%': { transform: 'translateX(-5px)' },
  '40%': { transform: 'translateX(5px)' },
  '60%': { transform: 'translateX(-3px)' },
  '80%': { transform: 'translateX(2px)' },
});

const iconButton = (size: number) => ({
  borderColor: 'currentcolor',
  borderRadius: 12,
  borderStyle: 'none',
  borderWidth: 'medium',
  backgroundColor: { default: 'transparent', ':hover': cssVar.colorFillSecondary },
  color: { default: cssVar.colorTextTertiary, ':hover': cssVar.colorText },
  transition: `all 160ms ${softEase}`,
  cursor: 'pointer',
  transform: { default: null, ':hover': 'scale(1.04)' },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: size,
  padding: 0,
  width: size,
});

export const styles = stylex.create({
  backdrop: {
    inset: 0,
    transition: `opacity 180ms ${softEase}`,
    backgroundColor: `color-mix(in srgb, ${cssVar.colorBgContainer} 60%, transparent)`,
    opacity: { default: null, [startingOrEnding]: 0 },
    position: 'fixed',
    zIndex: 1200,
  },

  close: {
    insetBlockStart: 8,
    insetInlineEnd: 12,
    position: 'absolute',
  },

  closeInline: iconButton(32),

  content: {
    paddingInline: 16,
    paddingBlockEnd: 16,
    paddingBlockStart: 0,
    overflowX: 'hidden',
    overflowY: 'auto',
  },

  contentNoHeader: {
    paddingBlockStart: 16,
  },

  denyAnimation: {
    animationDuration: '280ms',
    animationName: deny,
    animationTimingFunction: 'cubic-bezier(0.36, 0.66, 0.04, 1)',
  },

  footer: {
    gap: 8,
    paddingBlock: 12,
    paddingInline: 16,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
  },

  fullscreenPopupInner: {
    height: '100dvh !important',
    maxHeight: '100dvh !important',
    maxWidth: '100% !important',
    width: '100% !important',
  },

  fullscreenToggle: iconButton(28),

  header: {
    paddingBlock: 8,
    paddingInline: 16,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: 48,
  },

  headerActions: {
    gap: 4,
    alignItems: 'center',
    display: 'flex',
    marginInlineEnd: -4,
  },

  headerDraggable: {
    cursor: 'default',
    userSelect: 'none',
  },

  loadingSpinner: {
    borderColor: 'currentcolor',
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: 2,
    animationDuration: '0.6s',
    animationIterationCount: 'infinite',
    animationName: spin,
    animationTimingFunction: 'linear',
    borderBlockStartColor: 'transparent',
    display: 'inline-block',
    height: 14,
    width: 14,
  },

  popup: {
    inset: 0,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none',
    position: 'fixed',
    zIndex: 1201,
  },

  popupInner: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: cssVar.colorBgElevated,
    boxShadow: `${cssVar.boxShadow}, var(--lobe-ring)`,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    opacity: { default: null, [startingOrEnding]: 0 },
    pointerEvents: 'auto',
    position: 'relative',
    transform: {
      default: null,
      [ending]: 'scale(0.98)',
      ':is([data-starting-style]):not([data-ending-style])': 'scale(0.97)',
    },
    transitionDuration: { default: '220ms, 220ms', [ending]: '120ms' },
    transitionProperty: 'transform, opacity',
    transitionTimingFunction: {
      default: `${softEase}, ${softEase}`,
      [ending]: 'cubic-bezier(0.4, 0, 1, 1)',
    },
    maxHeight: 'calc(100dvh - 64px)',
    maxWidth: 520,
    width: 'calc(100% - 32px)',
  },

  title: {
    margin: 0,
    color: cssVar.colorText,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.4,
  },

  viewport: {
    inset: 0,
    overflow: 'auto',
    position: 'fixed',
    zIndex: 1200,
  },
});
