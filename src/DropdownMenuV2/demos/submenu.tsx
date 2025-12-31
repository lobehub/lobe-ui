import { Button, DropdownMenuV2 } from '@lobehub/ui';

import { submenuItems } from './data';

export default () => {
  return (
    <DropdownMenuV2 items={submenuItems}>
      <Button>Open Menu</Button>
    </DropdownMenuV2>
  );
};
