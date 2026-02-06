'use client';

import { type DropAnimation } from '@dnd-kit/core';
import { defaultDropAnimationSideEffects, DragOverlay } from '@dnd-kit/core';
import { type PropsWithChildren } from 'react';
import { memo } from 'react';

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4',
      },
    },
  }),
};

const SortableOverlay = memo<PropsWithChildren>(({ children }) => {
  return <DragOverlay dropAnimation={dropAnimationConfig}>{children}</DragOverlay>;
});

SortableOverlay.displayName = 'SortableOverlay';

export default SortableOverlay;
