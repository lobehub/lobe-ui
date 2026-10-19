'use client';

import clsx from 'clsx';
import { GripVertical } from 'lucide-react';
import { memo, use, useState } from 'react';

import ActionIcon, { type ActionIconProps } from '@/ActionIcon';

import { sortableListClasses } from '../stable';
import { SortableItemContext } from './SortableItem';

const DragHandle = memo<ActionIconProps>(({ className, style, ...rest }) => {
  const [grab, setGrab] = useState(false);
  const { attributes, listeners, ref } = use(SortableItemContext);
  return (
    <ActionIcon
      glass
      className={clsx(sortableListClasses('drag-handle'), className)}
      data-cypress="draggable-handle"
      icon={GripVertical}
      size={'small'}
      style={{ cursor: grab ? 'grab' : 'grabbing', ...style }}
      onMouseDown={() => setGrab(true)}
      onMouseUp={() => setGrab(false)}
      {...rest}
      {...attributes}
      {...listeners}
      ref={ref}
    />
  );
});

DragHandle.displayName = 'DragHandle';

export default DragHandle;
