import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { media } from '@/styles/stylex/media.stylex';

import { spotlightCardMarker } from './marker.stylex';

export const CHILDREN_CLASSNAME = 'hover-card';

export const styles = stylex.create({
  content: {
    margin: 1,
    borderRadius: 'calc(var(--spotlight-card-border-radius, 12px) - 1px)',
    backgroundColor: cssVar.colorBgContainer,
    zIndex: 2,
  },
  grid: {
    display: { default: 'grid', [media.sm]: 'flex' },
    flexDirection: { default: null, [media.sm]: 'column' },
  },
  item: {
    'borderRadius': 'var(--spotlight-card-border-radius, 12px)',
    'overflow': 'hidden',
    'backgroundColor': `color-mix(in srgb, ${cssVar.colorBorderSecondary} 75%, transparent)`,
    'cursor': 'pointer',
    'position': 'relative',
    '::after': {
      borderRadius: 'inherit',
      transition: 'opacity 500ms',
      content: '""',
      insetBlockStart: 0,
      insetInlineStart: 0,
      opacity: { default: 0, [stylex.when.ancestor(':hover', spotlightCardMarker)]: 1 },
      position: 'absolute',
      zIndex: 1,
      height: '100%',
      width: '100%',
    },
    '::before': {
      borderRadius: 'inherit',
      transition: 'opacity 500ms',
      content: '""',
      insetBlockStart: 0,
      insetInlineStart: 0,
      opacity: { 'default': 0, ':hover': 1 },
      pointerEvents: 'none',
      position: 'absolute',
      userSelect: 'none',
      zIndex: 3,
      height: '100%',
      width: '100%',
    },
  },
  itemDark: {
    '::after': {
      backgroundImage: `radial-gradient(calc(var(--spotlight-card-size, 800px) * 0.75) circle at var(--mouse-x) var(--mouse-y), color-mix(in srgb, ${cssVar.colorTextBase} 40%, transparent), transparent 40%)`,
    },
    '::before': {
      backgroundImage: `radial-gradient(var(--spotlight-card-size, 800px) circle at var(--mouse-x) var(--mouse-y), color-mix(in srgb, ${cssVar.colorTextBase} 6%, transparent), transparent 40%)`,
    },
  },
  itemLight: {
    '::after': {
      backgroundImage: `radial-gradient(calc(var(--spotlight-card-size, 800px) * 0.75) circle at var(--mouse-x) var(--mouse-y), color-mix(in srgb, ${cssVar.colorTextBase} 20%, transparent), transparent 40%)`,
    },
    '::before': {
      backgroundImage: `radial-gradient(var(--spotlight-card-size, 800px) circle at var(--mouse-x) var(--mouse-y), color-mix(in srgb, ${cssVar.colorTextBase} 2%, transparent), transparent 40%)`,
    },
  },
});
