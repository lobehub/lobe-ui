import './style.css';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { stylish } from '@/styles/stylex/stylish';

import type { HighlighterProps } from './type';

export const actionsHoverCls = 'ant-highlighter-highlighter-hover-actions lobe-highlighter-actions';
export const langHoverCls = 'ant-highlighter-highlighter-hover-lang lobe-highlighter-lang';
export const expandCls = 'ant-highlighter-highlighter-body-expand';
export const prefix = 'ant-highlighter';

export const styles = stylex.create({
  actions: {
    insetBlockStart: 8,
    insetInlineEnd: 8,
    opacity: 0,
    position: 'absolute',
    zIndex: 2,
  },
  body: {
    overflow: 'hidden',
    transition: `opacity 0.25s ${cssVar.motionEaseOut}`,
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
  filled: {
    backgroundColor: cssVar.colorFillQuaternary,
  },
  header: {
    padding: 4,
    cursor: 'pointer',
    position: 'relative',
  },
  headerBorderless: {
    paddingInline: 0,
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
  shadow: {
    boxShadow: `0 1px 0 -1px ${cssVar.colorBorder}, 0 1px 2px -0.5px ${cssVar.colorBorder}, 0 2px 2px -1px ${cssVar.colorBorderSecondary}, 0 3px 6px -4px ${cssVar.colorBorderSecondary}`,
  },
});

type Variant = NonNullable<HighlighterProps['variant']>;

const variantStyles = {
  borderless: stylish.variantBorderlessWithoutHover,
  filled: [stylish.variantFilledWithoutHover, styles.filled],
  outlined: stylish.variantOutlinedWithoutHover,
};

export const rootStyles = ({
  shadow,
  variant = 'filled',
}: {
  shadow?: boolean;
  variant?: Variant;
}) => [styles.root, variantStyles[variant], shadow && styles.shadow];

export const rootClassName = (wrap?: boolean, className?: string) =>
  clsx(
    prefix,
    'lobe-highlighter',
    wrap ? 'lobe-highlighter-wrap' : 'lobe-highlighter-nowrap',
    className,
  );

export const headerStyles = (variant: Variant = 'filled') => [
  styles.header,
  variant === 'filled' && styles.headerFilled,
  variant === 'borderless' && styles.headerBorderless,
];

export const bodyStyles = (expand: boolean, variant: Variant = 'filled') => [
  styles.body,
  expand ? variant !== 'borderless' && styles.bodyDivider : styles.bodyCollapsed,
];
