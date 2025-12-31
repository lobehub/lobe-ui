import { type DropdownMenuV2Props, Icon } from '@lobehub/ui';
import {
  ArchiveIcon,
  CopyIcon,
  FileTextIcon,
  FolderOpenIcon,
  LayoutGridIcon,
  ListIcon,
  ScissorsIcon,
  SettingsIcon,
  ShieldAlertIcon,
  Trash2Icon,
} from 'lucide-react';

export const items: Exclude<DropdownMenuV2Props['items'], () => unknown> = [
  {
    extra: 'Ctrl+C',
    icon: <Icon icon={CopyIcon} />,
    key: 'copy',
    label: 'Copy',
  },
  {
    extra: 'Ctrl+X',
    icon: <Icon icon={ScissorsIcon} />,
    key: 'cut',
    label: 'Cut',
  },
  {
    key: 'rename',
    label: 'Rename',
  },
  {
    type: 'divider',
  },
  {
    icon: <Icon icon={FolderOpenIcon} />,
    key: 'move',
    label: 'Move to...',
  },
  {
    danger: true,
    icon: <Icon icon={Trash2Icon} />,
    key: 'delete',
    label: 'Delete',
  },
];

export const submenuItems: Exclude<DropdownMenuV2Props['items'], () => unknown> = [
  {
    icon: <Icon icon={SettingsIcon} />,
    key: 'preferences',
    label: 'Preferences',
  },
  {
    type: 'divider',
  },
  {
    children: [
      {
        key: 'recent-1',
        label: 'Report_Q4.pdf',
      },
      {
        key: 'recent-2',
        label: 'Notes.md',
      },
    ],
    key: 'recent',
    label: 'Recent Files',
  },
  {
    children: [
      {
        icon: <Icon icon={FileTextIcon} />,
        key: 'export-pdf',
        label: 'Export as PDF',
      },
      {
        key: 'export-md',
        label: 'Export as Markdown',
      },
    ],
    key: 'export',
    label: 'Export',
    type: 'group',
  },
];

export const groupItems: Exclude<DropdownMenuV2Props['items'], () => unknown> = [
  {
    children: [
      {
        icon: <Icon icon={LayoutGridIcon} />,
        key: 'view-grid',
        label: 'Grid',
      },
      {
        icon: <Icon icon={ListIcon} />,
        key: 'view-list',
        label: 'List',
      },
    ],
    key: 'view',
    label: 'View',
    type: 'group',
  },
  {
    children: [
      {
        key: 'sort-name',
        label: 'Name',
      },
      {
        key: 'sort-date',
        label: 'Date',
      },
    ],
    key: 'sort',
    label: 'Sort by',
    type: 'group',
  },
];

export const dangerItems: Exclude<DropdownMenuV2Props['items'], () => unknown> = [
  {
    icon: <Icon icon={ArchiveIcon} />,
    key: 'archive',
    label: 'Archive',
  },
  {
    danger: true,
    icon: <Icon icon={Trash2Icon} />,
    key: 'delete',
    label: 'Delete',
  },
  {
    danger: true,
    icon: <Icon icon={ShieldAlertIcon} />,
    key: 'purge',
    label: 'Permanently delete',
  },
];
