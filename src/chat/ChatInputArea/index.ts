import { type ReactNode } from 'react';

import ChatInputAreaParent from './ChatInputArea';
import ChatInputActionBar from './components/ChatInputActionBar';
import ChatInputAreaInner from './components/ChatInputAreaInner';
import ChatSendButton from './components/ChatSendButton';
import type { ChatInputAreaProps } from './type';

interface IChatHeader {
  (props: ChatInputAreaProps): ReactNode;
  ActionBar: typeof ChatInputActionBar;
  Inner: typeof ChatInputAreaInner;
  SendButton: typeof ChatSendButton;
}

const ChatInputArea = ChatInputAreaParent as unknown as IChatHeader;

ChatInputArea.Inner = ChatInputAreaInner;
ChatInputArea.ActionBar = ChatInputActionBar;
ChatInputArea.SendButton = ChatSendButton;

export default ChatInputArea;
export { default as ChatInputActionBar } from './components/ChatInputActionBar';
export { default as ChatInputAreaInner } from './components/ChatInputAreaInner';
export { default as ChatSendButton } from './components/ChatSendButton';
export type * from './type';
