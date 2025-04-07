import { ActionIcon } from '@lobehub/ui';
import { Settings } from 'lucide-react';
import { Center } from 'react-layout-kit';

export default () => {
  return (
    <Center gap={16} horizontal wrap={'wrap'}>
      <ActionIcon icon={Settings} size={'small'} />
      <ActionIcon icon={Settings} size={'middle'} />
      <ActionIcon icon={Settings} size={'large'} />
      <ActionIcon icon={Settings} size={32} />
    </Center>
  );
};
