import { Checkbox } from '@lobehub/ui';
import { useTheme } from 'antd-style';

import { Center } from '@/Flex';

export default () => {
  const theme = useTheme();
  return (
    <Center gap={16} horizontal wrap={'wrap'}>
      <Checkbox defaultChecked size={16} />
      <Checkbox defaultChecked shape={'circle'} size={16} />
      <Checkbox defaultChecked size={24} />
      <Checkbox backgroundColor={theme.colorSuccess} defaultChecked shape={'circle'} size={24} />
      <Checkbox defaultChecked size={32} />
      <Checkbox defaultChecked shape={'circle'} size={32} />
    </Center>
  );
};
