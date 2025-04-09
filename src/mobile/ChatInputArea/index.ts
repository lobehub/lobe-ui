import { type ReactNode } from 'react';

import ChatInputAreaParent from './ChatInputArea';
import ChatSendButton from './components/ChatSendButton';
import type { ChatInputAreaProps } from './type';

interface IChatHeader {
  (props: ChatInputAreaProps): ReactNode;
  SendButton: typeof ChatSendButton;
}

const ChatInputArea = ChatInputAreaParent as unknown as IChatHeader;

ChatInputArea.SendButton = ChatSendButton;

export default ChatInputArea;
export { default as ChatSendButton } from './components/ChatSendButton';
export type * from './type';
