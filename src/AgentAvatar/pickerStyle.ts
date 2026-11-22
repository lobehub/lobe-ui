import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  color: {
    cursor: 'pointer',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '50%',
    width: 22,
    height: 22,
    padding: 0,
  },
  colorActive: {
    boxShadow: `0 0 0 2px ${cssVar.colorBgElevated}, 0 0 0 3.5px ${cssVar.colorTextSecondary}`,
  },
  colors: {
    display: 'grid',
    gap: 4,
    gridTemplateColumns: 'repeat(9, minmax(0, 1fr))',
    justifyItems: 'center',
    borderBlockStartWidth: 1,
    borderBlockStartStyle: 'solid',
    borderBlockStartColor: 'var(--lobe-fill-border)',
    paddingBlockStart: 12,
  },
  preview: {
    display: 'flex',
    justifyContent: 'center',
    paddingBlock: 8,
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: '100%',
    maxWidth: 320,
  },
  shape: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: cssVar.borderRadius,
    backgroundColor: {
      'default': 'transparent',
      ':hover': cssVar.colorFillTertiary,
    },
    aspectRatio: '1',
    padding: 4,
  },
  shapeActive: {
    backgroundColor: {
      'default': cssVar.colorFillSecondary,
      ':hover': cssVar.colorFillSecondary,
    },
  },
  shapes: {
    display: 'grid',
    gap: 4,
    gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
  },
});
