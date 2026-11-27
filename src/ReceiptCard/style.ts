import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

// Adapted from CopilotKit a2ui-playground (MIT), `renderers/domain.tsx` ReceiptCard.
// The `d*` entries restyle the same markup for `variant="default"`, the plain lobe-ui card.
export const styles = stylex.create({
  dashed: {
    marginInline: 16,
    borderBlockStartColor: a2ui.overlay12,
    borderBlockStartStyle: 'dashed',
    borderBlockStartWidth: 1,
  },
  footer: {
    gap: 8,
    paddingBlock: 10,
    paddingInline: 16,
    alignItems: 'center',
    backgroundColor: a2ui.overlay1_5,
    borderBlockStartColor: a2ui.line,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    color: a2ui.fgMuted,
    display: 'flex',
    fontSize: 12,
  },
  header: {
    gap: 12,
    paddingInline: 16,
    alignItems: 'flex-start',
    display: 'flex',
    justifyContent: 'space-between',
    paddingBlockEnd: '12px',
    paddingBlockStart: '16px',
  },
  headerMain: {
    gap: 10,
    alignItems: 'center',
    display: 'flex',
    minInlineSize: 0,
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
    minInlineSize: 0,
  },
  icon: {
    borderColor: a2ui.line,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: a2ui.overlay4,
    blockSize: 36,
    color: 'var(--lobe-purple-active)',
    display: 'flex',
    flexShrink: 0,
    inlineSize: 36,
    justifyContent: 'center',
  },
  item: {
    gap: 12,
    paddingBlock: 8,
    alignItems: 'flex-start',
    display: 'flex',
    justifyContent: 'space-between',
  },
  itemMain: {
    gap: 10,
    alignItems: 'flex-start',
    display: 'flex',
    minInlineSize: 0,
  },
  items: {
    paddingBlock: 8,
    paddingInline: 16,
    display: 'flex',
    flexDirection: 'column',
  },
  itemText: {
    display: 'flex',
    flexDirection: 'column',
    minInlineSize: 0,
  },
  merchant: {
    overflow: 'hidden',
    fontSize: 14.5,
    fontWeight: 600,
    letterSpacing: '-0.025em',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  meta: {
    overflow: 'hidden',
    color: a2ui.fgMuted,
    fontSize: 11.5,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  name: {
    fontSize: 13,
    fontWeight: 500,
  },
  note: {
    color: a2ui.fgMuted,
    fontSize: 11.5,
  },
  placeholder: {
    borderRadius: 6,
    marginBlock: 6,
    backgroundColor: a2ui.overlay5,
    blockSize: 32,
  },
  positive: {
    color: cssVar.colorSuccessText,
  },
  price: {
    flexShrink: 0,
    fontSize: 13,
    fontVariantNumeric: 'tabular-nums',
  },
  qty: {
    borderRadius: 6,
    paddingInline: 4,
    alignItems: 'center',
    backgroundColor: a2ui.overlay6,
    blockSize: 20,
    color: a2ui.fgMuted,
    display: 'flex',
    flexShrink: 0,
    fontSize: 10.5,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 600,
    justifyContent: 'center',
    marginBlockStart: 1,
    minInlineSize: 20,
  },
  root: {
    overflow: 'hidden',
    inlineSize: '100%',
    minInlineSize: 0,
  },
  row: {
    alignItems: 'center',
    display: 'flex',
    fontSize: 12.5,
    justifyContent: 'space-between',
  },
  rowLabel: {
    color: a2ui.fgMuted,
  },
  rowValue: {
    fontVariantNumeric: 'tabular-nums',
  },
  rule: {
    backgroundColor: a2ui.line,
    blockSize: 1,
  },
  status: {
    borderRadius: 999,
    borderStyle: 'solid',
    borderWidth: 1,
    paddingBlock: 2,
    paddingInline: 8,
    alignItems: 'center',
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: 11,
    fontWeight: 500,
    lineHeight: 1.5,
    textTransform: 'capitalize',
    whiteSpace: 'nowrap',
  },
  total: {
    alignItems: 'baseline',
    borderBlockStartColor: a2ui.line,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    justifyContent: 'space-between',
    marginBlockStart: 6,
    paddingBlockStart: 10,
  },
  totalAmount: {
    fontSize: 18,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 600,
    letterSpacing: '-0.025em',
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: 600,
  },
  totals: {
    gap: 6,
    paddingBlock: 12,
    paddingInline: 16,
    display: 'flex',
    flexDirection: 'column',
  },

  // variant="default": the plain lobe-ui card.
  dDashed: {
    borderBlockStartColor: cssVar.colorBorder,
  },
  dFooter: {
    backgroundColor: cssVar.colorFillQuaternary,
    borderBlockStartColor: cssVar.colorBorderSecondary,
    color: cssVar.colorTextSecondary,
    fontSize: cssVar.fontSizeSM,
  },
  dIcon: {
    borderRadius: cssVar.borderRadius,
    borderWidth: 0,
    backgroundColor: cssVar.colorFillTertiary,
    color: cssVar.colorTextSecondary,
  },
  dLine: {
    backgroundColor: cssVar.colorBorderSecondary,
  },
  dMerchant: {
    color: cssVar.colorTextHeading,
    fontSize: cssVar.fontSizeLG,
    letterSpacing: 'normal',
  },
  dMeta: {
    color: cssVar.colorTextDescription,
    fontSize: cssVar.fontSizeSM,
  },
  dName: {
    fontSize: cssVar.fontSize,
    fontWeight: 400,
  },
  dNote: {
    color: cssVar.colorTextDescription,
    fontSize: cssVar.fontSizeSM,
  },
  dQty: {
    borderRadius: cssVar.borderRadiusSM,
    backgroundColor: cssVar.colorFillTertiary,
    color: cssVar.colorTextSecondary,
    fontSize: cssVar.fontSizeSM,
    fontWeight: 500,
  },
  dRow: {
    fontSize: cssVar.fontSize,
  },
  dRowLabel: {
    color: cssVar.colorTextSecondary,
  },
  dText: {
    fontSize: cssVar.fontSize,
  },
  dTotal: {
    borderBlockStartColor: cssVar.colorBorderSecondary,
  },
  dTotalAmount: {
    fontSize: cssVar.fontSizeHeading4,
    fontWeight: 600,
    letterSpacing: 'normal',
  },
  dTotalLabel: {
    fontSize: cssVar.fontSize,
  },
});
