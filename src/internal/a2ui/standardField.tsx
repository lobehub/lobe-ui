'use client';

import * as stylex from '@stylexjs/stylex';
import type { CSSProperties, ReactNode } from 'react';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';

import { a2uiStyles } from './styles';
import { a2ui } from './tokens.stylex';

/**
 * Shared look of the `a2ui` input variants that follow the CopilotKit Gen UI 2.0 standard
 * catalog (`@copilotkit/react-core` v2 `generative-ui/standard/inputs.tsx` and
 * `@copilotkit/shared` `generative-ui/standard/styles.ts`, MIT): the field (label over the control),
 * the 40px pill control, the focus ring and the 36px pill button.
 *
 * Sizes keep the standard's units: type in `em` of the surrounding text (the standard inherits the
 * host font size; 16px in the playground), control geometry in px.
 */

/** `[data-a2ui-input]:focus-visible`: 2px focus outline, 1px off the control. */
const focusOutline = {
  outlineColor: { 'default': null, ':focus-visible': a2ui.info },
  outlineOffset: { 'default': null, ':focus-visible': 1 },
  outlineStyle: { 'default': null, ':focus-visible': 'solid' },
  outlineWidth: { 'default': null, ':focus-visible': 2 },
} as const;

export const a2uiFieldStyles = stylex.create({
  /** Inherit the host size: the standard's type is in `em`. */
  base: {
    fontSize: 'inherit',
  },
  /** `controlStyle(size xl, pill)`: 40px, 18px side padding, 1em text, pill. */
  control: {
    borderColor: a2ui.input,
    borderRadius: 9999,
    borderStyle: 'solid',
    borderWidth: 1,
    paddingBlock: 0,
    paddingInline: 18,
    backgroundColor: a2ui.surface,
    boxSizing: 'border-box',
    color: a2ui.fg,
    fontFamily: 'inherit',
    fontSize: '1em',
    maxWidth: '100%',
    minHeight: 40,
    minWidth: 0,
    width: '100%',
  },
  /** Disabled control (`opacity: .5`). */
  controlDisabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  /** The control is the focusable element itself. */
  controlFocus: focusOutline,
  /** The control wraps the focusable element (lobe `Input`, `Select` trigger). */
  controlFocusWithin: {
    outlineColor: { 'default': null, ':has(:focus-visible)': a2ui.info },
    outlineOffset: { 'default': null, ':has(:focus-visible)': 1 },
    outlineStyle: { 'default': null, ':has(:focus-visible)': 'solid' },
    outlineWidth: { 'default': null, ':has(:focus-visible)': 2 },
  },
  controlInvalid: {
    borderColor: cssVar.colorError,
  },
  /** `CheckError`: the failed check under a control. */
  error: {
    color: cssVar.colorErrorText,
    fontSize: '0.875em',
    lineHeight: 1.429,
  },
  /** `Field`: label over control, 8px apart, full width. */
  field: {
    gap: 8,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    width: '100%',
  },
  /** `FIELD_LABEL_STYLE`: `textFont("sm")`, medium, secondary text. */
  label: {
    margin: 0,
    padding: 0,
    color: a2ui.fgMuted,
    display: 'block',
    fontSize: '0.875em',
    fontWeight: 500,
    lineHeight: 1.429,
  },
  /** Label and an end slot (e.g. the slider value) on one row. */
  labelRow: {
    gap: 8,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    minWidth: 0,
  },
  /** `[data-a2ui-input]::placeholder`: tertiary text. */
  placeholder: {
    '::placeholder': {
      color: cssVar.colorTextTertiary,
      opacity: 1,
    },
  },
});

export interface A2uiFieldProps {
  children?: ReactNode;
  className?: string;
  /** Text under the control, e.g. a validation message. */
  error?: ReactNode;
  /** Makes the label a `<label for>` of this control id. */
  htmlFor?: string;
  label?: ReactNode;
  /** Shown at the end of the label row. */
  labelEnd?: ReactNode;
  /** Id of the label when it is a plain text a group points to (`aria-labelledby`). */
  labelId?: string;
  style?: CSSProperties;
}

/**
 * `Field` of the standard catalog: the label above the control, 8px apart. Without a `label` the
 * control renders on its own, so a variant can always go through it.
 */
export const A2uiField = ({
  children,
  className,
  error,
  htmlFor,
  label,
  labelEnd,
  labelId,
  style,
}: A2uiFieldProps) => {
  const hasLabel = label !== undefined && label !== null && label !== '';
  if (!hasLabel && labelEnd === undefined && error === undefined) return <>{children}</>;
  const labelNode = hasLabel ? (
    htmlFor === undefined ? (
      <span id={labelId} {...styleProps(a2uiFieldStyles.label)}>
        {label}
      </span>
    ) : (
      <label htmlFor={htmlFor} id={labelId} {...styleProps(a2uiFieldStyles.label)}>
        {label}
      </label>
    )
  ) : null;
  return (
    <div
      {...styleProps(
        [a2uiStyles.base, a2uiFieldStyles.base, a2uiFieldStyles.field],
        className,
        style,
      )}
    >
      {labelEnd === undefined ? (
        labelNode
      ) : (
        <div {...styleProps(a2uiFieldStyles.labelRow)}>
          {labelNode ?? <span />}
          {labelEnd}
        </div>
      )}
      {children}
      {error === undefined || error === null ? null : (
        <span role="alert" {...styleProps(a2uiFieldStyles.error)}>
          {error}
        </span>
      )}
    </div>
  );
};

// `Button` of the standard catalog at its default size `lg`: a 36px pill, 16px side padding,
// `.875em` medium text.
export const a2uiStandardButtonStyles = stylex.create({
  default: {
    borderColor: a2ui.line,
    backgroundColor: {
      'default': 'transparent',
      ':hover:not(:disabled)': a2ui.overlay4,
    },
    color: a2ui.fg,
  },
  primary: {
    borderColor: 'transparent',
    backgroundColor: {
      'default': a2ui.accent,
      ':hover:not(:disabled)': `color-mix(in srgb, ${a2ui.accent} 88%, transparent)`,
    },
    color: a2ui.primaryFg,
  },
  root: {
    ...focusOutline,
    borderRadius: 9999,
    borderStyle: 'solid',
    borderWidth: 1,
    gap: 6,
    paddingBlock: 0,
    paddingInline: 16,
    alignItems: 'center',
    boxSizing: 'border-box',
    cursor: { 'default': 'pointer', ':disabled': 'not-allowed' },
    display: 'inline-flex',
    fontFamily: 'inherit',
    fontSize: '0.875em',
    fontWeight: 500,
    justifyContent: 'center',
    lineHeight: 1,
    maxWidth: '100%',
    minHeight: 36,
    opacity: { 'default': null, ':disabled': 0.5 },
  },
});
