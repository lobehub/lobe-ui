import { Hotkey } from '@lobehub/ui';
import { Center } from 'react-layout-kit';

export default () => {
  return (
    <Center gap={2} horizontal wrap={'wrap'}>
      <Hotkey keys={'left-click'} />
      <Hotkey keys={'right-click'} />
      <Hotkey keys={'mid-click'} />
    </Center>
  );
};
