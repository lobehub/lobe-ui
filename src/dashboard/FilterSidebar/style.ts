import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { media } from '@/styles/stylex/media.stylex';

const pressed = ':is([aria-pressed="true"])';

export const styles = stylex.create({
  body: {
    paddingInline: 12,
    maxBlockSize: 360,
    paddingBlockEnd: 16,
    overflowY: 'auto',
  },
  bodyFlush: {
    flex: '1',
    maxBlockSize: 'none',
    minBlockSize: 0,
  },
  content: {
    flex: '1',
    gap: 16,
    overflow: { default: null, [media.laptop]: 'visible' },
    display: 'flex',
    flexDirection: 'column',
    minInlineSize: 0,
    paddingInlineStart: { default: 20, [media.laptop]: 0 },
  },
  contentFlush: {
    paddingBlock: 24,
    paddingInlineEnd: 24,
    paddingInlineStart: 24,
    overflowY: 'auto',
  },
  contentSplit: {
    paddingBlockEnd: '0',
    paddingBlockStart: '16px',
    paddingInlineEnd: 16,
    paddingInlineStart: 16,
  },
  count: {
    flex: 'none',
    color: cssVar.colorTextTertiary,
    fontSize: cssVar.fontSizeSM,
    fontVariantNumeric: 'tabular-nums',
  },
  drawerPanel: {
    gap: 8,
    display: 'flex',
    flexDirection: 'column',
  },
  head: {
    padding: 12,
    flex: 'none',
    gap: 8,
    display: 'flex',
    flexDirection: 'column',
  },
  layout: {
    gap: { default: null, [media.laptop]: 12 },
    display: 'flex',
    flexDirection: { default: null, [media.laptop]: 'column' },
  },
  layoutFlush: {
    flex: '1',
    minBlockSize: 0,
  },
  layoutSplit: {
    overflow: 'hidden',
    alignItems: 'stretch',
  },
  name: {
    flex: '1',
    overflow: 'hidden',
    minInlineSize: 0,
    textAlign: 'start',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  option: {
    font: 'inherit',
    borderColor: 'currentcolor',
    borderRadius: cssVar.borderRadius,
    borderStyle: 'none',
    borderWidth: 'medium',
    gap: 6,
    paddingInline: 8,
    alignItems: 'center',
    backgroundColor: {
      'default': 'transparent',
      [pressed]: cssVar.controlItemBgActive,
      ':hover:not([aria-pressed="true"])': cssVar.colorFillTertiary,
    },
    color: cssVar.colorText,
    cursor: 'pointer',
    display: 'flex',
    fontWeight: { default: null, [pressed]: 500 },
    inlineSize: '100%',
    minBlockSize: 36,
  },
  panel: {
    overflow: 'hidden',
    borderInlineEndColor: cssVar.colorBorderSecondary,
    borderInlineEndStyle: 'solid',
    borderInlineEndWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    minBlockSize: 0,
  },
  panelSplit: {
    blockSize: '100%',
    borderInlineEndColor: cssVar.colorBorder,
  },
  row: {
    flex: '1',
    gap: 6,
    alignItems: 'center',
    display: 'flex',
    minInlineSize: 0,
  },
  sidebar: {
    alignSelf: 'stretch',
    minBlockSize: 0,
  },
  sidebarFlush: {
    blockSize: '100%',
  },
});
