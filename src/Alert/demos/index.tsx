import { Alert, AlertProps, StoryBook, useControls, useCreateStore } from '@lobehub/ui';

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
      styleType: {
        options: ['', 'block', 'ghost', 'pure'],
        value: '',
      },
      type: {
        options: ['info', 'success', 'warning', 'error'],
        value: 'info',
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
