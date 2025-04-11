import { ChatActionsBar, ChatList, ChatListProps } from '@lobehub/ui/chat';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { data } from './data';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      showTitle: false,
      type: {
        options: ['doc', 'chat'],
        value: 'chat',
      },
    },
    { store },
  ) as ChatListProps;

  return (
    <StoryBook levaStore={store}>
      <ChatList
        {...control}
        data={data}
        renderActions={{
          default: ChatActionsBar,
        }}
        renderMessages={{
          default: ({ id, editableContent }) => <div id={id}>{editableContent}</div>,
        }}
        style={{ width: '100%' }}
      />
    </StoryBook>
  );
};
