import { Alert, AlertProps, Highlighter } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

const demoError = {
  details: {
    exception: 'Validation filter failed',
    msgId: 'Id-f5aab7304f6c754804f70000',
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
  const control: AlertProps | any = useControls(
    {
      banner: false,
      closable: false,
      colorfulText: true,
      description: 'Alert Title',
      extraIsolate: false,
      glass: false,
      message: 'Informational Notes',
      showIcon: true,
      type: {
        options: ['info', 'success', 'warning', 'error'],
        value: 'info',
      },
      variant: {
        options: ['filled', 'outlined', 'borderless'],
        value: 'filled',
      },
    },
    { store },
  );
  return (
    <StoryBook levaStore={store}>
      <Alert
        extra={
          <Highlighter
            actionIconSize={'small'}
            language={'json'}
            padding={8}
            variant={'borderless'}
          >
            {JSON.stringify(demoError, null, 2)}
          </Highlighter>
        }
        {...control}
      />
    </StoryBook>
  );
};
