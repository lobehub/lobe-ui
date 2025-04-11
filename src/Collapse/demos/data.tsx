import { ActionIcon, type CollapseProps } from '@lobehub/ui';
import { SettingsIcon } from 'lucide-react';

export const items: CollapseProps['items'] = [
  {
    children: 111,
    extra: (
      <ActionIcon
        icon={SettingsIcon}
        // If you want to prevent the event from bubbling up,
        // you can use the stopPropagation method.
        onClick={(e) => e.stopPropagation()}
        size={'small'}
      />
    ),
    key: '1',
    label: 'This is panel header 1',
  },
  {
    children: 222,

    key: '2',
    label: 'This is panel header 2',
  },
  {
    children: 333,
    key: '3',
    label: 'This is panel header 3',
  },
];
