import { SortableList, type SortableListProps } from '@lobehub/ui';
import { useState } from 'react';

const data: SortableListProps['items'] = [
  {
    id: '1',
    name: 'Item 1',
  },
  {
    id: '2',
    name: 'Item 2',
  },
  {
    id: '3',
    name: 'Item 3',
  },
  {
    id: '4',
    name: 'Item 4',
  },
];
export default () => {
  const [items, setItems] = useState(data);
  return (
    <SortableList
      items={items}
      onChange={setItems}
      renderItem={(item) => (
        <SortableList.Item id={item.id}>
          <SortableList.DragHandle />
          {item.name}
        </SortableList.Item>
      )}
    />
  );
};
