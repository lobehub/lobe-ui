import { Button, DropdownMenu } from '@lobehub/ui';

import { submenuItems } from './data';

export default () => {
  return (
    <DropdownMenu items={submenuItems}>
      <Button>Open Menu</Button>
    </DropdownMenu>
  );
};
