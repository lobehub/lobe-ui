import type { CSSProperties, ReactElement } from 'react';

import type { InputSize } from '@/Input/type';

export type ColorPickerFormat = 'hex' | 'rgb' | 'hsl';

export type ColorPickerTrigger = 'swatch' | 'field' | 'chip';

export interface ColorPickerProps {
  alpha?: boolean;
  children?: ReactElement;
  className?: string;
  defaultFormat?: ColorPickerFormat;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (hex: string) => void;
  onChangeComplete?: (hex: string) => void;
  presets?: string[];
  /**
   * Show the colours committed in this session under a Recent tab. Defaults to `true`.
   */
  recent?: boolean;
  /**
   * Same as `trigger="field"`.
   */
  showText?: boolean;
  size?: InputSize;
  style?: CSSProperties;
  /**
   * `swatch` (default) is a colour tile; `field` is an input-like control with the hex,
   * alpha and a caret; `chip` is a rounded pill for toolbars.
   */
  trigger?: ColorPickerTrigger;
  value?: string;
}
