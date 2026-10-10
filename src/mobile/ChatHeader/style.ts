import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  container: {
    overflow: 'hidden',
    backgroundColor: cssVar.colorBgLayout,
  },
  inner: {
    position: 'relative',
    maxHeight: 44,
    minHeight: 44,
  },
});

export const titleStyles = stylex.create({
  desc: {
    overflow: 'hidden',
    color: cssVar.colorTextTertiary,
    fontSize: 12,
    lineHeight: 1,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
  },
  title: {
    overflow: 'hidden',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 1,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  titleWithDesc: {
    overflow: 'hidden',
    fontWeight: 'bold',
    lineHeight: 1,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});
