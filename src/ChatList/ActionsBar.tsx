import { Copy, Edit, RotateCw, Trash } from 'lucide-react';
import { memo, useMemo } from 'react';

import ActionIconGroup, { type ActionIconGroupProps } from '@/ActionIconGroup';

export interface ActionsBarProps extends ActionIconGroupProps {
  primary?: boolean;
}

const ActionsBar = memo<ActionsBarProps>(({ primary, items = [], dropdownMenu = [], ...props }) => {
  const groupItems: ActionIconGroupProps['items'] = useMemo(
    () =>
      [
        primary
          ? { icon: Edit, key: 'edit', label: 'Edit' }
          : {
              icon: RotateCw,
              key: 'regenerate',
              label: 'Regenerate',
            },
        ...items,
      ].filter(Boolean),
    [primary, items],
  );

  const groupDropdownMenu: ActionIconGroupProps['dropdownMenu'] = useMemo(
    () => [
      ...dropdownMenu,
      {
        icon: Edit,
        key: 'edit',
        label: 'Edit',
      },
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
        key: 'Ddelete',
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
