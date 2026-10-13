import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  desc: {
    color: cssVar.colorTextSecondary,
    fontSize: 13,
    fontWeight: 400,
    lineHeight: 1.45,
  },
  more: {
    gap: 2,
    textDecoration: 'none',
    alignItems: 'center',
    color: { 'default': cssVar.colorTextSecondary, ':hover': cssVar.colorText },
    display: 'inline-flex',
    fontSize: 13,
  },
  title: {
    margin: 0,
    color: cssVar.colorText,
    fontSize: 15,
    fontWeight: 600,
    lineHeight: 1.4,
  },
});
