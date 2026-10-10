import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  icon: {
    color: cssVar.colorTextPlaceholder,
  },
  search: {
    position: 'relative',
    maxWidth: '100%',
  },
  tag: {
    backdropFilter: 'saturate(150%) blur(10px)',
    color: cssVar.colorTextDescription,
    insetBlockStart: '50%',
    insetInlineEnd: 6,
    position: 'absolute',
    transform: 'translateY(-50%)',
  },
});
