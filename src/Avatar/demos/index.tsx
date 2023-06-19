import { ActionIconProps, Avatar, StroyBook, useControls, useCreateStore } from '@lobehub/ui';

export default () => {
  const store = useCreateStore();
  const control: ActionIconProps | any = useControls(
    {
      avatar: 'https://npm.elemecdn.com/@lobehub/assets/logo/logo-3d.webp',
      background: '#FEE064',
      shape: {
        options: ['circle', 'square'],
        value: 'circle',
      },
      size: {
        max: 128,
        min: 16,
        step: 1,
        value: 40,
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
