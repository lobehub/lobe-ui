import type { Key, ReactNode, Ref } from 'react';

import type { FlexboxProps } from '@/Flex';

interface ColorSwatchesItemType {
  color: string;
  key?: Key;
  title?: ReactNode;
}

export interface ColorSwatchesPickerRenderProps {
  active: boolean;
  onChange: (color?: string) => void;
  presets: string[];
  shape: 'circle' | 'square';
  size: number;
  value?: string;
}

export interface ColorSwatchesProps extends Omit<FlexboxProps, 'onChange'> {
  colors: ColorSwatchesItemType[];
  defaultValue?: string;
  enableColorPicker?: boolean;
  enableColorSwatches?: boolean;
  onChange?: (color?: string) => void;
  ref?: Ref<HTMLDivElement>;
  renderPicker?: (props: ColorSwatchesPickerRenderProps, defaultPicker: ReactNode) => ReactNode;
  shape?: 'circle' | 'square';
  size?: number;
  texts?: {
    custom: string;
    presets: string;
  };
  value?: string;
}
