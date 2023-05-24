import { FC } from 'react';
import { createStoreUpdater } from 'zustand-utils';
import { InternalChatContext } from '../Chat/types';

import { ChatStore, useStoreApi } from '../Chat/store';

export interface StoreUpdaterProps
  extends Partial<InternalChatContext>,
    Pick<
      ChatStore,
      'onMessagesChange' | 'onAgentChange' | 'onResponseFinished' | 'onResponseStart'
    > {}

const StoreUpdater: FC<StoreUpdaterProps> = ({
  updateAt,
  createAt,
  title,
  description,
  agent,
  messages,
  onAgentChange,
  onMessagesChange,
  onResponseFinished,
  onResponseStart,
}) => {
  const useStoreUpdater = createStoreUpdater<ChatStore>(useStoreApi());

  useStoreUpdater('agent', agent);
  useStoreUpdater('onAgentChange', onAgentChange);

  useStoreUpdater('messages', messages);
  useStoreUpdater('onMessagesChange', onMessagesChange);
  useStoreUpdater('onResponseFinished', onResponseFinished);
  useStoreUpdater('onResponseStart', onResponseStart);

  useStoreUpdater('title', title);
  useStoreUpdater('description', description);

  useStoreUpdater('createAt', createAt);
  useStoreUpdater('updateAt', updateAt);

  return null;
};

export default StoreUpdater;
