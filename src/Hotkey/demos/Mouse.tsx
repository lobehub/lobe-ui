import { Hotkey, KeyMap } from '@lobehub/ui';
import { Center } from 'react-layout-kit';

export default () => {
  return (
    <Center gap={2} horizontal wrap={'wrap'}>
      <Hotkey keys={KeyMap.LeftClick} />
      <Hotkey keys={KeyMap.RightClick} />
      <Hotkey keys={KeyMap.MiddleClick} />
      <Hotkey keys={KeyMap.RightDoubleClick} />
      <Hotkey keys={KeyMap.LeftDoubleClick} />
    </Center>
  );
};
