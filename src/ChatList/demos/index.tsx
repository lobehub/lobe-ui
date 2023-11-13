import {
  ActionsBar,
  ChatList,
  ChatListProps,
  StoryBook,
  useControls,
  useCreateStore,
} from '@lobehub/ui';

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
    <StoryBook levaStore={store}>
      <ChatList
        data={data}
        renderActions={ActionsBar}
        renderMessages={{
          default: ({ id, editableContent }) => <div id={id}>{editableContent}</div>,
        }}
        style={{ width: '100%' }}
        {...control}
      />
    </StoryBook>
  );
};
