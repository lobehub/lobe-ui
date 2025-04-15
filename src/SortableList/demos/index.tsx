import { SortableList, type SortableListProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
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

  const store = useCreateStore();
  const { gap, ...control }: any = useControls(
    {
      gap: {
        max: 20,
        min: 0,
        step: 1,
        value: 4,
      },
      variant: {
        options: ['borderless', 'filled', 'outlined'],
        value: 'borderless',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <SortableList
        gap={gap}
        items={items}
        onChange={setItems}
        renderItem={(item) => (
          <SortableList.Item id={item.id} {...control}>
            <SortableList.DragHandle />
            {item.name}
          </SortableList.Item>
        )}
      />
    </StoryBook>
  );
};
