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
      <Alert {...control} />
    </StoryBook>
  );
};
