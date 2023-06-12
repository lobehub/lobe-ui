import { Copy, Edit, RotateCw, Trash } from 'lucide-react';
import { memo, useMemo } from 'react';

import { ActionIconGroup, type ActionIconGroupProps, Icon } from '@/index';

export interface ActionsBarProps extends ActionIconGroupProps {
  primary?: boolean;
}

const ActionsBar = memo<ActionsBarProps>(({ primary, items = [], dropdownMenu = [], ...props }) => {
  const groupItems: ActionIconGroupProps['items'] = useMemo(
    () =>
      [
        primary
          ? { icon: Edit, title: 'Edit', onClick: () => console.log('click Edit') }
          : {
              icon: RotateCw,
              title: 'Regenerate',
              onClick: () => console.log('click Regenerate'),
            },
        ...items,
      ].filter(Boolean),
    [primary, items],
  );

  const groupDropdownMenu: ActionIconGroupProps['dropdownMenu'] = useMemo(
    () =>
      dropdownMenu
        .concat([
          {
            key: 'Edit',
            icon: <Icon icon={Edit} size="small" />,
            label: 'Edit',
          },
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
        ])
        .filter(Boolean),
    [primary, dropdownMenu],
  );

  return (
    <ActionIconGroup dropdownMenu={groupDropdownMenu} items={groupItems} type="ghost" {...props} />
  );
});

export default ActionsBar;
