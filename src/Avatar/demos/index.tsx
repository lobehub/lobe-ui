import { ActionIconProps, Avatar, StroyBook, useControls, useCreateStore } from '@lobehub/ui';

export default () => {
  const store = useCreateStore();
  const control: ActionIconProps | any = useControls(
    {
      avatar: 'https://raw.githubusercontent.com/lobehub/favicon/main/icon.png',
      background: '#FEE064',
      size: {
        value: 40,
        step: 1,
        min: 16,
        max: 128,
      },
      shape: {
        value: 'circle',
        options: ['circle', 'square'],
      },
      title: 'cm',
    },
    { store },
  );

  return (
    <StroyBook levaStore={store}>
      <Avatar {...control} />
    </StroyBook>
  );
};
