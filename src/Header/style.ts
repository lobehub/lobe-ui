import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { media } from '@/styles/stylex/media.stylex';

export const styles = stylex.create({
  left: {
    zIndex: 10,
  },
  right: {
    zIndex: 10,
  },
  root: {
    paddingBlock: 0,
    paddingInline: { default: 24, [media.sm]: 12 },
    alignSelf: 'stretch',
    backgroundColor: `color-mix(in srgb, ${cssVar.colorBgLayout} 40%, transparent)`,
    borderBlockEndColor: cssVar.colorBorderSecondary,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    gridColumnEnd: 'head',
    gridColumnStart: 'head',
    gridRowEnd: 'head',
    gridRowStart: 'head',
    height: 64,
    width: '100%',
  },
});
