import { AlignVerticalSpaceAroundIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { useControls } from 'react-zoom-pan-pinch';

import ActionIcon from '@/ActionIcon';

const Controls = memo(() => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <Flexbox
      gap={4}
      horizontal
      style={{
        bottom: 8,
        position: 'absolute',
        right: 8,
        zIndex: 1,
      }}
    >
      <ActionIcon active glass icon={PlusIcon} onClick={() => zoomIn()} size={'small'} />
      <ActionIcon active glass icon={MinusIcon} onClick={() => zoomOut()} size={'small'} />
      <ActionIcon
        active
        glass
        icon={AlignVerticalSpaceAroundIcon}
        onClick={() => resetTransform()}
        size={'small'}
      />
    </Flexbox>
  );
});

export default Controls;
