import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const gradient = stylex.keyframes({
  '0%': { backgroundPosition: '0% 50%' },
  '50%': { backgroundPosition: '100% 50%' },
  '100%': { backgroundPosition: '0% 50%' },
});

const borderRadius = 'var(--gradient-button-border-radius, var(--lobe-border-radius))';
const gradientImage = `linear-gradient(-45deg, ${cssVar.gold}, ${cssVar.magenta}, ${cssVar.geekblue}, ${cssVar.cyan})`;
const hover = ':hover:not(:active)';

export const styles = stylex.create({
  button: {
    'borderColor': 'currentcolor',
    'borderRadius': borderRadius,
    'borderStyle': 'none',
    'borderWidth': 'medium',
    'position': 'relative',
    'zIndex': 1,
    '::after': {
      borderRadius: `calc(${borderRadius} - 1px)`,
      content: "''",
      insetBlockStart: 1,
      insetInlineStart: 1,
      position: 'absolute',
      zIndex: -1,
      height: 'calc(100% - 2px)',
      width: 'calc(100% - 2px)',
    },
    '::before': {
      inset: 0,
      borderRadius,
      animationDelay: '5s',
      animationDuration: '5s',
      animationIterationCount: 'infinite',
      animationName: gradient,
      animationTimingFunction: 'ease',
      backgroundImage: gradientImage,
      backgroundSize: '400% 400%',
      content: "''",
      position: 'absolute',
      zIndex: -2,
    },
  },
  buttonDark: {
    '::after': {
      backgroundColor: {
        'default': cssVar.colorBgLayout,
        [hover]: `color-mix(in srgb, ${cssVar.colorBgLayout} 90%, transparent)`,
        ':active': `color-mix(in srgb, ${cssVar.colorBgLayout} 85%, transparent)`,
      },
    },
  },
  buttonLight: {
    '::after': {
      backgroundColor: {
        'default': cssVar.colorBgContainer,
        [hover]: `color-mix(in srgb, ${cssVar.colorBgContainer} 95%, transparent)`,
        ':active': `color-mix(in srgb, ${cssVar.colorBgContainer} 90%, transparent)`,
      },
    },
  },
  glow: {
    borderRadius: 'inherit',
    animationDelay: '5s',
    animationDuration: '5s',
    animationIterationCount: 'infinite',
    animationName: gradient,
    animationTimingFunction: 'ease',
    backgroundImage: gradientImage,
    backgroundSize: '400% 400%',
    filter: 'blur(0.5em)',
    insetBlockStart: 0,
    insetInlineStart: 0,
    opacity: 0.5,
    position: 'absolute',
    zIndex: -2,
    height: '100%',
    width: '100%',
  },
});
