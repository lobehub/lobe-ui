import { Hotkey, KeyMapEnum } from '@lobehub/ui';

export default () => {
  return (
    <>
      <Hotkey keys={KeyMapEnum.LeftClick} />
      <Hotkey keys={`${KeyMapEnum.Shift}+${KeyMapEnum.Alt}+r`} />
    </>
  );
};
