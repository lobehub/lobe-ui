import { Button, DropdownMenuV2 } from '@lobehub/ui';

import { groupItems } from './data';

export default () => {
  return (
    <DropdownMenuV2 items={groupItems}>
      <Button>Group Items</Button>
    </DropdownMenuV2>
  );
};
