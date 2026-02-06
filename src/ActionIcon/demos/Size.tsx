import { ActionIcon } from '@lobehub/ui';
import { Settings } from 'lucide-react';

import { Center } from '@/Flex';

export default () => {
  return (
    <Center horizontal gap={16} wrap={'wrap'}>
      <ActionIcon icon={Settings} size={'small'} />
      <ActionIcon icon={Settings} size={'middle'} />
      <ActionIcon icon={Settings} size={'large'} />
      <ActionIcon icon={Settings} size={32} />
    </Center>
  );
};
