import type { TextAreaRef } from 'antd/es/input/TextArea';
import type { CSSProperties, ReactNode, Ref } from 'react';

import type { ButtonProps } from '@/Button';
import type { ChatInputAreaInnerProps } from '@/chat/ChatInputArea';

export interface ChatInputAreaProps extends ChatInputAreaInnerProps {
  bottomAddons?: ReactNode;
  expand?: boolean;
  ref?: Ref<TextAreaRef>;
  safeArea?: boolean;
  setExpand?: (expand: boolean) => void;
  style?: CSSProperties;
  textAreaLeftAddons?: ReactNode;
  textAreaRightAddons?: ReactNode;
  topAddons?: ReactNode;
}

export interface ChatSendButtonProps extends Omit<ButtonProps, 'onClick'> {
  onSend?: ButtonProps['onClick'];
  onStop?: ButtonProps['onClick'];
}
