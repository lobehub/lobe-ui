import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';

export const styles = stylex.create({
  link: {
    borderRadius: { 'default': null, ':focus-visible': 4 },
    overflow: 'hidden',
    transition: 'color 0.15s ease',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    color: {
      'default': cssVar.colorTextSecondary,
      ":is([aria-current='location'])": cssVar.colorText,
      ':hover': cssVar.colorText,
    },
    display: '-webkit-box',
    fontSize: 14,
    fontWeight: { 'default': null, ":is([aria-current='location'])": 500 },
    lineHeight: 1.4,
    outlineColor: { 'default': null, ':focus-visible': cssVar.colorText },
    outlineOffset: { 'default': null, ':focus-visible': 2 },
    outlineStyle: { 'default': null, ':focus-visible': 'solid' },
    outlineWidth: { 'default': null, ':focus-visible': 2 },
    overflowWrap: 'anywhere',
  },
  linkNested: {
    fontSize: 13,
  },
  list: {
    margin: 0,
    gap: 8,
    listStyle: 'none',
    paddingBlock: 0,
    borderInlineStartColor: cssVar.colorBorderSecondary,
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingInlineEnd: 0,
    paddingInlineStart: 14,
  },
  listNested: {
    borderInlineStartColor: 'currentcolor',
    borderInlineStartStyle: 'none',
    borderInlineStartWidth: 'medium',
    marginBlockStart: 8,
    paddingInlineStart: 12,
  },
  marker: {
    borderRadius: 2,
    transition: `inset-block-start 0.2s ${cssVar.motionEaseOut}, height 0.2s ${cssVar.motionEaseOut}`,
    backgroundColor: cssVar.colorText,
    insetInlineStart: -1,
    pointerEvents: 'none',
    position: 'absolute',
    transitionDuration: { default: null, [reducedMotion]: '0s' },
    transitionProperty: { default: null, [reducedMotion]: 'none' },
    width: 2,
  },
  root: {
    position: 'relative',
  },
});
