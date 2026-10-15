import * as stylex from '@stylexjs/stylex';

import { styleProps } from '@/styles/stylex/props';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';

// Each half keeps four points in both states (TL, TR, BR, BL), so clip-path
// interpolates the pause bars into the two halves of the play triangle.
const styles = stylex.create({
  half: {
    backgroundColor: 'currentColor',
    inset: 0,
    position: 'absolute',
    transition: {
      default: 'clip-path 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      [reducedMotion]: 'none',
    },
  },
  leftPause: {
    clipPath: 'polygon(19% 12%, 41% 12%, 41% 88%, 19% 88%)',
  },
  leftPlay: {
    clipPath: 'polygon(22% 10%, 55% 30%, 55% 70%, 22% 90%)',
  },
  rightPause: {
    clipPath: 'polygon(59% 12%, 81% 12%, 81% 88%, 59% 88%)',
  },
  rightPlay: {
    clipPath: 'polygon(55% 30%, 88% 50%, 88% 50%, 55% 70%)',
  },
  root: {
    display: 'inline-block',
    flex: 'none',
    position: 'relative',
  },
});

const PlayPauseIcon = ({ paused, size = 16 }: { paused: boolean; size?: number }) => (
  <span
    aria-hidden="true"
    data-state={paused ? 'play' : 'pause'}
    data-video-play-icon=""
    {...styleProps(styles.root, undefined, { height: size, width: size })}
  >
    <span {...styleProps([styles.half, paused ? styles.leftPlay : styles.leftPause])} />
    <span {...styleProps([styles.half, paused ? styles.rightPlay : styles.rightPause])} />
  </span>
);

export default PlayPauseIcon;
