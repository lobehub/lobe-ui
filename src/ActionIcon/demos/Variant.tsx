import { ActionIcon } from '@lobehub/ui';
import { Settings } from 'lucide-react';
import { Center } from 'react-layout-kit';

export default () => {
  return (
    <Center gap={16} horizontal wrap={'wrap'}>
      <ActionIcon icon={Settings} />
      <ActionIcon icon={Settings} variant={'filled'} />
      <ActionIcon icon={Settings} variant={'outlined'} />
      <ActionIcon icon={Settings} shadow variant={'outlined'} />
    </Center>
  );
};
