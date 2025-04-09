import type { FlexboxProps } from 'react-layout-kit';

import type { ControlInputProps } from '@/EditableText/ControlInput';

export interface EditableTextProps extends Omit<FlexboxProps, 'onChange'> {
  editing?: boolean;
  inputProps?: Omit<ControlInputProps, 'onChange' | 'value'>;
  onChange?: ControlInputProps['onChange'];
  onEditingChange?: (editing: boolean) => void;
  showEditIcon?: boolean;
  value?: ControlInputProps['value'];
}
