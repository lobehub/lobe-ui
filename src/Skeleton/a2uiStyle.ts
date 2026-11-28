import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';

// Adapted from CopilotKit a2ui-playground (MIT): `.a2-shimmer` (styles/motion.css), the
// `t-skel-pulse` loop at `--pulse-dur: 1000ms` / `--pulse-min: 0.5`.
const pulse = stylex.keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.5 },
});

// Adapted from CopilotKit a2ui-playground (MIT): renderers/feedback.tsx `Skeleton`.
export const styles = stylex.create({
  avatar: {
    borderRadius: '50%',
    flex: 'none',
    height: 40,
    width: 40,
  },
  bar: {
    borderRadius: 6,
    flex: '1',
    minWidth: 0,
  },
  body: {
    gap: 8,
    paddingBlockStart: 4,
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    minWidth: 0,
  },
  card: {
    gap: 12,
    padding: 16,
    display: 'flex',
    boxSizing: 'border-box',
    width: '100%',
  },
  chart: {
    gap: 8,
    padding: 16,
    alignItems: 'flex-end',
    boxSizing: 'border-box',
    display: 'flex',
    height: 192,
    width: '100%',
  },
  line: {
    borderRadius: 4,
    flex: 'none',
    height: 12,
  },
  shimmer: {
    animationDuration: '1000ms',
    animationIterationCount: 'infinite',
    animationName: { default: pulse, [reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    backgroundColor: a2ui.shimmer,
  },
  text: {
    gap: 8,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
});
