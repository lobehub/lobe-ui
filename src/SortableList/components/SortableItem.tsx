'use client';

import type { DraggableSyntheticListeners } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import { createContext, memo, useMemo } from 'react';
import { Flexbox, type FlexboxProps } from 'react-layout-kit';

import { useStyles } from '../style';

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
  variant?: 'borderless' | 'filled' | 'outlined';
}

const SortableItem = memo<SortableItemProps>(
  ({ variant = 'borderless', className, children, id, style, ...rest }) => {
    const { cx, styles } = useStyles();

    const variants = useMemo(
      () =>
        cva(styles.item, {
          compoundVariants: [
            {
              className: styles.itemVariant,
              variant: 'outlined',
            },
            {
              className: styles.itemVariant,
              variant: 'filled',
            },
          ],
          defaultVariants: {
            variant: 'borderless',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: styles.filled,
              outlined: styles.outlined,
              borderless: styles.borderless,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

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
          align={'center'}
          as={'li'}
          className={cx(variants({ className, variant }))}
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
      </SortableItemContext>
    );
  },
);

SortableItem.displayName = 'SortableItem';

export default SortableItem;
