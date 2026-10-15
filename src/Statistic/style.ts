import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  affix: {
    color: cssVar.colorTextSecondary,
    fontSize: 14,
    fontWeight: 400,
  },
  root: {
    gap: 4,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    color: cssVar.colorTextDescription,
    fontSize: 14,
    lineHeight: 1.5,
  },
  value: {
    gap: 4,
    alignItems: 'baseline',
    color: cssVar.colorText,
    display: 'flex',
    fontSize: 24,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 600,
    lineHeight: 1.25,
  },
});
