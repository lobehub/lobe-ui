import { type ActionIconGroupProps, Icon } from '@lobehub/ui';
import { Copy, RotateCw, Trash } from 'lucide-react';

export const items: ActionIconGroupProps['items'] = [
  {
    icon: Copy,
    title: 'Copy',
    onClick: () => console.log('click Copy'),
  },
  {
    icon: RotateCw,
    title: 'Regenerate',
    onClick: () => console.log('click Regenerate'),
  },
];

export const dropdownMenu: ActionIconGroupProps['dropdownMenu'] = [
  {
    key: 'Copy',
    icon: <Icon icon={Copy} size="small" />,
    label: 'Copy',
  },
  {
    key: 'Regenerate',
    icon: <Icon icon={RotateCw} size="small" />,
    label: 'Regenerate',
  },
  {
    type: 'divider',
  },
  {
    key: 'Delete',
    icon: <Icon icon={Trash} size="small" />,
    label: 'Delete',
  },
];
