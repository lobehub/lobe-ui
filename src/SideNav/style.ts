import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  root: {
    paddingBlock: 12,
    paddingInline: 0,
    backgroundColor: cssVar.colorBgContainer,
    borderInlineEndColor: cssVar.colorBorderSecondary,
    borderInlineEndStyle: 'solid',
    borderInlineEndWidth: 1,
    height: '100%',
    minHeight: 640,
    width: 58,
  },
});
