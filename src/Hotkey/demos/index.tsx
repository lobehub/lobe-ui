import { Hotkey, type HotkeyProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control: HotkeyProps | any = useControls(
    {
      compact: false,
      inverseTheme: false,
      keys: 'mod+k',
      variant: {
        options: ['filled', 'outlined', 'borderless'],
        value: 'filled',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <Hotkey {...control} />
    </StoryBook>
  );
};
