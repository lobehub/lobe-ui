import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { media } from '@/styles/stylex/media.stylex';

export const styles = stylex.create({
  ancestor: {
    color: cssVar.colorTextSecondary,
    whiteSpace: 'nowrap',
  },
  crumb: {
    alignItems: 'center',
    display: 'flex',
    minInlineSize: 0,
  },
  link: {
    textDecoration: 'none',
    color: { 'default': cssVar.colorTextSecondary, ':hover': cssVar.colorText },
    whiteSpace: 'nowrap',
  },
  optional: {
    flex: 'none',
    gap: 6,
    alignItems: 'center',
    display: { default: 'flex', [media.mobile]: 'none' },
  },
  page: {
    overflow: 'hidden',
    color: cssVar.colorText,
    fontWeight: 600,
    minInlineSize: 0,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  root: {
    flex: '1',
    overflow: 'hidden',
    alignItems: 'center',
    display: 'flex',
    fontSize: cssVar.fontSize,
    lineHeight: 1.4,
    minInlineSize: 0,
  },
  separator: {
    flex: 'none',
    marginInline: 8,
    color: cssVar.colorTextQuaternary,
  },
});
