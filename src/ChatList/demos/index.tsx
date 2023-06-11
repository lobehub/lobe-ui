import { ChatList, ChatListProps, StroyBook, useControls, useCreateStore } from '@lobehub/ui';

import { data } from './data';

export default () => {
  const store = useCreateStore();
  const control: ChatListProps | any = useControls(
    {
      type: {
        value: 'chat',
        options: ['doc', 'chat'],
      },
    },
    { store },
  );

  return (
    <StroyBook levaStore={store}>
      <ChatList data={data} {...control} />
    </StroyBook>
  );
};
