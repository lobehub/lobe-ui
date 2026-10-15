import * as stylex from '@stylexjs/stylex';

import { media } from '@/styles/stylex/media.stylex';

const aurora = stylex.keyframes({
  '0%': { backgroundPosition: '50% 50%, 50% 50%' },
  '100%': { backgroundPosition: '350% 50%, 350% 50%' },
});

const stripes =
  'repeating-linear-gradient(100deg, rgb(59, 130, 246) 10%, rgb(165, 180, 252) 15%, rgb(147, 197, 253) 20%, rgb(221, 214, 254) 25%, rgb(96, 165, 250) 30%)';

const darkBackground = `repeating-linear-gradient(100deg, rgb(0, 0, 0) 0%, rgb(0, 0, 0) 7%, rgba(0, 0, 0, 0%) 10%, rgba(0, 0, 0, 0%) 12%, rgb(0, 0, 0) 16%), ${stripes}`;

const lightBackground = `repeating-linear-gradient(100deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 7%, rgba(0, 0, 0, 0%) 10%, rgba(0, 0, 0, 0%) 12%, rgb(255, 255, 255) 16%), ${stripes}`;

export const styles = stylex.create({
  bg: {
    'inset': -10,
    'backgroundPosition': '50% 50%, 50% 50%',
    'animationDuration': '100s',
    'animationIterationCount': 'infinite',
    'animationName': aurora,
    'animationTimingFunction': 'linear',
    'backgroundSize': '300%, 200%',
    'maskImage': 'radial-gradient(at 100% 0, rgb(0 0 0) 10%, rgb(0 0 0 / 0%) 70%)',
    'pointerEvents': 'none',
    'position': 'absolute',
    'transform': { default: null, [media.sm]: 'scale(2)' },
    'willChange': 'transform',
    'maxHeight': { default: '100vh', [media.sm]: '25vh' },
    '::after': {
      inset: 0,
      animationDuration: '100s',
      animationIterationCount: 'infinite',
      animationName: aurora,
      animationTimingFunction: 'linear',
      backgroundAttachment: 'fixed',
      backgroundSize: '200%, 100%',
      content: "''",
      mixBlendMode: 'difference',
      position: 'absolute',
    },
  },
  bgDark: {
    'backgroundImage': darkBackground,
    'filter': 'blur(10px) invert(0)',
    'opacity': 0.3,
    '::after': { backgroundImage: darkBackground },
  },
  bgLight: {
    'backgroundImage': lightBackground,
    'filter': 'blur(10px) invert(1)',
    'opacity': 0.6,
    '::after': { backgroundImage: lightBackground },
  },
  wrapper: {
    inset: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: 0,
  },
});
