import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';

import { inputMarker } from './marker.stylex';
import type { InputSize, InputVariant } from './type';

const disabled = ':is([data-disabled], :has(:disabled))';
const hover = ':hover:not(:focus-within, [data-disabled])';
const invalid = ":has([data-invalid], [aria-invalid='true'])";
const invalidIdle =
  ":has([data-invalid], [aria-invalid='true']):is(:focus-within, :not(:hover), [data-disabled])";
const invalidFocus = ":has([data-invalid], [aria-invalid='true']):focus-within";
const validFocus = ":focus-within:not(:has([data-invalid], [aria-invalid='true']))";

const lobeShadow = `0 1px 0 -1px ${cssVar.colorBorder}, 0 1px 2px -0.5px ${cssVar.colorBorder}, 0 2px 2px -1px ${cssVar.colorBorderSecondary}, 0 3px 6px -4px ${cssVar.colorBorderSecondary}`;
const primaryRing = `0 0 0 2px ${cssVar.colorPrimaryBg}`;
const errorRing = `0 0 0 2px ${cssVar.colorErrorBg}`;

export const styles = stylex.create({
  borderless: {
    borderColor: { default: 'transparent', [invalid]: cssVar.colorError },
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    boxShadow: { default: null, [invalidFocus]: errorRing },
  },
  clear: {
    padding: 0,
    borderColor: 'currentcolor',
    borderRadius: '50%',
    borderStyle: 'none',
    borderWidth: 0,
    flex: 'none',
    alignItems: 'center',
    backgroundColor: {
      'default': cssVar.colorTextQuaternary,
      ':hover': cssVar.colorTextTertiary,
    },
    color: cssVar.colorBgContainer,
    cursor: 'pointer',
    display: 'inline-flex',
    justifyContent: 'center',
    visibility: {
      default: 'hidden',
      [stylex.when.ancestor(':focus-within', inputMarker)]: 'visible',
      [stylex.when.ancestor(':hover', inputMarker)]: 'visible',
    },
    height: 16,
    width: 16,
  },
  count: {
    borderRadius: 999,
    paddingInline: 8,
    alignItems: 'center',
    backgroundColor: {
      'default': cssVar.colorFillTertiary,
      ':is([data-over])': cssVar.colorError,
    },
    color: {
      'default': cssVar.colorTextSecondary,
      ':is([data-over])': cssVar.colorWhite,
    },
    display: 'inline-flex',
    fontSize: 11,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 600,
    insetBlockEnd: 6,
    insetInlineEnd: 8,
    pointerEvents: 'none',
    position: 'absolute',
    height: 20,
  },
  filled: {
    borderColor: { default: 'transparent', [invalid]: cssVar.colorError },
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: {
      default: cssVar.colorFillTertiary,
      [hover]: cssVar.colorFillSecondary,
    },
    boxShadow: { default: null, [invalidFocus]: errorRing },
  },
  input: {
    'font': 'inherit',
    'padding': 0,
    'borderColor': 'currentcolor',
    'borderStyle': 'none',
    'borderWidth': 'medium',
    'flex': '1',
    'outline': 'none',
    'appearance': 'none',
    'backgroundColor': 'transparent',
    'color': 'inherit',
    'minWidth': 0,
    '::placeholder': {
      color: cssVar.colorTextPlaceholder,
    },
  },
  numberControl: {
    margin: 0,
    padding: 0,
    borderColor: 'currentcolor',
    borderRadius: 4,
    borderStyle: 'none',
    borderWidth: 'medium',
    outline: 'none',
    transition: `color 150ms ${cssVar.motionEaseOut}, background 150ms ${cssVar.motionEaseOut}`,
    alignItems: 'center',
    backgroundColor: {
      'default': 'transparent',
      ':hover:not(:disabled)': cssVar.colorFillSecondary,
    },
    color: {
      'default': cssVar.colorTextTertiary,
      ':hover:not(:disabled)': cssVar.colorText,
    },
    cursor: { 'default': 'pointer', ':disabled': 'not-allowed' },
    display: 'flex',
    justifyContent: 'center',
    opacity: { 'default': null, ':disabled': 0.3 },
    height: 13,
    width: 20,
  },
  numberControlLarge: {
    height: 15,
    width: 22,
  },
  numberControls: {
    flex: 'none',
    display: 'flex',
    flexDirection: 'column',
    marginInlineEnd: -6,
  },
  numberControlSmall: {
    borderRadius: 3,
    height: 10,
    width: 16,
  },
  numberControlsSmall: {
    marginInlineEnd: -4,
  },
  numberInput: {
    fontVariantNumeric: 'tabular-nums',
  },
  otpCell: {
    flex: 'none',
    paddingInline: 0,
    textAlign: 'center',
    width: 32,
  },
  otpRoot: {
    gap: 8,
    alignItems: 'center',
    display: 'inline-flex',
  },
  outlined: {
    borderColor: {
      default: cssVar.colorBorderSecondary,
      [hover]: cssVar.colorBorder,
      [invalidIdle]: cssVar.colorError,
      [validFocus]: cssVar.colorPrimary,
    },
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: cssVar.colorBgContainer,
    boxShadow: { default: null, [invalidFocus]: errorRing, [validFocus]: primaryRing },
  },
  passwordToggle: {
    margin: 0,
    padding: 0,
    borderColor: 'currentcolor',
    borderStyle: 'none',
    borderWidth: 'medium',
    outline: 'none',
    transition: `color 150ms ${cssVar.motionEaseOut}`,
    alignItems: 'center',
    backgroundColor: 'transparent',
    color: { 'default': cssVar.colorTextTertiary, ':hover': cssVar.colorText },
    cursor: 'pointer',
    display: 'inline-flex',
    justifyContent: 'center',
  },
  root: {
    borderRadius: cssVar.borderRadius,
    gap: 8,
    paddingInline: 12,
    transition: `background 150ms ${cssVar.motionEaseOut}, border-color 150ms ${cssVar.motionEaseOut}, box-shadow 150ms ${cssVar.motionEaseOut}`,
    alignItems: 'center',
    boxSizing: 'border-box',
    color: { default: cssVar.colorText, [disabled]: cssVar.colorTextQuaternary },
    cursor: { default: 'text', [disabled]: 'not-allowed' },
    display: 'inline-flex',
    fontSize: 14,
    opacity: { default: null, [disabled]: 0.66 },
    width: '100%',
  },
  shadow: {
    boxShadow: { default: lobeShadow, [invalidFocus]: errorRing },
  },
  shadowOutlined: {
    boxShadow: { default: lobeShadow, [invalidFocus]: errorRing, [validFocus]: primaryRing },
  },
  sizeLarge: {
    borderRadius: cssVar.borderRadiusLG,
    fontSize: 16,
    minHeight: 40,
  },
  sizeMiddle: {
    minHeight: 32,
  },
  sizeSmall: {
    borderRadius: cssVar.borderRadiusSM,
    paddingInline: 8,
    fontSize: 12,
    minHeight: 24,
  },
  slot: {
    flex: 'none',
    alignItems: 'center',
    color: cssVar.colorTextTertiary,
    display: 'inline-flex',
  },
  textarea: {
    paddingBlock: 8,
    position: 'relative',
    height: 'auto',
  },
  textareaAutoSize: {
    fieldSizing: 'content',
  },
  textareaClear: {
    insetBlockStart: 10,
    insetInlineEnd: 10,
    position: 'absolute',
  },
  textareaControl: {
    lineHeight: 1.5,
    resize: 'none',
    maxHeight: 'var(--textarea-max-height, none)',
    minHeight: 'calc(1.5em * var(--textarea-min-rows, 2))',
  },
  textareaResize: {
    resize: 'vertical',
  },
  textareaWithCount: {
    paddingBlockEnd: 30,
  },
});

