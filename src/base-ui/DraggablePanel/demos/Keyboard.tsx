import { DraggablePanel } from '@lobehub/ui/base-ui';
import { useState } from 'react';

import { Flexbox } from '@/Flex';

export default () => {
  const [width, setWidth] = useState(320);

  return (
    <Flexbox horizontal height={'100%'} style={{ minHeight: 400 }} width={'100%'}>
      <DraggablePanel
        maxWidth={520}
        minWidth={200}
        placement="left"
        size={{ height: '100%', width }}
        onSizeChange={(_, size) => typeof size.width === 'number' && setWidth(size.width)}
      >
        <Flexbox gap={8} padding={24}>
          <div>Keyboard Resize</div>
          <div style={{ color: 'gray', fontSize: 12 }}>
            <p>Focus the handle with Tab, then use ArrowLeft / ArrowRight.</p>
            <p>Hold Shift or use PageUp / PageDown for larger steps.</p>
            <p>Home and End jump to the minimum and maximum size.</p>
            <p>Enter toggles the panel; Escape cancels an in-flight drag.</p>
          </div>
        </Flexbox>
      </DraggablePanel>
      <Flexbox padding={24} style={{ flex: 1 }}>
        <div>Width: {width}px</div>
      </Flexbox>
    </Flexbox>
  );
};
