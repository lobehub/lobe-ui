import type { Key, ReactNode, Ref } from 'react';
import type { FlexboxProps } from 'react-layout-kit';

interface ColorSwatchesItemType {
  color: string;
  key?: Key;
  title?: ReactNode;
}

export interface ColorSwatchesProps extends Omit<FlexboxProps, 'onChange'> {
  colors: ColorSwatchesItemType[];
  defaultValue?: string;
  enableColorPicker?: boolean;
  enableColorSwatches?: boolean;
  onChange?: (color?: string) => void;
  ref?: Ref<HTMLDivElement>;
  shape?: 'circle' | 'square';
  size?: number;
  texts?: {
    custom: string;
    presets: string;
  };
  value?: string;
}
