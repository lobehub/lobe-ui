import { Button, DropdownMenu } from '@lobehub/ui';

import { groupItems } from './data';

export default () => {
  return (
    <DropdownMenu items={groupItems}>
      <Button>Group Items</Button>
    </DropdownMenu>
  );
};
