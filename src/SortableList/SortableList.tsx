'use client';

import {
  type Active,
  DndContext,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Fragment, type ReactNode, memo, useMemo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import DragHandle from './components/DragHandle';
import SortableItem from './components/SortableItem';
import SortableOverlay from './components/SortableOverlay';
import { useStyles } from './style';
import type { SortableListProps } from './type';

const measuringConfig = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

const SortableListParent = memo<SortableListProps>(
  ({ ref, items, onChange, renderItem, renderOverlay, gap = 8, ...rest }) => {
    const [active, setActive] = useState<Active | null>(null);
    const { styles } = useStyles();
    const activeItem = useMemo(() => items.find((item) => item.id === active?.id), [active, items]);
    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      }),
    );

    const overlayRenderer = renderOverlay ?? renderItem;

    return (
      <DndContext
        collisionDetection={closestCenter}
        measuring={measuringConfig}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
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
        sensors={sensors}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <Flexbox as={'ul'} className={styles.container} gap={gap} ref={ref} {...rest}>
            {items.map((item) => (
              <Fragment key={item.id}>{renderItem(item)}</Fragment>
            ))}
          </Flexbox>
        </SortableContext>
        <SortableOverlay>{activeItem ? overlayRenderer(activeItem) : null}</SortableOverlay>
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
