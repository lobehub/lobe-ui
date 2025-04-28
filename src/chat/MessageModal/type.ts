import type { ReactNode } from 'react';

import type { ModalProps } from '@/Modal';
import type { MessageInputProps } from '@/chat/MessageInput';

export interface MessageModalProps extends Pick<ModalProps, 'open' | 'footer' | 'panelRef'> {
  editing?: boolean;
  extra?: ReactNode;
  height?: MessageInputProps['height'];
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
