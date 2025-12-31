import { Button, DropdownMenuV2, type DropdownMenuV2ItemType } from '@lobehub/ui';
import { useMemo, useState } from 'react';

export default () => {
  const [state, setState] = useState({ autoSave: true, notifications: false });

  const items = useMemo<DropdownMenuV2ItemType[]>(
    () => [
      {
        checked: state.autoSave,
        key: 'autoSave',
        label: 'Auto Save',
        onCheckedChange: (checked: boolean) => setState((prev) => ({ ...prev, autoSave: checked })),
        type: 'checkbox',
      },
      {
        checked: state.notifications,
        key: 'notifications',
        label: 'Email Notifications',
        onCheckedChange: (checked: boolean) =>
          setState((prev) => ({ ...prev, notifications: checked })),
        type: 'checkbox',
      },
      {
        type: 'divider',
      },
      {
        key: 'settings',
        label: 'Settings...',
      },
    ],
    [state.autoSave, state.notifications],
  );

  return (
    <DropdownMenuV2 items={items}>
      <Button>Checkbox Items</Button>
    </DropdownMenuV2>
  );
};
