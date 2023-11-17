import {
  ChatItem,
  ChatItemProps,
  Highlighter,
  StoryBook,
  useControls,
  useCreateStore,
} from '@lobehub/ui';

import { avatar } from './data';

const demoError = {
  details: {
    exception:
      'Validation filter failedId-f5aab7304f6c754804f70000Id-f5aab7304f6c754804f70000Id-f5aab7304f6c754804f70000Id-f5aab7304f6c754804f70000Id-f5aab7304f6c754804f70000Id-f5aab7304f6c754804f70000',
    msgId:
      'Id-f5aab7304f6c754804f70000Id-f5aab7304f6c754804f70000Id-f5aab7304f6c754804f70000Id-f5aab7304f6c754804f70000Id-f5aab7304f6c754804f70000',
  },
  reasons: [
    {
      language: 'en',
      message: 'Validation filter failed',
    },
  ],
};
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
      <ChatItem
        avatar={avatar}
        error={control}
        errorMessage={
          <Highlighter copyButtonSize={'small'} language={'json'} type={'pure'}>
            {JSON.stringify(demoError, null, 2)}
          </Highlighter>
        }
      />
    </StoryBook>
  );
};
