import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  dark: {
    backgroundImage: `radial-gradient(var(--spotlight-size, 64px) circle at var(--spotlight-x, 0) var(--spotlight-y, 0), ${cssVar.colorText}, transparent)`,
  },
  light: {
    backgroundImage: `radial-gradient(var(--spotlight-size, 64px) circle at var(--spotlight-x, 0) var(--spotlight-y, 0), #fff, ${cssVar.colorTextQuaternary})`,
  },
  outside: {
    opacity: 0,
  },
  root: {
    inset: 0,
    borderRadius: 'inherit',
    transition: 'all 0.2s',
    opacity: 'var(--spotlight-opacity, 0.1)',
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 1,
  },
});
