import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

// Adapted from CopilotKit a2ui-playground (MIT), `renderers/data.tsx` Agenda.
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
  dDay: {
    paddingBlock: 16,
    borderBlockStartColor: `var(--lobe-fill-border, ${cssVar.colorFill})`,
  },
  dDayNumber: {
    fontSize: cssVar.fontSizeHeading3,
    fontWeight: 500,
    letterSpacing: 'normal',
  },
  dEmpty: {
    color: cssVar.colorTextTertiary,
    fontSize: cssVar.fontSize,
  },
  dEvent: {
    borderRadius: cssVar.borderRadius,
    paddingBlock: 8,
    backgroundColor: cssVar.colorFillQuaternary,
  },
  dEventTitle: {
    color: cssVar.colorText,
    fontSize: cssVar.fontSize,
  },
  dHeader: {
    borderBlockEndColor: `var(--lobe-fill-border, ${cssVar.colorFill})`,
  },
  dMeta: {
    color: cssVar.colorTextDescription,
    fontSize: cssVar.fontSizeSM,
  },
  dMonth: {
    color: cssVar.colorTextTertiary,
    fontSize: cssVar.fontSizeSM,
  },
  dTime: {
    color: cssVar.colorTextSecondary,
    fontSize: cssVar.fontSizeSM,
    fontWeight: 400,
  },
  dTitle: {
    color: cssVar.colorTextHeading,
    fontSize: cssVar.fontSize,
    fontWeight: 500,
    letterSpacing: 'normal',
  },
  dWeekday: {
    color: cssVar.colorTextSecondary,
    fontSize: cssVar.fontSizeSM,
    fontWeight: 400,
  },
  body: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    minInlineSize: 0,
  },
  date: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    inlineSize: 48,
    paddingBlockStart: 2,
  },
  day: {
    gap: 16,
    paddingBlock: 14,
    paddingInline: 16,
    borderBlockStartColor: a2ui.line,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: {
      'default': 1,
      ':first-child': 0,
    },
    display: 'flex',
    minInlineSize: 0,
  },
  days: {
    display: 'flex',
    flexDirection: 'column',
  },
  dayNumber: {
    fontSize: 22,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 600,
    letterSpacing: '-0.025em',
    lineHeight: 1.25,
  },
  description: {
    overflow: 'hidden',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    color: a2ui.fgMuted,
    display: '-webkit-box',
    fontSize: 11.5,
    lineHeight: 1.375,
  },
  empty: {
    paddingBlock: 8,
    color: a2ui.fgMuted,
    fontSize: 12.5,
  },
  event: {
    gap: 12,
    paddingBlock: 8,
    paddingInline: 12,
    alignItems: 'stretch',
    display: 'flex',
    minInlineSize: 0,
  },
  eventBar: {
    borderRadius: 999,
    flexShrink: 0,
    inlineSize: 2,
  },
  eventTitle: {
    overflow: 'hidden',
    fontSize: 13,
    fontWeight: 500,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  events: {
    flex: '1',
    gap: 6,
    display: 'flex',
    flexDirection: 'column',
    minInlineSize: 0,
  },
  header: {
    paddingBlock: 12,
    paddingInline: 16,
    borderBlockEndColor: a2ui.line,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
  },
  location: {
    gap: 4,
    alignItems: 'center',
    color: a2ui.fgMuted,
    display: 'flex',
    fontSize: 11,
    minInlineSize: 0,
  },
  meta: {
    overflow: 'hidden',
    color: a2ui.fgMuted,
    fontSize: 11.5,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  month: {
    color: a2ui.fgMuted,
    fontSize: 11,
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    inlineSize: '100%',
    minInlineSize: 0,
  },
  time: {
    color: a2ui.fgMuted,
    flexShrink: 0,
    fontSize: 11.5,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 500,
    inlineSize: 64,
    paddingBlockStart: 1,
  },
  truncate: {
    overflow: 'hidden',
    minInlineSize: 0,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  weekday: {
    lineHeight: 1.25,
    textAlign: 'center',
  },
});
