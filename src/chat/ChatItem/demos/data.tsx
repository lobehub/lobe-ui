import { type ActionIconGroupProps } from '@lobehub/ui';
import { MetaData } from '@lobehub/ui/types/meta';
import { Copy, Edit, RotateCw, Trash } from 'lucide-react';

export const avatar: MetaData = {
  avatar: '😎',
  backgroundColor: '#E8DA5A',
  title: 'Advertiser',
};

export const items: ActionIconGroupProps['items'] = [
  {
    icon: Edit,
    key: 'edit',
    label: 'Edit',
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
