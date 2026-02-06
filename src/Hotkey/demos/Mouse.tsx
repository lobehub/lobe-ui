import { Hotkey, KeyMapEnum } from '@lobehub/ui';

import { Center } from '@/Flex';

export default () => {
  return (
    <Center horizontal gap={2} wrap={'wrap'}>
      <Hotkey keys={KeyMapEnum.LeftClick} />
      <Hotkey keys={KeyMapEnum.RightClick} />
      <Hotkey keys={KeyMapEnum.MiddleClick} />
      <Hotkey keys={KeyMapEnum.RightDoubleClick} />
      <Hotkey keys={KeyMapEnum.LeftDoubleClick} />
    </Center>
  );
};
