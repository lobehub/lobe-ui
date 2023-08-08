import { ChatList, ChatListProps, StroyBook, useControls, useCreateStore } from '@lobehub/ui';

import { groupData } from './data';

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
      <ChatList
        data={groupData}
        {...control}
        onActionClick={(key) => console.log(key)}
        style={{ width: '100%' }}
      />
    </StroyBook>
  );
};
