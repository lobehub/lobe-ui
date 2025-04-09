import { type ReactNode } from 'react';

import ChatHeaderParent from './ChatHeader';
import ChatHeaderTitle from './ChatHeaderTitle';
import type { ChatHeaderProps } from './type';

interface IChatHeader {
  (props: ChatHeaderProps): ReactNode;
  Title: typeof ChatHeaderTitle;
}

const ChatHeader = ChatHeaderParent as unknown as IChatHeader;

ChatHeader.Title = ChatHeaderTitle;

export default ChatHeader;
export { default as ChatHeaderTitle } from './ChatHeaderTitle';
export type * from './type';
