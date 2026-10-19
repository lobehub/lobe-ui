import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { media } from '@/styles/stylex/media.stylex';

export const styles = stylex.create({
  action: {
    flex: 'none',
    height: { default: 32, [media.mobile]: 44 },
    width: { default: 96, [media.mobile]: '100%' },
  },
  cell: {
    flex: 'none',
    height: 14,
    width: 88,
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
    borderBlockEndColor: {
      'default': `var(--lobe-fill-border, ${cssVar.colorFill})`,
      ':last-child': 'currentcolor',
    },
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
    overflow: 'clip',
    display: 'flex',
    flexDirection: 'column',
  },
  statGrid: {
    gap: 12,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  },
  statValue: {
    marginBlockEnd: '14px',
    marginBlockStart: '6px',
    height: cssVar.fontSizeHeading2,
    width: '42%',
  },
  table: {
    overflow: 'hidden',
    minInlineSize: 0,
  },
  tag: {
    borderRadius: cssVar.borderRadiusSM,
    flex: 'none',
    height: 22,
    width: 72,
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
    height: 12,
  },
  title: {
    maxInlineSize: '70%',
    height: cssVar.fontSizeHeading3,
    width: 220,
  },
});
