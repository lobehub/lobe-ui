import { CSSProperties } from 'react';

import type { ControlInputProps } from '@/EditableText/ControlInput';
import type { FlexboxProps } from '@/Flex';

export interface EditableTextProps
  extends
    Omit<FlexboxProps, 'onChange' | 'onBlur' | 'onFocus'>,
    Pick<
      ControlInputProps,
      | 'onChange'
      | 'value'
      | 'onChangeEnd'
      | 'onValueChanging'
      | 'texts'
      | 'variant'
      | 'onBlur'
      | 'onFocus'
      | 'size'
    > {
  className?: string;
  classNames?: {
    container?: string;
    input?: string;
  };
  editing?: boolean;
  inputProps?: Omit<
    ControlInputProps,
    | 'onChange'
    | 'value'
    | 'onChangeEnd'
    | 'onValueChanging'
    | 'texts'
    | 'className'
    | 'style'
    | 'onBlur'
    | 'onFocus'
    | 'size'
  >;

  onEditingChange?: (editing: boolean) => void;

  showEditIcon?: boolean;
  style?: CSSProperties;
  styles?: {
    container?: CSSProperties;
    input?: CSSProperties;
  };
}
