import type { InputProps } from 'antd';
import type { CSSProperties } from 'react';

export interface HotkeyInputProps {
  allowClear?: boolean;
  allowReset?: boolean;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  hotkeyConflicts?: string[];
  isApple?: boolean;
  onBlur?: InputProps['onBlur'];
  onChange?: (value: string) => void;
  onClear?: (currentValue: string) => void;
  onConflict?: (conflictKey: string) => void;
  onFocus?: InputProps['onFocus'];
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
