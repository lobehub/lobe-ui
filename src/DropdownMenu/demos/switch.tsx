import { Button, type DropdownItem, DropdownMenu } from '@lobehub/ui';
import { SaveIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

export default () => {
  const [state, setState] = useState({ autoSave: true, notifications: false });

  const items = useMemo<DropdownItem[]>(
    () => [
      {
        checked: state.autoSave,
        icon: <SaveIcon />,
        key: 'autoSave',
        label: 'Auto Save',
        onCheckedChange: (checked: boolean) => setState((prev) => ({ ...prev, autoSave: checked })),
        type: 'switch',
      },
      {
        checked: state.notifications,
        key: 'notifications',
        label: 'Email Notifications',
        onCheckedChange: (checked: boolean) =>
          setState((prev) => ({ ...prev, notifications: checked })),
        type: 'switch',
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
    <DropdownMenu nativeButton items={items}>
      <Button>Switch Items</Button>
    </DropdownMenu>
  );
};
