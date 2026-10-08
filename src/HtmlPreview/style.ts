import './style.css';

import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const shimmer = stylex.keyframes({
  '0%': { backgroundPosition: '200% 0' },
  '100%': { backgroundPosition: '-200% 0' },
});

export const styles = stylex.create({
  fallback: {
    padding: 16,
    color: cssVar.colorTextDescription,
    fontSize: 13,
  },
  iframe: {
    borderColor: 'currentcolor',
    borderStyle: 'none',
    borderWidth: 'medium',
    backgroundColor: 'transparent',
    display: 'block',
    width: '100%',
  },
  loadingBackdrop: {
    inset: 0,
    animationDuration: '1.6s',
    animationIterationCount: 'infinite',
    animationName: shimmer,
    animationTimingFunction: cssVar.motionEaseInOut,
    backgroundImage: `linear-gradient(90deg, transparent 0%, color-mix(in srgb, ${cssVar.colorText} 4%, transparent) 50%, transparent 100%)`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '200% 100%',
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 1,
  },
  loadingBadge: {
    borderRadius: 999,
    gap: 8,
    paddingBlock: 4,
    alignItems: 'center',
    backdropFilter: 'blur(8px)',
    backgroundColor: cssVar.colorBgContainer,
    boxShadow: `0 0 0 1px ${cssVar.colorBorderSecondary}`,
    color: cssVar.colorTextDescription,
    display: 'inline-flex',
    fontSize: 12,
    insetBlockStart: 12,
    insetInlineStart: 12,
    paddingInlineEnd: 10,
    paddingInlineStart: 6,
    position: 'absolute',
    zIndex: 2,
  },
  loadingRoot: {
    overflow: 'hidden',
    backgroundColor: `color-mix(in srgb, ${cssVar.colorText} 3%, ${cssVar.colorBgContainer})`,
    position: 'relative',
  },
  loadingSource: {
    overflow: 'hidden',
    opacity: 0.45,
    pointerEvents: 'none',
    height: '100%',
  },
  toolbar: {
    padding: 4,
    borderRadius: cssVar.borderRadiusLG,
    transition: `opacity 0.2s ${cssVar.motionEaseOut}`,
    backdropFilter: 'blur(8px)',
    backgroundColor: cssVar.colorBgContainer,
    boxShadow: `0 0 0 1px ${cssVar.colorBorderSecondary}`,
    insetBlockStart: 8,
    insetInlineEnd: 8,
    opacity: { 'default': 0, ':focus-within': 1 },
    position: 'absolute',
    zIndex: 2,
  },
});
