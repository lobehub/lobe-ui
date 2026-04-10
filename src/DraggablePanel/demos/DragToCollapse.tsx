import { DraggablePanel } from '@lobehub/ui';
import { useState } from 'react';

import { Flexbox } from '@/Flex';

export default () => {
  const [expand, setExpand] = useState(true);

  return (
    <Flexbox horizontal height={'100%'} style={{ minHeight: 500 }} width={'100%'}>
      <DraggablePanel
        showHandleWhenCollapsed
        defaultSize={{ width: 300 }}
        expand={expand}
        minWidth={180}
        placement="left"
        onExpandChange={setExpand}
      >
        <Flexbox gap={8} padding={24}>
          <div>Drag to Collapse Demo</div>
          <div style={{ color: 'gray', fontSize: 12 }}>
            <p>Drag the handle all the way to the left to collapse.</p>
            <p>Double-click the handle to restore default size (300px).</p>
          </div>
        </Flexbox>
      </DraggablePanel>
      <Flexbox padding={24} style={{ flex: 1 }}>
        <div>Panel is {expand ? 'expanded' : 'collapsed'}</div>
      </Flexbox>
    </Flexbox>
  );
};
