'use client';

import type { DraggableSyntheticListeners } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cx } from 'antd-style';
import { createContext, memo, useMemo } from 'react';

import { type FlexboxProps } from '@/Flex';
import { Flexbox } from '@/Flex';

import { variants } from '../style';

interface Context {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref: (node: HTMLElement | null) => void;
}

export const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
});

export interface SortableItemProps extends Omit<FlexboxProps, 'id'> {
  id: string | number;
  variant?: 'borderless' | 'filled' | 'outlined';
}

const SortableItem = memo<SortableItemProps>(
  ({ variant = 'borderless', className, children, id, style, ...rest }) => {
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
      <SortableItemContext value={context}>
        <Flexbox
          horizontal
          align={'center'}
          as={'li'}
          className={cx(variants({ variant }), className)}
          gap={4}
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
      </SortableItemContext>
    );
  },
);

SortableItem.displayName = 'SortableItem';

export default SortableItem;
