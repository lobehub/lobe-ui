import { HotKeys } from '@lobehub/ui';
import { useTheme } from 'antd-style';
import { Center } from 'react-layout-kit';

export default () => {
  const theme = useTheme();
  return (
    <Center height={240} style={{ background: theme.colorText }} width={'100%'}>
      <HotKeys inverseTheme keys={'mod+comma'} />
    </Center>
  );
};
