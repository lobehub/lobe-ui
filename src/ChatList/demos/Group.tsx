import { ChatList, ChatListProps, StoryBook, useControls, useCreateStore } from '@lobehub/ui';

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
    <StoryBook levaStore={store}>
      <ChatList
        data={groupData}
        {...control}
        onActionClick={(key) => console.log(key)}
        style={{ width: '100%' }}
      />
    </StoryBook>
  );
};
