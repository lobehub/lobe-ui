import type { CSSProperties } from 'react';

import type { ButtonProps } from '@/Button';
import type { CodeEditorProps } from '@/CodeEditor';
import type { DivProps } from '@/types';

export interface MessageInputProps extends DivProps {
  className?: string;
  classNames?: CodeEditorProps['classNames'];
  defaultValue?: string;
  editButtonSize?: ButtonProps['size'];
  height?: number | 'auto' | string;
  onCancel?: () => void;
  onConfirm?: (text: string) => void;
  placeholder?: string;
  renderButtons?: (text: string) => ButtonProps[];
  shortcut?: boolean;
  text?: {
    cancel?: string;
    confirm?: string;
  };
  textareaClassname?: string;
  textareaStyle?: CSSProperties;
  variant?: CodeEditorProps['variant'];
}
