import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  checkbox: {
    marginInlineEnd: 8,
  },
  guide: {
    overflow: 'visible',
    insetBlockStart: 0,
    insetInlineStart: 0,
    pointerEvents: 'none',
    position: 'absolute',
    height: '100%',
  },
  guidePath: {
    fill: 'none',
    stroke: cssVar.colorBorderSecondary,
    strokeLinecap: 'round',
    strokeWidth: 1,
  },
  icon: {
    flex: 'none',
    alignItems: 'center',
    color: cssVar.colorTextSecondary,
    display: 'inline-flex',
    marginInlineEnd: 6,
  },
  node: {
    borderRadius: cssVar.borderRadius,
    outline: 'none',
    alignItems: 'center',
    color: cssVar.colorText,
    display: 'flex',
    position: 'relative',
  },
  nodeBlock: {
    cursor: 'pointer',
  },
  nodeDisabled: {
    color: cssVar.colorTextDisabled,
    cursor: 'not-allowed',
  },
  nodeDisabledSelected: {
    backgroundColor: { 'default': cssVar.colorFillSecondary, ':hover': 'transparent' },
  },
  nodeHover: {
    backgroundColor: { 'default': null, ':hover': cssVar.colorFillTertiary },
  },
  nodeSelected: {
    backgroundColor: cssVar.colorFillSecondary,
  },
  panel: {
    overflow: 'hidden',
    transition: `height 200ms ${cssVar.motionEaseOut}`,
    transitionDuration: { 'default': null, '@media (prefers-reduced-motion: reduce)': '0s' },
    height: {
      'default': 'var(--collapsible-panel-height)',
      ':is([data-starting-style], [data-ending-style])': 0,
    },
  },
  root: {
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
    userSelect: 'none',
  },
  switcher: {
    padding: 0,
    borderColor: 'currentcolor',
    borderRadius: cssVar.borderRadiusSM,
    borderStyle: 'none',
    borderWidth: 0,
    flex: 'none',
    placeItems: 'center',
    backgroundColor: { 'default': 'transparent', ':hover': cssVar.colorFillSecondary },
    color: { 'default': cssVar.colorTextSecondary, ':hover': cssVar.colorText },
    cursor: 'pointer',
    display: 'grid',
    height: 24,
    width: 24,
  },
  switcherLeaf: {
    pointerEvents: 'none',
    visibility: 'hidden',
  },
  title: {
    borderRadius: cssVar.borderRadiusSM,
    gap: 6,
    overflow: 'hidden',
    paddingBlock: 2,
    paddingInline: 6,
    alignItems: 'center',
    display: 'inline-flex',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 0,
  },
  titleBlock: {
    flex: '1',
  },
  titleInline: {
    backgroundColor: { 'default': null, ':hover': cssVar.colorFillTertiary },
    cursor: 'pointer',
  },
  titleInlineDisabled: {
    backgroundColor: 'transparent',
    cursor: 'not-allowed',
  },
  titleInlineSelected: {
    backgroundColor: cssVar.colorFillSecondary,
  },
});
