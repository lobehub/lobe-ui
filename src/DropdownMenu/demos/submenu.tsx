import { Button, DropdownMenu } from '@lobehub/ui';

import { submenuItems } from './data';

export default () => {
  return (
    <DropdownMenu nativeButton items={submenuItems}>
      <Button>Open Menu</Button>
    </DropdownMenu>
  );
};
