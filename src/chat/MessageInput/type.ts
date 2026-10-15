import type { CSSProperties } from 'react';

import type { ButtonProps } from '@/Button';
import type { CodeEditorProps } from '@/CodeEditor';
import type { FlexboxProps } from '@/Flex';

export interface MessageInputProps extends FlexboxProps {
  classNames?: CodeEditorProps['classNames'] & {
    editor?: string;
  };
  defaultValue?: string;
  editButtonSize?: ButtonProps['size'];
  language?: CodeEditorProps['language'];
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
