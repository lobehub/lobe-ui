import { type ActionIconGroupProps } from '@lobehub/ui';
import { Copy, RotateCw, Trash } from 'lucide-react';

export const items: ActionIconGroupProps['items'] = [
  {
    icon: Copy,
    key: 'copy',
    label: 'Copy',
    loading: true,
  },
  {
    disabled: true,
    icon: RotateCw,
    key: 'regenerate',
    label: 'Regenerate',
  },
];

export const dropdownMenu: ActionIconGroupProps['menu'] = [
  {
    icon: Copy,
    key: 'copy',
    label: 'Copy',
  },
  {
    disabled: true,
    icon: RotateCw,
    key: 'regenerate',
    label: 'Regenerate',
  },
  {
    type: 'divider',
  },
  {
    danger: true,
    icon: Trash,
    key: 'delete',
    label: 'Delete',
  },
];
