import { ChatItem, ChatItemProps, StoryBook, useControls, useCreateStore } from '@lobehub/ui';

import { avatar } from './data';

export default () => {
  const store = useCreateStore();
  const control: ChatItemProps['error'] | any = useControls(
    {
      description: '',
      message: 'Error',
      type: {
        options: ['success', 'info', 'warning', 'error'],
        value: 'error',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <ChatItem avatar={avatar} error={control} />
    </StoryBook>
  );
};
