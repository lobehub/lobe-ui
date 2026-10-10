import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  content: {
    gap: 20,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  footnote: {
    margin: 0,
    color: cssVar.colorTextTertiary,
    fontSize: cssVar.fontSizeSM,
  },
  root: {
    overflow: 'hidden',
    paddingBlock: 'clamp(56px,9vh,88px)',
    borderBlockStartColor: cssVar.colorBorderSecondary,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    textAlign: 'center',
  },
  title: {
    margin: 0,
    color: cssVar.colorText,
    fontSize: 'clamp(22px, 3vw, 28px)',
    fontWeight: 650,
    letterSpacing: '-0.02em',
    textWrap: 'balance',
  },
});
