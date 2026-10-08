import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  active: {
    color: cssVar.colorPrimary,
  },
  container: {
    overflow: 'hidden',
    backgroundColor: cssVar.colorBgLayout,
    borderBlockStartColor: cssVar.colorFillTertiary,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    userSelect: 'none',
  },
  icon: {
    fontSize: 24,
  },
  inner: {
    position: 'relative',
  },
  tab: {
    color: cssVar.colorTextDescription,
    cursor: 'pointer',
  },
  title: {
    overflow: 'hidden',
    fontSize: 12,
    lineHeight: '1.125em',
    marginBlockStart: '-0.125em',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
  },
});
