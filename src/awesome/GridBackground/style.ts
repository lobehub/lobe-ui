import * as stylex from '@stylexjs/stylex';

const highlightAnimation = stylex.keyframes({
  '0%': { maskPosition: '100% 0%' },
  '16%': { maskPosition: '100% 200%' },
  '100%': { maskPosition: '100% 200%' },
});

const highlightAnimationReverse = stylex.keyframes({
  '0%': { maskPosition: '100% 200%' },
  '16%': { maskPosition: '100% 0%' },
  '100%': { maskPosition: '100% 0%' },
});

export const styles = stylex.create({
  backgroundShape: {
    borderRadius: '50%',
    backgroundColor: 'var(--grid-background-color-1, transparent)',
    boxShadow:
      '0 0 1em 2em var(--grid-background-color-1, transparent), 0 0 3em 6em var(--grid-background-color-2, transparent), 0 0 6em 10em var(--grid-background-color-3, transparent), 0 0 8em 16em var(--grid-background-color-4, transparent)',
    filter: 'blur(2em) saturate(400%)',
    insetBlockStart: '42%',
    insetInlineStart: '38%',
    position: 'absolute',
    transform: 'rotateX(60deg)',
    height: '36%',
    width: '24%',
  },
  backgroundContainer: {
    inset: 0,
    perspective: '200px',
    position: 'absolute',
    zIndex: -1,
    height: '100%',
    width: '100%',
  },
  container: {
    maskImage: 'linear-gradient(to bottom, transparent, #fff 30%, #fff 70%, transparent)',
    maskSize: 'cover',
    position: 'relative',
  },
  highlight: {
    '--delay': '0s',
    '--duration': '6s',
    'inset': 0,
    'animationDelay': 'var(--delay)',
    'animationDuration': 'var(--duration)',
    'animationIterationCount': 'infinite',
    'animationName': highlightAnimation,
    'animationTimingFunction': 'cubic-bezier(0.62, 0.62, 0.28, 0.67)',
    'maskImage': 'linear-gradient(to bottom, transparent 40%, #fff 60%, transparent)',
    'maskSize': '100% 200%',
    'position': 'absolute',
    'zIndex': 1,
  },
  highlightReverse: {
    animationName: highlightAnimationReverse,
  },
});
