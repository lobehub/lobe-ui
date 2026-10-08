import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  container: {
    padding: 0,
    listStyle: 'none',
  },
  item: {
    borderRadius: cssVar.borderRadius,
    listStyle: 'none',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
  itemVariant: {
    paddingBlock: 4,
    paddingInlineEnd: 16,
    paddingInlineStart: 4,
  },
});
