import { FC } from 'react';
import { createStoreUpdater } from 'zustand-utils';

import { ChatStore, useStoreApi } from '../Chat/store';
import { InternalChatContext } from '../Chat/types';

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
  messages,
  onAgentChange,
  onMessagesChange,
  onResponseFinished,
  onResponseStart,
}) => {
  const useStoreUpdater = createStoreUpdater<ChatStore>(useStoreApi());

  useStoreUpdater('onAgentChange', onAgentChange);

  useStoreUpdater('messages', messages);
  useStoreUpdater('onMessagesChange', onMessagesChange);
  useStoreUpdater('onResponseFinished', onResponseFinished);
  useStoreUpdater('onResponseStart', onResponseStart);

  useStoreUpdater('title', title);
  useStoreUpdater('description', description);

  useStoreUpdater('createAt', createAt);
  useStoreUpdater('updateAt', updateAt);

  return false;
};

export default StoreUpdater;
