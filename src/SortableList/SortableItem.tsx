import type { DraggableSyntheticListeners } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createContext, memo, useMemo } from 'react';
import { Flexbox, type FlexboxProps } from 'react-layout-kit';

import { useStyles } from './style';

interface Context {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
}

export const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
});

export interface SortableItemProps extends Omit<FlexboxProps, 'id'> {
  id: string | number;
}

const SortableItem = memo<SortableItemProps>(({ children, id, style, ...rest }) => {
  const { styles } = useStyles();
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef],
  );

  return (
    <SortableItemContext.Provider value={context}>
      <Flexbox
        align={'center'}
        as={'li'}
        className={styles.item}
        gap={4}
        horizontal
        ref={setNodeRef}
        style={{
          opacity: isDragging ? 0.4 : undefined,
          transform: CSS.Translate.toString(transform),
          transition,
          ...style,
        }}
        {...rest}
      >
        {children}
      </Flexbox>
    </SortableItemContext.Provider>
  );
});

export default SortableItem;
