import type { CSSProperties, ReactElement } from 'react';

import type { InputSize } from '@/Input/type';

export interface ColorPickerProps {
  alpha?: boolean;
  children?: ReactElement;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (hex: string) => void;
  onChangeComplete?: (hex: string) => void;
  presets?: string[];
  showText?: boolean;
  size?: InputSize;
  style?: CSSProperties;
  value?: string;
}
