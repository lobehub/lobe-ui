import { CSSProperties } from 'react';
import { FlexboxProps } from 'react-layout-kit';

import type { ButtonProps } from '@/Button';
import type { CodeEditorProps } from '@/CodeEditor';

export interface MessageInputProps extends FlexboxProps {
  classNames?: CodeEditorProps['classNames'] & {
    editor?: string;
  };
  defaultValue?: string;
  editButtonSize?: ButtonProps['size'];
  onCancel?: () => void;
  onConfirm?: (text: string) => void;
  placeholder?: string;
  renderButtons?: (text: string) => ButtonProps[];
  shortcut?: boolean;
  styles?: CodeEditorProps['styles'] & {
    editor?: CSSProperties;
  };
  text?: {
    cancel?: string;
    confirm?: string;
  };
  variant?: CodeEditorProps['variant'];
}
