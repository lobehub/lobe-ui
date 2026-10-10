import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  filled: {
    backgroundColor: cssVar.colorBgContainer,
  },
  root: {
    borderRadius: cssVar.borderRadius,
    position: 'relative',
  },
  shadow: {
    boxShadow: `0 1px 0 -1px ${cssVar.colorBorder}, 0 1px 2px -0.5px ${cssVar.colorBorder}, 0 2px 2px -1px ${cssVar.colorBorderSecondary}, 0 3px 6px -4px ${cssVar.colorBorderSecondary}`,
  },
});
