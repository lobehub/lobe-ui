import { memo, useRef } from 'react';

import { Provider, createChatStore } from '@/Chat/store';

import ChatContainer, { AppProps } from './App';
import StoreUpdater, { StoreUpdaterProps } from './StoreUpdater';

export interface ConversationProps extends StoreUpdaterProps, AppProps {
  /**
   * @description Whether to enable devtools or not
   * @default false
   */
  devtools?: boolean;
}

const Conversation = memo<ConversationProps>(({ readonly, devtools, includeSystem, ...res }) => {
  const reference = useRef(() => createChatStore(devtools));

  return (
    <Provider createStore={reference.current}>
      <ChatContainer includeSystem={includeSystem} readonly={readonly} />
      <StoreUpdater {...res} />
    </Provider>
  );
});

export default Conversation;
