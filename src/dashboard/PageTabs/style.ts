import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { media } from '@/styles/stylex/media.stylex';

export const styles = stylex.create({
  count: {
    borderRadius: cssVar.borderRadiusXS,
    paddingInline: cssVar.paddingXXS,
    alignItems: 'center',
    backgroundColor: cssVar.colorFillSecondary,
    color: cssVar.colorTextSecondary,
    display: 'inline-flex',
    fontSize: cssVar.fontSizeSM,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 500,
    justifyContent: 'center',
    lineHeight: 1.4,
    minInlineSize: '1.5em',
  },
  list: {
    'flexWrap': 'nowrap',
    'maxInlineSize': '100%',
    'scrollbarWidth': 'none',
    'overflowX': 'auto',
    '::-webkit-scrollbar': {
      display: 'none',
    },
  },
  root: {
    minInlineSize: 0,
  },
  tab: {
    flex: 'none',
    minBlockSize: { default: null, [media.mobile]: 44 },
  },
});
