import { ActionIcon, Collapse, CollapseProps } from '@lobehub/ui';
import { SettingsIcon } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';

const items: CollapseProps['items'] = [
  {
    children: 111,
    extra: (
      <ActionIcon
        icon={SettingsIcon}
        // If you want to prevent the event from bubbling up,
        // you can use the stopPropagation method.
        onClick={(e) => e.stopPropagation()}
        size={{ blockSize: 24, fontSize: 16 }}
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

export default () => {
  return (
    <Flexbox gap={32}>
      <Collapse items={items} padding={8} />
      <Collapse items={items} padding={{ body: 0 }} />
      <Collapse items={items} padding={{ body: 24, header: '16px 24px' }} />
    </Flexbox>
  );
};
