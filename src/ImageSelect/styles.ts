import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  active: {
    color: cssVar.colorText,
  },
  container: {
    color: cssVar.colorTextDescription,
    cursor: 'pointer',
  },
  img: {
    borderRadius: cssVar.borderRadius,
    backgroundColor: { 'default': cssVar.colorFillTertiary, ':hover': cssVar.colorFillSecondary },
    boxShadow: { 'default': null, ':hover': `0 0 0 2px ${cssVar.colorText}` },
  },
  imgActive: {
    backgroundColor: { 'default': cssVar.colorFillSecondary, ':hover': cssVar.colorFill },
    boxShadow: {
      'default': `0 0 0 2px ${cssVar.colorTextTertiary}`,
      ':hover': `0 0 0 2px ${cssVar.colorText}`,
    },
    color: cssVar.colorText,
  },
});
