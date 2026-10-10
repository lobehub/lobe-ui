import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  close: {
    margin: 0,
    padding: 0,
    borderColor: 'currentcolor',
    borderStyle: 'none',
    borderWidth: 'medium',
    gap: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
    color: {
      'default': cssVar.colorIcon,
      ':hover': cssVar.colorTextHeading,
    },
    cursor: 'pointer',
    display: 'inline-flex',
    justifyContent: 'center',
  },
  large: {
    borderRadius: 6,
    paddingInline: 12,
    height: 28,
  },
  middle: {
    borderRadius: 3,
    paddingInline: 8,
    height: 22,
  },
  root: {
    margin: 0,
    gap: '0.4em',
    alignItems: 'center',
    display: 'inline-flex',
    fontSize: cssVar.fontSizeSM,
    justifyContent: 'center',
    lineHeight: 1.2,
    userSelect: 'none',
    whiteSpace: 'nowrap',
    width: 'fit-content',
  },
  round: {
    borderRadius: 999,
  },
  roundLarge: {
    paddingInline: 14,
  },
  roundMiddle: {
    paddingInline: 10,
  },
  roundSmall: {
    paddingInline: 8,
  },
  small: {
    borderRadius: 3,
    paddingInline: 4,
    height: 20,
  },
});
