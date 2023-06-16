import { Copy, Edit, RotateCw, Trash } from 'lucide-react';
import { memo, useMemo } from 'react';

import ActionIconGroup, { type ActionIconGroupProps } from '@/ActionIconGroup';
import Icon from '@/Icon';

export interface ActionsBarProps extends ActionIconGroupProps {
  primary?: boolean;
}

const ActionsBar = memo<ActionsBarProps>(({ primary, items = [], dropdownMenu = [], ...props }) => {
  const groupItems: ActionIconGroupProps['items'] = useMemo(
    () =>
      [
        primary
          ? { icon: Edit, onClick: () => console.log('click Edit'), title: 'Edit' }
          : {
              icon: RotateCw,
              onClick: () => console.log('click Regenerate'),
              title: 'Regenerate',
            },
        ...items,
      ].filter(Boolean),
    [primary, items],
  );

  const groupDropdownMenu: ActionIconGroupProps['dropdownMenu'] = useMemo(
    () => [
      ...dropdownMenu,
      {
        icon: <Icon icon={Edit} size="small" />,
        key: 'Edit',
        label: 'Edit',
      },
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
    ],
    [primary, dropdownMenu],
  );

  return (
    <ActionIconGroup dropdownMenu={groupDropdownMenu} items={groupItems} type="ghost" {...props} />
  );
});

export default ActionsBar;
