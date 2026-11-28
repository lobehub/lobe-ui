import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

// Adapted from CopilotKit a2ui-playground (MIT), `renderers/content.tsx` ImageGallery.
// The `d*` entries restyle the same markup for `variant="default"`, lobe-ui image tiles.
export const styles = stylex.create({
  caption: {
    insetInline: 0,
    overflow: 'hidden',
    paddingInline: 10,
    // A dark fade under light text, the same in both themes: it sits on the photo, not the page.
    backgroundImage: `linear-gradient(to top, color-mix(in srgb, ${cssVar.colorBgSpotlight} 80%, transparent), transparent)`,
    color: `color-mix(in srgb, ${cssVar.colorTextLightSolid} 90%, transparent)`,
    fontSize: 11,
    fontWeight: 500,
    insetBlockEnd: 0,
    lineHeight: 1.5,
    paddingBlockEnd: '8px',
    paddingBlockStart: '24px',
    pointerEvents: 'none',
    position: 'absolute',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  feature: {
    gridColumn: 'span 2',
    gridRow: 'span 2',
  },
  image: {
    objectFit: 'cover',
    transform: { 'default': null, ':hover': 'scale(1.03)' },
    transitionDuration: '500ms',
    transitionProperty: 'transform',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  item: {
    margin: 0,
    borderColor: a2ui.line,
    borderRadius: 12,
    borderStyle: 'solid',
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: a2ui.overlay2_5,
    minInlineSize: 0,
    position: 'relative',
  },
  root: {
    gap: 8,
    display: 'grid',
    inlineSize: '100%',
    minInlineSize: 0,
  },

  // variant="default": lobe-ui image tiles with the caption below.
  dCaption: {
    overflow: 'hidden',
    color: cssVar.colorTextSecondary,
    fontSize: cssVar.fontSizeSM,
    lineHeight: cssVar.lineHeightSM,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  dFigure: {
    margin: 0,
    gap: 4,
    display: 'flex',
    flexDirection: 'column',
    minInlineSize: 0,
  },
  dItem: {
    borderColor: cssVar.colorBorderSecondary,
    borderRadius: cssVar.borderRadiusLG,
    backgroundColor: cssVar.colorFillTertiary,
  },
  dFeatureItem: {
    flex: '1',
  },
  square: {
    aspectRatio: '1',
  },
});
