import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

const WIDE = '@container (min-width: 520px)';

// Adapted from CopilotKit a2ui-playground (MIT), `renderers/domain.tsx` RecipeCard.
// The `d*` entries restyle the same markup for `variant="default"`, the plain lobe-ui card.
export const styles = stylex.create({
  column: {
    gap: 8,
    display: 'flex',
    flexDirection: 'column',
    minInlineSize: 0,
  },
  content: {
    gap: {
      [WIDE]: 20,
      default: 16,
    },
    paddingInline: 16,
    display: 'grid',
    gridTemplateColumns: {
      [WIDE]: 'minmax(0, 0.9fr) minmax(0, 1.1fr)',
      default: 'minmax(0, 1fr)',
    },
    paddingBlockEnd: '16px',
    paddingBlockStart: '14px',
  },
  count: {
    color: a2ui.fgMuted,
    fontSize: 11,
    fontVariantNumeric: 'tabular-nums',
  },
  cover: {
    overflow: 'hidden',
    backgroundColor: a2ui.overlay2_5,
    blockSize: 160,
    position: 'relative',
  },
  coverFade: {
    inset: 0,
    backgroundImage: `linear-gradient(to top, ${a2ui.surface}, color-mix(in srgb, ${a2ui.surface} 45%, transparent), color-mix(in srgb, ${a2ui.surface} 10%, transparent))`,
    position: 'absolute',
  },
  done: {
    color: a2ui.fgMuted,
    textDecorationColor: a2ui.overlay15,
    textDecorationLine: 'line-through',
  },
  header: {
    gap: 8,
    paddingInline: 16,
    display: 'flex',
    flexDirection: 'column',
  },
  headerNoCover: {
    paddingBlockStart: 16,
  },
  headerWithCover: {
    marginBlockStart: -40,
    position: 'relative',
  },
  ingredient: {
    borderRadius: 6,
    gap: 10,
    paddingBlock: 6,
    paddingInline: 4,
    alignItems: 'flex-start',
    backgroundColor: { 'default': null, ':hover': a2ui.overlay2_5 },
    cursor: 'pointer',
    display: 'flex',
    transitionDuration: '150ms',
    transitionProperty: 'background-color',
  },
  ingredientBox: {
    flexShrink: 0,
    marginBlockStart: 1,
  },
  ingredientText: {
    fontSize: 13,
    lineHeight: 1.375,
    transitionDuration: '150ms',
    transitionProperty: 'color',
  },
  list: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
  },
  progress: {
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: a2ui.overlay6,
    blockSize: 3,
  },
  progressBar: {
    borderRadius: 999,
    backgroundColor: 'var(--lobe-purple-8)',
    blockSize: '100%',
    transitionDuration: '300ms',
    transitionProperty: 'width',
  },
  root: {
    overflow: 'hidden',
    containerType: 'inline-size',
    inlineSize: '100%',
    minInlineSize: 0,
  },
  sectionHead: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  step: {
    gap: 10,
    display: 'flex',
  },
  stepNumber: {
    borderRadius: 999,
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    blockSize: 20,
    display: 'flex',
    flexShrink: 0,
    fontSize: 10.5,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 600,
    inlineSize: 20,
    justifyContent: 'center',
  },
  steps: {
    margin: 0,
    padding: 0,
    gap: 12,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
  },
  stepText: {
    color: a2ui.fg85,
    fontSize: 13,
    lineHeight: 1.625,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: '-0.025em',
    lineHeight: 1.375,
  },

  // variant="default": the plain lobe-ui card.
  dCount: {
    color: cssVar.colorTextDescription,
    fontSize: cssVar.fontSizeSM,
  },
  dIngredient: {
    borderRadius: cssVar.borderRadiusSM,
    backgroundColor: { 'default': null, ':hover': cssVar.colorFillQuaternary },
  },
  dIngredientText: {
    fontSize: cssVar.fontSize,
    lineHeight: cssVar.lineHeight,
  },
  dLabel: {
    color: cssVar.colorTextSecondary,
    fontSize: cssVar.fontSizeSM,
  },
  dProgress: {
    backgroundColor: cssVar.colorFillSecondary,
  },
  dProgressBar: {
    backgroundColor: cssVar.colorPrimary,
  },
  dStepNumber: {
    borderWidth: 0,
    backgroundColor: cssVar.colorFillSecondary,
    color: cssVar.colorText,
    fontSize: cssVar.fontSizeSM,
    fontWeight: 500,
  },
  dStepText: {
    color: cssVar.colorText,
    fontSize: cssVar.fontSize,
    lineHeight: cssVar.lineHeight,
  },
  dTitle: {
    color: cssVar.colorTextHeading,
    fontSize: cssVar.fontSizeHeading4,
    letterSpacing: 'normal',
  },
});
