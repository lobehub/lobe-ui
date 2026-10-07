import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import type { CSSProperties } from 'react';

export const styleProps = (
  styles: stylex.StyleXStyles | stylex.StyleXStyles[],
  className?: string,
  style?: CSSProperties,
): { className: string; style: CSSProperties | undefined } => {
  const p = stylex.props(styles);
  return {
    className: clsx(p.className, className),
    style: p.style || style ? { ...p.style, ...style } : undefined,
  };
};
