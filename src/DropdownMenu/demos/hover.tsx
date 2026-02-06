import { Button, DropdownMenu } from '@lobehub/ui';

import { items } from './data';

export default () => {
  return (
    <DropdownMenu nativeButton items={items} triggerProps={{ openOnHover: true } as any}>
      <Button>Hover to Open</Button>
    </DropdownMenu>
  );
};
