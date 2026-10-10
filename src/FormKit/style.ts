import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const fieldKitStyles = stylex.create({
  controlFixed: {
    flex: 'none',
    alignItems: 'stretch',
  },
  extra: {
    color: cssVar.colorTextDescription,
    fontSize: 12,
  },
  required: {
    color: cssVar.colorError,
    marginInlineStart: 4,
  },
});

export const listStyles = stylex.create({
  add: {
    font: 'inherit',
    borderColor: 'currentcolor',
    borderRadius: cssVar.borderRadiusSM,
    borderStyle: 'none',
    borderWidth: 'medium',
    gap: 6,
    paddingInline: 8,
    transition: `color 150ms ${cssVar.motionEaseOut}, background 150ms ${cssVar.motionEaseOut}`,
    alignItems: 'center',
    backgroundColor: { 'default': 'transparent', ':hover': cssVar.colorFillTertiary },
    color: { 'default': cssVar.colorTextSecondary, ':hover': cssVar.colorText },
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: 13,
    fontWeight: 500,
    height: 28,
  },
  cell: {
    minWidth: 0,
  },
  empty: {
    gap: 4,
    paddingInline: 12,
    alignItems: 'center',
    color: cssVar.colorTextSecondary,
    display: 'flex',
    flexDirection: 'column',
    fontSize: 13,
    paddingBlockEnd: 16,
    paddingBlockStart: 20,
  },
  foot: {
    padding: 4,
  },
  head: {
    gap: 4,
    paddingInline: 4,
    backgroundColor: cssVar.colorFillQuaternary,
    borderBlockEndColor: cssVar.colorBorderSecondary,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    display: 'grid',
  },
  remove: {
    justifySelf: 'center',
  },
  row: {
    padding: 4,
    gap: 4,
    alignItems: 'center',
    borderBlockEndColor: cssVar.colorSplit,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    display: 'grid',
  },
  table: {
    borderColor: cssVar.colorBorderSecondary,
    borderRadius: cssVar.borderRadiusLG,
    borderStyle: 'solid',
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: cssVar.colorBgContainer,
    width: '100%',
  },
  title: {
    paddingBlock: 8,
    paddingInline: 12,
    color: cssVar.colorTextSecondary,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
});
