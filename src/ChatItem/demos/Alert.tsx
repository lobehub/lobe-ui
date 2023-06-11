import { ChatItem, ChatItemProps, StroyBook, useControls, useCreateStore } from '@lobehub/ui';

export default () => {
  const store = useCreateStore();
  const control: ChatItemProps['alert'] | any = useControls(
    {
      message: 'Error',
      description: '',
      type: {
        value: 'error',
        options: ['success', 'info', 'warning', 'error'],
      },
    },
    { store },
  );

  return (
    <StroyBook levaStore={store}>
      <ChatItem alert={control} avatar="😅" />
    </StroyBook>
  );
};
