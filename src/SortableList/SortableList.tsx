'use client';

import {
  type Active,
  closestCenter,
  DndContext,
  KeyboardSensor,
  MeasuringStrategy,
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
import clsx from 'clsx';
import { Fragment, memo, type ReactNode, useMemo, useState } from 'react';

import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';

import DragHandle from './components/DragHandle';
import SortableItem from './components/SortableItem';
import SortableOverlay from './components/SortableOverlay';
import { sortableListClasses } from './stable';
import { styles } from './style';
import { type SortableListItem, type SortableListProps } from './type';

const measuringConfig = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

const SortableListParent = memo<SortableListProps>(
  ({ ref, items, onChange, renderItem, renderOverlay, gap = 8, className, ...rest }) => {
    const [active, setActive] = useState<Active | null>(null);
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
          <Flexbox
            as={'ul'}
            gap={gap}
            ref={ref}
            className={
              styleProps(styles.container, clsx(sortableListClasses(), className)).className
            }
            {...rest}
          >
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
  <T extends SortableListItem = SortableListItem>(props: SortableListProps<T>): ReactNode;
  DragHandle: typeof DragHandle;
  Item: typeof SortableItem;
}

const SortableList = SortableListParent as unknown as ISortableList;

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;

export default SortableList;
