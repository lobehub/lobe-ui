import { Button, DropdownMenu } from '@lobehub/ui';

import { dangerItems } from './data';

export default () => {
  return (
    <DropdownMenu items={dangerItems} nativeButton>
      <Button danger>Danger Items</Button>
    </DropdownMenu>
  );
};
