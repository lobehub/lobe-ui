import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  // a2ui: adapted from CopilotKit a2ui-playground (MIT), `TagList` and the table `Badge`.
  a2ui: {
    borderStyle: 'solid',
    borderWidth: 1,
    gap: 4,
    paddingBlock: 2,
    fontWeight: 400,
    maxWidth: '100%',
  },
  a2uiLarge: {
    borderRadius: 9,
    paddingInline: 10,
    fontSize: 13,
    height: 28,
  },
  a2uiMiddle: {
    borderRadius: 8,
    paddingInline: 8,
    fontSize: 12,
    height: 24,
  },
  a2uiText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 0,
  },
  a2uiRound: {
    borderRadius: 999,
    fontWeight: 500,
  },
  a2uiSmall: {
    borderRadius: 7,
    paddingInline: 8,
    fontSize: 11,
    height: 20,
  },
  clickable: {
    cursor: 'pointer',
  },
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
  defaultColor: {
    color: cssVar.colorTextSecondary,
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
