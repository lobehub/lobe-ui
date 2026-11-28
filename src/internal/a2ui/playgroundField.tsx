'use client';

import * as stylex from '@stylexjs/stylex';
import type { CSSProperties, ReactNode } from 'react';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';

import { a2uiStyles } from './styles';
import { a2ui } from './tokens.stylex';

/**
 * The field wrapper of the A2UI playground's own inputs (ButtonGroup, ChipSelect, Combobox,
 * DatePicker): a 12.5px label with an optional right slot, the control, and an 11px hint.
 * Adapted from CopilotKit a2ui-playground (MIT), `renderers/inputs.tsx` `Field`.
 *
 * `variant="default"` keeps the same structure in lobe-ui's form type (body-size label, the
 * description colour for the hint), for the plain variant of the new input components.
 */
const styles = stylex.create({
  dHint: {
    color: cssVar.colorTextDescription,
    fontSize: cssVar.fontSizeSM,
  },
  dLabel: {
    color: cssVar.colorText,
    fontSize: cssVar.fontSize,
    fontWeight: 500,
  },
  dRoot: {
    gap: 8,
    fontFamily: cssVar.fontFamily,
    lineHeight: cssVar.lineHeight,
  },
  head: {
    gap: 12,
    alignItems: 'baseline',
    display: 'flex',
    justifyContent: 'space-between',
    minWidth: 0,
  },
  hint: {
    margin: 0,
    color: a2ui.fgMuted,
    fontSize: 11,
  },
  label: {
    overflow: 'hidden',
    color: a2ui.fg90,
    cursor: 'default',
    fontSize: 12.5,
    fontWeight: 500,
    textOverflow: 'ellipsis',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    minWidth: 0,
  },
  root: {
    gap: 6,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    width: '100%',
  },
});

export interface PlaygroundFieldProps {
  children: ReactNode;
  className?: string;
  hint?: ReactNode;
  /** Id of the control the label points at. */
  htmlFor?: string;
  label?: ReactNode;
  /** Class of the label element. */
  labelClassName?: string;
  /** Inline style of the label element. */
  labelStyle?: CSSProperties;
  /** Shown on the right of the label row, e.g. "2 selected". */
  right?: ReactNode;
  /** Class of the right slot. */
  rightClassName?: string;
  style?: CSSProperties;
  variant?: 'default' | 'a2ui';
}

const PlaygroundField = ({
  children,
  className,
  hint,
  htmlFor,
  label,
  labelClassName,
  labelStyle,
  right,
  rightClassName,
  style,
  variant = 'a2ui',
}: PlaygroundFieldProps) => {
  const isA2ui = variant === 'a2ui';
  return (
    <div
      {...styleProps(
        isA2ui ? [a2uiStyles.base, styles.root] : [styles.root, styles.dRoot],
        className,
        style,
      )}
    >
      {label != null || right != null ? (
        <div {...styleProps(styles.head)}>
          {label == null ? (
            <span />
          ) : (
            <label
              htmlFor={htmlFor}
              {...styleProps([styles.label, !isA2ui && styles.dLabel], labelClassName, labelStyle)}
            >
              {label}
            </label>
          )}
          {right == null ? null : <span className={rightClassName}>{right}</span>}
        </div>
      ) : null}
      {children}
      {hint == null ? null : <p {...styleProps([styles.hint, !isA2ui && styles.dHint])}>{hint}</p>}
    </div>
  );
};

export default PlaygroundField;
