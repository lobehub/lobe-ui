import { Button, DropdownMenuV2 } from '@lobehub/ui';

import { dangerItems } from './data';

export default () => {
  return (
    <DropdownMenuV2 items={dangerItems}>
      <Button danger>Danger Items</Button>
    </DropdownMenuV2>
  );
};
