import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { media } from '@/styles/stylex/media.stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';

export const styles = stylex.create({
  badge: {
    borderRadius: 999,
    flex: 'none',
    paddingInline: 6,
    backgroundColor: `color-mix(in srgb, ${cssVar.colorError} 12%, transparent)`,
    color: cssVar.colorError,
    fontSize: cssVar.fontSizeSM,
    fontVariantNumeric: 'tabular-nums',
    minInlineSize: 20,
    textAlign: 'center',
  },
  chevron: {
    flex: 'none',
    transition: {
      default: 'transform 160ms ease, opacity 120ms ease 80ms',
      [reducedMotion]: 'none',
    },
  },
  chevronFolded: {
    transform: 'rotate(-90deg)',
  },
  dot: {
    borderRadius: 999,
    transition: { default: 'opacity 120ms ease', [reducedMotion]: 'none' },
    backgroundColor: cssVar.colorError,
    blockSize: 7,
    inlineSize: 7,
    insetBlockStart: 7,
    insetInlineEnd: 9,
    opacity: 0,
    position: 'absolute',
  },
  dotRail: {
    opacity: 1,
  },
  fold: {
    transition: {
      default: 'grid-template-rows 200ms ease, margin 200ms ease, opacity 120ms ease',
      [reducedMotion]: 'none',
    },
    display: 'grid',
    gridTemplateRows: '1fr',
  },
  foldBody: {
    overflow: 'hidden',
    minBlockSize: 0,
  },
  folded: {
    gridTemplateRows: '0fr',
    marginBlockStart: { 'default': null, ':not(:first-child)': -2 },
    opacity: 0,
  },
  group: {
    'transition': { default: 'margin 200ms ease', [reducedMotion]: 'none' },
    'display': 'flex',
    'flexDirection': 'column',
    'marginBlockStart': 12,
    'position': 'relative',
    '::before': {
      insetInline: 0,
      transition: { default: 'opacity 200ms ease', [reducedMotion]: 'none' },
      backgroundColor: cssVar.colorBorderSecondary,
      blockSize: 1,
      content: '""',
      insetBlockStart: -6,
      opacity: 0,
      position: 'absolute',
    },
  },
  groupDivider: {
    '::before': {
      opacity: 1,
    },
  },
  groupHead: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  groupHeader: {
    borderColor: 'currentcolor',
    borderRadius: cssVar.borderRadius,
    borderStyle: 'none',
    borderWidth: 'medium',
    gap: 8,
    alignItems: 'center',
    backgroundColor: 'transparent',
    color: { 'default': cssVar.colorTextSecondary, ':hover': cssVar.colorText },
    cursor: 'pointer',
    display: 'flex',
    fontSize: cssVar.fontSizeSM,
    fontWeight: 500,
    justifyContent: 'space-between',
    minBlockSize: 32,
    paddingInlineEnd: 10,
    paddingInlineStart: 10,
    textAlign: 'start',
    whiteSpace: 'nowrap',
  },
  groupHeaderActive: {
    color: cssVar.colorText,
  },
  groupHeaderIcon: {
    gap: 10,
    fontSize: cssVar.fontSize,
    justifyContent: 'flex-start',
    minBlockSize: 36,
  },
  groupHeaderIndent1: {
    paddingInlineStart: 38,
  },
  groupHeaderIndent2: {
    paddingInlineStart: 56,
  },
  groupHeaderNested: {
    gap: 8,
    color: { 'default': cssVar.colorTextDescription, ':hover': cssVar.colorTextSecondary },
    fontSize: cssVar.fontSizeSM,
    fontWeight: 400,
    justifyContent: 'flex-start',
    minBlockSize: 26,
  },
  groupHeaderNestedActive: {
    color: cssVar.colorTextSecondary,
  },
  groupHeaderRailIcon: {
    backgroundColor: { 'default': 'transparent', ':hover': cssVar.colorFillTertiary },
  },
  groupItems: {
    gap: 2,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    minBlockSize: 0,
  },
  groupLabelNested: {
    flexBasis: 'auto',
    flexGrow: '0',
    flexShrink: '1',
  },
  groupLevelIcon: {
    marginBlockStart: 2,
  },
  groupNested: {
    marginBlockStart: 6,
  },
  groupPanel: {
    transition: 'grid-template-rows 160ms ease',
    display: 'grid',
    gridTemplateRows: '1fr',
  },
  groupPanelCollapsed: {
    gridTemplateRows: '0fr',
  },
  groupPanelInstant: {
    transition: 'none',
  },
  groupRailEmpty: {
    marginBlockStart: 0,
  },
  headerIcon: {
    flex: 'none',
    display: 'flex',
  },
  headerIconWide: {
    inlineSize: 18,
    justifyContent: 'center',
  },
  indicator: {
    flex: 'none',
    transition: 'transform 160ms ease',
    alignItems: 'center',
    color: cssVar.colorTextDescription,
    display: 'flex',
    justifyContent: 'center',
    marginInlineStart: -6,
    height: 18,
    width: 18,
  },
  indicatorExpanded: {
    transform: 'rotate(90deg)',
  },
  item: {
    borderRadius: cssVar.borderRadius,
    gap: 10,
    textDecoration: 'none',
    transition: 'background 120ms ease, color 120ms ease',
    alignItems: 'center',
    backgroundColor: { 'default': null, ':hover': cssVar.colorFillTertiary },
    color: { 'default': cssVar.colorTextSecondary, ':hover': cssVar.colorText },
    display: 'flex',
    minBlockSize: { default: 36, [media.mobile]: 44 },
    paddingInlineEnd: 10,
    paddingInlineStart: 10,
    position: 'relative',
    whiteSpace: 'nowrap',
  },
  itemActive: {
    backgroundColor: cssVar.colorFillSecondary,
    color: cssVar.colorText,
    fontWeight: 500,
  },
  itemIndent1: {
    paddingInlineStart: 38,
  },
  itemIndent2: {
    paddingInlineStart: 56,
  },
  itemIndented: {
    color: cssVar.colorText,
    minBlockSize: 32,
  },
  itemLabel: {
    flex: '1',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  itemLabelRail: {
    textOverflow: 'clip',
  },
  itemRailIndent: {
    paddingInlineStart: 10,
  },
  nav: {
    flex: '1',
    gap: 2,
    paddingInline: 8,
    display: 'flex',
    flexDirection: 'column',
    minBlockSize: 0,
    overflowAnchor: 'none',
    paddingBlockEnd: 12,
    scrollbarWidth: 'thin',
  },
  navIcon: {
    flex: 'none',
    display: 'flex',
  },
  railFade: {
    transition: { default: 'opacity 120ms ease 80ms', [reducedMotion]: 'none' },
  },
  railFaded: {
    opacity: 0,
    transitionDelay: '0s',
  },
  railLink: {
    inset: 0,
    borderRadius: cssVar.borderRadius,
    transition: 'background 120ms ease',
    backgroundColor: { 'default': null, ':hover': cssVar.colorFillTertiary },
    position: 'absolute',
  },
  railLinkActive: {
    backgroundColor: cssVar.colorFillSecondary,
  },
  topItems: {
    gap: 2,
    transition: {
      default: 'margin 200ms ease, padding 200ms ease, border-color 200ms ease',
      [reducedMotion]: 'none',
    },
    display: 'flex',
    flexDirection: 'column',
  },
  topItemsDivided: {
    borderBlockEndColor: cssVar.colorBorderSecondary,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    marginBlockEnd: 6,
    paddingBlockEnd: 8,
  },
  topItemsRailEmpty: {
    borderBlockEndColor: 'transparent',
    marginBlockEnd: 0,
    paddingBlockEnd: 0,
  },
});
