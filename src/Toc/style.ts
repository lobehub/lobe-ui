import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';

export const styles = stylex.create({
  highlight: {
    fill: 'none',
    stroke: cssVar.colorText,
    strokeDasharray: null,
    strokeDashoffset: null,
    strokeLinecap: 'round',
    strokeWidth: 1.5,
    transition:
      'stroke-dasharray 460ms cubic-bezier(0.2, 0.8, 0.2, 1), stroke-dashoffset 460ms cubic-bezier(0.2, 0.8, 0.2, 1)',
    transitionDuration: { default: null, [reducedMotion]: '0.01ms' },
  },
  link: {
    borderRadius: { 'default': null, ':focus-visible': 4 },
    paddingBlock: '0.3125rem',
    textDecoration: 'none',
    transition: 'color 160ms ease',
    color: {
      'default': cssVar.colorTextSecondary,
      ':hover': cssVar.colorText,
    },
    display: 'block',
    fontSize: 13,
    fontWeight: { 'default': null, ":is([aria-current='location'])": 540 },
    lineHeight: '1.25rem',
    outlineColor: { 'default': null, ':focus-visible': cssVar.colorText },
    outlineOffset: { 'default': null, ':focus-visible': 2 },
    outlineStyle: { 'default': null, ':focus-visible': 'solid' },
    outlineWidth: { 'default': null, ':focus-visible': 2 },
    paddingInlineEnd: '0.25rem',
    paddingInlineStart: '1.375rem',
    transitionDuration: { default: null, [reducedMotion]: '0.01ms' },
  },
  linkActive: {
    color: cssVar.colorText,
    fontWeight: 540,
  },
  linkNested: {
    paddingInlineStart: '2.125rem',
  },
  list: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  pathList: {
    position: 'relative',
  },
  pathSvg: {
    overflow: 'visible',
    insetBlockStart: 0,
    insetInlineStart: 0,
    pointerEvents: 'none',
    position: 'absolute',
    height: '100%',
    width: '1rem',
  },
  root: {
    width: '100%',
  },
  track: {
    fill: 'none',
    stroke: cssVar.colorBorder,
    strokeLinecap: 'round',
    strokeWidth: 1,
  },
});
