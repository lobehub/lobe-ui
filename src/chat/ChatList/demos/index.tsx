import { ChatActionsBar, ChatList, type ChatListProps } from '@lobehub/ui/chat';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { data } from './data';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      showAvatar: true,
      showTitle: false,
      variant: {
        options: ['bubble', 'docs'],
        value: 'bubble',
      },
    },
    { store },
  ) as ChatListProps;

  return (
    <StoryBook levaStore={store}>
      <ChatList
        {...control}
        data={data}
        style={{ width: '100%' }}
        renderActions={{
          default: ChatActionsBar,
        }}
        renderMessages={{
          default: ({ id, editableContent }) => <div id={id}>{editableContent}</div>,
        }}
      />
    </StoryBook>
  );
};
