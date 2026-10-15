import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  bordered: {
    borderColor: cssVar.colorBorderSecondary,
    borderRadius: cssVar.borderRadius,
    borderStyle: 'solid',
    borderWidth: 1,
    borderBlockStartColor: 'currentcolor',
    borderBlockStartStyle: 'none',
    borderBlockStartWidth: 0,
    columnGap: 0,
    rowGap: 0,
  },
  borderedCell: {
    paddingBlock: 8,
    paddingInline: 12,
    borderBlockStartColor: cssVar.colorBorderSecondary,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
  },
  borderedLabel: {
    backgroundColor: cssVar.colorFillQuaternary,
    borderInlineEndColor: cssVar.colorBorderSecondary,
    borderInlineEndStyle: 'solid',
    borderInlineEndWidth: 1,
  },
  content: {
    margin: 0,
    color: cssVar.colorText,
    overflowWrap: 'anywhere',
    minWidth: 0,
  },
  extra: {
    flex: 'none',
  },
  header: {
    gap: 12,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginBlockEnd: 8,
  },
  label: {
    color: cssVar.colorTextDescription,
    whiteSpace: 'nowrap',
  },
  list: {
    margin: 0,
    columnGap: 12,
    display: 'grid',
    fontSize: 13,
    lineHeight: 1.5,
    rowGap: 6,
  },
  root: {
    minWidth: 0,
  },
  title: {
    color: cssVar.colorText,
    fontSize: 14,
    fontWeight: 600,
  },
});
