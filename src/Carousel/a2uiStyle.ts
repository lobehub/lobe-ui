import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';

// Adapted from CopilotKit Gen UI 2.0 standard catalog (MIT), `standard/layout.tsx` Carousel and
// CarouselItem: a snapping row of slides, 32px round arrows 4px in from the edges.
export const styles = stylex.create({
  arrow: {
    borderColor: a2ui.fg10,
    borderRadius: 9999,
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 0,
    transitionDuration: '0.15s',
    transitionProperty: 'opacity',
    alignItems: 'center',
    backgroundColor: a2ui.surface2,
    boxShadow: a2ui.shadowSm,
    boxSizing: 'border-box',
    color: a2ui.fg,
    cursor: 'pointer',
    display: 'flex',
    fontFamily: 'inherit',
    fontSize: 16,
    justifyContent: 'center',
    lineHeight: 1,
    insetBlockStart: '50%',
    position: 'absolute',
    transform: 'translateY(-50%)',
    zIndex: 1,
    height: 32,
    width: 32,
  },
  arrowHidden: {
    cursor: 'default',
    opacity: 0,
    pointerEvents: 'none',
  },
  arrowNext: {
    insetInlineEnd: 4,
  },
  arrowPrev: {
    insetInlineStart: 4,
  },
  root: {
    position: 'relative',
    minWidth: 0,
    width: '100%',
  },
  scroller: {
    outlineColor: { 'default': null, ':focus-visible': a2ui.info },
    outlineOffset: { 'default': null, ':focus-visible': 2 },
    outlineStyle: { 'default': null, ':focus-visible': 'solid' },
    outlineWidth: { 'default': null, ':focus-visible': 2 },
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    maxWidth: '100%',
    minWidth: 0,
  },
  slide: {
    gap: 16,
    boxSizing: 'border-box',
    display: 'flex',
    flex: '0 0 auto',
    flexDirection: 'column',
    scrollSnapAlign: 'start',
    maxWidth: '100%',
    minWidth: 0,
  },
});
