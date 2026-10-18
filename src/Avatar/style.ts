import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  circle: {
    borderRadius: '50%',
  },
  clickable: {
    cursor: 'pointer',
  },
  defaultBackground: {
    backgroundColor: cssVar.colorBorder,
  },
  defaultColor: {
    color: `oklch(from ${cssVar.colorBorder} clamp(0, (l - 0.62) * -1000, 1) 0 h / 1)`,
  },
  defaultEmojiFont: {
    fontSize: 33.6,
  },
  defaultSize: {
    fontSize: 24,
    height: 48,
    width: 48,
  },
  defaultSquare: {
    borderRadius: 8,
  },
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
