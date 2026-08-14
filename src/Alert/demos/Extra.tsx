import { Alert, type AlertProps, Button, Highlighter } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { RefreshCw } from 'lucide-react';

const demoError = {
  details: {
    exception: 'Validation filter failed',
    msgId: 'Id-f5aab7304f6c754804f70000',
  },
  reasons: [
    {
      language: 'en',
      title: 'Validation filter failed',
    },
  ],
};
export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      banner: false,
      closable: true,
      colorfulText: true,
      description: '',
      extraIsolate: false,
      glass: false,
      showIcon: true,
      title: 'Provider connection failed during the final response',
      type: {
        options: ['info', 'success', 'warning', 'error', 'secondary'],
        value: 'secondary',
      },
      variant: {
        options: ['filled', 'outlined', 'borderless'],
        value: 'filled',
      },
    },
    { store },
  ) as AlertProps;
  return (
    <StoryBook levaStore={store}>
      <Alert
        action={
          <Button icon={RefreshCw} size={'small'}>
            Regenerate
          </Button>
        }
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
