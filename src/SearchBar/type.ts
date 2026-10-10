import type { CSSProperties } from 'react';

import type { InputProps } from '@/Input';

export interface SearchBarProps extends Omit<InputProps, 'styles' | 'classNames'> {
  classNames?: {
    input?: string;
    shortKey?: string;
  };
  defaultValue?: string;
  enableShortKey?: boolean;
  loading?: boolean;
  onInputChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  shortKey?: string;
  spotlight?: boolean;
  styles?: {
    input?: CSSProperties;
    shortKey?: CSSProperties;
  };
  value?: string;
}
