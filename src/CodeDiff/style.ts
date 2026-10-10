import './style.css';

import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { stylish } from '@/styles/stylex/stylish';

export const prefix = 'lobe-code-diff';
export const compactActionsCls = `${prefix}-actions-compact`;
export const compactLangCls = `${prefix}-lang`;

export const styles = stylex.create({
  actions: {
    transition: `opacity 0.2s ${cssVar.motionEaseInOut}`,
    opacity: 0,
  },
  actionsCompact: {
    transition: `opacity 0.2s ${cssVar.motionEaseInOut}`,
    insetBlockStart: 8,
    insetInlineEnd: 8,
    opacity: 0,
    position: 'absolute',
    zIndex: 2,
  },
  additions: {
    color: cssVar.colorSuccess,
    fontFamily: cssVar.fontFamilyCode,
    fontSize: 12,
  },
  body: {
    overflow: 'auto',
    fontFamily: cssVar.fontFamilyCode,
    fontSize: 13,
    lineHeight: 1.6,
    width: '100%',
  },
  bodyCollapsed: {
    opacity: 0,
    height: 0,
  },
  bodyDivider: {
    borderBlockStartColor: cssVar.colorFillQuaternary,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
  },
  bodyRoot: {
    overflow: 'hidden',
    transition: `opacity 0.25s ${cssVar.motionEaseOut}`,
  },
  deletions: {
    color: cssVar.colorError,
    fontFamily: cssVar.fontFamilyCode,
    fontSize: 12,
  },
  filled: {
    backgroundColor: cssVar.colorFillQuaternary,
  },
  header: {
    color: cssVar.colorTextSecondary,
    cursor: 'pointer',
    fontFamily: cssVar.fontFamilyCode,
    fontSize: 13,
    position: 'relative',
  },
  headerFilled: {
    backgroundColor: 'transparent',
  },
  root: {
    borderRadius: cssVar.borderRadius,
    overflow: 'hidden',
    transition: `background-color 100ms ${cssVar.motionEaseOut}`,
    position: 'relative',
    width: '100%',
  },
});

export const variantStyles = {
  borderless: stylish.variantBorderlessWithoutHover,
  filled: [stylish.variantFilledWithoutHover, styles.filled],
  outlined: stylish.variantOutlinedWithoutHover,
};
