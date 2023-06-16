import { type ActionIconGroupProps, Icon } from '@lobehub/ui';
import { Copy, RotateCw, Trash } from 'lucide-react';

export const items: ActionIconGroupProps['items'] = [
  {
    icon: Copy,
    onClick: () => console.log('click Copy'),
    title: 'Copy',
  },
  {
    icon: RotateCw,
    onClick: () => console.log('click Regenerate'),
    title: 'Regenerate',
  },
];

export const dropdownMenu: ActionIconGroupProps['dropdownMenu'] = [
  {
    icon: <Icon icon={Copy} size="small" />,
    key: 'Copy',
    label: 'Copy',
  },
  {
    icon: <Icon icon={RotateCw} size="small" />,
    key: 'Regenerate',
    label: 'Regenerate',
  },
  {
    type: 'divider',
  },
  {
    icon: <Icon icon={Trash} size="small" />,
    key: 'Delete',
    label: 'Delete',
  },
];
