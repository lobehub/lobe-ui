import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  content: {
    padding: 0,
    overflow: 'hidden',
    alignItems: 'center',
    color: 'inherit',
    display: 'flex',
    fontSize: 'inherit',
    fontWeight: 'bolder',
    justifyContent: 'center',
    lineHeight: 1,
    height: '100%',
    width: '100%',
  },
  img: {
    flex: 'none',
    objectFit: 'cover',
    height: '100%',
    width: '100%',
  },
  loading: {
    inset: 0,
    backgroundColor: cssVar.colorBgMask,
    color: '#fff',
    position: 'absolute',
  },
  root: {
    flex: 'none',
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    userSelect: 'none',
  },
  shadow: {
    boxShadow: `0 1px 0 -1px ${cssVar.colorBorder}, 0 1px 2px -0.5px ${cssVar.colorBorder}, 0 2px 2px -1px ${cssVar.colorBorderSecondary}, 0 3px 6px -4px ${cssVar.colorBorderSecondary}`,
  },
});
