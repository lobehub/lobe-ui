import { Button, DropdownMenuV2 } from '@lobehub/ui';

import { items } from './data';

export default () => {
  return (
    <DropdownMenuV2 items={items} triggerProps={{ closeDelay: 100, delay: 120, openOnHover: true }}>
      <Button>Hover to Open</Button>
    </DropdownMenuV2>
  );
};
