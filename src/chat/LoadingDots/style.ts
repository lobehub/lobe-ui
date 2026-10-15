import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const size = 'var(--loading-dots-size, 8px)';
const dotColor = 'var(--loading-dots-color, var(--lobe-color-primary))';

const fade = stylex.keyframes({
  '0%, 100%': { opacity: 0.3 },
  '50%': { opacity: 1 },
});

const orbit = stylex.keyframes({
  '0%': { transform: `rotate(0deg) translateX(calc(${size} * 2))` },
  '100%': { transform: `rotate(360deg) translateX(calc(${size} * 2))` },
});

const pulse = stylex.keyframes({
  '0%, 100%': { opacity: 0.3, transform: 'scale(0.8)' },
  '50%': { opacity: 1, transform: 'scale(1.3)' },
});

const typing = stylex.keyframes({
  '0%, 100%': { opacity: 0.2, transform: 'scale(0.6)' },
  '25%': { opacity: 1, transform: 'scale(1)' },
  '50%, 75%': { opacity: 0.2, transform: 'scale(0.6)' },
});

const wave = stylex.keyframes({
  '0%, 100%': { transform: 'translateY(0)' },
  '25%': { transform: `translateY(calc(${size} * -1.5))` },
  '50%': { transform: 'translateY(0)' },
});

export const styles = stylex.create({
  container: {
    padding: cssVar.paddingXS,
    gap: 6,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  defaultDot: {
    animationDuration: '1.2s',
    animationIterationCount: 'infinite',
    animationName: fade,
    animationTimingFunction: 'ease-in-out',
  },
  dot: {
    borderRadius: '50%',
    backgroundColor: dotColor,
    height: size,
    width: size,
  },
  orbitContainer: {
    position: 'relative',
    height: `calc(${size} * 4)`,
    width: `calc(${size} * 4)`,
  },
  orbitDot: {
    borderRadius: '50%',
    animationDuration: '1.2s',
    animationIterationCount: 'infinite',
    animationName: orbit,
    animationTimingFunction: 'linear',
    backgroundColor: dotColor,
    insetBlockStart: '50%',
    insetInlineStart: '50%',
    marginBlockStart: `calc(${size} / -2)`,
    marginInlineStart: `calc(${size} / -2)`,
    position: 'absolute',
    transformOrigin: `calc(${size} * 2) 0`,
    height: size,
    width: size,
  },
  orbitWrapper: {
    padding: cssVar.paddingXS,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    height: `calc(${size} * 5)`,
    width: `calc(${size} * 5)`,
  },
  pulseDot: {
    animationDuration: '1.2s',
    animationIterationCount: 'infinite',
    animationName: pulse,
    animationTimingFunction: 'ease-in-out',
  },
  typingDot: {
    animationDuration: '1.2s',
    animationIterationCount: 'infinite',
    animationName: typing,
    animationTimingFunction: 'ease-in-out',
  },
  waveDot: {
    animationDuration: '1.24s',
    animationIterationCount: 'infinite',
    animationName: wave,
    animationTimingFunction: 'ease-in-out',
  },
});
