import { type ReactNode } from 'react';

import { type ModalComponentProps } from '@/base-ui/Modal';
import { type MessageInputProps } from '@/chat/MessageInput';

export interface MessageModalProps extends Pick<ModalComponentProps, 'open' | 'footer'> {
  editing?: boolean;
  extra?: ReactNode;
  height?: MessageInputProps['height'];
  language?: MessageInputProps['language'];
  onChange?: (text: string) => void;
  onEditingChange?: (editing: boolean) => void;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  text?: {
    cancel?: string;
    confirm?: string;
    edit?: string;
    title?: string;
  };
  /**
   * @description The value of the message content
   */
  value: string;
}
