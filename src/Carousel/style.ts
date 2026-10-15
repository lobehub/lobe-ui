import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';
const current = ':is([aria-current="true"])';

export const styles = stylex.create({
  arrow: {
    backgroundColor: cssVar.colorBgContainer,
    boxShadow: '0 1px 4px rgb(0 0 0 / 12%)',
    insetBlockStart: '50%',
    position: 'absolute',
    transform: 'translateY(-50%)',
    zIndex: 1,
  },
  dot: {
    padding: 0,
    borderRadius: 999,
    borderStyle: 'none',
    borderWidth: 0,
    outline: { 'default': null, ':focus-visible': `2px solid ${cssVar.colorText}` },
    transition: { default: 'width 0.2s ease, background 0.2s ease', [reducedMotion]: 'none' },
    backgroundColor: {
      [current]: cssVar.colorText,
      'default': cssVar.colorFill,
      ':hover:not([aria-current="true"])': cssVar.colorTextQuaternary,
    },
    cursor: 'pointer',
    outlineOffset: { 'default': null, ':focus-visible': 2 },
    height: 6,
    width: { [current]: 18, default: 6 },
  },
  dots: {
    gap: 6,
    paddingBlock: 10,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  root: {
    position: 'relative',
  },
  slide: {
    flexBasis: '100%',
    flexGrow: 0,
    flexShrink: 0,
    minWidth: 0,
  },
  track: {
    transition: {
      default: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
      [reducedMotion]: 'none',
    },
    display: 'flex',
  },
  trackAdaptive: {
    alignItems: 'flex-start',
  },
  viewport: {
    overflow: 'hidden',
    transition: { default: 'height 0.3s ease', [reducedMotion]: 'none' },
    position: 'relative',
    touchAction: 'pan-y',
  },
});
