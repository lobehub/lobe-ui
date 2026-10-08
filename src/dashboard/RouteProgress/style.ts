import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  bar: {
    insetInline: 0,
    backgroundColor: cssVar.colorPrimary,
    blockSize: 2,
    insetBlockStart: 0,
    position: 'fixed',
    transformOrigin: '0 50%',
    willChange: 'transform, opacity',
    zIndex: 1000,
  },
});
