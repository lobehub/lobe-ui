import { Hotkey } from '@lobehub/ui';
import { useTheme } from 'antd-style';

import { Center } from '@/Flex';

export default () => {
  const theme = useTheme();
  return (
    <Center height={240} style={{ background: theme.colorText }} width={'100%'}>
      <Hotkey inverseTheme keys={'mod+comma'} />
    </Center>
  );
};
