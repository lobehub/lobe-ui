import { Hotkey, type HotkeyProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { Center } from '@/Flex';

export default () => {
  const store = useCreateStore();
  const { isApple } = useControls(
    {
      isApple: true,
    },
    { store },
  ) as HotkeyProps;

  return (
    <StoryBook levaStore={store}>
      <Center horizontal gap={2} wrap={'wrap'}>
        <Hotkey isApple={isApple} keys={'mod'} />
        <Hotkey isApple={isApple} keys={'meta'} />
        <Hotkey isApple={isApple} keys={'ctrl'} />
        <Hotkey isApple={isApple} keys={'alt'} />
        <Hotkey isApple={isApple} keys={'enter'} />
        <Hotkey isApple={isApple} keys={'shift'} />
        <Hotkey isApple={isApple} keys={'tab'} />
        <Hotkey isApple={isApple} keys={'backspace'} />
        <Hotkey isApple={isApple} keys={'space'} />
      </Center>
    </StoryBook>
  );
};
