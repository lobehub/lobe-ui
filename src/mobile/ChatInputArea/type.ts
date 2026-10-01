import type { CSSProperties, MouseEventHandler, ReactNode, Ref } from 'react';

import type { ButtonProps } from '@/base-ui/Button';
import type { ChatInputAreaInnerProps } from '@/chat/ChatInputArea';

export interface ChatInputAreaProps extends ChatInputAreaInnerProps {
  bottomAddons?: ReactNode;
  expand?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
  safeArea?: boolean;
  setExpand?: (expand: boolean) => void;
  style?: CSSProperties;
  textAreaLeftAddons?: ReactNode;
  textAreaRightAddons?: ReactNode;
  topAddons?: ReactNode;
}

export interface ChatSendButtonProps extends Omit<ButtonProps, 'onClick'> {
  onSend?: MouseEventHandler<HTMLElement>;
  onStop?: MouseEventHandler<HTMLElement>;
}
