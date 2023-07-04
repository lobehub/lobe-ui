import { type ActionIconGroupProps } from '@lobehub/ui';
import { Copy, RotateCw, Trash } from 'lucide-react';

export const items: ActionIconGroupProps['items'] = [
  {
    icon: Copy,
    key: 'copy',
    label: 'Copy',
  },
  {
    icon: RotateCw,
    key: 'regenerate',
    label: 'Regenerate',
  },
];

export const dropdownMenu: ActionIconGroupProps['dropdownMenu'] = [
  {
    icon: Copy,
    key: 'copy',
    label: 'Copy',
  },
  {
    icon: RotateCw,
    key: 'regenerate',
    label: 'Regenerate',
  },
  {
    type: 'divider',
  },
  {
    icon: Trash,
    key: 'delete',
    label: 'Delete',
  },
];
