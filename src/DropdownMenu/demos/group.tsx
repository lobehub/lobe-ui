import { Button, DropdownMenu } from '@lobehub/ui';

import { groupItems } from './data';

export default () => {
  return (
    <DropdownMenu nativeButton items={groupItems}>
      <Button>Group Items</Button>
    </DropdownMenu>
  );
};
