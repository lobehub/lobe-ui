import { GripVertical } from 'lucide-react';
import React, { memo, useContext } from 'react';

import ActionIcon, { type ActionIconProps } from '@/ActionIcon';

import { SortableItemContext } from './SortableItem';

const DragHandle = memo<ActionIconProps>((props) => {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <ActionIcon
      icon={GripVertical}
      size={'small'}
      {...props}
      {...attributes}
      {...listeners}
      ref={ref}
    />
  );
});

export default DragHandle;
