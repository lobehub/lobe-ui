import { HotKeys, type HotKeysProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control: HotKeysProps | any = useControls(
    {
      compact: false,
      desc: 'New Topic',
      inverseTheme: false,
      isApple: false,
      keys: 'mod+comma',
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <HotKeys {...control} />
    </StoryBook>
  );
};
