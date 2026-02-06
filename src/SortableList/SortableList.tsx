'use client';

import {
  type Active,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Fragment, memo, type ReactNode, useMemo, useState } from 'react';

import { Flexbox } from '@/Flex';

import DragHandle from './components/DragHandle';
import SortableItem from './components/SortableItem';
import SortableOverlay from './components/SortableOverlay';
import { styles } from './style';
import { type SortableListProps } from './type';

const SortableListParent = memo<SortableListProps>(
  ({ ref, items, onChange, renderItem, gap = 8, ...rest }) => {
    const [active, setActive] = useState<Active | null>(null);
    const activeItem = useMemo(() => items.find((item) => item.id === active?.id), [active, items]);
    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      }),
    );

    return (
      <DndContext
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        sensors={sensors}
        onDragCancel={() => {
          setActive(null);
        }}
        onDragEnd={({ active, over }) => {
          if (over && active.id !== over?.id) {
            const activeIndex = items.findIndex(({ id }) => id === active.id);
            const overIndex = items.findIndex(({ id }) => id === over.id);

            onChange(arrayMove(items, activeIndex, overIndex));
          }
          setActive(null);
        }}
        onDragStart={({ active }) => {
          setActive(active);
        }}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <Flexbox as={'ul'} className={styles.container} gap={gap} ref={ref} {...rest}>
            {items.map((item) => (
              <Fragment key={item.id}>{renderItem(item)}</Fragment>
            ))}
          </Flexbox>
        </SortableContext>
        <SortableOverlay>{activeItem ? renderItem(activeItem) : null}</SortableOverlay>
      </DndContext>
    );
  },
);

SortableListParent.displayName = 'SortableList';

export interface ISortableList {
  (props: SortableListProps): ReactNode;
  DragHandle: typeof DragHandle;
  Item: typeof SortableItem;
}

const SortableList = SortableListParent as unknown as ISortableList;

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;

export default SortableList;
