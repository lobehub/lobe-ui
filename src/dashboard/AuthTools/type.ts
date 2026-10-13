import type { CSSProperties } from 'react';

export type AuthThemeMode = 'auto' | 'dark' | 'light';

export interface AuthThemeSwitchProps {
  className?: string;
  /**
   * Accessible names, also shown as tooltips. Labels are visually hidden.
   * @default { auto: 'System', dark: 'Dark', light: 'Light' }
   */
  labels?: Partial<Record<AuthThemeMode, string>>;
  onChange?: (mode: AuthThemeMode) => void;
  style?: CSSProperties;
  value?: AuthThemeMode;
}

export interface AuthLocaleOption {
  label: string;
  value: string;
}

export interface AuthLocaleSwitchProps {
  /** Accessible name of the select. @default 'Language' */
  'aria-label'?: string;
  'className'?: string;
  'onChange'?: (locale: string) => void;
  'options': AuthLocaleOption[];
  'style'?: CSSProperties;
  'value'?: string;
}
