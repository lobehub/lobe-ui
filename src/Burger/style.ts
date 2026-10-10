import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  footer: {
    padding: 20,
    gap: 8,
    display: 'flex',
    marginBlockStart: 'auto',
  },
  fullHeader: {
    flex: 'none',
    paddingInline: 12,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  largeRow: {
    borderRadius: 12,
    paddingInline: 8,
    backgroundColor: { 'default': 'transparent', ':hover': cssVar.colorFillTertiary },
    color: { 'default': cssVar.colorTextQuaternary, ':hover': cssVar.colorText },
    fontSize: 32,
    fontWeight: 600,
    letterSpacing: '-0.02em',
    lineHeight: 1.15,
    minHeight: 48,
  },
  largeRowCurrent: {
    backgroundColor: 'transparent',
    color: cssVar.colorText,
  },
  row: {
    borderRadius: 999,
    gap: 14,
    paddingInline: 16,
    fontSize: 17,
    minHeight: 52,
  },
  rowCurrent: {
    backgroundColor: cssVar.colorText,
    color: cssVar.colorBgContainer,
    fontWeight: 600,
  },
});
