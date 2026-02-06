import { ActionIcon } from '@lobehub/ui';
import { Settings } from 'lucide-react';

import { Center } from '@/Flex';

export default () => {
  return (
    <Center horizontal gap={16} wrap={'wrap'}>
      <ActionIcon icon={Settings} />
      <ActionIcon icon={Settings} variant={'filled'} />
      <ActionIcon icon={Settings} variant={'outlined'} />
      <ActionIcon shadow icon={Settings} variant={'outlined'} />
    </Center>
  );
};
