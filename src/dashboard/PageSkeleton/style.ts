import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { media } from '@/styles/stylex/media.stylex';

export const styles = stylex.create({
  action: {
    flex: 'none',
    blockSize: { default: 32, [media.mobile]: 44 },
    inlineSize: { default: 96, [media.mobile]: '100%' },
  },
  cell: {
    flex: 'none',
    blockSize: 14,
    inlineSize: 88,
  },
  copy: {
    flex: '1',
    minInlineSize: 0,
  },
  header: {
    gap: 16,
    alignItems: { default: 'flex-start', [media.mobile]: 'stretch' },
    display: 'flex',
    flexDirection: { default: null, [media.mobile]: 'column' },
    justifyContent: 'space-between',
  },
  headerCopy: {
    flex: '1',
    gap: 8,
    display: 'flex',
    flexDirection: 'column',
    minInlineSize: 0,
  },
  page: {
    gap: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    gap: 12,
    paddingBlock: 12,
    paddingInline: 16,
    alignItems: 'center',
    borderBlockEndColor: { 'default': cssVar.colorBorder, ':last-child': 'currentcolor' },
    borderBlockEndStyle: { 'default': 'solid', ':last-child': 'none' },
    borderBlockEndWidth: { 'default': 1, ':last-child': 'medium' },
    display: 'flex',
    minBlockSize: 54,
  },
  srOnly: {
    overflow: 'hidden',
    blockSize: 1,
    clipPath: 'inset(50%)',
    inlineSize: 1,
    position: 'absolute',
    whiteSpace: 'nowrap',
  },
  stat: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
  },
  statGrid: {
    gap: 12,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  },
  statValue: {
    blockSize: cssVar.fontSizeHeading2,
    inlineSize: '42%',
    marginBlockEnd: '14px',
    marginBlockStart: '6px',
  },
  table: {
    overflow: 'hidden',
    minInlineSize: 0,
  },
  tag: {
    flex: 'none',
    blockSize: 22,
    inlineSize: 72,
  },
  thead: {
    gap: 12,
    paddingBlock: 10,
    paddingInline: 16,
    alignItems: 'center',
    backgroundColor: cssVar.colorFillTertiary,
    display: 'flex',
    minBlockSize: 39,
  },
  theadCell: {
    flex: 'none',
    blockSize: 12,
  },
  title: {
    blockSize: cssVar.fontSizeHeading3,
    inlineSize: 220,
    maxInlineSize: '70%',
  },
});
