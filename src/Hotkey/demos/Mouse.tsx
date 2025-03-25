import { Hotkey, KeyMapEnum } from '@lobehub/ui';
import { Center } from 'react-layout-kit';

export default () => {
  return (
    <Center gap={2} horizontal wrap={'wrap'}>
      <Hotkey keys={KeyMapEnum.LeftClick} />
      <Hotkey keys={KeyMapEnum.RightClick} />
      <Hotkey keys={KeyMapEnum.MiddleClick} />
      <Hotkey keys={KeyMapEnum.RightDoubleClick} />
      <Hotkey keys={KeyMapEnum.LeftDoubleClick} />
    </Center>
  );
};
