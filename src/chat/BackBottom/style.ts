import * as stylex from '@stylexjs/stylex';

import { media } from '@/styles/stylex/media.stylex';

export const styles = stylex.create({
  hidden: {
    opacity: 0,
    pointerEvents: 'none',
    transform: 'translateY(16px)',
  },
  root: {
    backdropFilter: 'saturate(150%) blur(10px)',
    borderEndEndRadius: { default: null, [media.sm]: 0 },
    borderInlineEndStyle: { default: null, [media.sm]: 'none' },
    borderStartEndRadius: { default: null, [media.sm]: 0 },
    insetBlockEnd: 16,
    insetInlineEnd: { default: 16, [media.sm]: 0 },
    position: 'absolute',
  },
  visible: {
    opacity: 1,
    pointerEvents: 'all',
    transform: 'translateY(0)',
  },
});
