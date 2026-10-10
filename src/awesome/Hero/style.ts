import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { media } from '@/styles/stylex/media.stylex';

export const styles = stylex.create({
  actions: {
    gap: 16,
    alignItems: 'stretch',
    display: 'flex',
    flexDirection: { default: 'row', [media.sm]: 'column' },
    justifyContent: 'center',
    marginBlockStart: 24,
    width: { default: null, [media.sm]: '100%' },
  },
  container: {
    boxSizing: 'border-box',
    position: 'relative',
    textAlign: 'center',
  },
  desc: {
    marginInline: { default: null, [media.sm]: 16 },
    color: cssVar.colorTextSecondary,
    fontSize: { default: cssVar.fontSizeHeading3, [media.sm]: cssVar.fontSizeHeading5 },
    marginBlockEnd: { default: null, [media.sm]: 24 },
    marginBlockStart: { default: 0, [media.sm]: 24 },
    textAlign: 'center',
  },
  title: {
    margin: 0,
    fontSize: { default: 'min(100px, 10vw)', [media.sm]: 64 },
    lineHeight: 1.2,
    textAlign: 'center',
    zIndex: 10,
  },
});
