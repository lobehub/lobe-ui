import { Checkbox } from '@lobehub/ui';
import { cssVar } from 'antd-style';

import { Center } from '@/Flex';

export default () => {
  return (
    <Center horizontal gap={16} wrap={'wrap'}>
      <Checkbox defaultChecked size={16} />
      <Checkbox defaultChecked shape={'circle'} size={16} />
      <Checkbox defaultChecked size={24} />
      <Checkbox defaultChecked backgroundColor={cssVar.colorSuccess} shape={'circle'} size={24} />
      <Checkbox defaultChecked size={32} />
      <Checkbox defaultChecked shape={'circle'} size={32} />
    </Center>
  );
};
