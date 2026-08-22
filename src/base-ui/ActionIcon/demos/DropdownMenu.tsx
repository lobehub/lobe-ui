import { Flexbox } from '@lobehub/ui';
import { ActionIcon, DropdownMenu } from '@lobehub/ui/base-ui';
import { CopyIcon, MoreHorizontal, SettingsIcon, Trash2Icon } from 'lucide-react';

const items = [
  { key: 'copy', label: 'Copy', icon: CopyIcon },
  { key: 'settings', label: 'Settings', icon: SettingsIcon },
  { type: 'divider' as const },
  { danger: true, key: 'delete', label: 'Delete', icon: Trash2Icon },
];

export default () => {
  return (
    <Flexbox horizontal gap={16} padding={16} wrap={'wrap'}>
      <DropdownMenu items={items} placement="bottomRight">
        <ActionIcon aria-label="Open actions" icon={MoreHorizontal} />
      </DropdownMenu>
      <DropdownMenu items={items} placement="bottomRight">
        <ActionIcon aria-label="More options" icon={MoreHorizontal} variant={'outlined'} />
      </DropdownMenu>
    </Flexbox>
  );
};
