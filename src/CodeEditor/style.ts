import './style.css';

import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { stylish } from '@/styles/stylex/stylish';

export const styles = stylex.create({
  borderless: {
    borderRadius: 0,
  },
  highlight: {
    pointerEvents: 'none',
  },
  root: {
    borderRadius: cssVar.borderRadius,
    fontSize: 12,
    position: 'relative',
    height: 'fit-content',
    overflowX: 'hidden',
    overflowY: 'auto',
    width: '100%',
  },
  textarea: {
    'padding': 0,
    'borderColor': 'currentcolor',
    'borderStyle': 'none',
    'borderWidth': 'medium',
    'outline': 'none',
    'overflow': 'hidden',
    'backgroundColor': 'transparent',
    'boxShadow': { 'default': null, ':focus': 'none' },
    'boxSizing': 'border-box',
    'caretColor': cssVar.colorText,
    'color': 'transparent',
    'insetBlockStart': 0,
    'insetInlineStart': 0,
    'position': 'absolute',
    'resize': 'none',
    'textAlign': 'start',
    'height': '100%',
    'width': '100%',
    '::placeholder': {
      color: cssVar.colorTextQuaternary,
    },
  },
});

export const variantStyles = {
  borderless: [stylish.variantBorderlessWithoutHover, styles.borderless],
  filled: stylish.variantFilledWithoutHover,
  outlined: stylish.variantOutlinedWithoutHover,
};
