import { type ActionIconGroupProps, Icon } from '@lobehub/ui';
import { MetaData } from '@lobehub/ui/types/meta';
import { Copy, RotateCw, Trash } from 'lucide-react';

export const avatar: MetaData = {
  avatar: '😎',
  backgroundColor: '#E8DA5A',
  title: 'Advertiser',
};

export const items: ActionIconGroupProps['items'] = [
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
