import { Alert, AlertProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

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
      <Alert {...control} />
    </StoryBook>
  );
};
