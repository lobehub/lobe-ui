import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';

const shine = stylex.keyframes({
  '0%': { backgroundPosition: '100%' },
  '100%': { backgroundPosition: '-100%' },
});

export const styles = stylex.create({
  code: {
    fontFamily: cssVar.fontFamilyCode,
  },
  danger: {
    color: cssVar.colorError,
  },
  delete: {
    textDecoration: 'line-through',
  },
  disabled: {
    color: cssVar.colorTextDisabled,
    cursor: 'not-allowed',
  },
  ellipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  ellipsisMulti: {
    overflow: 'hidden',
    WebkitBoxOrient: 'vertical',
    display: '-webkit-box',
    textOverflow: 'ellipsis',
  },
  h1: {
    fontSize: `calc(${cssVar.fontSize} * 2.5)`,
    fontWeight: 'bold',
    lineHeight: 1.25,
  },
  h2: {
    fontSize: `calc(${cssVar.fontSize} * 2)`,
    fontWeight: 'bold',
    lineHeight: 1.25,
  },
  h3: {
    fontSize: `calc(${cssVar.fontSize} * 1.5)`,
    fontWeight: 'bold',
    lineHeight: 1.25,
  },
  h4: {
    fontSize: `calc(${cssVar.fontSize} * 1.25)`,
    fontWeight: 'bold',
    lineHeight: 1.25,
  },
  h5: {
    fontSize: cssVar.fontSize,
    fontWeight: 'bold',
    lineHeight: 1.25,
  },
  info: {
    color: cssVar.colorInfo,
  },
  italic: {
    fontStyle: 'italic',
  },
  mark: {
    backgroundColor: cssVar.yellow,
    color: '#000',
  },
  p: {
    marginBlock: 0,
  },
  secondary: {
    color: cssVar.colorTextDescription,
  },
  // The sweep peaks at --shiny-color. Override it to match the static text the
  // shimmering label sits next to. currentColor cannot serve here: the dimmed
  // color declared below would feed back into the sweep overlay.
  shiny: {
    '--shiny-color': cssVar.colorText,
    '--shiny-duration': '1.5s',
    'animationDuration': 'var(--shiny-duration)',
    'animationIterationCount': 'infinite',
    'animationName': shine,
    'animationTimingFunction': 'linear',
    'backgroundClip': 'text',
    'backgroundImage':
      'linear-gradient(120deg, transparent 25%, var(--shiny-color) 50%, transparent 75%)',
    'backgroundSize': '200% 100%',
    'color': 'color-mix(in srgb, var(--shiny-color) 28%, transparent)',
    'userSelect': 'none',
  },
  strong: {
    fontWeight: 'bold',
  },
  success: {
    color: cssVar.colorSuccess,
  },
  text: {
    color: cssVar.colorText,
  },
  underline: {
    textDecoration: 'underline',
  },
  warning: {
    color: cssVar.colorWarning,
  },
});

const shinyClassName = 'lobe-text-shiny';

const classNameOf = (style: Parameters<typeof styleProps>[0]) => styleProps(style).className;

export const textStyles = {
  ...(Object.fromEntries(
    Object.entries(styles).map(([key, value]) => [key, classNameOf(value)]),
  ) as Record<keyof typeof styles, string>),
  shiny: clsx(classNameOf(styles.shiny), shinyClassName),
};

export const groupStyles = {
  shinyGroup: 'lobe-text-shiny-group',
};

type TextVariantProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | null;
  class?: string;
  className?: string;
  code?: boolean | null;
  delete?: boolean | null;
  disabled?: boolean | null;
  ellipsis?: 'multi' | boolean | null;
  italic?: boolean | null;
  mark?: boolean | null;
  shiny?: boolean | null;
  strong?: boolean | null;
  type?: 'danger' | 'info' | 'secondary' | 'success' | 'warning' | null;
  underline?: boolean | null;
};

export const textStyleArray = (props: TextVariantProps = {}) => [
  styles.text,
  props.as && styles[props.as],
  props.code && styles.code,
  props.delete && styles.delete,
  props.disabled && styles.disabled,
  props.ellipsis === 'multi' && styles.ellipsisMulti,
  props.ellipsis === true && styles.ellipsis,
  props.italic && styles.italic,
  props.mark && styles.mark,
  props.shiny && styles.shiny,
  props.strong && styles.strong,
  props.type && styles[props.type],
  props.underline && styles.underline,
];

export const variants = (props: TextVariantProps = {}) =>
  clsx(
    classNameOf(textStyleArray(props)),
    props.shiny && shinyClassName,
    props.class,
    props.className,
  );
