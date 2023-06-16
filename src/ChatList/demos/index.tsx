import { ChatList, ChatListProps, StroyBook, useControls, useCreateStore } from '@lobehub/ui';

import { data } from './data';

export default () => {
  const store = useCreateStore();
  const control: ChatListProps | any = useControls(
    {
      showTitle: false,
      type: {
        options: ['doc', 'chat'],
        value: 'chat',
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
