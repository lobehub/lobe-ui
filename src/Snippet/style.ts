import './style.css';

import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { stylish } from '@/styles/stylex/stylish';

export const styles = stylex.create({
  highlight: {
    padding: 0,
    flex: '1',
    height: '100%',
    overflowX: 'auto',
    overflowY: 'hidden',
  },
  root: {
    borderRadius: cssVar.borderRadius,
    overflow: 'hidden',
    position: 'relative',
    maxWidth: '100%',
  },
  shadow: {
    boxShadow: `0 1px 0 -1px ${cssVar.colorBorder}, 0 1px 2px -0.5px ${cssVar.colorBorder}, 0 2px 2px -1px ${cssVar.colorBorderSecondary}, 0 3px 6px -4px ${cssVar.colorBorderSecondary}`,
  },
});

export const variantStyles = {
  borderless: stylish.variantBorderlessWithoutHover,
  filled: stylish.variantFilledWithoutHover,
  outlined: stylish.variantOutlinedWithoutHover,
};
