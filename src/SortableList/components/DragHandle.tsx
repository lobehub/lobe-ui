'use client';

import { GripVertical } from 'lucide-react';
import React, { memo, useContext, useState } from 'react';

import ActionIcon, { type ActionIconProps } from '@/ActionIcon';

import { SortableItemContext } from './SortableItem';

const DragHandle = memo<ActionIconProps>(({ style, ...rest }) => {
  const [grab, setGrab] = useState(false);
  const { attributes, listeners, ref } = useContext(SortableItemContext);
  return (
    <ActionIcon
      data-cypress="draggable-handle"
      glass
      icon={GripVertical}
      onMouseDown={() => setGrab(true)}
      onMouseUp={() => setGrab(false)}
      size={'small'}
      style={{ cursor: grab ? 'grab' : 'grabbing', ...style }}
      {...rest}
      {...attributes}
      {...listeners}
      ref={ref}
    />
  );
});

DragHandle.displayName = 'DragHandle';

export default DragHandle;
