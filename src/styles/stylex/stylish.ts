import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const stylish = stylex.create({
  variantBorderlessWithoutHover: {
    borderColor: 'currentcolor',
    borderStyle: 'none',
    borderWidth: 'medium',
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  variantFilledWithoutHover: {
    backgroundColor: cssVar.colorFillTertiary,
  },
  variantOutlinedWithoutHover: {
    borderColor: cssVar.colorBorderSecondary,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: cssVar.colorBgContainer,
  },
});
