import type { InputProps } from 'antd';
import type { CSSProperties } from 'react';

export interface HotkeyInputProps {
  allowReset?: boolean;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  hotkeyConflicts?: string[];
  isApple?: boolean;
  onBlur?: InputProps['onBlur'];
  onChange?: (value: string) => void;
  onConflict?: (conflictKey: string) => void;
  onFocus?: InputProps['onFocus'];
  onReset?: (currentValue: string, resetValue: string) => void;
  placeholder?: string;
  resetValue?: string;
  shadow?: boolean;
  style?: CSSProperties;
  texts?: {
    conflicts?: string;
    invalidCombination?: string;
    reset?: string;
  };
  value?: string;
  variant?: 'filled' | 'borderless' | 'outlined';
}
