import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  container: {
    backgroundColor: cssVar.colorFillQuaternary,
    borderBlockStartColor: cssVar.colorFillTertiary,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
  },
  expand: {
    position: 'absolute',
  },
});
