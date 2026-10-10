import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { media } from '@/styles/stylex/media.stylex';

export const styles = stylex.create({
  aside: {
    flex: 'none',
    backgroundColor: cssVar.colorFillSecondary,
    boxSizing: 'border-box',
    display: { default: null, [media.laptop]: 'none' },
    inlineSize: '50%',
    maxInlineSize: '50%',
    minInlineSize: 0,
    position: 'relative',
  },
  form: {
    flex: 'none',
    gap: 24,
    paddingBlock: { default: 40, [media.laptop]: 28 },
    paddingInline: { default: 36, [media.laptop]: 24 },
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    inlineSize: '100%',
    justifyContent: 'center',
    minInlineSize: 0,
  },
  formSplit: {
    inlineSize: { default: '50%', [media.laptop]: '100%' },
    maxInlineSize: { default: '50%', [media.laptop]: '100%' },
  },
  frame: {
    borderRadius: 'inherit',
    flex: 'none',
    overflow: 'hidden',
    display: 'flex',
    inlineSize: '100%',
    minInlineSize: 0,
  },
  header: {
    flex: 'none',
    gap: 12,
    paddingInline: 16,
    alignItems: 'center',
    blockSize: 56,
    display: 'flex',
    justifyContent: 'space-between',
  },
  lift: {
    display: 'flex',
    inlineSize: 'min(440px, 100%)',
  },
  liftSplit: {
    inlineSize: { default: 'min(880px, 100%)', [media.laptop]: 'min(440px, 100%)' },
  },
  main: {
    flex: '1',
    paddingInline: 16,
    placeItems: 'center',
    display: 'grid',
    paddingBlockEnd: '48px',
    paddingBlockStart: '24px',
  },
  page: {
    backgroundColor: cssVar.colorBgLayout,
    blockSize: '100%',
    display: 'flex',
    flexDirection: 'column',
    minBlockSize: 0,
  },
  split: {
    minBlockSize: { default: 520, [media.laptop]: 0 },
  },
  tools: {
    gap: 6,
    alignItems: 'center',
    display: 'flex',
    marginInlineStart: 'auto',
  },
});
