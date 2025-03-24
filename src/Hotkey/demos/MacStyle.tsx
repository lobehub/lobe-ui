import { Hotkey, type HotkeyProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Center } from 'react-layout-kit';

export default () => {
  const store = useCreateStore();
  const { isApple }: HotkeyProps | any = useControls(
    {
      isApple: true,
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <Center gap={2} horizontal wrap={'wrap'}>
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
