import type { CSSProperties,FocusEventHandler  } from 'react';

export interface HotkeyInputProps {
  allowClear?: boolean;
  allowReset?: boolean;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  hotkeyConflicts?: string[];
  isApple?: boolean;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onChange?: (value: string) => void;
  onClear?: (currentValue: string) => void;
  onConflict?: (conflictKey: string) => void;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onReset?: (currentValue: string, resetValue: string) => void;
  placeholder?: string;
  resetValue?: string;
  shadow?: boolean;
  style?: CSSProperties;
  texts?: {
    clear?: string;
    conflicts?: string;
    invalidCombination?: string;
    reset?: string;
  };
  value?: string;
  variant?: 'filled' | 'borderless' | 'outlined';
}
