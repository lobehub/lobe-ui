import { StoryBook, TabsNav, useControls, useCreateStore } from '@lobehub/ui';

export default () => {
  const store = useCreateStore();

  const { variant }: any = useControls(
    {
      variant: {
        options: ['default', 'compact'],
        value: 'default',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <TabsNav
        items={[
          {
            key: 'home',
            label: 'Home',
          },
          {
            key: 'components',
            label: 'Components',
          },
          {
            key: 'changelog',
            label: 'Changelog',
          },
        ]}
        variant={variant}
      />
    </StoryBook>
  );
};