const sizeStyles = {
  large: styles.sizeLarge,
  middle: styles.sizeMiddle,
  small: styles.sizeSmall,
};

const variantStyles = {
  borderless: styles.borderless,
  filled: styles.filled,
  outlined: styles.outlined,
};

interface RootOptions {
  shadow?: boolean | null;
  size?: InputSize | null;
  variant?: InputVariant | null;
}

export const inputRootStyles = ({ shadow, size, variant }: RootOptions = {}) => {
  const mergedVariant = variant || 'outlined';
  return [
    inputMarker,
    styles.root,
    sizeStyles[size || 'middle'],
    variantStyles[mergedVariant],
    shadow && (mergedVariant === 'outlined' ? styles.shadowOutlined : styles.shadow),
  ];
};

export const rootVariants = (options?: RootOptions) =>
  stylex.props(inputRootStyles(options)).className ?? '';

const className = (style: Parameters<typeof styleProps>[0]) => styleProps(style).className;

export const inputClassNames = {
  borderless: className(styles.borderless),
  clear: className(styles.clear),
  count: className(styles.count),
  filled: className(styles.filled),
  input: className(styles.input),
  invalid: '',
  numberControl: className(styles.numberControl),
  numberControlLarge: className(styles.numberControlLarge),
  numberControls: className(styles.numberControls),
  numberControlSmall: className(styles.numberControlSmall),
  numberControlsSmall: className(styles.numberControlsSmall),
  numberInput: className(styles.numberInput),
  otpCell: className(styles.otpCell),
  otpRoot: className(styles.otpRoot),
  outlined: className(styles.outlined),
  passwordToggle: className(styles.passwordToggle),
  root: className([inputMarker, styles.root]),
  shadow: className(styles.shadow),
  sizeLarge: className(styles.sizeLarge),
  sizeMiddle: className(styles.sizeMiddle),
  sizeSmall: className(styles.sizeSmall),
  slot: className(styles.slot),
  textarea: className(styles.textarea),
  textareaAutoSize: className(styles.textareaAutoSize),
  textareaClear: className(styles.textareaClear),
  textareaResize: className(styles.textareaResize),
  textareaWithCount: className(styles.textareaWithCount),
};
