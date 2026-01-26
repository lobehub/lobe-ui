import { Button, type DropdownItem, DropdownMenu, Icon } from '@lobehub/ui';
import { FileIcon, FolderIcon, ImageIcon, SettingsIcon, VideoIcon } from 'lucide-react';

const items: DropdownItem[] = [
  {
    children: [
      {
        icon: <Icon icon={FileIcon} />,
        key: 'new-file',
        label: 'New File',
      },
      {
        key: 'new-template',
        label: 'From Template',
      },
      {
        icon: <Icon icon={FolderIcon} />,
        key: 'new-folder',
        label: 'New Folder',
      },
    ],
    key: 'create',
    label: 'Create (mixed icons)',
    type: 'group',
  },
  {
    children: [
      {
        key: 'import-local',
        label: 'From Local',
      },
      {
        key: 'import-cloud',
        label: 'From Cloud',
      },
    ],
    key: 'import',
    label: 'Import (no icons)',
    type: 'group',
  },
  {
    children: [
      {
        icon: <Icon icon={ImageIcon} />,
        key: 'media-image',
        label: 'Images',
      },
      {
        icon: <Icon icon={VideoIcon} />,
        key: 'media-video',
        label: 'Videos',
      },
    ],
    key: 'media',
    label: 'Media (all icons)',
    type: 'group',
  },
  {
    children: [
      {
        checked: true,
        key: 'auto-save',
        label: 'Auto Save',
        type: 'checkbox',
      },
      {
        icon: <Icon icon={SettingsIcon} />,
        key: 'preferences',
        label: 'Preferences',
      },
      {
        key: 'reset',
        label: 'Reset',
      },
    ],
    key: 'settings',
    label: 'Settings (checkbox + icons)',
    type: 'group',
  },

  {
    type: 'divider' as const,
  },
  {
    checked: false,
    key: 'full-width',
    label: 'Full Width',
    onCheckedChange: (checked: boolean) => console.log('checked', checked),
    type: 'switch' as const,
  },
  {
    type: 'divider' as const,
  },

  {
    key: 'settings',
    label: 'Settings...',
  },
];

export default () => {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <DropdownMenu iconSpaceMode="global" items={items} nativeButton>
        <Button>Global Mode (Default)</Button>
      </DropdownMenu>
      <DropdownMenu iconSpaceMode="group" items={items} nativeButton>
        <Button>Group Mode</Button>
      </DropdownMenu>
    </div>
  );
};
