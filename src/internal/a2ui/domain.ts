import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

import { a2ui } from './tokens.stylex';

/**
 * Atoms the domain cards (ProfileCard, EventCard, ReceiptCard, RecipeCard, WeatherCard) share.
 * Adapted from CopilotKit a2ui-playground (MIT), `renderers/domain.tsx` (`chip`, `Img`).
 */
export const domainStyles = stylex.create({
  /** `chip`: rounded-full hairline pill, 11px muted text. */
  chip: {
    borderColor: a2ui.line,
    borderRadius: 999,
    borderStyle: 'solid',
    borderWidth: 1,
    gap: 4,
    paddingBlock: 2,
    paddingInline: 8,
    alignItems: 'center',
    backgroundColor: a2ui.overlay4,
    color: a2ui.fgMuted,
    display: 'inline-flex',
    fontSize: 11,
    lineHeight: 1.5,
    whiteSpace: 'nowrap',
  },
  chips: {
    gap: 6,
    display: 'flex',
    flexWrap: 'wrap',
  },
  /** Plain lobe-ui card of the `default` variants. */
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
  /** Hairline of the `default` variants. */
  dLine: {
    borderColor: cssVar.colorBorderSecondary,
  },
  /** Cover image filling its box. */
  img: {
    display: 'block',
    objectFit: 'cover',
    blockSize: '100%',
    inlineSize: '100%',
  },
  truncate: {
    overflow: 'hidden',
    minInlineSize: 0,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});
