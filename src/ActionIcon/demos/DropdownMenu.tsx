import { ActionIcon, DropdownMenu } from '@lobehub/ui';
import { MoreHorizontal } from 'lucide-react';

import { items } from '@/DropdownMenu/demos/data';
import { Center } from '@/Flex';

export default () => {
  return (
    <Center horizontal gap={16} wrap={'wrap'}>
      <DropdownMenu items={items} placement="bottomRight">
        <ActionIcon aria-label="Open actions" icon={MoreHorizontal} />
      </DropdownMenu>
      <DropdownMenu items={items} placement="bottomRight">
        <ActionIcon aria-label="More options" icon={MoreHorizontal} variant={'outlined'} />
      </DropdownMenu>
    </Center>
  );
};
