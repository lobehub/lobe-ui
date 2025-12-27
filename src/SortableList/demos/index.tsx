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
  const { gap, useCustomOverlay, ...control }: any = useControls(
    {
      gap: {
        max: 20,
        min: 0,
        step: 1,
        value: 4,
      },
      useCustomOverlay: false,
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
        renderOverlay={
          useCustomOverlay
            ? (item) => (
                <div
                  style={{
                    background: 'rgba(0, 100, 255, 0.1)',
                    border: '2px dashed #0064ff',
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    padding: '8px 12px',
                    transform: 'rotate(2deg)',
                  }}
                >
                  📦 {item.name}
                </div>
              )
            : undefined
        }
      />
    </StoryBook>
  );
};
