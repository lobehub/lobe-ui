import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  columnTitle: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    wordBreak: 'keep-all',
    minWidth: 0,
  },
  filterActive: {
    color: { 'default': cssVar.colorPrimary, ':hover': cssVar.colorPrimary },
  },
  filterButton: {
    flex: 'none',
    marginBlock: -4,
  },
  filterButtons: {
    gap: 8,
    paddingBlock: 7,
    paddingInline: 8,
    alignItems: 'center',
    borderBlockStartColor: cssVar.colorSplit,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    justifyContent: 'space-between',
  },
  filterCheckAll: {
    paddingInline: 4,
    marginBlockEnd: 4,
  },
  filterDropdown: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 120,
  },
  filterEmpty: {
    paddingBlock: 16,
    paddingInline: 0,
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  filterGroupTitle: {
    paddingBlock: 5,
    paddingInline: 8,
    color: cssVar.colorTextDescription,
    fontSize: 12,
  },
  filterItem: {
    borderRadius: cssVar.borderRadiusSM,
    paddingBlock: 5,
    paddingInline: 8,
    alignItems: 'center',
    backgroundColor: { 'default': null, ':hover': cssVar.colorFillTertiary },
    display: 'flex',
    whiteSpace: 'nowrap',
  },
  filterMenu: {
    padding: 4,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 264,
  },
  filterPopup: {
    padding: 0,
    overflow: 'hidden',
  },
  filterSearch: {
    padding: 8,
    borderBlockEndColor: cssVar.colorSplit,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
  },
  filterTree: {
    padding: 8,
    overflow: 'auto',
    maxHeight: 264,
  },
  frostEnd: {
    flex: 'none',
    backdropFilter: 'blur(16px)',
    insetInlineEnd: 0,
    marginInlineStart: 'auto',
    position: 'sticky',
    height: '100%',
  },
  // z-index 1: above scrolling cells (z auto), below fixed cells (z >= 2).
  frostRail: {
    display: 'flex',
    insetBlockStart: 0,
    insetInlineStart: 0,
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 1,
  },
  frostStart: {
    flex: 'none',
    backdropFilter: 'blur(16px)',
    insetInlineStart: 0,
    position: 'sticky',
    height: '100%',
  },
  headerInner: {
    gap: 6,
    alignItems: 'center',
    display: 'inline-flex',
    verticalAlign: 'middle',
    maxWidth: '100%',
    minWidth: 0,
  },
  loading: {
    inset: 0,
    gap: 8,
    alignItems: 'center',
    backgroundColor: `color-mix(in srgb, ${cssVar.colorBgContainer} 60%, transparent)`,
    color: cssVar.colorTextSecondary,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'absolute',
  },
  pagination: {
    marginBlock: 16,
    display: 'flex',
  },
  paginationCenter: {
    justifyContent: 'center',
  },
  paginationEnd: {
    justifyContent: 'flex-end',
  },
  paginationStart: {
    justifyContent: 'flex-start',
  },
  paginationTop: {
    marginBlockEnd: '16px',
    marginBlockStart: '0',
  },
  root: {
    minWidth: 0,
  },
  selection: {
    display: 'inline-flex',
    flexDirection: 'column',
    position: 'relative',
    verticalAlign: 'middle',
  },
  selectionExtra: {
    alignItems: 'center',
    display: 'flex',
    insetBlockStart: 0,
    marginInlineStart: '100%',
    paddingInlineStart: 2,
    position: 'absolute',
    zIndex: 1,
    height: '100%',
  },
  selectionRadioGroup: {
    display: 'inline-flex',
    verticalAlign: 'middle',
  },
  selectionTrigger: {
    flex: 'none',
    marginBlock: -4,
  },
  skeleton: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'start',
    minWidth: 0,
    width: '100%',
  },
  skeletonCell: {
    paddingBlock: 'var(--lobe-table-padding-block)',
    paddingInline: 'var(--lobe-table-padding-inline)',
    alignItems: 'center',
    display: 'flex',
    minWidth: 0,
  },
  skeletonRow: {
    alignItems: 'stretch',
    borderBlockEndColor: `var(--lobe-fill-border, ${cssVar.colorFill})`,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: { 'default': 1, ':last-child': 0 },
    display: 'grid',
    minWidth: 0,
    width: '100%',
  },
  sortButton: {
    gap: 4,
    alignItems: 'center',
    display: 'inline-flex',
    maxWidth: '100%',
    minWidth: 0,
  },
  sortCaret: {
    flex: 'none',
    marginBlock: -4,
  },
  sortTitle: {
    cursor: 'pointer',
    minWidth: 0,
  },
  spinContainer: {
    position: 'relative',
  },
});
