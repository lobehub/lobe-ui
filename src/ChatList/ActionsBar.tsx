import { Copy, Edit, RotateCw, Trash } from 'lucide-react';
import { memo, useMemo } from 'react';

import ActionIconGroup, { type ActionIconGroupProps } from '@/ActionIconGroup';

export interface ActionsBarProps extends ActionIconGroupProps {
  primary?: boolean;
  text?: {
    copy?: string;
    delete?: string;
    edit?: string;
    regenerate?: string;
  };
}

const ActionsBar = memo<ActionsBarProps>(
  ({ primary, text, items = [], dropdownMenu = [], ...props }) => {
    const groupItems: ActionIconGroupProps['items'] = useMemo(
      () =>
        [
          {
            icon: RotateCw,
            key: 'regenerate',
            label: text?.regenerate || 'Regenerate',
          },
          primary
            ? {
                icon: Edit,
                key: 'edit',
                label: text?.edit || 'Edit',
              }
            : {
                icon: Copy,
                key: 'copy',
                label: text?.copy || 'Copy',
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
          label: text?.edit || 'Edit',
        },
        {
          icon: Copy,
          key: 'copy',
          label: text?.copy || 'Copy',
        },
        {
          icon: RotateCw,
          key: 'regenerate',
          label: text?.regenerate || 'Regenerate',
        },
        {
          type: 'divider',
        },
        {
          icon: Trash,
          key: 'delete',
          label: text?.delete || 'Delete',
        },
      ],
      [primary, dropdownMenu],
    );

    return (
      <ActionIconGroup
        dropdownMenu={groupDropdownMenu}
        items={groupItems}
        type="ghost"
        {...props}
      />
    );
  },
);

export default ActionsBar;
