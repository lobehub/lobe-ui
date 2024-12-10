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
      message: 'Informational Notes',
      showIcon: true,
      type: {
        options: ['info', 'success', 'warning', 'error'],
        value: 'info',
      },
      variant: {
        options: ['', 'block', 'ghost', 'pure'],
        value: '',
      },
    },
    { store },
  );
  return (
    <StoryBook levaStore={store}>
      <Alert
        extra={
          <Highlighter copyButtonSize={'small'} language={'json'} type={'pure'}>
            {JSON.stringify(demoError, null, 2)}
          </Highlighter>
        }
        {...control}
      />
    </StoryBook>
  );
};
