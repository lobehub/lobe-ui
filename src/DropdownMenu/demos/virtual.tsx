import { Button, DropdownMenu } from '@lobehub/ui';
import { useMemo } from 'react';

export default () => {
  const items = useMemo(
    () =>
      Array.from({ length: 1000 }, (_, index) => ({
        key: `item-${index + 1}`,
        label: `Item ${index + 1}`,
      })),
    [],
  );

  return (
    <DropdownMenu nativeButton virtual items={items} listItemHeight={32}>
      <Button>1000 Items</Button>
    </DropdownMenu>
  );
};
