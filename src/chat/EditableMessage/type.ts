import type { CSSProperties } from 'react';

import type { MarkdownProps } from '@/Markdown';
import type { MessageInputProps } from '@/chat/MessageInput';
import type { MessageModalProps } from '@/chat/MessageModal';

export interface EditableMessageProps {
  className?: string;
  classNames?: MessageInputProps['classNames'] & {
    input?: string;
    markdown?: string;
  };
  defaultValue?: string;
  editButtonSize?: MessageInputProps['editButtonSize'];
  editing?: boolean;
  fontSize?: number;
  fullFeaturedCodeBlock?: boolean;
  height?: MessageInputProps['height'];
  language?: MessageInputProps['language'];
  markdownProps?: Omit<MarkdownProps, 'className' | 'style' | 'children'>;
  model?: {
    extra?: MessageModalProps['extra'];
    footer?: MessageModalProps['footer'];
  };
  onChange?: (value: string) => void;
  onEditingChange?: (editing: boolean) => void;
  onOpenChange?: (open: boolean) => void;
  openModal?: boolean;
  placeholder?: string;
  showEditWhenEmpty?: boolean;
  style?: CSSProperties;
  styles?: MessageInputProps['styles'] & {
    input?: CSSProperties;
    markdown?: CSSProperties;
  };
  text?: MessageModalProps['text'];
  value: string;
  variant?: MessageInputProps['variant'];
}
