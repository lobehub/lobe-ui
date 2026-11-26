import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

// Adapted from CopilotKit a2ui-playground (MIT), `ComparisonTable` in `renderers/data.tsx`.
// The `d*` entries restyle the same markup for `variant="default"`, the plain lobe-ui card.
export const styles = stylex.create({
  dCard: {
    borderColor: `var(--lobe-fill-border, ${cssVar.colorFill})`,
    borderRadius: cssVar.borderRadiusLG,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: cssVar.colorBgContainer,
    color: cssVar.colorText,
    fontFamily: cssVar.fontFamily,
    fontSize: cssVar.fontSize,
    lineHeight: cssVar.lineHeight,
  },
  dCell: {
    paddingBlock: 12,
    paddingInline: 16,
  },
  dCheck: {
    backgroundColor: 'transparent',
    color: cssVar.colorSuccess,
    verticalAlign: 'middle',
  },
  dCross: {
    color: cssVar.colorTextQuaternary,
  },
  dFeature: {
    paddingBlock: 12,
    color: cssVar.colorText,
    fontSize: cssVar.fontSize,
  },
  dFeatureHead: {
    color: cssVar.colorTextSecondary,
    fontSize: cssVar.fontSizeSM,
    fontWeight: 400,
  },
  dHeader: {
    paddingBlock: 12,
  },
  dHighlight: {
    backgroundColor: cssVar.colorFillQuaternary,
  },
  dHighlightHead: {
    backgroundColor: cssVar.colorFillQuaternary,
    boxShadow: `inset 0 2px 0 ${cssVar.colorPrimary}`,
  },
  dLine: {
    borderBlockEndColor: `var(--lobe-fill-border, ${cssVar.colorFill})`,
  },
  dOptionName: {
    color: cssVar.colorText,
    fontSize: cssVar.fontSize,
    fontWeight: 500,
  },
  dRowHover: {
    backgroundColor: { 'default': null, ':hover': cssVar.colorFillQuaternary },
  },
  dTableRuled: {
    borderBlockStartColor: `var(--lobe-fill-border, ${cssVar.colorFill})`,
  },
  dTitle: {
    color: cssVar.colorTextHeading,
    fontSize: cssVar.fontSize,
    fontWeight: 500,
    letterSpacing: 'normal',
  },
  dValue: {
    color: cssVar.colorText,
    fontSize: cssVar.fontSize,
  },
  cell: {
    paddingBlock: 10,
    paddingInline: 12,
    fontVariantNumeric: 'tabular-nums',
    textAlign: 'center',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
  },
  check: {
    borderRadius: 999,
    placeItems: 'center',
    backgroundColor: `color-mix(in oklch, ${a2ui.positive} 16%, transparent)`,
    color: a2ui.positive,
    display: 'inline-grid',
    // Baseline-aligned like the playground: the chip's bottom sits on the text baseline.
    verticalAlign: 'baseline',
    height: 20,
    width: 20,
  },
  cross: {
    color: `color-mix(in oklab, ${a2ui.fgMuted} 45%, transparent)`,
    display: 'inline',
    verticalAlign: 'middle',
  },
  empty: {
    color: `color-mix(in oklab, ${a2ui.fgMuted} 40%, transparent)`,
  },
  feature: {
    paddingBlock: 10,
    paddingInline: 16,
    color: a2ui.fg85,
    fontSize: 12.5,
    textAlign: 'start',
    verticalAlign: 'middle',
    whiteSpace: 'normal',
  },
  featureHead: {
    paddingBlock: 12,
    paddingInline: 16,
    color: a2ui.fgMuted,
    fontSize: 11.5,
    fontWeight: 500,
    textAlign: 'start',
    verticalAlign: 'bottom',
    whiteSpace: 'nowrap',
  },
  header: {
    paddingInline: 16,
    paddingBlockEnd: 12,
    paddingBlockStart: 14,
    minWidth: 0,
  },
  highlight: {
    backgroundColor: `color-mix(in oklch, ${a2ui.accent} 7%, transparent)`,
  },
  highlightHead: {
    backgroundColor: `color-mix(in oklch, ${a2ui.accent} 7%, transparent)`,
    boxShadow: `inset 0 2px 0 ${a2ui.accent}`,
  },
  optionHead: {
    paddingBlock: 12,
    paddingInline: 12,
    color: a2ui.fg,
    fontWeight: 500,
    textAlign: 'center',
    verticalAlign: 'bottom',
    whiteSpace: 'nowrap',
  },
  optionInner: {
    gap: 4,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  optionName: {
    color: a2ui.fg80,
    fontSize: 12.5,
    fontWeight: 600,
  },
  optionNameActive: {
    color: a2ui.fg,
  },
  root: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    width: '100%',
  },
  row: {
    transition: 'background-color 150ms',
    backgroundColor: { 'default': null, ':hover': a2ui.overlay2 },
    borderBlockEndColor: a2ui.line,
    borderBlockEndStyle: { 'default': 'solid', ':last-child': 'none' },
    borderBlockEndWidth: 1,
  },
  headRow: {
    borderBlockEndColor: a2ui.line,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
  },
  scroll: {
    position: 'relative',
    scrollbarWidth: 'thin',
    overflowX: 'auto',
    width: '100%',
  },
  fadeBoth: {
    maskImage:
      'linear-gradient(to right, transparent, #000 36px, #000 calc(100% - 36px), transparent)',
  },
  fadeLeft: {
    maskImage: 'linear-gradient(to left, #000 calc(100% - 36px), transparent)',
  },
  fadeRight: {
    maskImage: 'linear-gradient(to right, #000 calc(100% - 36px), transparent)',
  },
  table: {
    borderCollapse: 'collapse',
    borderSpacing: 0,
    fontSize: 13,
    width: '100%',
  },
  tableRuled: {
    borderBlockStartColor: a2ui.line,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
  },
  value: {
    color: a2ui.fg90,
    fontSize: 12.5,
  },
});
