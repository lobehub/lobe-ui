'use client';

import * as stylex from '@stylexjs/stylex';
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { a2uiStyles } from './styles';
import { a2ui } from './tokens.stylex';

/** An action an `a2ui` variant draws as its own small button. */
export interface A2uiActionConfig {
  disabled?: boolean;
  /** Button text. */
  label: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const isA2uiActionConfig = (value: unknown): value is A2uiActionConfig =>
  !!value &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  'label' in value &&
  !('$$typeof' in value);

// Adapted from CopilotKit a2ui-playground (MIT): shadcn `Button` at `size="sm"`.
const styles = stylex.create({
  primary: {
    backgroundColor: {
      'default': a2ui.primary,
      ':hover:not(:disabled)': `color-mix(in oklab, ${a2ui.primary} 80%, transparent)`,
    },
    color: a2ui.primaryFg,
  },
  root: {
    borderColor: 'transparent',
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    gap: 4,
    paddingBlock: 0,
    paddingInline: 10,
    transitionDuration: '150ms',
    transitionProperty: 'all',
    alignItems: 'center',
    backgroundClip: 'padding-box',
    boxShadow: { 'default': null, ':focus-visible': `0 0 0 3px ${a2ui.ring}` },
    cursor: { 'default': 'pointer', ':disabled': 'default' },
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: '0.8rem',
    fontWeight: 500,
    justifyContent: 'center',
    lineHeight: 1.5,
    opacity: { 'default': null, ':disabled': 0.5 },
    outline: 'none',
    pointerEvents: { 'default': null, ':disabled': 'none' },
    transform: { 'default': null, ':active:not(:disabled)': 'translateY(1px)' },
    userSelect: 'none',
    whiteSpace: 'nowrap',
    height: 28,
  },
  secondary: {
    backgroundColor: {
      'default': a2ui.secondary,
      ':hover:not(:disabled)': `color-mix(in oklch, ${a2ui.secondary}, ${a2ui.fg} 5%)`,
    },
    color: a2ui.fg,
  },
});

export interface A2uiButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  tone?: 'primary' | 'secondary';
}

/** The small playground button the `a2ui` variants draw for an `{ label, onClick }` action. */
const A2uiButton = ({ tone = 'secondary', className, style, ...rest }: A2uiButtonProps) => (
  <button
    type="button"
    {...rest}
    {...styleProps([a2uiStyles.base, styles.root, styles[tone]], className, style)}
  />
);

export default A2uiButton;
